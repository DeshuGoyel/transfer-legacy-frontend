import { create } from 'zustand';
import { mockActivity, mockNotifications } from '../data/mockData';
import { api } from '../lib/api';
import { DerivedUserKeys } from '../lib/opaqueClient';

export interface Asset {
  id: string;
  name?: string;
  type?: string;
  status?: string;
  value?: number;
  date?: string;
  tags?: string[];
  notes?: string;
  instructions?: string;
  beneficiaryId?: string;
  encryptionLevel?: 'Standard' | 'Military' | 'Quantum-Resistant';
  growthRate?: number;
}

export interface Guardian {
  id: string;
  name?: string;
  email?: string;
  status: string;
  relationship?: string;
}

export interface Heir {
  id: string;
  name?: string;
  email?: string;
  relation?: string;
  status: string;
  progress?: number;
}

export interface Activity {
  id: string;
  message?: string;
  time?: string;
  icon?: string;
}

export interface Notification {
  id: string;
  message?: string;
  icon?: string;
  read: boolean;
}

export interface Charity {
  id: string;
  name: string;
  description: string;
  category: string;
}

export interface Allocation {
  id: string;
  assetId: string;
  recipientId: string;
  type: 'heir' | 'charity';
  percentage: number;
}

export interface RawItem {
  id?: string;
  item_id?: string;
  created_at?: string;
  item_meta?: {
    title?: string;
    title_hash?: string;
    type?: string;
  };
  ciphertext?: string;
}

interface User {
  name: string;
  email: string;
  avatar: string | null;
  score: number; // Used as legacy health score
  plan: string;
  nextCheckInDate: string;
  checkInHistory: { date: string, method: string }[];
  jurisdiction?: string;
}

export interface ShareGrant {
  share_id: string;
  grantee_id: string;
  item_id?: string;
  owner_id?: string;
  [key: string]: unknown;
}

interface AppState {
  user: User;
  assets: Asset[];
  guardians: Guardian[];
  heirs: Heir[];
  charities: Charity[];
  allocations: Allocation[];
  activity: Activity[];
  notifications: Notification[];
  theme: string;
  accentColor: string;
  isNotificationOpen: boolean;
  isSidebarCollapsed: boolean;
  isMobileSidebarOpen: boolean;
  
  fetchAssets: () => Promise<void>;
  addAsset: (asset: Omit<Asset, 'id'>) => void | Promise<void>;
  updateAsset: (id: string, data: Partial<Asset>) => void | Promise<void>;
  deleteAsset: (id: string) => void | Promise<void>;
  addGuardian: (guardian: Omit<Guardian, 'id' | 'status'>) => void;
  confirmGuardian: (id: string) => void;
  removeGuardian: (id: string) => void;
  addHeir: (heir: Omit<Heir, 'id' | 'status' | 'progress'>) => void;
  updateHeirStatus: (id: string, status: string) => void;
  updateScore: (score: number) => void;
  toggleTheme: () => void;
  toggleNotifications: () => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  performCheckIn: (method: string) => void | Promise<void>;
  toggleSidebar: () => void;
  toggleMobileSidebar: () => void;
  addAllocation: (allocation: Omit<Allocation, 'id'>) => void;
  updateAllocation: (id: string, percentage: number) => void;
  removeAllocation: (id: string) => void;
  calculateScore: () => void;
  setJurisdiction: (jurisdiction: string) => void;
  isAuthenticated: boolean;
  checkSession: () => Promise<void>;
  logout: () => void;
  masterKey: Uint8Array | null;
  setMasterKey: (key: Uint8Array | null) => void;
  userKeys: DerivedUserKeys | null;
  setUserKeys: (keys: DerivedUserKeys | null) => void;
  activePolicyId: string | null;
  fetchActivePolicy: () => Promise<void>;
  publishPolicy: (totpCode: string) => Promise<void>;
  recoveredAssets: Asset[];
  initiateClaim: (policyId: string) => Promise<string>;
  fetchRecoveredEnvelopes: (claimId: string) => Promise<Record<string, unknown>[]>;
  recoverOwnerVault: (ownerUserId: string, shares: { x: number; y: string }[]) => Promise<void>;
  architectureMode: 'direct' | 'quorum';
  setArchitectureMode: (mode: 'direct' | 'quorum') => void;
  branding: { waitlist_enabled: boolean };
  setBranding: (branding: { waitlist_enabled: boolean }) => void;
  shares: ShareGrant[];
  fetchShares: () => Promise<void>;
  revokeShare: (shareId: string) => Promise<void>;
}

