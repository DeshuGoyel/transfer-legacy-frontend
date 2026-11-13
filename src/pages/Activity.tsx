import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Clock, Lock, Users, Shield, Trash2, FileText, CheckCircle, RefreshCw, Activity as ActivityIcon
} from 'lucide-react';
import { useStore } from '../store/useStore';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { cn } from '../utils/cn';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.5, ease: [0.16, 1, 0.3, 1] },
});

export default function Activity() {
  const { activity } = useStore();
  const [filter, setFilter] = useState<'all' | 'vault' | 'trust' | 'system'>('all');

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Lock':
        return <Lock size={15} className="text-brand-primary" />;
      case 'User':
      case 'Users':
        return <Users size={15} className="text-brand-primary" />;
      case 'Shield':
      case 'CheckCircle':
        return <Shield size={15} className="text-brand-primary" />;
      case 'Trash2':
        return <Trash2 size={15} className="text-brand-gold" />;
      case 'FileText':
        return <FileText size={15} className="text-brand-primary" />;
      default:
        return <ActivityIcon size={15} className="text-brand-primary" />;
    }
  };

  const getCategory = (item: any) => {
    const msg = item.message.toLowerCase();
    if (msg.includes('guardian') || msg.includes('heir')) return 'trust';
    if (msg.includes('asset') || msg.includes('vault') || msg.includes('secured')) return 'vault';
    return 'system';
  };

  const filteredActivity = activity.filter((item) => {
    if (filter === 'all') return true;
    return getCategory(item) === filter;
  });

  const filterButtons = [
    { key: 'all', label: 'All Activities' },
    { key: 'vault', label: 'Vault Secures' },
    { key: 'trust', label: 'Succession & Trust' },
    { key: 'system', label: 'System Check-ins' },
  ] as const;

  return (
    <div className="min-h-screen bg-page text-primary pt-6 pb-20">
      <main className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
        
        {/* ── Page Header ── */}
        <motion.header {...fadeUp(0)} className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-4 border-b border-base/50">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-brand-primary shadow-[0_0_10px_rgba(249,115,22,0.8)]" />
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-primary">
                Audit Logs
              </p>
            </div>
            <h1 className="text-3xl sm:text-4xl font-display font-bold text-primary tracking-tight">
              Real-Time <span className="italic text-brand-primary">Activity Log</span>
            </h1>
            <p className="text-muted text-xs mt-2 font-medium">
              A cryptographically signed, chronological log of all interactions with your estate plan.
            </p>
          </div>
        </motion.header>

        {/* ── Filter Buttons ── */}
        <motion.div {...fadeUp(0.05)} className="flex gap-2 overflow-x-auto pb-1.5 scrollbar-none">
          {filterButtons.map((btn) => (
            <button
              key={btn.key}
              onClick={() => setFilter(btn.key)}
              className={cn(
                "text-[12px] font-semibold px-4 py-2 rounded-full border transition-all shrink-0 cursor-pointer",
                filter === btn.key
                  ? "bg-brand-primary border-brand-primary text-white"
                  : "border-base text-secondary hover:border-brand-primary/40 hover:text-brand-primary"
              )}
            >
              {btn.label}
            </button>
          ))}
        </motion.div>

        {/* ── Timeline list ── */}
        <div className="relative border-l border-base ml-4 pl-6 space-y-6 py-2">
          {filteredActivity.length === 0 ? (
            <motion.div {...fadeUp(0.1)} className="text-center py-16 border border-dashed border-base rounded-2xl bg-surface/20">
              <Clock size={32} className="mx-auto text-secondary/30 mb-3 animate-pulse" />
              <p className="text-sm text-secondary font-light">
                No recent activity found matching this filter.
              </p>
            </motion.div>
          ) : (
            filteredActivity.map((item, idx) => (
              <motion.div 
                key={item.id || idx} 
                {...fadeUp(0.1 + idx * 0.03)}
                className="relative group"
              >
                {/* Timeline node icon */}
                <span className="absolute -left-[35px] top-1 w-5 h-5 rounded-full bg-surface border border-base flex items-center justify-center shadow-sm group-hover:border-brand-primary/50 transition-colors z-10">
                  {getIcon(item.icon)}
                </span>
                
                <Card className="p-4 bg-surface/30 hover:bg-surface/50 border-base/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-muted font-mono tracking-wider">
                      {getCategory(item)} activity
                    </span>
                    <p className="text-sm font-semibold text-primary">{item.message}</p>
                  </div>
                  
                  <div className="flex items-center gap-3 shrink-0">
                    <Badge variant="secondary" className="text-[9px] font-mono py-0.5">
                      {item.time || 'recently'}
                    </Badge>
                    <span className="text-[10px] text-muted font-light flex items-center gap-1">
                      <CheckCircle size={10} className="text-brand-primary" /> Verified
                    </span>
                  </div>
                </Card>
              </motion.div>
            ))
          )}
        </div>

      </main>
    </div>
  );
}
