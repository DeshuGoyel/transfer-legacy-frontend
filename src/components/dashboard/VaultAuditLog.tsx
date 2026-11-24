import { motion } from 'framer-motion';
import { Clock, Lock, Activity } from 'lucide-react';
import { useStore } from '../../store/useStore';

export default function VaultAuditLog() {
  const { activity } = useStore();

  return (
    <div className="bg-surface/40 backdrop-blur-md rounded-3xl border border-base/60 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary shadow-inner">
            <Activity size={20} />
          </div>
          <div>
            <h3 className="text-lg font-display font-bold text-primary tracking-tight">Immortal <span className="italic text-brand-primary">Record</span></h3>
            <p className="text-[10px] font-bold text-muted uppercase tracking-[0.2em]">Vault Audit Log</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest">Encrypted</span>
        </div>
      </div>

      <div className="space-y-4 max-h-[320px] overflow-y-auto pr-2 custom-scrollbar">
        {activity.length === 0 ? (
          <div className="text-center py-8 text-sm text-secondary">
            No vault activity recorded yet.
          </div>
        ) : (
          activity.map((log, i) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="group relative pl-6 pb-4 border-l border-base/40 last:pb-0"
            >
              {/* Timeline dot */}
              <div className="absolute left-[-5px] top-1 w-2.5 h-2.5 rounded-full bg-brand-primary/30 border border-brand-primary/50 group-hover:scale-125 group-hover:bg-brand-primary transition-all duration-300 shadow-[0_0_8px_rgba(79,92,255,0.2)]" />
              
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-primary tracking-wide">{log.message}</span>
                  <span className="text-[9px] font-medium text-muted font-digits">{log.time}</span>
                </div>
                <div className="flex items-center gap-3 text-[9px] font-bold uppercase tracking-widest text-muted">
                  <span className="flex items-center gap-1"><Lock size={10} /> Verified Record</span>
                  <span className="flex items-center gap-1"><Clock size={10} /> Immutable</span>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      <div className="mt-6 pt-6 border-t border-base/40">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <p className="text-[9px] font-bold text-muted uppercase tracking-widest mb-1">Logged Events</p>
            <p className="text-xl font-display font-bold text-primary tracking-tight">{activity.length}</p>
          </div>
          <div className="text-center">
            <p className="text-[9px] font-bold text-muted uppercase tracking-widest mb-1">Cryptographic State</p>
            <p className="text-xl font-display font-bold text-emerald-400 tracking-tight">Secured</p>
          </div>
        </div>
      </div>
    </div>
  );
}
