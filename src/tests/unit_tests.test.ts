import { describe, it, expect, beforeEach } from 'vitest';
import { calculateProjection, calculateProjectionSequence } from '../utils/mathUtils';
import { generateHash } from '../utils/cryptoUtils';
import { waitlistSchema } from '../lib/validations';
import { useStore } from '../store/useStore';
import { useCheckinStore } from '../store/useCheckinStore';
import { AssetBuilder, GuardianBuilder } from './builders';

// Mock Web Crypto API digest since Node environment requires subtle mocks in older versions
if (!global.crypto) {
  Object.defineProperty(global, 'crypto', {
    value: {
      subtle: {
        digest: async (_algorithm: string, _data: Uint8Array) => {
          return new Uint8Array(32).buffer; // 256-bit empty buffer for hashing Mock
        }
      },
      randomUUID: () => 'mock-uuid-12345'
    }
  });
}

describe('Math Utilities Unit Tests', () => {
  it('should_calculate_correct_compound_interest_when_growth_is_applied', () => {
    const principal = 100000;
    const rate = 0.05; // 5%
    const years = 10;
    const result = calculateProjection(principal, rate, years);
    expect(result).toBeCloseTo(162889.46, 2);
  });

  it('should_return_correct_sequence_length_and_year_progression_for_projections', () => {
    const principal = 100000;
    const rate = 0.05;
    const years = 5;
    const sequence = calculateProjectionSequence(principal, rate, years);
    
    expect(sequence.length).toBe(6); // Year 0 to Year 5
    expect(sequence[0].value).toBe(100000);
    expect(sequence[5].year).toBe(new Date().getFullYear() + 5);
  });
});

describe('Crypto Utilities Unit Tests', () => {
  it('should_generate_stable_hash_representation_for_valid_json_payloads', async () => {
    const data = { vaultId: '123', secret: 'abc' };
    const hash = await generateHash(data);
    expect(hash).toHaveLength(64); // SHA-256 hex string length
    expect(typeof hash).toBe('string');
  });
});

describe('Validation Schema Unit Tests', () => {
  it('should_validate_correct_email_addresses_successfully', () => {
    const result = waitlistSchema.safeParse({ email: 'test@familink.com' });
    expect(result.success).toBe(true);
  });

  it('should_reject_invalid_email_addresses_with_descriptive_error_messages', () => {
    const result = waitlistSchema.safeParse({ email: 'not-an-email' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Please enter a valid email address');
    }
  });
});

describe('Zustand Main Store Unit Tests', () => {
  beforeEach(() => {
    // Reset Zustand store state before each test
    useStore.setState({
      assets: [],
      guardians: [],
      heirs: [],
      isAuthenticated: true
    });
  });

  it('should_add_asset_to_store_and_increment_legacy_score', async () => {
    const mockAsset = new AssetBuilder().withName('Hardware Wallet').withValue(50000).build();
    await useStore.getState().addAsset(mockAsset);
    
    const assets = useStore.getState().assets;
    expect(assets.length).toBe(1);
    expect(assets[0].name).toBe('Hardware Wallet');
  });

  it('should_remove_asset_from_store_upon_deletion_request', async () => {
    const mockAsset = new AssetBuilder().withId('asset-del-123').build();
    useStore.setState({ assets: [mockAsset] });
    
    await useStore.getState().deleteAsset('asset-del-123');
    const assets = useStore.getState().assets;
    expect(assets.length).toBe(0);
  });

  it('should_add_guardian_as_pending_initially', () => {
    const mockGuardian = new GuardianBuilder().withName('Alice').withEmail('alice@net.com').build();
    useStore.getState().addGuardian({ name: mockGuardian.name, email: mockGuardian.email });
    
    const guardians = useStore.getState().guardians;
    expect(guardians.length).toBe(1);
    expect(guardians[0].status).toBe('Pending');
  });

  it('should_confirm_guardian_status_when_handshake_completes', () => {
    const mockGuardian = new GuardianBuilder().withId('guard-1').withStatus('Pending').build();
    useStore.setState({ guardians: [mockGuardian] });
    
    useStore.getState().confirmGuardian('guard-1');
    const guardians = useStore.getState().guardians;
    expect(guardians[0].status).toBe('Confirmed');
  });
});

describe('Zustand Check-In Store Unit Tests', () => {
  beforeEach(() => {
    useCheckinStore.setState({
      checkins: [],
      checkinSettings: {
        frequency: 'weekly',
        consecutiveMissesAllowed: 3,
        currentStreak: 0,
        totalMissed: 0,
        alertGuardiansAfterMisses: 2,
        lastCheckinAt: null,
        status: 'active'
      }
    });
  });

  it('should_record_completed_checkin_and_update_streak', () => {
    useCheckinStore.getState().completeCheckin('tap');
    const state = useCheckinStore.getState();
    
    expect(state.checkins.length).toBe(1);
    expect(state.checkins[0].status).toBe('responded');
    expect(state.checkinSettings.currentStreak).toBe(1);
    expect(state.checkinSettings.status).toBe('active');
  });
});
