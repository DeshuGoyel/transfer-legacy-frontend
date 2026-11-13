import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Briefcase, Shield, Globe, Lock, Cpu, ArrowRight, CheckCircle2, 
  MapPin, DollarSign, Send, X, Sparkles, Building, Layers
} from 'lucide-react';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import toast from 'react-hot-toast';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.5, ease: [0.16, 1, 0.3, 1] },
});

interface JobPosition {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  salary: string;
  description: string;
  requirements: string[];
}

const POSITIONS: JobPosition[] = [
  {
    id: 'zk-cryptographer',
    title: 'Principal Zero-Knowledge Cryptographer',
    department: 'Cryptography & Core R&D',
    location: 'Global Remote (US / EU / Asia)',
    type: 'Full-time',
    salary: '$220,000 - $280,000 USD + Equity',
    description: 'Design and optimize client-side zero-knowledge proof circuits (zk-SNARKs/STARKs) for non-custodial Shamir key sharding and liveness verification.',
    requirements: [
      '5+ years experience in Applied Cryptography & Zero-Knowledge Proofs',
      'Proficiency in Circom, Halo2, or Rust zk-ecosystems',
      'Deep knowledge of threshold cryptography & Shamir Secret Sharing'
    ]
  },
  {
    id: 'rust-security',
    title: 'Senior Rust & Smart Contract Auditor',
    department: 'Security Operations',
    location: 'Remote',
    type: 'Full-time',
    salary: '$190,000 - $240,000 USD',
    description: 'Audit and harden smart succession protocols, on-chain dead man switch logic, and client-side sodium key derivation routines.',
    requirements: [
      'Proven track record of auditing EVM / Solana smart contracts',
      'Expert in Rust, libsodium, and formal verification tools',
      'Experience with threat modeling and penetration testing'
    ]
  },
  {
    id: 'frontend-lead',
    title: 'Lead Full-Stack Web3 & React Engineer',
    department: 'Product Engineering',
    location: 'Remote',
    type: 'Full-time',
    salary: '$180,000 - $220,000 USD',
    description: 'Spearhead our high-craft React & TypeScript web application. Craft pixel-perfect, zero-latency interfaces for vault management and heir guidance.',
    requirements: [
      '6+ years experience with React, TypeScript, Tailwind CSS, Vite',
      'Demonstrated expertise in client-side Web Crypto API & Zustand',
      'Strong eye for UI/UX aesthetics, animations, and micro-interactions'
    ]
  },
  {
    id: 'legal-counsel',
    title: 'Digital Property & Estate Legal Product Counsel',
    department: 'Legal & Global Compliance',
    location: 'New York / London / Remote',
    type: 'Full-time',
    salary: '$200,000 - $250,000 USD',
    description: 'Bridge traditional estate law (RUFADAA, probate court procedures) with decentralized cryptographic succession protocols globally.',
    requirements: [
      'J.D. or equivalent LL.M. in Estate Planning or Digital Assets Law',
      'Experience consulting on cross-border inheritance protocols',
      'Familiarity with digital asset custody & fiduciary standards'
    ]
  }
];

