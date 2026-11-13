import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, Target, Zap, AlertTriangle, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import SEO from '../../components/seo/SEO';
import { useStore } from '../../store/useStore';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
});

export default function SuccessionPlanner() {
  const navigate = useNavigate();
  const { isAuthenticated } = useStore();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);

  const questions = [
    {
      id: "jurisdiction",
      question: "Where are your primary assets located?",
      options: ["India", "USA", "UK", "UAE", "Other / Global"]
    },
    {
      id: "asset_type",
      question: "What is your primary asset class?",
      options: ["Cryptocurrency", "Digital Accounts", "Family Memories", "Combined Assets"]
    },
    {
      id: "guardian_status",
      question: "Do you have a verified legal heir or guardian?",
      options: ["Yes, fully verified", "No, I'm a solo investor", "I have family but no legal will"]
    }
  ];

  const handleAnswer = (answer: string) => {
    const newAnswers = { ...answers, [questions[step].id]: answer };
    setAnswers(newAnswers);
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      setShowResults(true);
    }
  };

  const getScore = () => {
    let score = 30; // Base score
    if (answers.guardian_status === "Yes, fully verified") score += 30;
    if (answers.asset_type === "Combined Assets") score += 20;
    if (answers.jurisdiction !== "Other / Global") score += 20;
    return Math.min(score, 100);
  };

  return (
    <div className="min-h-screen bg-page text-primary pt-24 pb-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-aurora opacity-30 pointer-events-none" />
      
      <SEO 
        title="Interactive Succession Planner | Transfer Legacy"
        description="Audit your digital estate readiness. Get a custom succession checklist and risk score in 2 minutes."
        canonicalUrl="https://transferlegacy.com/tools/planner"
      />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <motion.div {...fadeUp(0)} className="flex items-center justify-center gap-2 mb-4">
            <Sparkles size={16} className="text-brand-gold" />
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-gold">
              Sovereign Planning Engine
            </p>
          </motion.div>
          <motion.h1 {...fadeUp(0.1)} className="text-5xl md:text-7xl font-display font-bold tracking-tight mb-6">
            Legacy <span className="italic text-brand-primary">Audit</span>
          </motion.h1>
          <motion.p {...fadeUp(0.2)} className="text-secondary text-xl font-medium">
            Analyze your succession readiness in 60 seconds.
          </motion.p>
        </div>

        <div className="bg-surface/30 backdrop-blur-md border border-base/60 rounded-[40px] p-8 md:p-12 shadow-2xl">
          {!showResults ? (
            <AnimatePresence mode="wait">
              <motion.div 
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="flex items-center justify-between mb-8">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted">Question {step + 1} of {questions.length}</span>
                  <div className="flex gap-1">
                    {questions.map((_, i) => (
                      <div key={i} className={`h-1 w-8 rounded-full transition-colors ${i <= step ? 'bg-brand-primary' : 'bg-base/40'}`} />
                    ))}
                  </div>
                </div>

                <h2 className="text-3xl font-display font-bold text-primary mb-12">{questions[step].question}</h2>
                
                <div className="grid grid-cols-1 gap-4">
                  {questions[step].options.map((option, i) => (
                    <button
                      key={i}
                      onClick={() => handleAnswer(option)}
                      className="group flex items-center justify-between p-6 rounded-[24px] bg-page/60 border border-base/40 hover:border-brand-primary transition-all text-left"
                    >
                      <span className="text-lg font-bold text-secondary group-hover:text-primary transition-colors">{option}</span>
                      <div className="w-8 h-8 rounded-full border border-base/40 group-hover:bg-brand-primary group-hover:border-brand-primary flex items-center justify-center transition-all">
                        <ArrowRight size={14} className="text-muted group-hover:text-obsidian-950 transition-colors" />
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-primary/10 rounded-full border border-brand-primary/20 mb-8">
                <Target size={14} className="text-brand-primary" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-brand-primary">Audit Results Complete</span>
              </div>
              
              <div className="mb-12">
                <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-muted mb-4">Readiness Score</p>
                <div className="text-8xl md:text-9xl font-display font-bold text-primary leading-none tracking-tighter">
                  {getScore()}<span className="text-brand-primary">%</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 text-left">
                <div className="p-6 rounded-[32px] bg-page/60 border border-base/40">
                  <h4 className="flex items-center gap-2 text-brand-gold font-bold uppercase tracking-widest text-[10px] mb-4">
                    <AlertTriangle size={14} /> Immediate Risks
                  </h4>
                  <ul className="space-y-3">
                    <li className="text-[13px] text-secondary font-medium">• 0% Proof-of-Life verification active</li>
                    <li className="text-[13px] text-secondary font-medium">• No encrypted guardian handoff</li>
                    <li className="text-[13px] text-secondary font-medium">• {answers.jurisdiction} legal gap detected</li>
                  </ul>
                </div>
                <div className="p-6 rounded-[32px] bg-brand-primary/5 border border-brand-primary/20">
                  <h4 className="flex items-center gap-2 text-brand-primary font-bold uppercase tracking-widest text-[10px] mb-4">
                    <Zap size={14} /> Protocol Solution
                  </h4>
                  <ul className="space-y-3">
                    <li className="text-[13px] text-secondary font-medium">• Initialize Zero-Knowledge Vault</li>
                    <li className="text-[13px] text-secondary font-medium">• Setup Dead Man's Switch</li>
                    <li className="text-[13px] text-secondary font-medium">• Localize tax-efficient release</li>
                  </ul>
                </div>
              </div>

              <Button 
                onClick={() => navigate(isAuthenticated ? '/dashboard' : '/onboarding')}
                className="w-full h-16 rounded-[24px] bg-brand-primary text-obsidian-950 font-bold uppercase tracking-widest text-[11px] shadow-2xl shadow-brand-primary/20"
              >
                {isAuthenticated ? 'Go to Dashboard' : 'Finalize My Succession Plan'} <ArrowRight className="ml-2" size={16} />
              </Button>

              <button 
                onClick={() => { setShowResults(false); setStep(0); setAnswers({}); }}
                className="mt-8 text-[10px] font-bold uppercase tracking-widest text-muted hover:text-primary transition-colors"
              >
                Restart Audit
              </button>
            </motion.div>
          )}
        </div>

        {/* Informational Sections */}
        <div className="mt-32 space-y-32">
          <section className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="w-12 h-12 bg-brand-primary/10 rounded-2xl flex items-center justify-center text-brand-primary mb-8 border border-brand-primary/20">
                <FileText size={24} />
              </div>
              <h3 className="text-3xl font-display font-bold mb-6">Technical Notarization</h3>
              <p className="text-secondary font-medium leading-relaxed mb-8">
                Transfer Legacy acts as a technical notary for your digital wealth. We verify identity through multi-factor biometrics before any asset release occurs.
              </p>
              <div className="flex gap-4">
                <div className="px-4 py-2 bg-page border border-base/40 rounded-xl text-[10px] font-bold text-muted">ISO 27001 Certified</div>
                <div className="px-4 py-2 bg-page border border-base/40 rounded-xl text-[10px] font-bold text-muted">SOC2 Compliant</div>
              </div>
            </div>
            <div className="bg-surface/30 backdrop-blur-md border border-base/60 rounded-[40px] p-10">
               <div className="space-y-6">
                 {[
                   { label: "Asset Inventory", status: "Critical" },
                   { label: "Guardian Network", status: "Warning" },
                   { label: "Tax Optimization", status: "Missing" },
                   { label: "Legal Alignment", status: "Manual" }
                 ].map((item, i) => (
                   <div key={i} className="flex items-center justify-between p-4 bg-page/60 rounded-2xl border border-base/40">
                      <span className="text-sm font-bold text-secondary">{item.label}</span>
                      <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-md ${
                        item.status === 'Critical' ? 'bg-red-400/10 text-red-400' : 
                        item.status === 'Warning' ? 'bg-brand-gold/10 text-brand-gold' : 
                        'bg-muted/10 text-muted'
                      }`}>{item.status}</span>
                   </div>
                 ))}
               </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
