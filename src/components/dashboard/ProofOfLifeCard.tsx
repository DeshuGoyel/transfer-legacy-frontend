import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, ShieldCheck, Heart, Settings2 } from 'lucide-react';
import { useCheckinStore } from '../../store/useCheckinStore';
import Button from '../ui/Button';
import { trackEvent, EVENTS } from '../seo/Analytics';
import toast from 'react-hot-toast';

export default function ProofOfLifeCard() {
  const { checkinSettings, completeCheckin } = useCheckinStore();
  const [isSyncing, setIsSyncing] = useState(false);
  
  const last = checkinSettings.lastCheckinAt ? new Date(checkinSettings.lastCheckinAt) : new Date(Date.now() - 86400000);
  const nextDue = new Date(last);
  if (checkinSettings.frequency === 'weekly') nextDue.setDate(nextDue.getDate() + 7);
  if (checkinSettings.frequency === 'biweekly') nextDue.setDate(nextDue.getDate() + 14);
  if (checkinSettings.frequency === 'monthly') nextDue.setMonth(nextDue.getMonth() + 1);

  const now = new Date();
  const diffTime = nextDue.getTime() - now.getTime();
  const daysUntilNext = Math.ceil(diffTime / (1000 * 3600 * 24));
  
  const isUrgent = daysUntilNext <= 2;
  const isOverdue = daysUntilNext < 0;

  const handleHeartbeatSync = () => {
    setIsSyncing(true);
    completeCheckin('tap');
    const updatedStreak = (checkinSettings.currentStreak || 0) + 1;
    toast.success(`Heartbeat confirmed. Streak updated to ${updatedStreak} days!`, {
      icon: '❤️',
      style: {
        background: '#0E1015',
        color: '#E9E6DF',
        border: '1px solid rgba(244, 63, 94, 0.3)'
      }
    });
    trackEvent(EVENTS.HEARTBEAT_SYNC, {
      frequency: checkinSettings.frequency,
      status: isOverdue ? 'overdue' : isUrgent ? 'urgent' : 'nominal',
      streak: updatedStreak
    });
    setTimeout(() => setIsSyncing(false), 900);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-surface/40 backdrop-blur-md rounded-[32px] p-8 relative overflow-hidden transition-all duration-500 border ${
        isOverdue ? 'border-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.15)]' : 
        isUrgent ? 'border-brand-gold/50 shadow-[0_0_30px_rgba(212,175,55,0.15)]' : 
        'border-base/60 hover:border-brand-primary/40'
      }`}
    >
      {/* Heartbeat Pulse Background with Beating Heart */}
      <div className="absolute top-0 right-0 p-8 opacity-15 pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.25, 1], rotate: [0, 2, -2, 0] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
        >
          <Heart size={110} className={isOverdue ? 'text-red-500 fill-red-500/20' : isUrgent ? 'text-brand-gold fill-brand-gold/20' : 'text-rose-500 fill-rose-500/20'} />
        </motion.div>
      </div>

      <div className="flex justify-between items-start mb-8 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-xl font-display font-bold text-primary tracking-tight">Proof of <span className="italic text-brand-primary">Life</span></h3>
            {isOverdue ? (
              <ShieldAlert className="text-red-500 animate-pulse" size={20} />
            ) : isUrgent ? (
              <ShieldAlert className="text-brand-gold animate-pulse" size={20} />
            ) : (
              <ShieldCheck className="text-emerald-400" size={20} />
            )}
          </div>
          <p className="text-secondary text-[11px] font-medium tracking-wide flex items-center gap-1.5 uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
            Heartbeat Monitoring Active
          </p>
        </div>
        <button className="p-2 rounded-lg bg-white/5 border border-white/10 text-muted hover:text-primary transition-colors">
          <Settings2 size={16} />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8 relative z-10">
        <div className="p-4 rounded-2xl bg-page/50 border border-base shadow-inner">
          <p className="text-[9px] font-bold text-muted uppercase tracking-widest mb-1">Status</p>
          <p className={`text-sm font-display font-bold ${isOverdue ? 'text-red-400' : isUrgent ? 'text-brand-gold' : 'text-emerald-400'}`}>
            {isOverdue ? 'Critical' : isUrgent ? 'Action Required' : 'Vault Secured'}
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-page/50 border border-base shadow-inner">
          <p className="text-[9px] font-bold text-muted uppercase tracking-widest mb-1">Frequency</p>
          <p className="text-sm font-display font-bold text-primary uppercase tracking-tight">{checkinSettings.frequency}</p>
        </div>
      </div>

      <div className="bg-surface/50 border border-base/50 rounded-2xl p-5 mb-8 shadow-inner relative z-10">
        <div className="flex justify-between items-center mb-1">
          <span className="text-[10px] font-bold text-muted uppercase tracking-widest">Next Verification Due</span>
          <span className={`text-[10px] font-bold uppercase tracking-widest ${isOverdue ? 'text-red-400' : isUrgent ? 'text-brand-gold' : 'text-brand-primary'}`}>
            {Math.abs(daysUntilNext)} Days {isOverdue ? 'Overdue' : 'Left'}
          </span>
        </div>
        <div className="w-full h-1.5 bg-page rounded-full overflow-hidden mb-2">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${Math.max(0, Math.min(100, (daysUntilNext / 30) * 100))}%` }}
            className={`h-full ${isOverdue ? 'bg-red-500' : isUrgent ? 'bg-brand-gold' : 'bg-brand-primary'}`}
          />
        </div>
        <div className="flex justify-between items-center text-[9px] font-bold text-muted uppercase">
          <span>{last.toLocaleDateString()}</span>
          <span>{nextDue.toLocaleDateString()}</span>
        </div>
      </div>

      {/* Heartbeat Action Button with Animated Heart Icon and Ripple */}
      <Button 
        className="w-full h-14 relative group overflow-hidden shadow-xl shadow-rose-500/10 flex items-center justify-center gap-3 border border-rose-500/20" 
        variant={isOverdue || isUrgent ? 'primary' : 'secondary'}
        onClick={handleHeartbeatSync}
        disabled={isSyncing}
      >
        <motion.div
          animate={isSyncing ? { scale: [1, 1.4, 0.9, 1.3, 1], rotate: [0, 15, -15, 0] } : { scale: [1, 1.2, 1] }}
          transition={{ duration: isSyncing ? 0.6 : 1.4, repeat: isSyncing ? 1 : Infinity, ease: "easeInOut" }}
          className="relative flex items-center justify-center"
        >
          <Heart 
            size={18} 
            className="fill-rose-500 text-rose-500 filter drop-shadow-[0_0_8px_rgba(244,63,94,0.6)]" 
          />
          <span className="absolute inset-0 rounded-full bg-rose-500/30 animate-ping -z-10" />
        </motion.div>
        <span className="relative z-10 font-bold uppercase tracking-widest text-[11px] text-white">
          {isSyncing ? 'Heartbeat Pulsing...' : 'Initiate Heartbeat Sync'}
        </span>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
      </Button>

      <p className="text-center mt-6 text-[10px] font-medium text-muted">
        Fail-safe protocol: Succession triggers after <span className="text-primary font-bold">48 hours</span> of inactivity.
      </p>
    </motion.div>
  );
}
