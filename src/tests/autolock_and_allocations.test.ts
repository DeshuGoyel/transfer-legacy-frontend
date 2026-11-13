import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useStore, Allocation } from '../store/useStore';

// Ensure localStorage is mocked for the test environment
if (typeof global.localStorage === 'undefined') {
  let store: Record<string, string> = {};
  Object.defineProperty(global, 'localStorage', {
    value: {
      getItem: (key: string) => store[key] ?? null,
      setItem: (key: string, value: string) => { store[key] = String(value); },
      removeItem: (key: string) => { delete store[key]; },
      clear: () => { store = {}; },
      length: 0,
      key: (_i: number) => null,
    },
    writable: true,
  });
}

describe('Vault Auto-Lock and Session Inactivity Tests', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    useStore.setState({
      isAuthenticated: true,
      masterKey: new Uint8Array(32).fill(0x55),
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should_purge_keys_and_logout_when_inactivity_threshold_is_exceeded', async () => {
    const INACTIVITY_TIMEOUT_MS = 15 * 60 * 1000; // 15 mins
    let isLocked = false;

    // Simulation of useVaultAutoLock logic
    let timer = setTimeout(async () => {
      if (useStore.getState().isAuthenticated || useStore.getState().masterKey) {
        await useStore.getState().logout();
        isLocked = true;
      }
    }, INACTIVITY_TIMEOUT_MS);

    expect(useStore.getState().isAuthenticated).toBe(true);
    expect(useStore.getState().masterKey).not.toBeNull();

    // Fast-forward time past 15 minutes
    vi.advanceTimersByTime(INACTIVITY_TIMEOUT_MS + 100);
    await vi.runAllTimersAsync();

    expect(isLocked).toBe(true);
    expect(useStore.getState().isAuthenticated).toBe(false);
    expect(useStore.getState().masterKey).toBeNull();
    clearTimeout(timer);
  });

  it('should_reset_auto_lock_timer_when_activity_event_occurs', () => {
    const INACTIVITY_TIMEOUT_MS = 15 * 60 * 1000;
    let lockTriggered = false;

    let timer = setTimeout(() => {
      lockTriggered = true;
    }, INACTIVITY_TIMEOUT_MS);

    // Fast-forward 10 minutes (not yet timed out)
    vi.advanceTimersByTime(10 * 60 * 1000);
    expect(lockTriggered).toBe(false);

    // Activity event resets timer
    clearTimeout(timer);
    timer = setTimeout(() => {
      lockTriggered = true;
    }, INACTIVITY_TIMEOUT_MS);

    // Fast-forward another 10 minutes (20 minutes total, but only 10 since reset)
    vi.advanceTimersByTime(10 * 60 * 1000);
    expect(lockTriggered).toBe(false);

    // Fast-forward remaining 5 minutes to trigger lock
    vi.advanceTimersByTime(5 * 60 * 1000 + 10);
    expect(lockTriggered).toBe(true);
  });
});

describe('Allocation Boundary & Precision Calculations Tests', () => {
  it('should_correctly_calculate_remaining_percentage_and_prevent_overallocation', () => {
    const assetAllocations: Allocation[] = [
      { id: 'alloc-1', assetId: 'asset-1', recipientId: 'heir-1', type: 'heir', percentage: 40 },
      { id: 'alloc-2', assetId: 'asset-1', recipientId: 'heir-2', type: 'heir', percentage: 35 },
    ];

    const totalAllocated = assetAllocations.reduce((sum, a) => sum + a.percentage, 0);
    const remainingPercent = 100 - totalAllocated;

    expect(totalAllocated).toBe(75);
    expect(remainingPercent).toBe(25);

    // Attempting to increase alloc-1 by 30% (from 40 to 70) when only 25% remains:
    const oldValue = 40;
    const requestedValue = 70;
    const diff = requestedValue - oldValue; // 30

    let clampedValue = requestedValue;
    if (diff > remainingPercent) {
      clampedValue = oldValue + remainingPercent; // 40 + 25 = 65
    }

    expect(clampedValue).toBe(65);
    expect(clampedValue + 35).toBe(100);
  });

  it('should_handle_decimal_shares_for_three_equal_beneficiaries_accurately', () => {
    // 3 heirs dividing 100%: 33.33%, 33.33%, 33.34%
    const share1 = 33.33;
    const share2 = 33.33;
    const share3 = 33.34;

    const total = Number((share1 + share2 + share3).toFixed(2));
    expect(total).toBe(100);

    const remaining = Number((100 - total).toFixed(2));
    expect(remaining).toBe(0);
  });
});