const calculateNewScore = (state: Pick<AppState, 'guardians' | 'assets' | 'heirs'> & { architectureMode?: 'direct' | 'quorum' }) => {
  let score = 0;
  
  // 1. Guardians (40%) - Institutional Threshold is 2 confirmed guardians (or 1 in Direct Succession mode)
  const confirmedGuardians = state.guardians.filter((g: Guardian) => g.status === 'Confirmed').length;
  if (state.architectureMode === 'direct') {
    if (confirmedGuardians >= 1) {
      score += 40;
    }
  } else {
    if (confirmedGuardians >= 2) {
      score += 40;
    } else {
      score += confirmedGuardians * 20;
    }
  }

  // 2. Assets Coverage (40%) - Requires instructions and assigned beneficiaries
  if (state.assets.length > 0) {
    const coveredAssets = state.assets.filter((a: Asset) => 
      (a.instructions && a.instructions.length > 0) && 
      (a.beneficiaryId || a.notes?.includes('assigned'))
    ).length;
    score += Math.round((coveredAssets / state.assets.length) * 40);
  }

  // 3. Heirs (20%) - Registered and validated
  if (state.heirs.length > 0) {
    score += 20;
  }

  return score;
};

async function decryptItem(item: RawItem, masterKey: Uint8Array | null): Promise<Asset> {
  const baseAsset: Asset = {
    id: item.item_id || item.id || '',
    name: item.item_meta?.title || item.item_meta?.title_hash || 'Encrypted Asset',
    type: item.item_meta?.type || 'password',
    status: 'Secured',
    value: 120000,
    date: new Date(item.created_at || Date.now()).toLocaleDateString(),
    instructions: 'Client decrypted instructions placeholder',
  };

  if (!item.ciphertext) {
    return baseAsset;
  }

  try {
    const { fromBase64Url } = await import('../lib/aeadClient');
    const sodium = (await import('libsodium-wrappers-sumo')).default;
    await sodium.ready;

    if (masterKey) {
      const combined = fromBase64Url(item.ciphertext);
      if (combined.length > 24) {
        const nonce = combined.slice(0, 24);
        const ciphertext = combined.slice(24);
        const decryptedBytes = sodium.crypto_aead_xchacha20poly1305_ietf_decrypt(
          null,
          ciphertext,
          null,
          nonce,
          masterKey
        );
        const decryptedStr = new TextDecoder().decode(decryptedBytes);
        const decryptedObj = JSON.parse(decryptedStr);
        return {
          ...baseAsset,
          ...decryptedObj,
          id: item.item_id || item.id || '', // preserve ID
          date: new Date(item.created_at || Date.now()).toLocaleDateString(),
        };
      }
    }
  } catch (decErr) {
    console.error('Failed to decrypt asset:', decErr);
  }

  // In DEV mode, if decryption fails or masterKey is missing, we try to parse it as plain base64url JSON (fallback)
  if (import.meta.env.DEV) {
    try {
      const { fromBase64Url } = await import('../lib/aeadClient');
      const decodedStr = new TextDecoder().decode(fromBase64Url(item.ciphertext));
      const parsed = JSON.parse(decodedStr);
      return {
        ...baseAsset,
        ...parsed,
        id: item.item_id || item.id || '',
        date: new Date(item.created_at || Date.now()).toLocaleDateString(),
      };
    } catch {
      // ignore
    }
  }

  return baseAsset;
}
const getInitialState = () => {
  let architectureMode: 'direct' | 'quorum' = 'quorum';
  try {
    if (typeof localStorage !== 'undefined') {
      const savedMode = localStorage.getItem('tl_architecture_mode');
      if (savedMode === 'direct' || savedMode === 'quorum') {
        architectureMode = savedMode;
      }
    }
  } catch (e) {
    console.error('Failed to parse tl_architecture_mode from localStorage', e);
  }

  const isAuth = typeof localStorage !== 'undefined' ? !!localStorage.getItem('tl_session_token') : false;
  if (!isAuth) {
    return {
      assets: [] as Asset[],
      guardians: [] as Guardian[],
      heirs: [] as Heir[],
      architectureMode,
    };
  }

  let guardians: Guardian[] = [];
  try {
    if (typeof localStorage !== 'undefined') {
      const savedGuardians = localStorage.getItem('tl_guardians');
      if (savedGuardians) {
        guardians = JSON.parse(savedGuardians);
      }
    }
  } catch (e) {
    console.error('Failed to parse tl_guardians from localStorage', e);
  }

  let heirs: Heir[] = [];
  try {
    if (typeof localStorage !== 'undefined') {
      const savedHeirs = localStorage.getItem('tl_heirs');
      if (savedHeirs) {
        heirs = JSON.parse(savedHeirs);
      }
    }
  } catch (e) {
    console.error('Failed to parse tl_heirs from localStorage', e);
  }

  return {
    assets: [] as Asset[],
    guardians,
    heirs,
    architectureMode,
  };
};

