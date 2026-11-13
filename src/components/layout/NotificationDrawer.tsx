import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { X, Key, User, FileText, AlertTriangle, CheckCircle, Bell, CheckCheck, Trash2, ExternalLink } from 'lucide-react';
import React from 'react';

const icons: Record<string, React.ElementType> = {
  Key,
  User,
  FileText,
  AlertTriangle,
  CheckCircle,
  Bell,
};

export default function NotificationDrawer() {
  const navigate = useNavigate();
  const {
    notifications,
    isNotificationOpen,
    toggleNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
  } = useStore();
  const [filter, setFilter] = useState<'all' | 'unread' | 'security'>('all');

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'unread') return !n.read;
    if (filter === 'security') {
      return (
        n.icon === 'AlertTriangle' ||
        n.icon === 'Key' ||
        n.notification_type === 'security'
      );
    }
    return true;
  });

  const handleNotificationClick = async (n: typeof notifications[0]) => {
    if (!n.read) {
      await markNotificationAsRead(n.id);
    }
    if (n.action_url) {
      toggleNotifications();
      navigate(n.action_url);
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    await deleteNotification(id);
  };

  const formatTime = (isoString?: string) => {
    if (!isoString) return 'Just now';
    try {
      const date = new Date(isoString);
      const diffSec = Math.floor((Date.now() - date.getTime()) / 1000);
      if (diffSec < 60) return 'Just now';
      if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
      if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
      return `${Math.floor(diffSec / 86400)}d ago`;
    } catch {
      return 'Recently';
    }
  };

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
                    <h2 className="text-base font-display font-bold text-white tracking-tight">
                      Notifications
                    </h2>
                    {unreadCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-primary/20 text-brand-primary border border-brand-primary/30">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#9B97A3] font-medium">
                    Vault security and protocol events
                  </p>
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
              {(['all', 'unread', 'security'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilter(tab)}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all ${
                    filter === tab
                      ? 'bg-brand-primary text-white shadow-md shadow-brand-primary/20'
                      : 'text-[#9B97A3] hover:text-white hover:bg-white/5'
                  }`}
                >
                  {tab === 'all'
                    ? 'All'
                    : tab === 'unread'
                    ? `Unread (${unreadCount})`
                    : 'Security'}
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
                  <p className="text-xs text-[#9B97A3] mt-1">
                    All systems and vaults are functioning normally.
                  </p>
                </div>
              ) : (
                filteredNotifications.map((n) => {
                  const Icon = (n.icon && icons[n.icon]) ? icons[n.icon] : Bell;
                  const isAlert = n.icon === 'AlertTriangle' || n.notification_type === 'security';
                  const isKey = n.icon === 'Key';
                  const isCheck = n.icon === 'CheckCircle';

                  return (
                    <div
                      key={n.id}
                      onClick={() => handleNotificationClick(n)}
                      className={`group p-3.5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden flex items-start gap-3.5 ${
                        !n.read
                          ? 'bg-[#0E1015] border-brand-primary/30 shadow-lg shadow-brand-primary/5 hover:border-brand-primary/50'
                          : 'bg-[#0E1015]/40 border-[rgba(255,255,255,0.05)] hover:bg-[#0E1015]/70 hover:border-white/10'
                      }`}
                    >
                      {!n.read && (
                        <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-brand-primary animate-pulse" />
                      )}

                      <div
                        className={`p-2.5 rounded-xl shrink-0 border ${
                          isAlert
                            ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                            : isKey
                            ? 'bg-brand-primary/10 text-brand-primary border-brand-primary/20'
                            : isCheck
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : 'bg-white/5 text-[#9B97A3] border-white/10'
                        }`}
                      >
                        <Icon size={16} />
                      </div>

                      <div className="flex-1 pr-6">
                        {n.title && (
                          <p className="text-xs font-semibold text-white tracking-tight mb-0.5">
                            {n.title}
                          </p>
                        )}
                        <p
                          className={`text-xs leading-relaxed ${
                            !n.read ? 'text-[#E9E6DF]' : 'text-[#9B97A3]'
                          }`}
                        >
                          {n.message}
                        </p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-[10px] text-[#6B6675] font-mono">
                            {formatTime(n.created_at)}
                          </span>
                          {n.action_url && (
                            <span className="text-[10px] text-brand-primary font-medium flex items-center gap-1 hover:underline">
                              View details <ExternalLink size={10} />
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={(e) => handleDelete(e, n.id)}
                        title="Dismiss notification"
                        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-[#6B6675] hover:text-rose-400 hover:bg-rose-500/10 transition-all shrink-0"
                      >
                        <Trash2 size={13} />
                      </button>
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
