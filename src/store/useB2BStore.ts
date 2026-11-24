import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface B2BApiKey {
  id: string;
  name: string;
  key: string;
  tier: "developer" | "scale" | "enterprise";
  status: "active" | "revoked";
  createdAt: string;
  lastUsedAt: string | null;
}

interface B2BUsageData {
  date: string;
  calls: number;
}

export interface B2BNode {
  id: string;
  name: string;
  type: string;
  status: string;
  permissions: string[];
}

interface B2BState {
  apiKeys: B2BApiKey[];
  usageData: B2BUsageData[];
  webhooks: { url: string; events: string[] }[];
  connectedNodes: B2BNode[];
  lastPing: Record<string, string>;
  createKey: (name: string, tier: B2BApiKey["tier"]) => string;
  revokeKey: (id: string) => void;
  recordApiCall: (keyId?: string) => void;
  addWebhook: (url: string, events: string[]) => void;
  registerNode: (node: Omit<B2BNode, 'id'>) => void;
  pingNode: (id: string) => void;
}

export const useB2BStore = create<B2BState>()(
  persist(
    (set) => ({
      apiKeys: [],
      usageData: [],
      webhooks: [],
      connectedNodes: [],
      lastPing: {},
      
      createKey: (name, tier) => {
        const charset = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const randomBytes = new Uint8Array(12);
        crypto.getRandomValues(randomBytes);
        const randomKey = Array.from(randomBytes, (byte) => charset[byte % charset.length]).join('');
        const fullKey = `lk_live_${randomKey}`;
        const maskedKey = `lk_live_••••••••${randomKey.slice(-4)}`;
        const newKey: B2BApiKey = {
          id: Date.now().toString(),
          name,
          key: maskedKey,
          tier,
          status: "active",
          createdAt: new Date().toISOString(),
          lastUsedAt: null
        };
        set((state) => ({ apiKeys: [...state.apiKeys, newKey] }));
        return fullKey;
      },
      
      revokeKey: (id) => set((state) => ({
        apiKeys: state.apiKeys.map(k => k.id === id ? { ...k, status: "revoked" } : k)
      })),
      
      recordApiCall: (keyId) => set((state) => {
        const today = new Date().toISOString().split('T')[0];
        const existingIdx = state.usageData.findIndex(u => u.date === today);
        let newUsage = [...state.usageData];
        if (existingIdx >= 0) {
          newUsage[existingIdx] = { ...newUsage[existingIdx], calls: newUsage[existingIdx].calls + 1 };
        } else {
          newUsage.push({ date: today, calls: 1 });
          if (newUsage.length > 30) newUsage = newUsage.slice(-30);
        }
        
        return {
          usageData: newUsage,
          apiKeys: state.apiKeys.map(k => (keyId && k.id === keyId) || (!keyId && k.status === 'active')
            ? { ...k, lastUsedAt: new Date().toISOString() }
            : k
          )
        };
      }),
      
      addWebhook: (url, events) => set((state) => ({
        webhooks: [...state.webhooks, { url, events }]
      })),

      registerNode: (node) => set(state => ({
        connectedNodes: [...state.connectedNodes, { ...node, id: Date.now().toString() }]
      })),

      pingNode: (id) => set(state => ({
        lastPing: { ...state.lastPing, [id]: new Date().toISOString() }
      }))
    }),
    {
      name: 'transfer_legacy_b2b_api_keys',
    }
  )
);
