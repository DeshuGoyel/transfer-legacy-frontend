import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface IdentityPassport {
  fullName: string;
  dateOfBirth: string;
  country: string;
  emergencyContact: { name: string; phone: string; relation: string };
  bloodGroup: string;
  vaultSummary: string;
  qrCodeData: string;
  lastUpdated: string;
  shareableWithAttorney: boolean;
  shareableWithAdvisor: boolean;
  shareableWithFamily: boolean;
}

interface PassportState {
  passport: IdentityPassport;
  updatePassport: (updates: Partial<IdentityPassport>) => void;
  generateQRData: () => void;
  generateSummary: (summary: string) => void;
}

const defaultPassport: IdentityPassport = {
  fullName: typeof localStorage !== 'undefined' ? (localStorage.getItem('tl_user_name') || "") : "",
  dateOfBirth: "",
  country: "",
  emergencyContact: { name: "", phone: "", relation: "" },
  bloodGroup: "",
  vaultSummary: "",
  qrCodeData: "",
  lastUpdated: new Date().toISOString(),
  shareableWithAttorney: false,
  shareableWithAdvisor: false,
  shareableWithFamily: true,
};

export const usePassportStore = create<PassportState>()(
  persist(
    (set) => ({
      passport: defaultPassport,
      
      updatePassport: (updates) => set((state) => ({
        passport: { ...state.passport, ...updates, lastUpdated: new Date().toISOString() }
      })),
      
      generateQRData: () => set((state) => {
        const userId = typeof localStorage !== 'undefined' ? (localStorage.getItem('tl_user_id') || 'unregistered') : 'unregistered';
        const publicData = {
          uid: userId,
          name: state.passport.fullName || undefined,
          dob: state.passport.dateOfBirth || undefined,
          blood: state.passport.bloodGroup || undefined,
          emergency: state.passport.emergencyContact?.name ? state.passport.emergencyContact : undefined,
          ts: Date.now()
        };
        const payload = btoa(unescape(encodeURIComponent(JSON.stringify(publicData))));
        const qrString = `https://transferlegacy.com/trust?passport=${payload}`;
        return { passport: { ...state.passport, qrCodeData: qrString, lastUpdated: new Date().toISOString() } };
      }),
      
      generateSummary: (summary) => set((state) => ({
        passport: { ...state.passport, vaultSummary: summary, lastUpdated: new Date().toISOString() }
      }))
    }),
    {
      name: 'transfer_legacy_identity_passport',
      // Merge stored state with defaults so new fields never come back undefined
      merge: (persisted: unknown, current: PassportState): PassportState => ({
        ...current,
        passport: {
          ...defaultPassport,
          ...(persisted as PassportState)?.passport,
          // Ensure nested emergencyContact is never undefined
          emergencyContact: {
            ...defaultPassport.emergencyContact,
            ...(persisted as PassportState)?.passport?.emergencyContact,
          },
        },
      }),
    }
  )
);
