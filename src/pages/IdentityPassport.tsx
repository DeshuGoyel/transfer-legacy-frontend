import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePassportStore, IdentityPassport } from '../store/usePassportStore';
import { useStore } from '../store/useStore';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { Activity, ShieldCheck, Share2, Download, Edit3, X, QrCode, Sparkles, Fingerprint, Globe, ShieldAlert } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { toast } from 'react-hot-toast';

// CSS holographic flip card - replaces broken Three.js canvas
function HolographicCard({ isFlipped }: { isFlipped: boolean }) {
  return (
    <div style={{ perspective: '1200px' }} className="w-full h-48">
      <div
        style={{
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          transition: 'transform 0.7s cubic-bezier(0.16,1,0.3,1)',
          position: 'relative', width: '100%', height: '100%'
        }}
      >
        {/* Front */}
        <div style={{ backfaceVisibility: 'hidden' }}
          className="absolute inset-0 rounded-3xl bg-[#0a0a0c] border border-brand-primary/20 shadow-[0_0_60px_rgba(79,92,255,0.15)] overflow-hidden flex items-center justify-center"
        >
          <div className="absolute inset-0 bg-[conic-gradient(from_0deg_at_50%_50%,rgba(79,92,255,0.08),rgba(249,115,22,0.05),rgba(79,92,255,0.08))] animate-spin" style={{ animationDuration: '8s' }} />
          <div className="absolute top-4 left-6 text-[9px] font-bold tracking-[0.3em] text-brand-primary/60 uppercase">Transfer Legacy · Sovereign Vault</div>
          <Fingerprint size={64} className="text-brand-primary/10" />
          <div className="absolute bottom-4 right-6 text-[9px] font-mono text-obsidian-700">TL-2025-INST-001</div>
        </div>
        {/* Back */}
        <div style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          className="absolute inset-0 rounded-3xl bg-gradient-to-br from-brand-primary/20 to-obsidian-900 border border-brand-primary/30 shadow-2xl flex items-center justify-center"
        >
          <ShieldCheck size={64} className="text-brand-primary/40" />
        </div>
      </div>
    </div>
  );
}

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 15 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { delay, duration: 0.5, ease: [0.16, 1, 0.3, 1] },
});

