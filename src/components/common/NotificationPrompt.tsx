import React, { useState, useEffect } from 'react';
import { Bell, X, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { requestPushPermission, setOneSignalUser } from '../../lib/onesignal';
import { toast } from 'react-hot-toast';

export default function NotificationPrompt() {
  const [isVisible, setIsVisible] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return;
    }

    // Do not prompt if already granted or explicitly blocked
    if (Notification.permission !== 'default') {
      return;
    }

    // Check if dismissed within the last 7 days
    try {
      const dismissedAt = localStorage.getItem('tl_notification_prompt_dismissed');
      if (dismissedAt) {
        const dismissedTime = parseInt(dismissedAt, 10);
        if (!isNaN(dismissedTime) && Date.now() - dismissedTime < 7 * 24 * 60 * 60 * 1000) {
          return;
        }
      }
    } catch {
      // Ignore localStorage access restrictions
    }

    // Delay prompt appearance by exactly 1 minute (60 seconds)
    const ONE_MINUTE_MS = 60 * 1000;
    const timer = setTimeout(() => {
      if (Notification.permission === 'default') {
        setIsVisible(true);
      }
    }, ONE_MINUTE_MS);

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    try {
      localStorage.setItem('tl_notification_prompt_dismissed', Date.now().toString());
    } catch {
      // Ignore
    }
    setIsVisible(false);
  };

  const handleSubscribe = async () => {
    setIsSubscribing(true);
    try {
      const granted = await requestPushPermission();
      if (granted) {
        toast.success('Protocol alerts enabled successfully');
        try {
          const userId = localStorage.getItem('tl_user_id');
          if (userId) {
            await setOneSignalUser(userId);
          }
          localStorage.setItem('tl_notification_prompt_dismissed', 'granted');
        } catch {
          // Ignore
        }
        setIsVisible(false);
      } else {
        handleDismiss();
      }
    } catch (err) {
      console.warn('Failed to subscribe to push notifications:', err);
      handleDismiss();
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-6 right-4 sm:right-6 z-50 max-w-sm w-[calc(100vw-2rem)]"
        >
          <div className="relative p-5 rounded-2xl bg-surface/95 border border-base/80 backdrop-blur-xl shadow-2xl shadow-black/50 space-y-4">
            {/* Ambient subtle glow */}
            <div className="absolute top-0 right-0 -mr-6 -mt-6 w-28 h-28 bg-brand-primary/10 rounded-full blur-2xl pointer-events-none" />

            {/* Header */}
            <div className="flex items-start justify-between gap-3 relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary shrink-0 shadow-inner">
                  <Bell size={18} className="animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-primary" />
                    <h4 className="text-xs font-bold uppercase tracking-widest text-primary font-display">
                      Protocol Alerts
                    </h4>
                  </div>
                  <p className="text-[10px] text-muted font-bold uppercase tracking-wider mt-0.5">
                    Zero-Knowledge Network
                  </p>
                </div>
              </div>

              <button
                onClick={handleDismiss}
                className="text-muted hover:text-primary transition-colors p-1 rounded-lg hover:bg-surface-raised"
                aria-label="Dismiss notification prompt"
              >
                <X size={15} />
              </button>
            </div>

            {/* Body */}
            <p className="text-xs text-secondary leading-relaxed font-sans relative z-10">
              Enable real-time security alerts for proof-of-life heartbeats, guardian attestations, and recovery signals. You can configure or disable this anytime.
            </p>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-1 relative z-10">
              <button
                onClick={handleDismiss}
                disabled={isSubscribing}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-secondary hover:text-primary transition-colors"
              >
                Later
              </button>
              <button
                onClick={handleSubscribe}
                disabled={isSubscribing}
                className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-brand-primary text-white hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-brand-primary/20 flex items-center gap-1.5 disabled:opacity-50"
              >
                {isSubscribing ? 'Enabling...' : 'Subscribe'}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
