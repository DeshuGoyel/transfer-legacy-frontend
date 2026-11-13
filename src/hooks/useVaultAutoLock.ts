import { useEffect, useRef } from 'react';
import { useStore } from '../store/useStore';
import toast from 'react-hot-toast';

// 15 minutes of inactivity auto-lock threshold (in milliseconds)
const INACTIVITY_TIMEOUT_MS = 15 * 60 * 1000;

export function useVaultAutoLock() {
  const isAuthenticated = useStore(state => state.isAuthenticated);
  const masterKey = useStore(state => state.masterKey);
  const logout = useStore(state => state.logout);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Only monitor if the user is authenticated and holds cryptographic keys in RAM
    if (!isAuthenticated && !masterKey) {
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }

    const resetTimer = () => {
      if (timerRef.current) clearTimeout(timerRef.current);

      timerRef.current = setTimeout(() => {
        // Clear decrypted master key from RAM & log out for zero-knowledge vault protection (OWASP ASVS 3.3)
        if (useStore.getState().isAuthenticated || useStore.getState().masterKey) {
          toast('Vault automatically locked due to 15 minutes of inactivity.', {
            icon: '🔒',
            duration: 6000,
          });
          logout();
        }
      }, INACTIVITY_TIMEOUT_MS);
    };

    // User activity events to reset inactivity counter
    const activityEvents = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart', 'click'];
    
    activityEvents.forEach(event => {
      window.addEventListener(event, resetTimer, { passive: true });
    });

    // Start initial timer
    resetTimer();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      activityEvents.forEach(event => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [isAuthenticated, masterKey, logout]);
}