export default function IdentityPassportPage() {
  const { passport: rawPassport, updatePassport, generateQRData, generateSummary } = usePassportStore();
  const { assets, guardians, heirs } = useStore();

  // Defensive: merge with defaults in case localStorage state is partial/stale
  const passport: IdentityPassport = {
    fullName: '', dateOfBirth: '', country: '', bloodGroup: '', vaultSummary: '',
    qrCodeData: '', lastUpdated: '', shareableWithAttorney: false,
    shareableWithAdvisor: false, shareableWithFamily: true,
    ...rawPassport,
    emergencyContact: { name: '', phone: '', relation: '', ...rawPassport?.emergencyContact },
  };

  const [isFlipped, setIsFlipped] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const [editForm, setEditForm] = useState<IdentityPassport>(passport);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSave = () => {
    updatePassport(editForm);
    generateQRData();
    setIsEditModalOpen(false);
  };

  const simulateAiSummary = () => {
    setIsGenerating(true);
    const totalValue = assets.reduce((acc, a) => acc + (a.value || 0), 0);
    const newSummary = `This sovereign user has ${assets.length} protected digital assets worth approximately $${totalValue.toLocaleString()}, ${guardians.filter(g=>g.status==='confirmed').length} confirmed institutional guardians, and ${heirs.length} designated beneficiaries. The protocol is fully synchronized.`;
    
    setTimeout(() => {
      generateSummary(newSummary);
      setEditForm(prev => ({ ...prev, vaultSummary: newSummary }));
      setIsGenerating(false);
    }, 1500);
  };

  const calculateAge = (dob: string) => {
    if (!dob) return '';
    const diff = Date.now() - new Date(dob).getTime();
    return Math.abs(new Date(diff).getUTCFullYear() - 1970);
  };

  return (
    <div className="min-h-screen bg-page text-primary selection:bg-brand-primary/30 pt-6">
      <main className="px-4 sm:px-6 lg:px-8 pb-24 md:pb-12 max-w-5xl mx-auto space-y-12">
        
        {/* ── Page Header ── */}
        <motion.header {...fadeUp(0)} className="flex flex-col items-center justify-center text-center">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-brand-primary shadow-[0_0_10px_rgba(79,92,255,0.8)]" />
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-primary">
              Sovereign Identity Protocol
            </p>
          </div>
          <h1 className="text-4xl sm:text-5xl font-display font-bold text-primary tracking-tight leading-none mb-4">
            Digital Identity <span className="italic text-brand-primary">Passport</span>
          </h1>
          <p className="text-muted text-sm max-w-lg font-medium">
            A verifiable cryptographic proof of existence. Universal, portable, and institutional-grade.
          </p>
        </motion.header>

        {/* ── Holographic Card (CSS 3D) ── */}
        <motion.div
          {...fadeUp(0.1)}
          className="w-full cursor-pointer"
          onMouseEnter={() => setIsFlipped(true)}
          onMouseLeave={() => setIsFlipped(false)}
          onClick={() => setIsFlipped(!isFlipped)}
        >
          <HolographicCard isFlipped={isFlipped} />
          <p className="text-center text-[9px] font-bold text-obsidian-600 tracking-[0.4em] uppercase mt-3">Click to rotate credential</p>
        </motion.div>

        <div className="flex flex-col md:flex-row gap-12 justify-center items-start">
          
          {/* ── Physical-Style Passport Card ── */}
          <motion.div {...fadeUp(0.2)} className="w-full md:w-[480px] aspect-[1.586/1] rounded-[32px] p-[1.5px] bg-gradient-to-br from-brand-primary/40 via-obsidian-800 to-brand-primary/10 shadow-[0_40px_100px_rgba(0,0,0,0.5)] relative group">
            <div className="w-full h-full bg-[#0a0a0c] rounded-[31px] p-8 flex flex-col justify-between relative overflow-hidden backdrop-blur-xl">
              
              {/* Complex Watermark Patterns */}
              <div className="absolute -right-16 -bottom-16 w-64 h-64 border border-brand-primary/5 rounded-full pointer-events-none" />
              <div className="absolute -right-8 -bottom-8 w-48 h-48 border border-brand-primary/5 rounded-full pointer-events-none" />
              <ShieldCheck size={240} className="absolute -right-20 -bottom-20 text-brand-primary opacity-[0.03] pointer-events-none" />

              <div className="flex justify-between items-start border-b border-base pb-4 mb-6">
                <div>
                  <h3 className="text-brand-primary font-bold tracking-[0.25em] text-[10px] mb-1.5 uppercase">Transfer Legacy · Digital Passport</h3>
                  <p className="text-[9px] text-obsidian-600 font-mono font-bold tracking-widest uppercase">ID: {passport.fullName.toUpperCase().replace(/\s/g, '')}-{calculateAge(passport.dateOfBirth)}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-surface border border-base flex items-center justify-center shadow-inner">
                  <Fingerprint className="text-brand-primary" size={24} />
                </div>
              </div>

              <div className="flex gap-8 flex-1">
                <div className="space-y-5 flex-1">
                  <div>
                    <p className="text-[9px] text-obsidian-600 font-bold uppercase tracking-[0.2em] mb-1.5">Full Legal Name</p>
                    <p className="text-base font-display font-bold text-primary tracking-tight">{passport.fullName}</p>
                  </div>
                  <div className="flex gap-8">
                    <div>
                      <p className="text-[9px] text-obsidian-600 font-bold uppercase tracking-[0.2em] mb-1.5">Issuance Date</p>
                      <p className="text-xs font-bold text-obsidian-200 uppercase tracking-widest">{passport.dateOfBirth}</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-obsidian-600 font-bold uppercase tracking-[0.2em] mb-1.5">Jurisdiction</p>
                      <p className="text-xs font-bold text-obsidian-200 uppercase tracking-widest">{passport.country}</p>
                    </div>
                  </div>
                  <div className="flex gap-8">
                    <div>
                      <p className="text-[9px] text-obsidian-600 font-bold uppercase tracking-[0.2em] mb-1.5">Blood Metric</p>
                      <p className="text-xs font-bold text-red-500 uppercase tracking-widest">{passport.bloodGroup}</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-obsidian-600 font-bold uppercase tracking-[0.2em] mb-1.5">Vault State</p>
                      <p className="text-xs font-bold text-brand-primary flex items-center gap-2 tracking-[0.2em]">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse shadow-[0_0_8px_rgba(79,92,255,0.8)]" />
                        SYNCHRONIZED
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="w-28 flex flex-col items-end gap-3 shrink-0">
                  <div className="p-2.5 bg-obsidian-50 rounded-2xl shadow-2xl relative group-hover:scale-105 transition-transform">
                    <QRCodeSVG value={passport.qrCodeData || 'transfer_legacy'} size={92} bgColor="#f8fafc" fgColor="#0a0a0c" />
                  </div>
                  <div className="w-full">
                    <p className="text-[7px] text-obsidian-700 text-right font-mono font-bold truncate tracking-widest">{passport.qrCodeData}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-base">
                <p className="text-[9px] text-obsidian-600 font-bold uppercase tracking-[0.2em] mb-1.5">Protocol Custodian</p>
                <p className="text-[11px] font-bold text-obsidian-200 tracking-tight flex items-center gap-2">
                  {passport.emergencyContact.name} <span className="text-obsidian-700 font-medium">({passport.emergencyContact.relation})</span>
                  <span className="w-1 h-1 rounded-full bg-surface/80" />
                  <span className="font-mono text-primary0">{passport.emergencyContact.phone}</span>
                </p>
              </div>
              
            </div>
          </motion.div>

          {/* ── Action Matrix ── */}
          <div className="w-full md:w-80 space-y-6">
            <motion.div {...fadeUp(0.3)}>
              <Card className="p-6 bg-surface/40 border border-base/60 relative group">
                <div className="absolute inset-0 bg-brand-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <h4 className="text-[10px] font-bold text-brand-primary uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                  <Sparkles size={12} /> Autonomous Synthesis
                </h4>
                <p className="text-xs text-muted font-medium leading-relaxed mb-6 italic">
                  "{passport.vaultSummary}"
                </p>
                <button 
                  onClick={simulateAiSummary} 
                  disabled={isGenerating} 
                  className="text-[10px] font-bold text-primary0 uppercase tracking-widest flex items-center gap-2 hover:text-brand-primary transition-colors disabled:opacity-50"
                >
                  {isGenerating ? <div className="w-3 h-3 border-2 border-brand-primary border-t-transparent rounded-full animate-spin" /> : <Activity size={14}/>}
                  {isGenerating ? 'Synthesizing...' : 'Regenerate Analysis'}
                </button>
              </Card>
            </motion.div>

            <motion.div {...fadeUp(0.4)} className="grid grid-cols-2 gap-4">
               <button 
                onClick={() => setIsEditModalOpen(true)}
                className="flex flex-col items-center justify-center p-6 rounded-3xl bg-surface border border-base hover:border-brand-primary/40 hover:bg-page transition-all gap-3 group"
               >
                 <div className="w-10 h-10 rounded-xl bg-page border border-base flex items-center justify-center group-hover:text-brand-primary transition-colors">
                   <Edit3 size={18}/>
                 </div>
                 <span className="text-[10px] font-bold text-muted uppercase tracking-widest">Update Data</span>
               </button>
               
               <button 
                onClick={() => setIsShareModalOpen(true)}
                className="flex flex-col items-center justify-center p-6 rounded-3xl bg-brand-primary text-obsidian-950 hover:bg-brand-primary transition-all gap-3 shadow-xl shadow-brand-primary/10 active:scale-95"
               >
                 <div className="w-10 h-10 rounded-xl bg-page/10 flex items-center justify-center">
                   <Share2 size={18}/>
                 </div>
                 <span className="text-[10px] font-bold uppercase tracking-widest">Share Pulse</span>
               </button>
            </motion.div>

            <motion.button
              {...fadeUp(0.5)}
              onClick={() => toast.success('Institutional Verification PDF Generated')}
              className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl border border-base text-primary0 hover:text-obsidian-200 hover:border-base transition-all text-[10px] font-bold uppercase tracking-[0.2em]"
            >
               <Download size={14}/> Generate Verification PDF
            </motion.button>
          </div>

        </div>
      </main>

      {/* ── Institutional Edit Modal ── */}
      <AnimatePresence>
        {isEditModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-page/80 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }} 
              className="w-full max-w-lg bg-surface border border-base rounded-[32px] overflow-hidden shadow-2xl"
            >
              <div className="p-8 border-b border-base flex justify-between items-center bg-surface/50">
                <div>
                  <h3 className="text-xl font-display font-bold text-primary">Modify Protocol Data</h3>
                  <p className="text-[10px] font-bold text-obsidian-600 uppercase tracking-widest mt-1">Identity Authorization Required</p>
                </div>
                <button onClick={() => setIsEditModalOpen(false)} className="text-obsidian-600 hover:text-obsidian-200 p-2 transition-colors"><X size={20}/></button>
              </div>
              
              <div className="p-8 space-y-6 max-h-[60vh] overflow-y-auto scrollbar-hide">
                <div className="grid grid-cols-2 gap-6">
                  <div className="col-span-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-obsidian-600 mb-2 block">Full Legal Identity</label>
                    <input type="text" className="w-full bg-page border border-base rounded-xl px-4 py-3 text-sm text-obsidian-100 focus:outline-none focus:border-brand-primary/50 font-medium" value={editForm.fullName} onChange={(e) => setEditForm({...editForm, fullName: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-obsidian-600 mb-2 block">Birth Metrics</label>
                    <input type="date" className="w-full bg-page border border-base rounded-xl px-4 py-3 text-sm text-obsidian-100 focus:outline-none focus:border-brand-primary/50 font-medium" value={editForm.dateOfBirth} onChange={(e) => setEditForm({...editForm, dateOfBirth: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-obsidian-600 mb-2 block">Blood Group</label>
                    <select className="w-full bg-page border border-base rounded-xl px-4 py-3 text-sm text-obsidian-100 focus:outline-none focus:border-brand-primary/50 outline-none font-medium" value={editForm.bloodGroup} onChange={(e) => setEditForm({...editForm, bloodGroup: e.target.value})}>
                      {['A+','A-','B+','B-','O+','O-','AB+','AB-'].map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-obsidian-600 mb-2 block">Sovereign Jurisdiction</label>
                    <input type="text" className="w-full bg-page border border-base rounded-xl px-4 py-3 text-sm text-obsidian-100 focus:outline-none focus:border-brand-primary/50 font-medium" value={editForm.country} onChange={(e) => setEditForm({...editForm, country: e.target.value})} />
                  </div>
                </div>

                <div className="pt-6 border-t border-base">
                  <h4 className="text-xs font-bold text-muted uppercase tracking-widest mb-4 flex items-center gap-2">
                    <ShieldAlert size={14} className="text-red-500" /> Emergency Custodian
                  </h4>
                  <div className="space-y-4">
                    <input type="text" placeholder="Legal Name" className="w-full bg-page border border-base rounded-xl px-4 py-3 text-sm text-obsidian-100 focus:outline-none focus:border-brand-primary/50 font-medium" value={editForm.emergencyContact.name} onChange={(e) => setEditForm({...editForm, emergencyContact: {...editForm.emergencyContact, name: e.target.value}})} />
                    <div className="grid grid-cols-2 gap-4">
                      <input type="text" placeholder="Global Phone" className="w-full bg-page border border-base rounded-xl px-4 py-3 text-sm text-obsidian-100 focus:outline-none focus:border-brand-primary/50 font-medium" value={editForm.emergencyContact.phone} onChange={(e) => setEditForm({...editForm, emergencyContact: {...editForm.emergencyContact, phone: e.target.value}})} />
                      <input type="text" placeholder="Relation" className="w-full bg-page border border-base rounded-xl px-4 py-3 text-sm text-obsidian-100 focus:outline-none focus:border-brand-primary/50 font-medium" value={editForm.emergencyContact.relation} onChange={(e) => setEditForm({...editForm, emergencyContact: {...editForm.emergencyContact, relation: e.target.value}})} />
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-base">
                  <h4 className="text-xs font-bold text-muted uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Globe size={14} className="text-brand-primary" /> Authorization Bounds
                  </h4>
                  <div className="space-y-3">
                    {[
                      { id: 'shareableWithFamily', label: 'Mandate Sharing with Verified Beneficiaries' },
                      { id: 'shareableWithAttorney', label: 'Mandate Sharing with Legal Counsel' },
                      { id: 'shareableWithAdvisor', label: 'Mandate Sharing with Sovereign Advisor' },
                    ].map(pref => (
                      <label key={pref.id} className="flex items-center gap-4 p-4 rounded-2xl bg-page/40 border border-base/60 hover:border-brand-primary/30 cursor-pointer transition-all group">
                        <input type="checkbox" className="w-5 h-5 rounded-lg text-brand-primary focus:ring-brand-primary bg-surface border-base transition-all" 
                          checked={editForm[pref.id as keyof IdentityPassport] as boolean} 
                          onChange={(e) => setEditForm({...editForm, [pref.id]: e.target.checked})} 
                        />
                        <span className="text-[11px] font-bold text-muted uppercase tracking-widest group-hover:text-obsidian-200 transition-colors">{pref.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

              </div>
              <div className="p-8 border-t border-base bg-page/40 flex justify-end gap-4">
                <Button variant="secondary" className="px-8 font-bold uppercase tracking-widest text-[10px]" onClick={() => setIsEditModalOpen(false)}>Abort</Button>
                <Button variant="primary" className="px-8 font-bold uppercase tracking-widest text-[10px]" onClick={handleSave}>Sync Protocol</Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Institutional Share Modal ── */}
      <AnimatePresence>
        {isShareModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-page/80 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.95 }} 
              className="w-full max-w-sm bg-surface border border-base rounded-[40px] p-10 text-center shadow-2xl relative overflow-hidden"
            >
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(79,92,255,0.1),transparent)]" />
               <div className="w-20 h-20 rounded-[28px] bg-brand-primary/10 text-brand-primary flex items-center justify-center mx-auto mb-6 border border-brand-primary/20 shadow-inner relative z-10">
                 <QrCode size={36} />
               </div>
               <h3 className="text-2xl font-display font-bold text-primary mb-2 relative z-10">Authorization Node</h3>
               <p className="text-[10px] font-bold text-primary0 uppercase tracking-[0.2em] mb-10 relative z-10">Verified Protocol Sharing</p>
               
               <div className="bg-obsidian-50 p-6 rounded-[32px] inline-block mb-10 shadow-[0_20px_50px_rgba(0,0,0,0.4)] relative z-10">
                 <QRCodeSVG value={passport.qrCodeData} size={180} bgColor="#f8fafc" fgColor="#0a0a0c" />
               </div>
               
               <div className="w-full bg-page rounded-2xl p-4 text-[10px] text-obsidian-600 font-mono font-bold flex items-center justify-between border border-base mb-10 relative z-10">
                 <span className="truncate flex-1 text-left select-all tracking-widest">{passport.qrCodeData}</span>
               </div>
               
               <div className="space-y-4 relative z-10">
                 <Button variant="primary" className="w-full py-4 text-[10px] font-bold uppercase tracking-widest" onClick={() => setIsShareModalOpen(false)}>
                   Transmit via Secure Email
                 </Button>
                 <button className="text-[10px] font-bold text-obsidian-600 uppercase tracking-[0.2em] hover:text-secondary transition-colors" onClick={() => setIsShareModalOpen(false)}>
                   Close Protocol
                 </button>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
