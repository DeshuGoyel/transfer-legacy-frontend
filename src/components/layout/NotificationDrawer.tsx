import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../store/useStore';
import { X, Key, User, FileText, AlertTriangle, CheckCircle, Bell, CheckCheck } from 'lucide-react';
import React from 'react';

const icons: Record<string, React.ElementType> = {
  Key,
  User,
  FileText,
  AlertTriangle,
  CheckCircle,
  Bell
};

export default function NotificationDrawer() {
  const { notifications, isNotificationOpen, toggleNotifications, markNotificationAsRead, markAllNotificationsAsRead } = useStore();
  const [filter, setFilter] = useState<'all' | 'unread' | 'security'>('all');

  const unreadCount = notifications.filter(n => !n.read).length;

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.read;
    if (filter === 'security') return n.icon === 'AlertTriangle' || n.icon === 'Key';
    return true;
  });

  return (
    <AnimatePresence>
      {isNotificationOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleNotifications}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[99]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 280 }}
            className="fixed inset-y-0 right-0 w-full max-w-sm sm:max-w-md bg-[#08090C] border-l border-[rgba(255,255,255,0.08)] z-[100] shadow-2xl flex flex-col text-[#E9E6DF]"
          >
            {/* Header */}
            <div className="p-5 border-b border-[rgba(255,255,255,0.08)] bg-[#0E1015]/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary">
                  <Bell size={18} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-display font-bold text-white tracking-tight">Notifications</h2>
                    {unreadCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-primary/20 text-brand-primary border border-brand-primary/30">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#9B97A3] font-medium">Vault security & protocol events</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={() => markAllNotificationsAsRead()}
                    title="Mark all as read"
                    className="p-2 rounded-lg text-[#9B97A3] hover:text-white hover:bg-white/5 transition-colors flex items-center gap-1 text-[11px] font-medium"
                  >
                    <CheckCheck size={16} />
                  </button>
                )}
                <button
                  onClick={toggleNotifications}
                  className="p-2 rounded-lg text-[#9B97A3] hover:text-white hover:bg-white/5 transition-colors"
                  aria-label="Close notifications"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Category Filter Tabs */}
            <div className="flex items-center gap-2 px-5 py-3 border-b border-[rgba(255,255,255,0.06)] bg-[#08090C]">
              {(['all', 'unread', 'security'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setFilter(tab)}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all ${
                    filter === tab
                      ? 'bg-brand-primary text-white shadow-md shadow-brand-primary/20'
                      : 'text-[#9B97A3] hover:text-white hover:bg-white/5'
                  }`}
                >
                  {tab === 'all' ? 'All' : tab === 'unread' ? `Unread (${unreadCount})` : 'Security'}
                </button>
              ))}
            </div>

            {/* Notification List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {filteredNotifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-center px-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#9B97A3] mb-3">
                    <Bell size={22} className="opacity-50" />
                  </div>
                  <p className="text-sm font-semibold text-white">No notifications</p>
                  <p className="text-xs text-[#9B97A3] mt-1">All systems and vaults are functioning normally.</p>
                </div>
              ) : (
                filteredNotifications.map((n) => {
                  const Icon = icons[n.icon] || AlertTriangle;
                  const isAlert = n.icon === 'AlertTriangle';
                  const isKey = n.icon === 'Key';
                  const isCheck = n.icon === 'CheckCircle';

                  return (
                    <div
                      key={n.id}
                      onClick={() => !n.read && markNotificationAsRead(n.id)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden flex items-start gap-3.5 ${
                        !n.read
                          ? 'bg-[#0E1015] border-brand-primary/30 shadow-lg shadow-brand-primary/5 hover:border-brand-primary/50'
                          : 'bg-[#0E1015]/40 border-[rgba(255,255,255,0.05)] hover:bg-[#0E1015]/70 hover:border-white/10'
                      }`}
                    >
                      {!n.read && (
                        <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-brand-primary animate-pulse" />
                      )}

                      <div className={`p-2.5 rounded-xl shrink-0 border ${
                        isAlert
                          ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                          : isKey
                          ? 'bg-brand-primary/10 text-brand-primary border-brand-primary/20'
                          : isCheck
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : 'bg-white/5 text-[#9B97A3] border-white/10'
                      }`}>
                        <Icon size={16} />
                      </div>

                      <div className="flex-1 pr-3">
                        <p className={`text-xs leading-relaxed ${!n.read ? 'text-[#E9E6DF] font-semibold' : 'text-[#9B97A3]'}`}>
                          {n.message}
                        </p>
                        <span className="text-[10px] text-[#6B6675] mt-1.5 block font-mono">
                          Vault Protocol Alert
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-[rgba(255,255,255,0.08)] bg-[#0E1015]/40 text-center">
              <p className="text-[10px] font-mono uppercase tracking-widest text-[#6B6675]">
                Zero-Knowledge Notification Pipeline
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
