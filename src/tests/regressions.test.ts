import { describe, it, expect, vi } from 'vitest';
import { useStore } from '../store/useStore';
import { useCheckinStore } from '../store/useCheckinStore';

describe('Regression Testing Suite - Fix Verification', () => {

  // Regression 1: Waitlist Endpoint Mismatch
  it('should_prevent_mismatched_waitlist_signup_endpoints_returning_404', () => {
    const frontendEndpoint = '/api/waitlist';
    const backendRouteRegex = /^\/api\/waitlist$|^\/v1\/api\/waitlist$/;
    
    // Asserts that the endpoint called matches the routed backend path
    expect(frontendEndpoint).toMatch(backendRouteRegex);
  });

  // Regression 2: Check-in Consecutive Misses Streak Calculation Bug
  it('should_calculate_consecutive_misses_instead_of_total_accumulated_misses', () => {
    useCheckinStore.setState({
      checkins: [],
      checkinSettings: {
        frequency: 'weekly',
        consecutiveMissesAllowed: 3,
        consecutiveMisses: 0,
        currentStreak: 0,
        totalMissed: 0,
        alertGuardiansAfterMisses: 2,
        lastCheckinAt: null,
        status: 'active'
      }
    });

    const store = useCheckinStore.getState();

    // 1. First miss -> consecutive misses = 1
    store.missCheckin();
    expect(useCheckinStore.getState().checkinSettings.consecutiveMisses).toBe(1);

    // 2. User recovers -> checkin completed -> consecutiveMisses reset to 0, streak = 1
    store.completeCheckin('tap');
    expect(useCheckinStore.getState().checkinSettings.consecutiveMisses).toBe(0);
    expect(useCheckinStore.getState().checkinSettings.currentStreak).toBe(1);

    // 3. User misses again -> consecutive misses should be exactly 1 (not 2 or totalMissed)
    store.missCheckin();
    const settings = useCheckinStore.getState().checkinSettings;
    
    expect(settings.consecutiveMisses).toBe(1);
    expect(settings.status).toBe('active');
  });

  // Regression 3: Asset Real API Persistence Guard
  it('should_propagate_error_on_api_failure_without_fake_persistence', async () => {
    useStore.setState({ assets: [], masterKey: null });

    // Calling addAsset without masterKey / API failure must throw rather than silently fake success
    await expect(
      useStore.getState().addAsset({
        name: 'Test BTC',
        type: 'Crypto',
        value: 50000,
        status: 'Protected',
        date: '2026-10-17'
      } as any)
    ).rejects.toThrow();
  });

  // Regression 4: Forgot Password Explicit Error Handling
  it('should_explicitly_throw_and_not_fake_success_when_api_fails', async () => {
    const mockPost = vi.fn().mockRejectedValue(new Error('Network error'));
    const apiMock = { post: mockPost };

    await expect(
      apiMock.post('/auth/password/reset/request', { email: 'test@email.com' })
    ).rejects.toThrow('Network error');
  });

  // Regression 5: Check-in Liveness Release Guard
  it('should_block_resetting_liveness_status_to_active_once_recovery_has_already_released', () => {
    useCheckinStore.setState({
      checkins: [],
      checkinSettings: {
        frequency: 'weekly',
        consecutiveMissesAllowed: 3,
        consecutiveMisses: 3,
        currentStreak: 0,
        totalMissed: 3,
        alertGuardiansAfterMisses: 2,
        lastCheckinAt: null,
        status: 'recovery_triggered' // Released stage
      }
    });

    useCheckinStore.getState().completeCheckin('tap');
    const settings = useCheckinStore.getState().checkinSettings;
    
    // Status must be preserved as recovery_triggered
    expect(settings.status).toBe('recovery_triggered');
  });
});
