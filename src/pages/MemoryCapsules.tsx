import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { FloatingCapsules } from '../components/capsules/FloatingCapsules';
import { useCapsuleStore, MemoryCapsule } from '../store/useCapsuleStore';
import { useStore } from '../store/useStore';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { Lock, Unlock, Mail, Mic, Video, Sparkles, X, ChevronRight, CheckCircle2, Clock, Archive } from 'lucide-react';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 15 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { delay, duration: 0.5, ease: [0.16, 1, 0.3, 1] },
});

export default function MemoryCapsules() {
  const { capsules, createCapsule, sealCapsule, deleteCapsule } = useCapsuleStore();
  const { heirs, assets } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [newCapsule, setNewCapsule] = useState<Partial<MemoryCapsule>>({
    type: 'letter',
    unlockCondition: 'on_recovery'
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const simulateAiGeneration = () => {
    setIsGenerating(true);
    const text = "To those I hold dear, \n\nI am establishing this institutional memory capsule to ensure my intentions and legacy are preserved with absolute clarity. Beyond the assets allocated, I want to impart the values that built this foundation. Please manage what has been entrusted to you with the same integrity and long-term vision. \n\nWith enduring trust.";
    
    let currentText = "";
    let i = 0;
    setNewCapsule({ ...newCapsule, content: "" });
    
    const interval = setInterval(() => {
      currentText += text.charAt(i);
      setNewCapsule(prev => ({ ...prev, content: currentText }));
      i++;
      if (i >= text.length) {
        clearInterval(interval);
        setIsGenerating(false);
      }
    }, 15);
  };

  const handleCreate = () => {
    createCapsule(newCapsule as MemoryCapsule);
    setIsModalOpen(false);
    setStep(1);
    setNewCapsule({ type: 'letter', unlockCondition: 'on_recovery' });
  };

  const getIcon = (type: string) => {
    if (type === 'voice_note') return <Mic size={20} />;
    if (type === 'video_note') return <Video size={20} />;
    return <Mail size={20} />;
  };

  return (
    <div className="min-h-screen bg-page text-primary selection:bg-brand-primary/30 pt-6">
      <main className="px-4 sm:px-6 lg:px-8 pb-28 md:pb-12 max-w-7xl mx-auto space-y-10">
        
        {/* ── Page Header ── */}
        <motion.header {...fadeUp(0)} className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-brand-primary" />
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-primary">
                Legacy Preservation Protocol
              </p>
            </div>
            <h1 className="text-4xl sm:text-5xl font-display font-bold text-primary tracking-tight leading-none">
              Memory <span className="italic text-brand-primary">Capsules</span>
            </h1>
            <p className="text-muted text-sm mt-3 font-medium">
              Secure institutional-grade messaging and media for your heirs.
            </p>
          </div>
          <Button 
            variant="primary" 
            onClick={() => setIsModalOpen(true)}
            className="h-11 flex items-center gap-2 group"
          >
            <Archive size={18} className="text-vault-200 group-hover:scale-110 transition-transform" />
            Create Archive
          </Button>
        </motion.header>

        {/* ── 3D Visualization ── */}
        <motion.div 
          {...fadeUp(0.1)}
          className="h-72 w-full rounded-2xl bg-surface/30 border border-base relative overflow-hidden flex items-center justify-center shadow-2xl"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(79,92,255,0.05)_0%,transparent_70%)]" />
          <Canvas camera={{ position: [0, 0, 5] }}>
            <FloatingCapsules capsules={capsules} />
          </Canvas>
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-page to-transparent pointer-events-none" />
          <div className="absolute top-6 left-6 flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-brand-primary animate-pulse" />
            <span className="text-[10px] font-bold text-muted uppercase tracking-widest">Live Vault Visualization</span>
          </div>
        </motion.div>

        {/* ── Capsules Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {capsules.map((capsule, i) => {
            const heir = heirs.find(h => h.id === capsule.recipientHeirId);
            const asset = assets.find(a => a.id === capsule.assetId);

            return (
              <Card 
                key={capsule.id}
                {...fadeUp(0.2 + i * 0.05)}
                variant="default"
                className="p-8 relative group hover:border-brand-primary/30 transition-all bg-surface/50"
              >
                <div className="absolute top-6 right-6">
                  {capsule.isLocked ? (
                    <div className="p-2.5 bg-brand-gold/10 rounded-xl text-brand-gold border border-brand-gold/20" title="Sealed">
                      <Lock size={16} />
                    </div>
                  ) : (
                    <div className="p-2.5 bg-brand-primary/10 rounded-xl text-brand-primary border border-brand-primary/20" title="Open">
                      <Unlock size={16} />
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-4 mb-8">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all ${capsule.isLocked ? 'bg-surface/80 border-base text-brand-gold/70' : 'bg-brand-primary/10 border-brand-primary/20 text-brand-primary'}`}>
                    {getIcon(capsule.type)}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-primary tracking-tight">{capsule.title}</h3>
                    <p className="text-xs text-secondary font-medium flex items-center gap-1.5 mt-1">
                      Recipient: <span className="text-secondary">{heir?.name || 'Institutional Collective'}</span>
                    </p>
                  </div>
                </div>

                {asset && (
                  <div className="mb-6 bg-page/50 p-3.5 rounded-xl border border-base/50 flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">Protocol Anchor:</span>
                    <span className="text-xs font-bold text-primary truncate">{asset.name}</span>
                  </div>
                )}

                <div className="mb-8">
                  <p className="text-[10px] font-bold text-secondary uppercase tracking-widest mb-1.5">Unlocking Mandate:</p>
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-muted" />
                    <span className="text-sm font-bold text-primary">
                      {capsule.unlockCondition === 'on_recovery' ? 'Verification Success' : capsule.unlockDate}
                    </span>
                  </div>
                </div>

                <div className="relative h-28 mb-8 bg-page/80 p-4 rounded-xl border border-base overflow-hidden shadow-inner">
                  {capsule.isLocked ? (
                    <>
                      <div className="absolute inset-0 backdrop-blur-[3px] bg-page/40 flex flex-col items-center justify-center z-10">
                        <Lock size={16} className="text-brand-gold/50 mb-2" />
                        <span className="text-[10px] text-brand-gold font-bold tracking-[0.2em] uppercase">Sealed Archive</span>
                      </div>
                      <p className="text-secondary opacity-20 blur-[3px] select-none text-xs leading-relaxed">
                        {capsule.content.substring(0, 150)}...
                      </p>
                    </>
                  ) : (
                    <p className="text-secondary text-xs italic leading-relaxed">"{capsule.content.substring(0, 120)}..."</p>
                  )}
                </div>

                <div className="flex justify-between items-center gap-3">
                  {!capsule.isLocked && (
                    <Button variant="secondary" className="flex-1 text-brand-gold border-brand-gold/30 hover:bg-brand-gold/5 h-10 text-xs font-bold" onClick={() => sealCapsule(capsule.id)}>
                      Seal Protocol
                    </Button>
                  )}
                  <Button variant="ghost" className="flex-1 text-red-500 hover:bg-red-500/5 h-10 text-xs font-bold" onClick={() => deleteCapsule(capsule.id)}>
                    Purge
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>

        {capsules.length === 0 && (
          <motion.div {...fadeUp(0.2)} className="text-center py-20 px-4 border border-dashed border-base rounded-3xl bg-surface/20">
            <div className="w-20 h-20 rounded-full bg-surface border border-base flex items-center justify-center mx-auto mb-6">
              <Archive size={32} className="text-secondary" />
            </div>
            <h3 className="text-2xl font-display font-bold text-primary mb-2">No Archives Detected</h3>
            <p className="text-secondary max-w-sm mx-auto mb-8 font-medium italic">Your legacy vault is currently empty. Initiate your first preservation protocol.</p>
            <Button variant="primary" onClick={() => setIsModalOpen(true)} className="h-12 px-8">
              Initialize Capsule
            </Button>
          </motion.div>
        )}

      </main>

      {/* ── Creation Protocol Modal ── */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-page/90 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-2xl bg-surface rounded-3xl border border-base shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col max-h-[92vh]"
            >
              <div className="p-6 border-b border-base flex justify-between items-center bg-surface/50">
                <div>
                  <h2 className="text-xl font-display font-bold text-primary flex items-center gap-2">
                    <Archive size={22} className="text-brand-primary"/> Legacy Archive Initiation
                  </h2>
                  <p className="text-[10px] font-bold text-secondary uppercase tracking-widest mt-1">Step {step} of 5 Protocol Verification</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="text-secondary hover:text-primary transition-colors p-2 bg-surface/50 rounded-xl"><X size={20}/></button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-10">
                
                {/* ── Step Indicators ── */}
                <div className="flex justify-between items-center px-4 relative">
                  <div className="absolute left-8 right-8 h-[1px] bg-surface/80 top-4 -z-10" />
                  {[1, 2, 3, 4, 5].map((s) => (
                    <div key={s} className="flex flex-col items-center gap-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-500 border-2 ${
                        step === s ? 'bg-brand-primary border-brand-primary text-page shadow-[0_0_20px_rgba(79,92,255,0.4)]' : 
                        step > s ? 'bg-brand-primary/20 border-brand-primary text-brand-primary' : 'bg-page border-base text-secondary'
                      }`}>
                        {step > s ? <CheckCircle2 size={16} /> : s}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="min-h-[300px]">
                  {step === 1 && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                      <div className="text-center">
                        <h3 className="text-2xl font-display font-bold text-primary">Select Archive Format</h3>
                        <p className="text-sm text-primary0 mt-2 font-medium">Choose the institutional standard for your message.</p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        {[
                          { id: 'letter', label: 'Mandate', icon: <Mail />, desc: 'Text Document' },
                          { id: 'voice_note', label: 'Audio Vault', icon: <Mic />, desc: 'Voice Print' },
                          { id: 'video_note', label: 'Visual Log', icon: <Video />, desc: 'Bio-Sync Media' }
                        ].map((type) => (
                          <button
                            key={type.id}
                            onClick={() => setNewCapsule({ ...newCapsule, type: type.id as unknown })}
                            className={`p-6 rounded-2xl border-2 flex flex-col items-center justify-center gap-4 transition-all duration-300 ${
                              newCapsule.type === type.id ? 'bg-brand-primary/10 border-brand-primary text-brand-primary' : 'bg-page border-base hover:border-base text-primary0 hover:text-secondary'
                            }`}
                          >
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${newCapsule.type === type.id ? 'bg-brand-primary text-page' : 'bg-surface/80 text-muted border border-base'}`}>
                              {type.icon}
                            </div>
                            <div className="text-center">
                              <span className="block font-bold text-sm tracking-tight">{type.label}</span>
                              <span className="block text-[10px] font-bold opacity-60 uppercase tracking-widest mt-1">{type.desc}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                      <div className="text-center">
                        <h3 className="text-2xl font-display font-bold text-primary">Identity & Attribution</h3>
                        <p className="text-sm text-primary0 mt-2 font-medium">Define the scope and recipients of this archive.</p>
                      </div>
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-primary0 uppercase tracking-[0.2em] ml-1">Archive Title</label>
                          <input type="text" className="w-full bg-page border border-base rounded-xl px-4 py-4 text-primary focus:outline-none focus:border-brand-primary/40 transition-all font-medium placeholder:text-muted" placeholder="e.g. Master Asset Allocation Intent" value={newCapsule.title || ''} onChange={(e) => setNewCapsule({...newCapsule, title: e.target.value})} />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-secondary uppercase tracking-[0.2em] ml-1">Recipient Heir</label>
                            <select className="w-full bg-page border border-base rounded-xl px-4 py-4 text-primary outline-none focus:border-brand-primary/40 font-medium" value={newCapsule.recipientHeirId || 'all'} onChange={(e) => setNewCapsule({...newCapsule, recipientHeirId: e.target.value})}>
                              <option value="all">Institutional Collective</option>
                              {heirs.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
                            </select>
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-secondary uppercase tracking-[0.2em] ml-1">Anchor Asset</label>
                            <select className="w-full bg-page border border-base rounded-xl px-4 py-4 text-primary outline-none focus:border-brand-primary/40 font-medium" value={newCapsule.assetId || ''} onChange={(e) => setNewCapsule({...newCapsule, assetId: e.target.value})}>
                              <option value="">No Anchor Required</option>
                              {assets.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                            </select>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {step === 3 && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 flex flex-col h-full">
                      <div className="flex justify-between items-center">
                        <h3 className="text-xl font-display font-bold text-primary flex items-center gap-3">
                          {getIcon(newCapsule.type || 'letter')} Content Manifest
                        </h3>
                        <button 
                          onClick={simulateAiGeneration}
                          disabled={isGenerating}
                          className="text-[10px] font-bold px-4 py-2 rounded-full bg-brand-gold/10 text-brand-gold border border-brand-gold/30 flex items-center gap-2 hover:bg-brand-gold/20 transition-all uppercase tracking-widest"
                        >
                         <Sparkles size={14} /> {isGenerating ? 'Synthesizing...' : 'AI Synthesis'}
                        </button>
                      </div>
                      
                      <div className="relative group">
                        <textarea 
                          className="w-full min-h-[280px] bg-page border border-base rounded-2xl p-6 text-primary placeholder:text-muted resize-none focus:outline-none focus:border-brand-primary/40 transition-all leading-relaxed font-medium"
                          placeholder="Commence archival documentation..."
                          value={newCapsule.content || ''}
                          onChange={(e) => setNewCapsule({...newCapsule, content: e.target.value})}
                        />
                        <div className="absolute bottom-4 right-4 text-[10px] font-bold text-muted uppercase tracking-widest pointer-events-none">
                          Secured Encryption Active
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {step === 4 && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                      <div className="text-center">
                        <h3 className="text-2xl font-display font-bold text-primary">Release Mandate</h3>
                        <p className="text-sm text-primary0 mt-2 font-medium">Configure the automated decryption protocols.</p>
                      </div>
                      <div className="space-y-5">
                        <button 
                          onClick={() => setNewCapsule({...newCapsule, unlockCondition: 'on_recovery'})}
                          className={`w-full p-6 text-left rounded-2xl border-2 transition-all duration-300 ${newCapsule.unlockCondition === 'on_recovery' ? 'bg-brand-primary/10 border-brand-primary shadow-[0_0_30px_rgba(79,92,255,0.1)]' : 'bg-page border-base hover:border-base'}`}
                        >
                          <div className="flex items-center gap-3 font-bold text-primary mb-2"><Unlock size={20} className="text-brand-primary" /> Verification Success (Recommended)</div>
                          <p className="text-sm text-primary0 font-medium pl-8 italic">Archive decrypts only upon official vault succession verification.</p>
                        </button>
                        
                        <div className="space-y-3">
                          <button 
                            onClick={() => setNewCapsule({...newCapsule, unlockCondition: 'on_date'})}
                            className={`w-full p-6 text-left rounded-2xl border-2 transition-all duration-300 ${newCapsule.unlockCondition === 'on_date' ? 'bg-brand-primary/10 border-brand-primary' : 'bg-page border-base hover:border-base'}`}
                          >
                            <div className="flex items-center gap-3 font-bold text-primary mb-2"><Clock size={20} className="text-muted" /> Scheduled Protocol</div>
                            <p className="text-sm text-primary0 font-medium pl-8 italic">Archive releases on a pre-defined institutional date.</p>
                          </button>
                          {newCapsule.unlockCondition === 'on_date' && (
                            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-page border border-base rounded-2xl ml-8">
                              <input type="date" className="w-full bg-surface border border-base text-primary px-4 py-3 rounded-xl focus:outline-none focus:border-brand-primary/30 font-medium" value={newCapsule.unlockDate || ''} onChange={(e) => setNewCapsule({...newCapsule, unlockDate: e.target.value})} />
                            </motion.div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {step === 5 && (
                    <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-10 text-center py-6">
                      <div className="relative inline-block">
                        <div className="w-24 h-24 rounded-3xl bg-brand-gold/10 border border-brand-gold/30 flex items-center justify-center mx-auto mb-6 relative z-10">
                          <Lock size={48} className="text-brand-gold" />
                        </div>
                        <div className="absolute inset-0 bg-brand-gold/20 blur-3xl rounded-full" />
                      </div>
                      <div>
                        <h3 className="text-3xl font-display font-bold text-primary tracking-tight">Seal Archive Protocol</h3>
                        <p className="text-primary0 max-w-sm mx-auto mt-3 font-medium italic">
                          This manifest will be encrypted using institutional standards. Review the anchor points before final sealing.
                        </p>
                      </div>
                      <div className="p-6 bg-page rounded-2xl border border-base text-left w-full max-w-md mx-auto shadow-inner">
                        <div className="flex justify-between items-start mb-4">
                          <p className="text-sm font-bold text-primary">{newCapsule.title}</p>
                          <Badge variant="default" className="text-[9px]">Draft Manifest</Badge>
                        </div>
                        <div className="flex gap-4 text-[10px] font-bold text-secondary uppercase tracking-widest mb-4">
                          <span>Format: {newCapsule.type}</span>
                          <span className="w-[1px] h-3 bg-surface/80" />
                          <span>Release: {newCapsule.unlockCondition}</span>
                        </div>
                        <div className="h-16 overflow-hidden relative border-t border-base pt-4">
                           <p className="text-[11px] text-muted italic leading-relaxed">"{newCapsule.content}"</p>
                           <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-page to-transparent" />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>

              </div>

              <div className="p-6 border-t border-base bg-surface/80 flex justify-between gap-4">
                 {step > 1 ? (
                   <Button variant="ghost" onClick={() => setStep(step - 1)} className="px-8 font-bold text-muted">Back</Button>
                 ) : <div className="flex-1" />}
                 
                 {step < 5 ? (
                   <Button 
                     variant="primary" 
                     onClick={() => setStep(step + 1)} 
                     className="px-10 h-12 font-bold group"
                     disabled={
                       (step === 2 && !newCapsule.title) ||
                       (step === 3 && !newCapsule.content) ||
                       (step === 4 && newCapsule.unlockCondition === 'on_date' && !newCapsule.unlockDate)
                     }
                   >
                     Continue <ChevronRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform"/>
                   </Button>
                 ) : (
                   <Button 
                     variant="primary" 
                     className="bg-brand-gold hover:bg-gold-600 text-page border-none px-12 h-12 font-bold shadow-[0_0_30px_rgba(212,175,55,0.2)]" 
                     onClick={handleCreate}
                   >
                     Seal Archive Protocol
                   </Button>
                 )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
