import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { lazy, Suspense } from 'react';
const AuroraScene = lazy(() => import('../components/obituary/AuroraScene').then(module => ({ default: module.AuroraScene })));
import { useObituaryStore, ObituaryEntry } from '../store/useObituaryStore';
import { useStore } from '../store/useStore';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { Sparkles, Video, Mic, Feather, BookOpen, Clock, Lock, X, Eye, PenTool, CheckCircle2, ShieldCheck } from 'lucide-react';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 15 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { delay, duration: 0.5, ease: [0.16, 1, 0.3, 1] },
});

export default function DigitalObituary() {
  const { entries, createEntry, deleteEntry } = useObituaryStore();
  const { heirs } = useStore();
  const [hasSeenIntro, setHasSeenIntro] = useState(entries.length > 0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [newEntry, setNewEntry] = useState<Partial<ObituaryEntry>>({ type: 'letter' });
  const [isGenerating, setIsGenerating] = useState(false);

  const simulateAiGeneration = () => {
    setIsGenerating(true);
    const text = "My dearest family, \n\nIf you are reading this, it means I have passed on. Please know that my final thoughts were full of love and gratitude for the time we shared. I've left instructions to ensure you are taken care of through the Transfer Legacy protocols. Do not mourn for too long, but celebrate the joyful moments we had. I am at peace.\n\nAlways with you,\n[Name]";
    
    let currentText = "";
    let i = 0;
    setNewEntry({ ...newEntry, content: "" });
    
    const interval = setInterval(() => {
      currentText += text.charAt(i);
      setNewEntry(prev => ({ ...prev, content: currentText }));
      i++;
      if (i >= text.length) {
        clearInterval(interval);
        setIsGenerating(false);
      }
    }, 12);
  };

  const handleCreate = () => {
    createEntry({
      type: newEntry.type as unknown,
      title: newEntry.title || 'My Final Letter',
      content: newEntry.content || '',
      recipientHeirId: newEntry.recipientHeirId || 'all',
      isLocked: true 
    });
    setIsModalOpen(false);
    setStep(1);
    setNewEntry({ type: 'letter' });
  };

  const getIcon = (type: string) => {
    if (type === 'voice') return <Mic size={18} />;
    if (type === 'video') return <Video size={18} />;
    return <Feather size={18} />;
  };

  return (
    <div className="min-h-screen bg-page text-primary selection:bg-brand-primary/30 pt-6">
      <main className="px-4 sm:px-6 lg:px-8 pb-24 md:pb-12 max-w-4xl mx-auto space-y-12">
        
        {/* ── Page Header ── */}
        <motion.header {...fadeUp(0)} className="flex flex-col items-center justify-center text-center">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-brand-primary shadow-[0_0_10px_rgba(79,92,255,0.8)]" />
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-primary">
              Legacy Commemoration Protocol
            </p>
          </div>
          <h1 className="text-4xl sm:text-5xl font-display font-bold text-primary tracking-tight leading-none mb-4">
            Final <span className="italic text-brand-primary">Words</span>
          </h1>
          <p className="text-muted text-sm max-w-md font-medium">
            Some things are too important to leave unsaid. Archive your final mandates and personal sentiments.
          </p>
        </motion.header>

        {/* ── 3D Visualizer ── */}
        <motion.div {...fadeUp(0.1)} className="h-64 w-full rounded-[40px] bg-surface/40 border border-base/60 relative overflow-hidden flex items-center justify-center group shadow-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(79,92,255,0.05),transparent)] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <Canvas camera={{ position: [0, 0, 5] }}>
            <Suspense fallback={null}>
              <AuroraScene />
            </Suspense>
          </Canvas>
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-transparent to-obsidian-950/80" />
          <div className="absolute bottom-6 left-0 right-0 text-center pointer-events-none">
            <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-obsidian-600">Archival Synthesis Active</p>
          </div>
        </motion.div>

        {!hasSeenIntro ? (
          <motion.div 
            {...fadeUp(0.2)}
            className="max-w-2xl mx-auto bg-surface/40 backdrop-blur-xl rounded-[32px] p-12 border border-base/60 text-center relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-primary/50 to-transparent" />
            <BookOpen size={56} className="mx-auto text-brand-primary mb-8 opacity-80" />
            <p className="text-xl text-primary leading-relaxed font-display font-bold mb-8 italic">
              "This space is sovereign. Your words are cryptographically sealed until protocol activation. 
              The most profound inheritance you leave is your voice."
            </p>
            <Button 
              variant="primary" 
              className="px-12 py-4 text-[10px] font-bold uppercase tracking-[0.2em] shadow-2xl shadow-brand-primary/20"
              onClick={() => { setHasSeenIntro(true); setIsModalOpen(true); }}
            >
              Begin Archival Process
            </Button>
          </motion.div>
        ) : (
          <div className="space-y-8">
            <motion.div {...fadeUp(0.2)} className="flex justify-between items-end">
              <div>
                <h2 className="text-xl font-display font-bold text-primary">Sealed Mandates</h2>
                <p className="text-[10px] font-bold uppercase tracking-widest text-obsidian-600 mt-1">Owner Access Only</p>
              </div>
              <Button 
                variant="secondary" 
                className="text-[10px] font-bold uppercase tracking-widest px-6"
                onClick={() => setIsModalOpen(true)}
              >
                + New Message
              </Button>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {entries.map((entry, idx) => {
                const heir = heirs.find(h => h.id === entry.recipientHeirId);
                return (
                  <motion.div 
                    key={entry.id}
                    {...fadeUp(0.3 + idx * 0.1)}
                  >
                    <Card className="p-8 bg-surface/40 border border-base/60 relative group hover:border-brand-primary/30 transition-all cursor-default">
                      <div className="absolute top-8 right-8 p-2.5 bg-brand-gold/10 rounded-xl border border-brand-gold/20 shadow-inner group-hover:bg-brand-gold/20 transition-all" title="Institutional Lock Applied">
                        <Lock size={16} className="text-brand-gold" />
                      </div>

                      <h3 className="text-2xl font-display font-bold text-primary mb-3 truncate pr-12">{heir ? `To ${heir.name}` : 'Family Protocol'}</h3>
                      <div className="flex items-center gap-5 text-[10px] font-bold text-primary0 uppercase tracking-widest">
                        <span className="flex items-center gap-2 text-brand-primary">{getIcon(entry.type)} {entry.type}</span>
                        <span className="w-1 h-1 rounded-full bg-surface/80" />
                        <span className="flex items-center gap-2"><Clock size={12}/> {new Date(entry.createdAt).toLocaleDateString()}</span>
                      </div>

                      <div className="flex justify-between items-center mt-10 pt-6 border-t border-base/60">
                        <button className="text-[10px] font-bold text-brand-primary uppercase tracking-widest flex items-center gap-2 hover:text-brand-primary transition-colors">
                          <Eye size={14}/> Decrypt Preview
                        </button>
                        <button onClick={() => deleteEntry(entry.id)} className="text-[10px] font-bold text-obsidian-700 hover:text-red-500 uppercase tracking-widest transition-colors">
                          Purge
                        </button>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Multi-Step Synthesis Modal ── */}
        <AnimatePresence>
          {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-page/90 backdrop-blur-md">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 30 }}
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
                className="w-full max-w-3xl bg-surface border border-base rounded-[40px] overflow-hidden flex flex-col max-h-[90vh] shadow-[0_40px_100px_rgba(0,0,0,0.6)]"
              >
                <div className="p-8 border-b border-base/60 flex justify-between items-center bg-surface/50">
                  <div className="flex items-center gap-4 text-brand-primary">
                    <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center border border-brand-primary/20">
                       <PenTool size={20}/> 
                    </div>
                    <div>
                      <span id="modal-title" className="font-display text-xl font-bold text-primary">Synthesis Hub</span>
                      <p className="text-[9px] font-bold text-obsidian-600 uppercase tracking-[0.2em] mt-1">Archival Step {step} / 5</p>
                    </div>
                  </div>
                  <button onClick={() => setIsModalOpen(false)} className="text-obsidian-600 hover:text-obsidian-200 p-2.5 rounded-xl hover:bg-page transition-all"><X size={20}/></button>
                </div>

                <div className="flex-1 overflow-y-auto p-10 lg:p-12 space-y-10 scrollbar-hide">
                  
                  {step === 1 && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-10 text-center">
                      <h3 className="text-3xl font-display font-bold text-primary tracking-tight">Designate Mandate Recipient</h3>
                      <div className="max-w-md mx-auto relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-primary/20 to-transparent blur opacity-0 group-hover:opacity-100 transition duration-500" />
                        <select 
                          className="relative w-full bg-page border border-base rounded-2xl px-6 py-5 text-primary text-lg font-medium outline-none focus:border-brand-primary/50 transition-all appearance-none cursor-pointer"
                          value={newEntry.recipientHeirId || 'all'} 
                          onChange={(e) => setNewEntry({...newEntry, recipientHeirId: e.target.value})}
                        >
                          <option value="all">General Protocol (All Beneficiaries)</option>
                          {heirs.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
                        </select>
                      </div>
                      <p className="text-xs text-primary0 font-medium">Specific messages can only be decrypted by the designated heir.</p>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
                      <h3 className="text-3xl font-display font-bold text-primary text-center tracking-tight">Select Transmission Mode</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                          { id: 'letter', icon: Feather, title: 'Written Mandate', desc: 'Sovereign text archive.' },
                          { id: 'voice', icon: Mic, title: 'Vocal Record', desc: 'Audio synthesis upload.' },
                          { id: 'video', icon: Video, title: 'Visual Synthesis', desc: 'Full motion archive.' }
                        ].map((t) => (
                          <button
                            key={t.id}
                            onClick={() => setNewEntry({ ...newEntry, type: t.id as unknown })}
                            className={`p-8 rounded-[32px] border flex flex-col items-center justify-center gap-6 transition-all text-center relative overflow-hidden group ${
                              newEntry.type === t.id ? 'bg-brand-primary/10 border-brand-primary shadow-2xl shadow-brand-primary/10 text-primary' : 'bg-page border-base text-obsidian-600 hover:border-base'
                            }`}
                          >
                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${newEntry.type === t.id ? 'bg-brand-primary text-obsidian-950' : 'bg-surface text-obsidian-700 border border-base'}`}>
                              <t.icon size={32} />
                            </div>
                            <div>
                              <span className="font-display font-bold text-xl block mb-2">{t.title}</span>
                              <span className="text-[10px] font-bold uppercase tracking-widest opacity-60 italic">{t.desc}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {step === 3 && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 flex flex-col h-full min-h-[450px]">
                      <div className="flex justify-between items-center">
                        <h3 className="text-2xl font-display font-bold text-primary flex items-center gap-4">
                          {getIcon(newEntry.type || 'letter')} Transcribe Content
                        </h3>
                        <button 
                          onClick={simulateAiGeneration}
                          disabled={isGenerating}
                          className="px-5 py-2.5 rounded-xl bg-brand-gold/10 text-brand-gold border border-brand-gold/20 flex items-center gap-2 hover:bg-brand-gold/20 transition-all text-[10px] font-bold uppercase tracking-widest"
                        >
                         <Sparkles size={14} className={isGenerating ? 'animate-spin' : ''} /> {isGenerating ? 'Synthesizing...' : 'AI Assist'}
                        </button>
                      </div>
                      
                      <div className="flex-1 relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-brand-primary/5 to-transparent blur opacity-0 group-hover:opacity-100 transition duration-500" />
                        <textarea 
                          className="relative w-full h-full min-h-[350px] bg-page border border-base rounded-[32px] p-8 text-lg text-primary font-medium placeholder:text-muted resize-none focus:outline-none focus:border-brand-primary/40 transition-all leading-relaxed"
                          placeholder="Initialize protocol message here...&#10;&#10;Consider sharing:&#10;• Personal values and final guidance.&#10;• Distribution intent beyond legal dry text.&#10;• Final words of continuity."
                          value={newEntry.content || ''}
                          onChange={(e) => setNewEntry({...newEntry, content: e.target.value})}
                        />
                      </div>
                    </motion.div>
                  )}

                  {step === 4 && (
                    <motion.div initial={{ opacity: 0, y: 10, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} className="p-12 rounded-[40px] bg-obsidian-50 border border-white shadow-2xl relative">
                       <div className="absolute top-8 right-8 opacity-10">
                          <CheckCircle2 size={120} className="text-brand-primary" />
                       </div>
                       <div className="relative z-10 font-medium text-lg leading-relaxed text-obsidian-900 max-w-lg mx-auto">
                          <p className="mb-10 text-[10px] font-bold uppercase tracking-[0.3em] text-brand-primary">Document Review</p>
                          <p className="mb-10 font-display font-bold text-2xl text-obsidian-950">
                            Subject: Legacy Mandate to {heirs.find(h => h.id === newEntry.recipientHeirId)?.name || 'Family Quorum'}
                          </p>
                          <div className="whitespace-pre-wrap italic font-serif opacity-80 leading-loose">"{newEntry.content}"</div>
                          <div className="mt-16 pt-8 border-t border-obsidian-200 flex justify-between items-end">
                             <div className="text-[9px] font-bold text-muted uppercase tracking-widest">
                                Protocol Encoded: {new Date().toLocaleDateString()}
                             </div>
                             <div className="w-16 h-1 w-obsidian-200" />
                          </div>
                       </div>
                    </motion.div>
                  )}
                  
                  {step === 5 && (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-10 text-center py-16">
                      <motion.div 
                         animate={{ 
                           scale: [1, 1.05, 1],
                           boxShadow: ['0 0 20px rgba(212,175,55,0.2)', '0 0 60px rgba(212,175,55,0.4)', '0 0 20px rgba(212,175,55,0.2)']
                         }} 
                         transition={{ repeat: Infinity, duration: 3 }}
                         className="w-32 h-32 rounded-full bg-brand-gold text-obsidian-950 flex items-center justify-center mx-auto mb-10 shadow-2xl"
                      >
                        <Lock size={48} />
                      </motion.div>
                      <h3 className="text-4xl font-display font-bold text-primary tracking-tight">Seal Mandate</h3>
                      <p className="text-lg text-muted max-w-md mx-auto font-medium">
                        This archive will be cryptographically locked. It is only accessible upon verification of protocol activation.
                      </p>
                    </motion.div>
                  )}

                </div>

                <div className="p-8 border-t border-base bg-page/40 flex justify-between items-center">
                   <div className="flex gap-4">
                     {step > 1 ? (
                       <Button variant="secondary" className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest border-base" onClick={() => setStep(step - 1)}>Go Back</Button>
                     ) : <div></div>}
                   </div>
                   
                   <div className="flex gap-4">
                     {step < 5 ? (
                       <Button 
                         variant="primary" 
                         onClick={() => setStep(step + 1)} 
                         className="px-10 py-3 text-[10px] font-bold uppercase tracking-widest min-w-[140px] disabled:opacity-50"
                         disabled={step === 3 && !newEntry.content}
                       >
                         {step === 4 ? 'Confirm Review' : 'Continue Pulse'}
                       </Button>
                     ) : (
                       <Button variant="primary" className="bg-brand-gold hover:bg-brand-gold text-obsidian-950 border-none shadow-[0_0_30px_rgba(212,175,55,0.3)] px-12 py-4 text-[10px] font-bold uppercase tracking-[0.2em]" onClick={handleCreate}>
                         <ShieldCheck size={18} className="mr-2"/> Commit to Vault
                       </Button>
                     )}
                   </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
