import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Checkin {
  id: string;
  respondedAt: string | null;
  method: "tap" | "email" | "biometric";
  status: "responded" | "missed" | "pending";
  scheduledFor: string;
  metadata: object;
}

export interface CheckinSettings {
  frequency: "weekly" | "biweekly" | "monthly" | string;
  consecutiveMissesAllowed: number;
  consecutiveMisses: number;
  currentStreak: number;
  totalMissed: number;
  alertGuardiansAfterMisses: number;
  lastCheckinAt: string | null;
  status: "active" | "alert_sent" | "recovery_triggered";
}

interface CheckinState {
  checkins: Checkin[];
  checkinSettings: CheckinSettings;
  completeCheckin: (method: "tap" | "email" | "biometric") => void;
  missCheckin: () => void;
  updateSettings: (settings: Partial<CheckinSettings>) => void;
  simulateMissedCheckin: () => void;
}

export const useCheckinStore = create<CheckinState>()(
  persist(
    (set, get) => ({
      checkins: [],
      checkinSettings: {
        frequency: "weekly",
        consecutiveMissesAllowed: 3,
        consecutiveMisses: 0,
        currentStreak: 0,
        totalMissed: 0,
        alertGuardiansAfterMisses: 2,
        lastCheckinAt: null,
        status: "active"
      },
      
      completeCheckin: (method) => {
        const now = new Date().toISOString();
        const newCheckin: Checkin = {
          id: Date.now().toString(),
          respondedAt: now,
          method,
          status: "responded",
          scheduledFor: now,
          metadata: {}
        };
        
        set((state) => {
          // Guard: active status cannot be restored once recovery has already been triggered (Release)
          const isReleaseTriggered = state.checkinSettings.status === 'recovery_triggered';
          return {
            checkins: [newCheckin, ...state.checkins],
            checkinSettings: {
              ...state.checkinSettings,
              currentStreak: state.checkinSettings.currentStreak + 1,
              consecutiveMisses: 0,
              lastCheckinAt: now,
              status: isReleaseTriggered ? 'recovery_triggered' : 'active'
            }
          };
        });
      },
      
      missCheckin: () => {
        const now = new Date().toISOString();
        const newCheckin: Checkin = {
          id: Date.now().toString(),
          respondedAt: null,
          method: "tap",
          status: "missed",
          scheduledFor: now,
          metadata: {}
        };
        
        set((state) => {
          const missedCount = state.checkinSettings.totalMissed + 1;
          const consecutive = (state.checkinSettings.consecutiveMisses || 0) + 1;
          
          let updatedStatus = state.checkinSettings.status;
          if (consecutive >= state.checkinSettings.alertGuardiansAfterMisses) {
            updatedStatus = "alert_sent";
          }
          if (consecutive >= state.checkinSettings.consecutiveMissesAllowed) {
            updatedStatus = "recovery_triggered";
          }

          return {
            checkins: [newCheckin, ...state.checkins],
            checkinSettings: {
              ...state.checkinSettings,
              currentStreak: 0,
              consecutiveMisses: consecutive,
              totalMissed: missedCount,
              status: updatedStatus
            }
          };
        });
      },

      simulateMissedCheckin: () => {
        get().missCheckin();
      },
      
      updateSettings: (settings) => set((state) => ({
        checkinSettings: { ...state.checkinSettings, ...settings }
      }))
    }),
    {
      name: 'transfer_legacy_checkins_store', // Maps to the requested localStorage data concept
    }
  )
);