export default function Careers() {
  const [selectedJob, setSelectedJob] = useState<JobPosition | null>(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [applicantName, setApplicantName] = useState('');
  const [applicantEmail, setApplicantEmail] = useState('');
  const [applicantLink, setApplicantLink] = useState('');
  const [applicantNote, setApplicantNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenApply = (job: JobPosition) => {
    setSelectedJob(job);
    setIsApplyModalOpen(true);
  };

  const handleSubmitApplication = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      toast.success(`Application submitted for ${selectedJob?.title || 'Position'}! Our team will review your application.`);
      setIsApplyModalOpen(false);
      setApplicantName('');
      setApplicantEmail('');
      setApplicantLink('');
      setApplicantNote('');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-page text-primary pt-6 pb-24 selection:bg-brand-primary/30">
      <main className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-12">
        
        {/* ── Page Header ── */}
        <motion.header {...fadeUp(0)} className="text-center space-y-4 max-w-3xl mx-auto pt-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-xs font-bold uppercase tracking-widest">
            <Sparkles size={14} /> Sovereign Engineering Culture
          </div>
          <h1 className="text-4xl sm:text-5xl font-display font-bold text-primary tracking-tight leading-tight">
            Build the Future of <span className="italic text-brand-primary">Digital Inheritance</span>
          </h1>
          <p className="text-muted text-sm sm:text-base leading-relaxed font-medium">
            Join Transfer Legacy. We are building institutional-grade, zero-knowledge infrastructure to secure digital assets, identities, and family legacies for generations.
          </p>
        </motion.header>

        {/* ── Engineering Values Grid ── */}
        <motion.div {...fadeUp(0.1)} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 bg-surface/40 border-base/60 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary">
              <Lock size={20} />
            </div>
            <h3 className="text-base font-bold text-primary">Zero-Knowledge First</h3>
            <p className="text-xs text-muted leading-relaxed">
              We build systems where user privacy is guaranteed by cryptography, not promises. We never see plaintext keys or vault data.
            </p>
          </Card>

          <Card className="p-6 bg-surface/40 border-base/60 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Globe size={20} />
            </div>
            <h3 className="text-base font-bold text-primary">Sovereign & Remote</h3>
            <p className="text-xs text-muted leading-relaxed">
              Work from anywhere on Earth. We prioritize deep focus, clear async documentation, and autonomous problem-solving.
            </p>
          </Card>

          <Card className="p-6 bg-surface/40 border-base/60 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center text-brand-gold">
              <Shield size={20} />
            </div>
            <h3 className="text-base font-bold text-primary">Institutional Standard</h3>
            <p className="text-xs text-muted leading-relaxed">
              We operate with high mathematical rigor. Our protocol safeguards wealth and generational estate plans across 50+ countries.
            </p>
          </Card>
        </motion.div>

        {/* ── Open Roles Section ── */}
        <motion.section {...fadeUp(0.15)} className="space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-base/50">
            <div>
              <h2 className="text-2xl font-display font-bold text-primary tracking-tight">Open Positions</h2>
              <p className="text-xs text-muted mt-1">Explore current career opportunities across cryptography, engineering, and legal product strategy.</p>
            </div>
            <Badge variant="success" className="text-xs font-bold px-3 py-1">
              {POSITIONS.length} Active Openings
            </Badge>
          </div>

          <div className="space-y-4">
            {POSITIONS.map((job, idx) => (
              <motion.div key={job.id} {...fadeUp(0.2 + idx * 0.05)}>
                <Card className="p-6 bg-surface/40 hover:bg-surface border-base/60 transition-all duration-300 space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-brand-primary font-mono">{job.department}</span>
                        <span className="text-muted">•</span>
                        <span className="text-[11px] text-muted flex items-center gap-1 font-medium"><MapPin size={12} /> {job.location}</span>
                      </div>
                      <h3 className="text-lg font-bold text-primary">{job.title}</h3>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-xs font-bold text-emerald-400 font-mono bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl">
                        {job.salary}
                      </span>
                      <button
                        onClick={() => handleOpenApply(job)}
                        className="h-10 px-5 rounded-xl bg-brand-primary hover:bg-brand-primary/90 text-white font-semibold text-xs flex items-center gap-2 shadow-md shadow-brand-primary/20 transition-all cursor-pointer"
                      >
                        Apply Now <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-secondary leading-relaxed max-w-3xl">
                    {job.description}
                  </p>

                  <div className="pt-3 border-t border-base/40 flex flex-wrap gap-2">
                    {job.requirements.map((req, i) => (
                      <span key={i} className="text-[11px] text-muted bg-page/80 border border-base/60 px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                        <CheckCircle2 size={12} className="text-brand-primary" /> {req}
                      </span>
                    ))}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

      </main>

      {/* ── Job Application Modal ── */}
      <AnimatePresence>
        {isApplyModalOpen && selectedJob && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-page border border-base rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-2xl relative"
            >
              <button
                onClick={() => setIsApplyModalOpen(false)}
                className="absolute top-5 right-5 text-muted hover:text-primary p-1 rounded-lg hover:bg-surface cursor-pointer"
              >
                <X size={20} />
              </button>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-brand-primary font-mono">
                  Career Application
                </span>
                <h3 className="text-xl font-bold text-primary mt-1">{selectedJob.title}</h3>
                <p className="text-xs text-muted mt-1">{selectedJob.department} • {selectedJob.location}</p>
              </div>

              <form onSubmit={handleSubmitApplication} className="space-y-4 text-xs">
                <div>
                  <label className="block text-muted font-bold mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                    placeholder="Satoshi Nakamoto"
                    className="w-full h-10 px-3.5 rounded-xl bg-surface/50 border border-base focus:border-brand-primary text-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-muted font-bold mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={applicantEmail}
                    onChange={(e) => setApplicantEmail(e.target.value)}
                    placeholder="satoshi@gmx.com"
                    className="w-full h-10 px-3.5 rounded-xl bg-surface/50 border border-base focus:border-brand-primary text-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-muted font-bold mb-1">GitHub / LinkedIn / Portfolio URL</label>
                  <input
                    type="url"
                    required
                    value={applicantLink}
                    onChange={(e) => setApplicantLink(e.target.value)}
                    placeholder="https://github.com/yourhandle"
                    className="w-full h-10 px-3.5 rounded-xl bg-surface/50 border border-base focus:border-brand-primary text-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-muted font-bold mb-1">Why Transfer Legacy? (Brief Note)</label>
                  <textarea
                    rows={4}
                    value={applicantNote}
                    onChange={(e) => setApplicantNote(e.target.value)}
                    placeholder="Tell us about your background and passion for cryptography or digital asset inheritance..."
                    className="w-full p-3.5 rounded-xl bg-surface/50 border border-base focus:border-brand-primary text-primary focus:outline-none leading-relaxed"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-base/50">
                  <button
                    type="button"
                    onClick={() => setIsApplyModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-muted hover:text-primary cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-primary/90 text-white font-semibold text-xs shadow-md shadow-brand-primary/20 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <Send size={13} /> {isSubmitting ? 'Submitting...' : 'Submit Application'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
