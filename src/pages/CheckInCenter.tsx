import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Clock, Bell, History, Settings, Fingerprint, Mail, Activity, ChevronRight, AlertTriangle } from 'lucide-react';
import { useCheckinStore } from '../store/useCheckinStore';
import { Canvas } from '@react-three/fiber';
import { CheckInHeart } from '../components/checkin/CheckInHeart';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 15 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { delay, duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
});

export default function CheckInCenter() {
  const { checkins, checkinSettings, completeCheckin, updateSettings, simulateMissedCheckin } = useCheckinStore();
  const [showSettings, setShowSettings] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);

  const isAlertMode = checkinSettings.status !== 'active';
  const misses = checkinSettings.currentStreak === 0 ? checkinSettings.totalMissed : 0; 

  // Update countdown timer
  useEffect(() => {
    const updateTime = () => {
      const last = checkinSettings.lastCheckinAt ? new Date(checkinSettings.lastCheckinAt) : new Date(Date.now() - 86400000);
      const nextDue = new Date(last);
      const freq = checkinSettings.frequency;
      if (freq === 'weekly') {
        nextDue.setDate(nextDue.getDate() + 7);
      } else if (freq === 'biweekly') {
        nextDue.setDate(nextDue.getDate() + 14);
      } else if (freq === 'monthly') {
        nextDue.setMonth(nextDue.getMonth() + 1);
      } else {
        const days = parseInt(freq as string);
        if (!isNaN(days)) {
          nextDue.setDate(nextDue.getDate() + days);
        } else {
          nextDue.setDate(nextDue.getDate() + 30); // Default fallback
        }
      }

      const diff = nextDue.getTime() - Date.now();
      if (diff <= 0) {
        setTimeRemaining('Overdue');
      } else {
        const d = Math.floor(diff / (1000 * 60 * 60 * 24));
        const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const m = Math.floor((diff / 1000 / 60) % 60);
        setTimeRemaining(`${d}d ${h}h ${m}m`);
      }
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, [checkinSettings]);

  const handleCheckIn = () => {
    completeCheckin('tap');
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 2000);
  };

  return (
    <div className="min-h-screen bg-page text-primary selection:bg-brand-primary/30 pt-6">
      <main className="px-4 sm:px-6 lg:px-8 pb-24 md:pb-12 max-w-5xl mx-auto space-y-12">
        
        {/* ── Page Header ── */}
        <motion.header {...fadeUp(0)} className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className={`w-2 h-2 rounded-full ${isAlertMode ? 'bg-red-500 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.8)]' : 'bg-brand-primary shadow-[0_0_10px_rgba(79,92,255,0.8)]'}`} />
              <p className={`text-[10px] font-bold uppercase tracking-[0.2em] ${isAlertMode ? 'text-red-500' : 'text-brand-primary'}`}>
                {isAlertMode ? 'Emergency Alert Status' : 'Vault Heartbeat Protocol'}
              </p>
            </div>
            <h1 className="text-4xl sm:text-5xl font-display font-bold text-primary tracking-tight leading-none">
              Proof of <span className="italic text-brand-primary">Life</span>
            </h1>
            <p className="text-muted text-sm mt-3 font-medium">
              Maintain sovereign control through periodic verification pulses.
            </p>
          </div>
          <div className="flex items-center gap-4">
             <Badge variant={isAlertMode ? 'error' : 'default'} className="px-4 py-1.5 text-[10px] uppercase tracking-widest font-bold">
               {isAlertMode ? 'Protocol Violated' : 'Operational Sync'}
             </Badge>
          </div>
        </motion.header>

        {/* ── Heartbeat Visualization ── */}
        <motion.div {...fadeUp(0.1)} className="h-64 w-full rounded-[32px] bg-surface/40 border border-base/60 relative overflow-hidden flex items-center justify-center backdrop-blur-sm group">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(79,92,255,0.05),transparent)] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <Canvas camera={{ position: [0, 0, 5] }}>
            <CheckInHeart isAlert={isAlertMode} />
          </Canvas>
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(10,10,12,0.6)_100%)]" />
          <div className="absolute bottom-6 left-0 right-0 text-center pointer-events-none">
            <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-obsidian-600">Sovereign Pulse Active</p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* ── Main Status Matrix ── */}
          <motion.div {...fadeUp(0.2)} className="lg:col-span-2 space-y-6">
            <Card variant="default" className="p-8 bg-surface/50 border-base/60 relative">
              <div className="grid grid-cols-2 gap-8 mb-10">
                <div className="p-6 bg-page/50 rounded-2xl border border-base/50 group hover:border-brand-primary/30 transition-all">
                  <p className="text-[10px] font-bold text-primary0 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <History size={12} className="text-brand-primary" /> Last Pulse
                  </p>
                  <p className="text-xl font-display font-bold text-primary tracking-tight">
                    {checkinSettings.lastCheckinAt ? new Date(checkinSettings.lastCheckinAt).toLocaleDateString() : 'Uninitialized'}
                  </p>
                </div>
                <div className="p-6 bg-page/50 rounded-2xl border border-base/50 group hover:border-brand-primary/30 transition-all">
                  <p className="text-[10px] font-bold text-primary0 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Clock size={12} className="text-brand-primary" /> Next Window
                  </p>
                  <p className={`text-xl font-display font-bold tracking-tight ${timeRemaining === 'Overdue' ? 'text-red-500' : 'text-brand-primary'}`}>
                    {timeRemaining}
                  </p>
                </div>
                <div className="p-6 bg-page/50 rounded-2xl border border-base/50 group hover:border-brand-primary/30 transition-all">
                  <p className="text-[10px] font-bold text-primary0 uppercase tracking-widest mb-3">Violation Misses</p>
                  <p className="text-xl font-display font-bold text-primary tracking-tight flex items-center gap-3">
                    {misses} 
                    {misses > 0 && <span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]"></span>}
                  </p>
                </div>
                <div className="p-6 bg-brand-primary/5 rounded-2xl border border-brand-primary/20 group hover:bg-brand-primary/10 transition-all">
                  <p className="text-[10px] font-bold text-brand-primary/80 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Activity size={12} /> Sync Streak
                  </p>
                  <p className="text-xl font-display font-bold text-brand-primary tracking-tight">
                    {checkinSettings.currentStreak} <span className="text-sm">Days</span>
                  </p>
                </div>
              </div>

              <div className="relative">
                <AnimatePresence>
                  {showConfetti && (
                    <motion.div 
                      initial={{ scale: 0.5, opacity: 1 }}
                      animate={{ scale: 2, opacity: 0 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
                    >
                      <CheckCircle className="text-brand-primary w-32 h-32 blur-sm" />
                    </motion.div>
                  )}
                </AnimatePresence>
                
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={handleCheckIn}
                  className="w-full py-8 rounded-3xl relative overflow-hidden group bg-brand-primary text-obsidian-950 shadow-2xl shadow-brand-primary/20 transition-all active:scale-95"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 translate-x-[-100%] group-hover:animate-[shimmer_2s_infinite]"></div>
                  <span className="relative z-10 flex items-center justify-center gap-4 text-2xl font-display font-bold uppercase tracking-tighter">
                    <Fingerprint size={32} /> Initialize Verification Pulse
                  </span>
                </motion.button>
              </div>
            </Card>

            {/* ── History Timeline ── */}
            <Card className="p-8 bg-surface/30 border-base/60">
              <h3 className="text-xs font-bold uppercase tracking-widest text-primary0 mb-8 flex items-center gap-3">
                <History size={16} className="text-brand-primary" /> Pulse Verification History
              </h3>
              <div className="space-y-4">
                {checkins.slice(0, 8).map((checkin) => (
                  <div key={checkin.id} className="flex items-center justify-between p-5 rounded-2xl bg-page/50 border border-base/50 hover:border-brand-primary/20 transition-all group">
                    <div className="flex items-center gap-5">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        checkin.status === 'responded' ? 'bg-brand-primary/10 text-brand-primary' :
                        checkin.status === 'missed' ? 'bg-red-500/10 text-red-500' : 'bg-amber-500/10 text-amber-500'
                      }`}>
                        {checkin.method === 'tap' ? <Fingerprint size={18}/> : <Mail size={18}/>}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-primary tracking-tight group-hover:text-brand-primary transition-colors capitalize">{checkin.status}</p>
                        <p className="text-[10px] text-obsidian-600 font-bold uppercase tracking-widest mt-1.5">{new Date(checkin.scheduledFor).toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <span className={`text-[9px] font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-full bg-surface border ${
                         checkin.status === 'responded' ? 'border-brand-primary/20 text-brand-primary' : 'border-red-500/20 text-red-400'
                      }`}>
                        {checkin.method}
                      </span>
                      <ChevronRight size={14} className="text-obsidian-800" />
                    </div>
                  </div>
                ))}
                {checkins.length === 0 && (
                  <p className="text-center text-obsidian-600 font-bold uppercase tracking-widest py-16 text-[10px] italic">No pulse history recorded in vault.</p>
                )}
              </div>
            </Card>
          </motion.div>

          {/* ── Settings & Tools ── */}
          <motion.div {...fadeUp(0.3)} className="space-y-8">
            <Card className="p-8 bg-surface/50 border-base/60">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xs font-bold uppercase tracking-widest text-primary0 flex items-center gap-3">
                  <Settings size={16} className="text-brand-primary"/> Protocol Config
                </h3>
                <button 
                  onClick={() => setShowSettings(!showSettings)}
                  className="text-[10px] font-bold text-brand-primary uppercase tracking-widest hover:underline"
                >
                  {showSettings ? 'Close' : 'Modify'}
                </button>
              </div>

              {showSettings ? (
                <div className="space-y-8">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-obsidian-600 mb-4 block">Verification Frequency</label>
                    <div className="grid grid-cols-1 gap-2">
                      {['weekly', 'biweekly', 'monthly'].map(f => (
                        <button 
                          key={f}
                          onClick={() => updateSettings({ frequency: f })}
                          className={`px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-widest border transition-all ${
                            checkinSettings.frequency === f 
                              ? 'bg-brand-primary/10 text-brand-primary border-brand-primary/40 shadow-[0_0_15px_rgba(79,92,255,0.1)]' 
                              : 'bg-page text-primary0 border-base hover:border-base'
                          }`}
                        >
                          {f}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted block mb-2">
                      Alert Guardians After: {checkinSettings.alertGuardiansAfterMisses} Misses
                    </label>
                    <input 
                      type="range" 
                      min="1" 
                      max="3" 
                      value={checkinSettings.alertGuardiansAfterMisses} 
                      onChange={(e) => updateSettings({ alertGuardiansAfterMisses: parseInt(e.target.value) })}
                      className="w-full h-1.5 bg-surface/80 rounded-full appearance-none cursor-pointer accent-brand-primary"
                    />
                  </div>

                  <div className="pt-2 border-t border-base/40">
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-secondary">
                        Succession Handover to Heirs:
                      </label>
                      <span className="text-xs font-bold text-brand-primary">
                        {checkinSettings.consecutiveMissesAllowed} Missed Checks
                      </span>
                    </div>
                    <p className="text-[10px] text-muted mb-3 leading-relaxed">
                      If your heartbeat is silent for this many consecutive periods, the Dead Man's Switch triggers cryptographic succession to transfer the vault to your heirs.
                    </p>
                    <input 
                      type="range" 
                      min="1" 
                      max="6" 
                      value={checkinSettings.consecutiveMissesAllowed} 
                      onChange={(e) => updateSettings({ consecutiveMissesAllowed: parseInt(e.target.value) || 1 })}
                      className="w-full h-1.5 bg-surface/80 rounded-full appearance-none cursor-pointer accent-brand-primary"
                    />
                    <div className="flex justify-between text-[9px] font-mono text-muted mt-1">
                      <span>1 cycle (Immediate)</span>
                      <span>3 cycles (Standard)</span>
                      <span>6 cycles (Extended)</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                   <div className="flex justify-between items-center p-4 rounded-xl bg-page/40 border border-base/60">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-muted">Interval</span>
                      <span className="text-xs font-bold text-primary capitalize">{checkinSettings.frequency}</span>
                   </div>
                   <div className="flex justify-between items-center p-4 rounded-xl bg-page/40 border border-base/60">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-muted">Quorum Trigger</span>
                      <span className="text-xs font-bold text-primary">{checkinSettings.alertGuardiansAfterMisses} Misses</span>
                   </div>
                   <div className="flex justify-between items-center p-4 rounded-xl bg-page/40 border border-base/60">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-muted">Succession Depth</span>
                      <span className="text-xs font-bold text-primary">{checkinSettings.consecutiveMissesAllowed} Misses</span>
                   </div>
                </div>
              )}
            </Card>

            {/* ── Intelligence Alerts ── */}
            <div className="p-8 rounded-[32px] bg-red-500/5 border border-red-500/20 relative group overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                 <AlertTriangle size={80} className="text-red-500" />
              </div>
              <h3 className="text-xs font-bold text-red-500 uppercase tracking-widest mb-4 flex items-center gap-3">
                <Bell size={16}/> Protocol Testing
              </h3>
              <p className="text-[10px] text-muted font-medium leading-relaxed mb-6">Simulation of missed verification pulses triggers guardian alerts and starts the succession countdown.</p>
              <Button 
                variant="secondary" 
                className="w-full py-4 text-[10px] font-bold uppercase tracking-widest text-red-500 border-red-500/30 hover:bg-red-500/10" 
                onClick={() => simulateMissedCheckin()}
              >
                Simulate Violation Pulse
              </Button>
            </div>
          </motion.div>
        </div>

      </main>
    </div>
  );
}