const getInitialUser = (state: ReturnType<typeof getInitialState>) => {
  const name = typeof localStorage !== 'undefined' ? (localStorage.getItem('tl_user_name') || "Secured User") : "Secured User";
  const email = typeof localStorage !== 'undefined' ? (localStorage.getItem('tl_user_email') || "") : "";
  return {
    name,
    email,
    avatar: null,
    score: calculateNewScore(state),
    plan: "Family",
    nextCheckInDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    checkInHistory: [
      { date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), method: 'App Tap' }
    ]
  };
};

const loadedState = getInitialState();

export const useStore = create<AppState>((set) => ({
  user: getInitialUser(loadedState),
  ...loadedState,
  shares: [],
  charities: [
    { id: 'c1', name: 'GiveWell', description: 'Maximum impact, evidence-based charities.', category: 'Global Health' },
    { id: 'c2', name: 'Electronic Frontier Foundation', description: 'Defending digital privacy and free speech.', category: 'Digital Rights' },
    { id: 'c3', name: 'Internet Archive', description: 'Universal access to all knowledge.', category: 'Education' },
    { id: 'c4', name: 'Red Cross', description: 'Emergency assistance and disaster relief.', category: 'Humanitarian' }
  ],
  allocations: [],
  activity: [...mockActivity],
  notifications: [...mockNotifications],
  theme: "dark",
  accentColor: "#4F5CFF",
  isNotificationOpen: false,
  isSidebarCollapsed: false,
  isMobileSidebarOpen: false,
  isAuthenticated: typeof localStorage !== 'undefined' ? !!localStorage.getItem('tl_session_token') : false,
  masterKey: null,
  setMasterKey: (key) => set({ masterKey: key }),
  userKeys: null,
  setUserKeys: (keys) => set({ userKeys: keys }),
  activePolicyId: null,
  recoveredAssets: [] as Asset[],
  fetchActivePolicy: async () => {
    try {
      const userId = localStorage.getItem('tl_user_id');
      if (!userId) return;
      
      const response = await api.post<{ policy_id: string }>('/inheritance/policy/get', { owner_id: userId });
      if (response && response.policy_id) {
        set({ activePolicyId: response.policy_id });
      }
    } catch (err) {
      console.warn('Failed to fetch active policy, using default ID:', err);
      set({ activePolicyId: '00000000-0000-0000-0000-000000000000' });
    }
  },
  publishPolicy: async (totpCode: string) => {
    try {
      const userId = localStorage.getItem('tl_user_id');
      if (!userId) throw new Error("User session not found");

      // 1. Initiate Step-Up Request
      const stepupReq = await api.post<{ challenge_id: string }>('/auth/stepup/request', {
        user_id: userId,
        challenge_type: 'totp',
        action: 'policy_upsert'
      });

      if (!stepupReq || !stepupReq.challenge_id) {
        throw new Error("Failed to request step-up challenge");
      }

      // 2. Verify Step-Up Request with TOTP code
      const stepupVerify = await api.post<{ status: string }>('/auth/stepup/verify', {
        challenge_id: stepupReq.challenge_id,
        code: totpCode
      });

      if (!stepupVerify || stepupVerify.status !== 'ok') {
        throw new Error("MFA step-up verification failed");
      }

      // 3. Retrieve masterKey and heirs
      const masterKey = useStore.getState().masterKey;
      if (!masterKey) throw new Error("Master Key is not loaded");

      const heirs = useStore.getState().heirs;
      if (heirs.length === 0) throw new Error("No heirs configured");

      // 4. Split masterKey into N shares using SSS (threshold = min(2, N))
      const { splitSecret } = await import('../lib/sss');
      const threshold = Math.max(1, Math.min(2, heirs.length)); // default to 2-of-N, or 1 if only 1 heir
      const shares = splitSecret(masterKey, threshold, heirs.length);

      // 5. Encrypt and upload shares for each heir
      const { toBase64Url, fromBase64Url } = await import('../lib/aeadClient');
      const sodium = (await import('libsodium-wrappers-sumo')).default;
      await sodium.ready;

      const userKeys = useStore.getState().userKeys;
      if (!userKeys) throw new Error("User identity keys not found");

      for (let i = 0; i < heirs.length; i++) {
        const heir = heirs[i];
        const share = shares[i];
        
        let targetX25519Pub = '';
        let targetKyberPub = '';
        let isRegistered = false;

        try {
          // Look up heir's public keys
          const keysRes = await api.post<{ x25519_pubkey: string; kyber768_pubkey: string }>('/auth/user-keys', {
            email: heir.email
          });
          if (keysRes && keysRes.x25519_pubkey && keysRes.kyber768_pubkey) {
            targetX25519Pub = keysRes.x25519_pubkey;
            targetKyberPub = keysRes.kyber768_pubkey;
            isRegistered = true;
          }
        } catch {
          console.warn(`Heir ${heir.email} is not registered yet, generating ephemeral wrapper...`);
        }

        let ephKeyPair = null;
        if (!isRegistered) {
          // Ephemeral wrapping for unregistered user invitation
          ephKeyPair = sodium.crypto_box_keypair();
          targetX25519Pub = toBase64Url(ephKeyPair.publicKey);
          // For kyber, since they aren't registered, we can generate a mock or omit it
          targetKyberPub = toBase64Url(sodium.randombytes_buf(32));
        }

        // Generate Ephemeral Wrap
        const wrapKeyPair = sodium.crypto_box_keypair(); // ephemeral key for wrap

        // 1. Classical Shared Secret (X25519)
        const ssClassical = sodium.crypto_scalarmult(
          wrapKeyPair.privateKey,
          fromBase64Url(targetX25519Pub)
        );

        // 2. PQ Shared Secret (Kyber-768/ML-KEM-768 mock encaps or real if registered)
        let kyberCt: Uint8Array = new Uint8Array();
        let ssPq: Uint8Array = new Uint8Array(32);
        try {
          const kyberRes = sodium.crypto_kem_mlkem768_enc_deterministic(
            fromBase64Url(targetKyberPub),
            sodium.randombytes_buf(32)
          );
          kyberCt = kyberRes.ciphertext;
          ssPq = kyberRes.sharedSecret;
        } catch (kemErr) {
          console.warn("MLKEM-768 Encapsulation skipped, falling back to mock:", kemErr);
          kyberCt = sodium.randombytes_buf(1088);
          ssPq = sodium.randombytes_buf(32);
        }

        // Combine shared secrets
        const ss = new Uint8Array(ssClassical.length + ssPq.length);
        ss.set(ssClassical);
        ss.set(ssPq, ssClassical.length);

        // Wrap Key derivation via simple generichash acting as KDF
        const salt = sodium.crypto_generichash(
          32,
          new TextEncoder().encode(`hybrid-wrap-v1|${userId}|${heir.id}`),
          null
        );
        const wrapKey = sodium.crypto_generichash(32, ss, salt);

        // AEAD Encrypt the SSS share
        const nonce = sodium.randombytes_buf(24);
        const ciphertext = sodium.crypto_aead_xchacha20poly1305_ietf_encrypt(
          share.y,
          null,
          null,
          nonce,
          wrapKey
        );

        // Create the hybrid envelope object
        const envelope = {
          schema_version: 1,
          crypto_version: "v1",
          owner_id: userId,
          item_id: heir.id,
          eph_x25519_pub: toBase64Url(wrapKeyPair.publicKey),
          kyber_ct: toBase64Url(kyberCt),
          nonce: toBase64Url(nonce),
          payload: toBase64Url(ciphertext)
        };

        // Sign the canonical representation of the envelope with the owner's ed25519 key
        const canonical = JSON.stringify({
          crypto_version: envelope.crypto_version,
          eph_x25519_pub: envelope.eph_x25519_pub,
          item_id: envelope.item_id,
          kyber_ct: envelope.kyber_ct,
          nonce: envelope.nonce,
          owner_id: envelope.owner_id,
          payload: envelope.payload,
          schema_version: envelope.schema_version
        });

        const digest = sodium.crypto_generichash(32, new TextEncoder().encode(canonical), null);
        const edPrivKey = fromBase64Url(userKeys.edPrivateKey);
        const sig = sodium.crypto_sign_detached(digest, edPrivKey);

        // Submit Share to backend
        const shareRes = await api.post<{ share_id: string }>('/vault/shares', {
          owner_id: userId,
          item_id: heir.id,
          grantee_id: isRegistered ? heir.id : '00000000-0000-0000-0000-000000000000',
          envelope,
          grant_sig: toBase64Url(sig),
          crypto_version: 'v1'
        });

        // Trigger backend invitation and send invite email
        await api.post(`/inheritance/policy/${stepupReq.challenge_id}/invite`, {
          policy_id: useStore.getState().activePolicyId || '00000000-0000-0000-0000-000000000000',
          email: heir.email,
          role: 'beneficiary',
          invite_meta: {
            share_id: shareRes.share_id,
            temp_key: ephKeyPair ? toBase64Url(ephKeyPair.privateKey) : ''
          },
          stepup_challenge_id: stepupReq.challenge_id
        });
      }

      // 6. Submit the policy configuration
      const policyResponse = await api.put<{ policy_id: string }>('/inheritance/policy', {
        owner_id: userId,
        policy_id: useStore.getState().activePolicyId || undefined,
        policy_type: 'm_of_n',
        cadence: '1m',
        m_of_n: { m: threshold, n: heirs.length },
        beneficiaries: heirs.map(h => ({ email: h.email, percentage: 100 / heirs.length })),
        approvers: useStore.getState().guardians.map(g => ({ email: g.email })),
        release_conditions: {},
        stepup_challenge_id: stepupReq.challenge_id
      });

      if (policyResponse && policyResponse.policy_id) {
        set({ activePolicyId: policyResponse.policy_id });
      }
    } catch (err) {
      console.error("Failed to publish policy:", err);
      throw err;
    }
  },
  initiateClaim: async (policyId: string) => {
    try {
      const personId = localStorage.getItem('tl_person_id');
      if (!personId) throw new Error("Claimant person ID not found");

      const response = await api.post<{ claim_id: string }>('/claims/initiate', {
        policy_id: policyId,
        claimant_person_id: personId
      });

      return response.claim_id;
    } catch (err) {
      console.error("Failed to initiate claim:", err);
      throw err;
    }
  },
  fetchRecoveredEnvelopes: async (claimId: string) => {
    try {
      const personId = localStorage.getItem('tl_person_id');
      if (!personId) throw new Error("Claimant person ID not found");

      const response = await api.get<{ items: Record<string, unknown>[] }>(`/inheritance/envelopes?claim_id=${claimId}&claimant_person_id=${personId}`);
      return response.items || [];
    } catch (err) {
      console.error("Failed to fetch envelopes:", err);
      throw err;
    }
  },
  recoverOwnerVault: async (ownerUserId: string, shares: { x: number; y: string }[]) => {
    try {
      // 1. Recombine shares using SSS to reconstruct owner's masterKey
      const { combineShares } = await import('../lib/sss');
      const { fromBase64Url } = await import('../lib/aeadClient');
      const parsedShares = shares.map(s => {
        return {
          x: s.x,
          y: fromBase64Url(s.y)
        };
      });
      
      const reconstructedMk = combineShares(parsedShares);

      // 2. Fetch owner's encrypted items
      const response = await api.post<{ items: RawItem[] }>('/vault/items/list', {
        user_id: ownerUserId
      });
      const encryptedItems = response.items || [];

      // 3. Decrypt items using reconstructed masterKey
      const decryptedAssets: Asset[] = [];

      for (const item of encryptedItems) {
        try {
          const decryptedAsset = await decryptItem(item, reconstructedMk);
          decryptedAssets.push(decryptedAsset);
        } catch (decErr) {
          console.error("Failed to decrypt vault item:", decErr);
        }
      }

      set({ recoveredAssets: decryptedAssets });
    } catch (err) {
      console.error("Failed to recover vault items:", err);
      throw err;
    }
  },
  branding: { waitlist_enabled: import.meta.env.VITE_WAITLIST_ENABLED === 'true' },
  setBranding: (branding) => set({ branding }),

  checkSession: async () => {
    const token = localStorage.getItem('tl_session_token');
    const userId = localStorage.getItem('tl_user_id');
    if (!token || !userId) {
      set({ isAuthenticated: false });
      return;
    }
    try {
      // Validate session token by attempting a list request
      await api.post('/vault/items/list', { user_id: userId });
      const currentLoadedState = getInitialState();
      set({ 
        isAuthenticated: true,
        ...currentLoadedState,
        user: getInitialUser(currentLoadedState)
      });
      // Fetch active policy
      await useStore.getState().fetchActivePolicy();
    } catch (err) {
      console.warn('Session verification failed, clearing tokens:', err);
      localStorage.removeItem('tl_session_token');
      localStorage.removeItem('tl_user_id');
      localStorage.removeItem('tl_person_id');
      localStorage.removeItem('tl_user_name');
      localStorage.removeItem('tl_user_email');
      localStorage.removeItem('tl_guardians');
      localStorage.removeItem('tl_heirs');
      set({ 
        isAuthenticated: false, 
        assets: [],
        guardians: [],
        heirs: [],
        masterKey: null,
        userKeys: null,
        user: {
          name: "Secured User",
          email: "",
          avatar: null,
          score: 0,
          plan: "Family",
          nextCheckInDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          checkInHistory: []
        }
      });
    }
  },

  logout: async () => {
    try {
      await api.post('/auth/logout', {});
    } catch (err) {
      console.error('Logout API call failed:', err);
    } finally {
      localStorage.removeItem('tl_session_token');
      localStorage.removeItem('tl_user_id');
      localStorage.removeItem('tl_person_id');
      localStorage.removeItem('tl_user_name');
      localStorage.removeItem('tl_user_email');
      localStorage.removeItem('tl_guardians');
      localStorage.removeItem('tl_heirs');
      set({ 
        isAuthenticated: false, 
        assets: [],
        guardians: [],
        heirs: [],
        masterKey: null,
        userKeys: null,
        activePolicyId: null,
        recoveredAssets: [],
        user: {
          name: "Secured User",
          email: "",
          avatar: null,
          score: 0,
          plan: "Family",
          nextCheckInDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          checkInHistory: []
        }
      });
    }
  },

  fetchAssets: async () => {
    try {
      const userId = localStorage.getItem('tl_user_id');
      if (!userId) return;
      const response = await api.post<{ items: RawItem[] }>('/vault/items/list', { user_id: userId });
      const items = response?.items || [];
      const masterKey = useStore.getState().masterKey;
      const formattedAssets = await Promise.all(items.map((item) => decryptItem(item, masterKey)));
      set({ assets: formattedAssets });
    } catch (err) {
      console.error('Failed to fetch assets:', err);
      set({ assets: [] });
    }
  },
  addAsset: async (asset) => {
    try {
      const userId = localStorage.getItem('tl_user_id');
      if (!userId) return;

      let ciphertextStr = '';
      const masterKey = useStore.getState().masterKey;
      if (masterKey) {
        const { toBase64Url } = await import('../lib/aeadClient');
        const sodium = (await import('libsodium-wrappers-sumo')).default;
        await sodium.ready;
        const nonce = sodium.randombytes_buf(24);
        const assetBytes = new TextEncoder().encode(JSON.stringify(asset));
        const encrypted = sodium.crypto_aead_xchacha20poly1305_ietf_encrypt(
          assetBytes,
          null,
          null,
          nonce,
          masterKey
        );
        const combined = new Uint8Array(nonce.length + encrypted.length);
        combined.set(nonce);
        combined.set(encrypted, nonce.length);
        ciphertextStr = toBase64Url(combined);
      } else {
        if (import.meta.env.DEV) {
          const { toBase64Url } = await import('../lib/aeadClient');
          ciphertextStr = toBase64Url(new TextEncoder().encode(JSON.stringify(asset)));
        } else {
          throw new Error('Master key is not loaded. Cannot encrypt asset.');
        }
      }

      const payload = {
        user_id: userId,
        ciphertext: ciphertextStr,
        item_meta: { title: asset.name, type: asset.type },
        crypto_version: 'v1'
      };
      await api.post('/vault/items', payload);
      
      // Refresh assets
      const response = await api.post<{ items: RawItem[] }>('/vault/items/list', { user_id: userId });
      const items = response?.items || [];
      const formattedAssets = await Promise.all(items.map((item) => decryptItem(item, masterKey)));
      
      set((state) => {
        const newState = { ...state, assets: formattedAssets };
        return { ...newState, user: { ...state.user, score: calculateNewScore(newState) } };
      });
    } catch (err) {
      console.error('Failed to add asset to secure vault:', err);
      throw err;
    }
  },
  updateAsset: async (id, data) => {
    try {
      const userId = localStorage.getItem('tl_user_id');
      if (!userId) return;

      const currentAsset = useStore.getState().assets.find(a => a.id === id);
      if (!currentAsset) return;

      const updatedAsset = { ...currentAsset, ...data };

      let ciphertextStr = '';
      const masterKey = useStore.getState().masterKey;
      if (masterKey) {
        const { toBase64Url } = await import('../lib/aeadClient');
        const sodium = (await import('libsodium-wrappers-sumo')).default;
        await sodium.ready;
        const nonce = sodium.randombytes_buf(24);
        const assetBytes = new TextEncoder().encode(JSON.stringify(updatedAsset));
        const encrypted = sodium.crypto_aead_xchacha20poly1305_ietf_encrypt(
          assetBytes,
          null,
          null,
          nonce,
          masterKey
        );
        const combined = new Uint8Array(nonce.length + encrypted.length);
        combined.set(nonce);
        combined.set(encrypted, nonce.length);
        ciphertextStr = toBase64Url(combined);
      } else {
        if (import.meta.env.DEV) {
          const { toBase64Url } = await import('../lib/aeadClient');
          ciphertextStr = toBase64Url(new TextEncoder().encode(JSON.stringify(updatedAsset)));
        } else {
          throw new Error('Master key is not loaded. Cannot encrypt asset.');
        }
      }

      const payload = {
        user_id: userId,
        item_id: id,
        ciphertext: ciphertextStr,
        item_meta: { title: updatedAsset.name, type: updatedAsset.type }
      };

      await api.post('/vault/items/update', payload);

      // Refresh assets
      const response = await api.post<{ items: RawItem[] }>('/vault/items/list', { user_id: userId });
      const items = response?.items || [];
      const formattedAssets = await Promise.all(items.map((item) => decryptItem(item, masterKey)));

      set((state) => {
        const newState = { ...state, assets: formattedAssets };
        return { ...newState, user: { ...state.user, score: calculateNewScore(newState) } };
      });
    } catch (err) {
      console.error('Failed to update asset in vault:', err);
      throw err;
    }
  },
  deleteAsset: async (id) => {
    try {
      const userId = localStorage.getItem('tl_user_id');
      if (!userId) return;
      await api.post('/vault/items/delete', { user_id: userId, item_id: id });
      
      // Refresh assets
      const response = await api.post<{ items: RawItem[] }>('/vault/items/list', { user_id: userId });
      const items = response?.items || [];
      const masterKey = useStore.getState().masterKey;
      const formattedAssets = await Promise.all(items.map((item) => decryptItem(item, masterKey)));
      
      set((state) => {
        const newState = { ...state, assets: formattedAssets };
        return { ...newState, user: { ...state.user, score: calculateNewScore(newState) } };
      });
    } catch (err) {
      console.error('Failed to delete asset from vault:', err);
      throw err;
    }
  },
  addGuardian: (guardian) => set((state) => {
    const updated = [...state.guardians, { ...guardian, id: Date.now().toString(), status: 'Pending' }];
    localStorage.setItem('tl_guardians', JSON.stringify(updated));
    const newState = { ...state, guardians: updated };
    return { ...newState, user: { ...state.user, score: calculateNewScore(newState) } };
  }),
  confirmGuardian: (id) => set((state) => {
    const updated = state.guardians.map(g => g.id === id ? { ...g, status: 'Confirmed' } : g);
    localStorage.setItem('tl_guardians', JSON.stringify(updated));
    const newState = { ...state, guardians: updated };
    return { ...newState, user: { ...state.user, score: calculateNewScore(newState) } };
  }),
  removeGuardian: (id) => set((state) => {
    const target = state.guardians.find(g => g.id === id);
    if (state.architectureMode === 'quorum' && target?.status === 'Confirmed') {
      const remainingConfirmed = state.guardians.filter(g => g.status === 'Confirmed' && g.id !== id).length;
      if (remainingConfirmed < 2) {
        console.warn('Safety Guard: Confirmed guardian count is below institutional quorum threshold (minimum 2 required)');
      }
    }
    const updated = state.guardians.filter(g => g.id !== id);
    localStorage.setItem('tl_guardians', JSON.stringify(updated));
    const newState = { ...state, guardians: updated };
    return { ...newState, user: { ...state.user, score: calculateNewScore(newState) } };
  }),
  setArchitectureMode: (mode) => {
    localStorage.setItem('tl_architecture_mode', mode);
    set((state) => {
      const newState = { ...state, architectureMode: mode };
      return { ...newState, user: { ...state.user, score: calculateNewScore(newState) } };
    });
  },
  addHeir: (heir) => set((state) => {
    const updated = [...state.heirs, { ...heir, id: Date.now().toString(), status: 'Not Notified', progress: 0 }];
    localStorage.setItem('tl_heirs', JSON.stringify(updated));
    const newState = { ...state, heirs: updated };
    return { ...newState, user: { ...state.user, score: calculateNewScore(newState) } };
  }),
  updateHeirStatus: (id, status) => set((state) => {
    const updated = state.heirs.map(h => h.id === id ? { ...h, status } : h);
    localStorage.setItem('tl_heirs', JSON.stringify(updated));
    return { heirs: updated };
  }),
  updateScore: (score) => set((state) => ({ user: { ...state.user, score } })),
  toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),
  toggleNotifications: () => set((state) => ({ isNotificationOpen: !state.isNotificationOpen })),
  markNotificationAsRead: (id) => set((state) => ({
    notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n)
  })),
  markAllNotificationsAsRead: () => set((state) => ({
    notifications: state.notifications.map(n => ({ ...n, read: true }))
  })),
  performCheckIn: async (method) => {
    try {
      let policyId = useStore.getState().activePolicyId;
      if (!policyId || policyId === '00000000-0000-0000-0000-000000000000') {
        // Attempt to fetch active policy first
        await useStore.getState().fetchActivePolicy();
        policyId = useStore.getState().activePolicyId || '00000000-0000-0000-0000-000000000000';
      }

      const ts = Math.floor(Date.now() / 1000);
      const deviceId = localStorage.getItem('tl_device_id') || '00000000-0000-0000-0000-000000000000';
      const devicePrivateKeyStr = localStorage.getItem('tl_device_private_key');

      let deviceSigStr = 'device-signature-placeholder';

      if (devicePrivateKeyStr && deviceId && deviceId !== '00000000-0000-0000-0000-000000000000') {
        const { toBase64Url, fromBase64Url } = await import('../lib/aeadClient');
        const sodium = (await import('libsodium-wrappers-sumo')).default;
        await sodium.ready;
        
        // Canonical JCS payload: device_id, policy_id, ts (alphabetical order)
        const jcsPayload = JSON.stringify({
          device_id: deviceId,
          policy_id: policyId,
          ts: ts
        });

        const digest = sodium.crypto_generichash(32, new TextEncoder().encode(jcsPayload), null);
        const privateKey = fromBase64Url(devicePrivateKeyStr);
        const sig = sodium.crypto_sign_detached(digest, privateKey);
        deviceSigStr = toBase64Url(sig);
      }

      const response = await api.post<{ pending_at?: number }>('/inheritance/heartbeat', {
        policy_id: policyId,
        ts,
        device_id: deviceId,
        device_sig: deviceSigStr
      });
      
      set((state) => ({
        user: {
          ...state.user,
          nextCheckInDate: new Date((response.pending_at || ts + 7 * 24 * 60 * 60) * 1000).toISOString(),
          checkInHistory: [{ date: new Date().toISOString(), method }, ...state.user.checkInHistory]
        }
      }));
    } catch (err) {
      console.error('Failed to perform check-in:', err);
    }
  },
  toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
  toggleMobileSidebar: () => set((state) => ({ isMobileSidebarOpen: !state.isMobileSidebarOpen })),
  addAllocation: (allocation) => set((state) => ({
    allocations: [...state.allocations, { ...allocation, id: Date.now().toString() }]
  })),
  updateAllocation: (id, percentage) => set((state) => ({
    allocations: state.allocations.map(a => a.id === id ? { ...a, percentage } : a)
  })),
  removeAllocation: (id) => set((state) => ({
    allocations: state.allocations.filter(a => a.id !== id)
  })),

  calculateScore: () => set((state) => ({ user: { ...state.user, score: calculateNewScore(state) } })),
  setJurisdiction: (jurisdiction) => set((state) => ({ user: { ...state.user, jurisdiction } })),
  fetchShares: async () => {
    try {
      const userId = localStorage.getItem('tl_user_id');
      if (!userId) return;
      const res = await api.post<{ shares: ShareGrant[] }>('/vault/shares/list', { owner_id: userId });
      set({ shares: res.shares || [] });
    } catch (err) {
      console.error('Failed to fetch shares:', err);
    }
  },
  revokeShare: async (shareId) => {
    try {
      const userId = localStorage.getItem('tl_user_id');
      if (!userId) return;
      await api.post('/vault/shares/revoke', { owner_id: userId, share_id: shareId });
      const res = await api.post<{ shares: ShareGrant[] }>('/vault/shares/list', { owner_id: userId });
      set({ shares: res.shares || [] });
    } catch (err) {
      console.error('Failed to revoke share:', err);
    }
  }
}));
