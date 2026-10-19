import { useState } from 'react';
import { useStore } from '../store/useStore';
import { UserPlus, Trash2, Mail, Info, ShieldCheck, CheckCircle2, Share2, ChevronRight, Lock, Verified } from 'lucide-react';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import { useForm as useRHForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import GuardianNetwork3D from '../components/3d/GuardianNetwork3D';
import Card from '../components/ui/Card';

const guardianSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  message: z.string().optional()
});

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 15 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { delay, duration: 0.5, ease: [0.16, 1, 0.3, 1] },
});

export default function Guardians() {
  const { guardians, addGuardian, removeGuardian, confirmGuardian, architectureMode, setArchitectureMode } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [template, setTemplate] = useState('Formal');

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useRHForm({
    resolver: zodResolver(guardianSchema)
  });

  const templates = {
    Formal: "I am adding you as a guardian to my Transfer Legacy Vault to secure my digital legacy.",
    Personal: "Hey! I'm setting up my digital inheritance and chosen you to be one of my trusted guardians.",
    Brief: "Please accept this invitation to be my digital guardian on Transfer Legacy."
  };

  const handleTemplateSelect = (t: string) => {
    setTemplate(t);
    setValue('message', templates[t as keyof typeof templates]);
  };

  const onSubmit = (data: unknown) => {
    const d = data as { name: string; email: string };
    addGuardian({ name: d.name, email: d.email });
    toast.success(`Protocol invitation sent to ${d.name}`);
    setIsModalOpen(false);
    reset();
  };

  const confirmed = guardians.filter(g => g.status === 'Confirmed').length;
  const pending = guardians.filter(g => g.status === 'Pending').length;

  return (
    <div className="min-h-screen bg-page text-primary selection:bg-brand-primary/30 pt-6">
      <main className="px-4 sm:px-6 lg:px-8 pb-28 md:pb-12 max-w-7xl mx-auto space-y-12">
        
        {/* ── Page Header ── */}
        <motion.header {...fadeUp(0)} className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-gold shadow-[0_0_10px_rgba(212,175,55,0.8)]" />
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-gold">
                Network Trust Protocol
              </p>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-5xl font-display font-bold text-primary tracking-tight leading-none">
              Guardian <span className="italic text-brand-gold">Network</span>
            </h1>
            <p className="text-muted text-sm font-medium max-w-xl">
              {architectureMode === 'direct' 
                ? `Direct Succession Protocol active. Vault keys will be transferred to your nominated guardian/beneficiary directly.` 
                : `Distribute cryptographic key fragments across a trusted circle of ${confirmed} verified guardians and ${pending} pending nodes via Shamir's Secret Sharing.`}
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            {/* Architecture Mode Toggle */}
            <div className="flex items-center p-1 rounded-2xl bg-surface/60 border border-base shadow-inner">
              <button
                type="button"
                onClick={() => {
                  setArchitectureMode('quorum');
                  toast.success('Architecture: M-of-N Consensus Quorum enabled');
                }}
                className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all ${
                  architectureMode === 'quorum'
                    ? 'bg-brand-gold text-black shadow-lg shadow-brand-gold/20'
                    : 'text-muted hover:text-primary'
                }`}
              >
                M-of-N Quorum
              </button>
              <button
                type="button"
                onClick={() => {
                  setArchitectureMode('direct');
                  toast.success('Architecture: Direct Beneficiary Succession enabled');
                }}
                className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all ${
                  architectureMode === 'direct'
                    ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20'
                    : 'text-muted hover:text-primary'
                }`}
              >
                Direct (Single)
              </button>
            </div>

            <Button onClick={() => setIsModalOpen(true)} variant="primary" className="h-12 px-8 text-[11px] font-bold uppercase tracking-widest shadow-xl shadow-brand-gold/10">
              <UserPlus size={18} className="mr-2" /> Invite Guardian
            </Button>
          </div>
        </motion.header>

        {/* ── 3D Network Visualization ── */}
        <motion.div {...fadeUp(0.1)} className="h-[450px] w-full rounded-[40px] bg-surface/40 border border-base/60 overflow-hidden relative shadow-2xl group">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.03),transparent)]" />
          <Canvas camera={{ position: [0, 4, 10], fov: 45 }}>
            <GuardianNetwork3D guardians={guardians} />
          </Canvas>
          <div className="absolute top-8 left-8 flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-page/80 border border-base backdrop-blur-xl shadow-2xl">
            <div className="w-2 h-2 rounded-full bg-brand-gold animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Live Trust Graph Synthesis</span>
          </div>
          <div className="absolute bottom-8 right-8 text-right">
             <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-muted mb-1">
               {architectureMode === 'direct' ? 'Direct Beneficiary Mode' : 'Decentralized Recovery Active'}
             </p>
             <div className="flex gap-1 justify-end">
                {[1,2,3,4,5].map(i => <div key={i} className="w-1 h-4 bg-brand-gold/20 rounded-full" />)}
             </div>
          </div>
        </motion.div>

        {/* ── Security Status Hub ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div {...fadeUp(0.2)}>
            {architectureMode === 'direct' ? (
              <Card className="bg-brand-primary/5 border border-brand-primary/20 p-8 flex items-start space-x-6 relative overflow-hidden group">
                <div className="absolute -right-8 -bottom-8 opacity-5 transform group-hover:scale-110 transition-transform duration-700">
                   <ShieldCheck size={160} className="text-brand-primary" />
                </div>
                <div className="w-14 h-14 rounded-2xl bg-brand-primary/10 flex items-center justify-center shrink-0 border border-brand-primary/20 shadow-inner">
                   <ShieldCheck size={24} className="text-brand-primary" />
                </div>
                <div>
                   <h4 className="text-[11px] font-bold text-brand-primary uppercase tracking-[0.2em] mb-2">Direct Beneficiary Succession</h4>
                   <p className="text-sm text-secondary font-medium leading-relaxed max-w-sm">
                     M-of-N threshold is optional and currently bypassed. Single-node transfer will deliver vault access directly upon triggered succession.
                   </p>
                </div>
              </Card>
            ) : confirmed < 3 ? (
              <Card className="bg-brand-gold/5 border border-brand-gold/20 p-8 flex items-start space-x-6 relative overflow-hidden group">
                <div className="absolute -right-8 -bottom-8 opacity-5 transform group-hover:scale-110 transition-transform duration-700">
                   <ShieldCheck size={160} className="text-brand-gold" />
                </div>
                <div className="w-14 h-14 rounded-2xl bg-brand-gold/10 flex items-center justify-center shrink-0 border border-brand-gold/20 shadow-inner">
                   <Info size={24} className="text-brand-gold" />
                </div>
                <div>
                   <h4 className="text-[11px] font-bold text-brand-gold uppercase tracking-[0.2em] mb-2">Quorum Threshold Required</h4>
                   <p className="text-sm text-secondary font-medium leading-relaxed max-w-sm">
                     Institutional recovery via Shamir's Secret Sharing requires a minimum of 3 verified nodes. Secure {3 - confirmed} more guardians to finalize protocol, or switch to Direct mode above.
                   </p>
                </div>
              </Card>
            ) : (
              <Card className="bg-trust-500/5 border border-trust-500/20 p-8 flex items-start space-x-6 relative overflow-hidden group">
                <div className="absolute -right-8 -bottom-8 opacity-5 transform group-hover:scale-110 transition-transform duration-700">
                   <ShieldCheck size={160} className="text-trust-500" />
                </div>
                <div className="w-14 h-14 rounded-2xl bg-trust-500/10 flex items-center justify-center shrink-0 border border-trust-500/20 shadow-inner">
                   <ShieldCheck size={24} className="text-trust-500" />
                </div>
                <div>
                   <h4 className="text-[11px] font-bold text-trust-500 uppercase tracking-[0.2em] mb-2">Decentralized Protection Active</h4>
                   <p className="text-sm text-secondary font-medium leading-relaxed max-w-sm">
                     Trust threshold satisfied. Your institutional vault keys are now cryptographically fragmented across your verified network.
                   </p>
                </div>
              </Card>
            )}
          </motion.div>
          
          <motion.div {...fadeUp(0.25)}>
            <Card className="bg-brand-primary/5 border border-brand-primary/20 p-8 flex items-center justify-between group cursor-pointer hover:border-brand-primary/40 transition-all">
               <div className="flex items-start gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-brand-primary/10 flex items-center justify-center shrink-0 border border-brand-primary/20 shadow-inner">
                     <Share2 size={24} className="text-brand-primary" />
                  </div>
                  <div>
                     <h4 className="text-[11px] font-bold text-brand-primary uppercase tracking-[0.2em] mb-2">Network Expansion</h4>
                     <p className="text-sm text-secondary font-medium max-w-xs">Delegate institutional guardianship to trusted peers and professional fiduciaries.</p>
                  </div>
               </div>
               <div className="p-3 bg-page rounded-xl border border-base group-hover:border-brand-primary/30 transition-all">
                  <ChevronRight size={20} className="text-brand-primary" />
               </div>
            </Card>
          </motion.div>
        </div>

        {/* ── Guardian Node List ── */}
        <div className="space-y-6 mt-4">
          <motion.div {...fadeUp(0.3)} className="flex items-center justify-between mb-2">
             <h3 className="text-xl font-display font-bold text-primary">Verified Network Nodes</h3>
             <p className="text-[10px] font-bold text-muted uppercase tracking-widest">Protocol Version 1.0.4</p>
          </motion.div>
          
          <div className="grid grid-cols-1 gap-6">
            {guardians.map((g, i) => (
              <motion.div key={g.id} {...fadeUp(0.35 + i * 0.05)}>
                <Card className="p-8 flex items-center justify-between hover:border-brand-primary/30 transition-all group bg-surface/40 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-transparent via-brand-gold/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="flex items-center space-x-6">
                    <div className={`w-16 h-16 rounded-[24px] flex items-center justify-center font-display font-bold text-2xl transition-all border shadow-inner
                      ${g.status === 'Confirmed' 
                        ? 'bg-brand-primary/10 text-brand-primary border-brand-primary/30' 
                        : 'bg-page text-muted border-base'}
                    `}>
                      {g.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-xl font-display font-bold text-primary tracking-tight group-hover:text-vault-50 transition-colors">{g.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                         <p className="text-sm text-primary0 font-medium">{g.email}</p>
                         {g.status === 'Confirmed' && <Verified size={14} className="text-trust-500" />}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-8">
                    <Badge variant={g.status === 'Confirmed' ? 'success' : 'warning'} className="text-[10px] font-bold uppercase tracking-widest px-4 py-1">
                      {g.status === 'Confirmed' ? 'Active Node' : 'Awaiting Encryption'}
                    </Badge>
                    <div className="flex space-x-3">
                      {g.status === 'Pending' && (
                        <div className="flex space-x-3">
                          <button 
                            onClick={() => { confirmGuardian(g.id); toast.success('Protocol verified (Simulation)'); }}
                            className="p-3 text-trust-500 hover:text-trust-400 transition bg-page hover:bg-surface/80 rounded-xl border border-base shadow-inner"
                            title="Verify Node"
                          >
                            <CheckCircle2 size={18} />
                          </button>
                          <button 
                            onClick={() => toast.success('Invite protocol resent')}
                            className="p-3 text-primary0 hover:text-brand-primary transition bg-page hover:bg-surface/80 rounded-xl border border-base shadow-inner"
                            title="Resend Handshake"
                          >
                            <Mail size={18} />
                          </button>
                        </div>
                      )}
                      <button 
                        onClick={() => {
                          if (architectureMode === 'quorum' && g.status === 'Confirmed') {
                            const remainingConfirmed = guardians.filter(item => item.status === 'Confirmed' && item.id !== g.id).length;
                            if (remainingConfirmed < 2) {
                              toast.error('Cannot remove guardian: at least 2 confirmed guardians are required for quorum recovery. Switch to Direct Mode if desired.');
                              return;
                            }
                          }
                          removeGuardian(g.id);
                          toast.success('Node removed from network');
                        }}
                        className="p-3 text-muted hover:text-red-500 transition bg-page hover:bg-surface/80 rounded-xl border border-base shadow-inner"
                        title="Purge Node"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

      </main>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Initiate Guardian Handshake">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="Guardian Designation" placeholder="Legal Name / Alias" {...register('name')} error={errors.name?.message as string} />
            <Input label="Network Identity" type="email" placeholder="email@protocol.com" {...register('email')} error={errors.email?.message as string} />
          </div>
          
          <div className="space-y-4">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary0 ml-1">Communication Semantic</label>
            <div className="flex flex-wrap gap-3">
              {['Formal', 'Personal', 'Brief'].map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => handleTemplateSelect(t)}
                  className={`px-6 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all border ${
                    template === t 
                    ? 'bg-brand-primary/10 text-brand-primary border-brand-primary/40 shadow-xl' 
                    : 'bg-page text-muted border-base hover:border-base'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <textarea
              {...register('message')}
              className="w-full mt-2 bg-page border border-base rounded-2xl px-5 py-4 text-primary text-sm focus:outline-none focus:border-brand-primary/50 transition-all placeholder:text-muted leading-relaxed min-h-[120px]"
              rows={4}
              placeholder="Custom protocol instructions..."
            />
          </div>

          <div className="pt-8 border-t border-base">
             <h4 className="text-[10px] font-bold text-muted uppercase tracking-[0.3em] flex items-center gap-3 mb-6">
                <Lock size={14}/> Handshake Architecture Preview
             </h4>
             <div className="bg-page text-secondary p-8 rounded-[32px] border border-base shadow-2xl relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-48 h-48 bg-brand-primary/5 blur-[80px] pointer-events-none" />
                 <div className="border-b border-base/60 pb-6 mb-6 flex items-center gap-4">
                     <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary border border-brand-primary/20 shadow-inner">
                        <ShieldCheck size={20}/>
                     </div>
                     <span className="font-display font-bold text-2xl text-primary">Transfer <span className="text-brand-primary italic">Legacy</span></span>
                 </div>
                 <p className="font-display font-bold text-lg text-primary mb-4">Mandatory Verification: Guardian Role Assigned</p>
                 <p className="text-sm mb-6 leading-relaxed text-muted italic font-medium">"{watch('message') || templates[template as keyof typeof templates]}"</p>
                 <div className="mb-8 text-primary0 bg-surface/40 border-l-2 border-brand-gold p-5 rounded-r-2xl text-[12px] leading-loose">
                    "You are designated as a critical node in an institutional succession protocol. Confirmation initiates cryptographic key-share distribution."
                 </div>
                 <div className="w-full h-14 bg-brand-primary rounded-2xl flex items-center justify-center font-bold text-[11px] uppercase tracking-[0.2em] text-white shadow-xl shadow-brand-primary/20 cursor-not-allowed">
                    Finalize Handshake
                 </div>
                 <p className="text-[9px] text-muted text-center uppercase tracking-[0.4em] mt-8">Institutional Protocol Architecture · v1.0.4</p>
             </div>
          </div>
          
          <Button variant="primary" fullWidth type="submit" className="h-14 font-bold uppercase tracking-[0.2em] shadow-xl shadow-brand-primary/10">Initiate Protocol Invitation</Button>
        </form>
      </Modal>
    </div>
  );
}
