import { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import {
  Bot,
  ShieldAlert,
  Lightbulb,
  ShieldCheck,
  Send,
  Sparkles,
  AlertTriangle,
  ChevronRight,
  CheckCircle2,
  RotateCcw,
  Cpu
} from 'lucide-react';
import Card from '../components/ui/Card';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../utils/cn';
import { request } from '../lib/api';

interface Message {
  role: 'ai' | 'user';
  content: string;
  modelUsed?: string;
}

interface AiPlannerResponse {
  reply: string;
  suggested_actions?: string[];
  credential_redacted?: boolean;
  model_used?: string;
}

// Lightweight Markdown Renderer for estate advice
const FormattedAiContent = ({ text }: { text: string }) => {
  const lines = text.split('\n');

  return (
    <div className="space-y-2.5 text-sm leading-relaxed text-primary">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) {
          return <div key={idx} className="h-1" />;
        }

        // Note or backend connection warning
        if (trimmed.startsWith('*Note:') || trimmed.startsWith('Note:')) {
          return (
            <div
              key={idx}
              className="p-3 my-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 text-xs flex items-start gap-2.5"
            >
              <Info size={15} className="shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
              <div className="font-medium leading-relaxed">{trimmed.replace(/^\*|\*$/g, '')}</div>
            </div>
          );
        }

        // Alert box
        if (trimmed.startsWith('> ⚠️') || trimmed.startsWith('>')) {
          return (
            <div
              key={idx}
              className="p-3 my-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 text-xs flex items-start gap-2"
            >
              <AlertTriangle size={15} className="shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
              <div className="font-medium leading-relaxed">{trimmed.replace(/^>\s*/, '')}</div>
            </div>
          );
        }

        // Headings
        if (trimmed.startsWith('### ')) {
          return (
            <h4 key={idx} className="text-base font-bold text-primary mt-4 mb-2 font-display">
              {trimmed.replace('### ', '')}
            </h4>
          );
        }
        if (trimmed.startsWith('## ')) {
          return (
            <h3 key={idx} className="text-lg font-bold text-primary mt-4 mb-2 font-display">
              {trimmed.replace('## ', '')}
            </h3>
          );
        }

        // Bullet point
        if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
          const bulletContent = trimmed.substring(2);
          return (
            <div key={idx} className="flex items-start gap-2.5 ml-1">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-primary mt-2 shrink-0" />
              <div className="text-primary leading-relaxed">{renderFormattedInline(bulletContent)}</div>
            </div>
          );
        }

        // Numbered list
        const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
        if (numMatch) {
          return (
            <div key={idx} className="flex items-start gap-2.5 ml-1">
              <span className="text-[11px] font-bold text-brand-primary min-w-[16px] mt-0.5">
                {numMatch[1]}.
              </span>
              <div className="text-primary leading-relaxed">{renderFormattedInline(numMatch[2])}</div>
            </div>
          );
        }

        return <p key={idx} className="text-primary leading-relaxed">{renderFormattedInline(trimmed)}</p>;
      })}
    </div>
  );
};

function renderFormattedInline(content: string) {
  // Parse **bold** and *italic* formatting
  const parts = content.split(/(\*\*.*?\*\*|\*.*?\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={index} className="text-primary font-bold">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
      return (
        <em key={index} className="italic text-secondary">
          {part.slice(1, -1)}
        </em>
      );
    }
    return part;
  });
}

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 15 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { delay, duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
});

const STORAGE_KEY = 'tl_ai_planner_chat_history';

export default function AIPlanner() {
  const navigate = useNavigate();
  const { user, assets, guardians } = useStore();

  const confirmedCount = useMemo(
    () => guardians.filter((g) => g.status === 'Confirmed').length,
    [guardians]
  );
  const missingInstructions = useMemo(
    () => assets.filter((a) => !a.instructions).length,
    [assets]
  );
  const assetsWithBeneficiary = useMemo(
    () => assets.filter((a) => a.beneficiaryId).length,
    [assets]
  );

  const defaultGreeting: Message = useMemo(
    () => ({
      role: 'ai',
      content: `Greetings ${
        user?.name ? user.name.split(' ')[0] : 'Member'
      }. I am your sovereign succession advisor. Your current Legacy Health Score is ${
        user?.score ?? 80
      }%. I have analyzed your vault (${assets.length} assets, ${confirmedCount} confirmed guardians). How can I assist your estate protocol today?`,
    }),
    [user?.name, user?.score, assets.length, confirmedCount]
  );

  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return [defaultGreeting];
  });

  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [modelIndicator, setModelIndicator] = useState<string>('Gemini 2.5 Flash');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {
      // ignore
    }
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const clearChat = () => {
    setMessages([defaultGreeting]);
    localStorage.removeItem(STORAGE_KEY);
  };

  const executeQuery = async (queryText: string) => {
    if (!queryText.trim() || isTyping) return;

    const trimmed = queryText.trim();
    const newHistory: Message[] = [...messages, { role: 'user', content: trimmed }];
    setMessages(newHistory);
    setInputVal('');
    setIsTyping(true);

    try {
      const response = await request<AiPlannerResponse>('/ai/planner/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: trimmed,
          history: newHistory.slice(-6).map((m) => ({
            role: m.role,
            content: m.content,
          })),
          context: {
            score: user?.score ?? 80,
            assetCount: assets.length,
            confirmedGuardians: confirmedCount,
            missingInstructions: missingInstructions,
            totalGuardians: guardians.length,
          },
        }),
        skipAead: true,
      });

      const payload = (response as any)?.data || response;
      if (payload && payload.reply) {
        if (payload.model_used) {
          setModelIndicator(
            payload.model_used.includes('gemini') ? 'Gemini 2.0 Flash' : 'Transfer Legacy Engine'
          );
        }
        setMessages((prev) => [
          ...prev,
          {
            role: 'ai',
            content: payload.reply,
            modelUsed: payload.model_used,
          },
        ]);
      } else {
        throw new Error('Empty response received from planner');
      }
    } catch (err: unknown) {
      console.error('[AI Planner] Backend request failed:', err);
      // Client-side graceful fallback if backend is unreachable or during network hiccups
      setMessages((prev) => [
        ...prev,
        {
          role: 'ai',
          content: `### Sovereign Legacy Analysis\n\nI reviewed your request regarding: *"${trimmed}"*\n\n* **Vault Assets:** ${assets.length} items logged\n* **Quorum Integrity:** ${confirmedCount} confirmed guardian(s)\n* **Action Item:** ${
            missingInstructions > 0
              ? `Hardening recovery instructions for **${missingInstructions} incomplete asset(s)** is strongly advised.`
              : 'All registered assets have recovery instructions documented.'
          }\n\n*Note: Connect to the backend with an active internet connection for live Gemini 2.5 synthesis.*`,
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    executeQuery(inputVal);
  };

  const handleActionClick = (action: string) => {
    const promptMap: Record<string, string> = {
      'Analyze Gaps': 'Analyze the security and succession gaps in my vault protocol.',
      'Generate Mandates': 'Generate legal and digital mandate recommendations for my designated heirs.',
      'Risk Assessment': 'Perform a comprehensive risk assessment of my guardian quorum and secret recovery keys.',
      'Legal Audit': 'What legal probate and digital executor considerations apply to my assets?',
    };

    const prompt = promptMap[action] || `Run advisory protocol for: ${action}`;
    executeQuery(prompt);
  };

  // Safe percentage calculations preventing NaN%
  const assetSynthesisPct =
    assets.length > 0 ? Math.round(((assets.length - missingInstructions) / assets.length) * 100) : 0;
  const guardianQuorumPct =
    guardians.length > 0 ? Math.round((confirmedCount / guardians.length) * 100) : 0;
  const mandateCoveragePct =
    assets.length > 0 ? Math.round((assetsWithBeneficiary / assets.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-page text-primary selection:bg-brand-primary/30 pt-8">
      <main className="px-4 sm:px-6 lg:px-8 pb-24 md:pb-12 max-w-7xl mx-auto space-y-8">
        {/* ── Page Header ── */}
        <motion.header {...fadeUp(0)} className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <div className="absolute inset-0 bg-brand-primary/20 blur-xl rounded-full" />
              <motion.div
                animate={{
                  boxShadow: [
                    '0 0 10px rgba(75,174,130,0.3)',
                    '0 0 35px rgba(75,174,130,0.6)',
                    '0 0 10px rgba(75,174,130,0.3)',
                  ],
                }}
                transition={{ repeat: Infinity, duration: 3 }}
                className="w-14 h-14 bg-brand-primary text-white rounded-2xl flex items-center justify-center relative z-10 shadow-lg"
              >
                <Bot size={32} />
              </motion.div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-brand-primary animate-pulse" />
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-primary">
                  Cognitive Legacy Synthesis
                </p>
              </div>
              <h1 className="text-3xl sm:text-4xl font-display font-bold text-primary tracking-tight leading-none">
                Institutional <span className="italic text-brand-primary">Legacy Planner</span>
              </h1>
              <p className="text-muted text-sm mt-2 font-medium">
                Powered by {modelIndicator} · Sovereign Zero-Knowledge Estate Advisor
              </p>
            </div>
          </div>

          <button
            onClick={clearChat}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-surface/80 border border-base text-xs font-semibold text-muted hover:text-primary hover:border-base/80 transition-all active:scale-95"
            title="Reset conversation"
          >
            <RotateCcw size={14} />
            <span>Reset Session</span>
          </button>
        </motion.header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* ── Chat Container ── */}
          <motion.div
            {...fadeUp(0.2)}
            className="lg:col-span-2 flex flex-col h-[650px] bg-surface/40 border border-base/60 rounded-[32px] overflow-hidden backdrop-blur-md relative shadow-2xl"
          >
            <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 scrollbar-hide">
              <AnimatePresence initial={false}>
                {messages.map((msg, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 15, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[88%] p-6 rounded-3xl font-medium leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-brand-primary text-white dark:text-obsidian-950 rounded-br-none shadow-lg shadow-brand-primary/10'
                          : 'bg-surface/90 border border-base text-primary rounded-bl-none shadow-sm'
                      }`}
                    >
                      {msg.role === 'ai' ? (
                        <FormattedAiContent text={msg.content} />
                      ) : (
                        <p className="text-sm font-semibold">{msg.content}</p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {isTyping && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                  <div className="bg-page/50 border border-base/80 px-5 py-4 rounded-3xl rounded-bl-none flex items-center space-x-2">
                    <span className="text-xs text-muted font-medium mr-2">Synthesizing protocols</span>
                    <motion.div
                      animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                      transition={{ repeat: Infinity, duration: 1, delay: 0 }}
                      className="w-1.5 h-1.5 rounded-full bg-brand-primary"
                    />
                    <motion.div
                      animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                      transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                      className="w-1.5 h-1.5 rounded-full bg-brand-primary"
                    />
                    <motion.div
                      animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                      transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
                      className="w-1.5 h-1.5 rounded-full bg-brand-primary"
                    />
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* ── Chat Input ── */}
            <div className="p-6 border-t border-base/60 bg-page/40">
              <div className="flex flex-wrap gap-2 mb-4">
                {[
                  { label: 'Analyze Gaps', icon: Sparkles },
                  { label: 'Generate Mandates', icon: Bot },
                  { label: 'Risk Assessment', icon: AlertTriangle },
                  { label: 'Legal Audit', icon: ShieldCheck },
                ].map((action, i) => (
                  <button
                    key={i}
                    onClick={() => handleActionClick(action.label)}
                    disabled={isTyping}
                    className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-surface border border-base text-[10px] font-bold uppercase tracking-widest text-muted hover:text-brand-primary hover:border-brand-primary/50 transition-all active:scale-95 disabled:opacity-50"
                  >
                    <action.icon size={12} />
                    {action.label}
                  </button>
                ))}
              </div>

              <form onSubmit={handleSend} className="relative group">
                <input
                  type="text"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  placeholder="Ask advisor about inheritance protocols, Shamir's threshold, probate..."
                  disabled={isTyping}
                  className="w-full bg-surface border border-base rounded-2xl pl-6 pr-14 py-4 text-primary focus:outline-none focus:border-brand-primary/50 focus:ring-1 focus:ring-brand-primary/30 text-sm font-medium transition-all placeholder:text-muted/60"
                />
                <button
                  type="submit"
                  disabled={!inputVal.trim() || isTyping}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-brand-primary text-white rounded-xl hover:opacity-90 disabled:opacity-40 transition-all shadow-lg active:scale-95"
                  aria-label="Send message"
                >
                  <Send size={18} />
                </button>
              </form>
            </div>
          </motion.div>

          {/* ── Sidebar Metrics & Real Intelligence Feed ── */}
          <div className="space-y-8">
            <motion.div {...fadeUp(0.3)}>
              <Card className="flex flex-col items-center justify-center p-8 text-center bg-surface/50 border border-base/60 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted mb-6">
                  Legacy Protocol Health
                </h3>

                <div className="relative w-36 h-36 flex items-center justify-center mb-6">
                  <svg className="transform -rotate-90 w-full h-full">
                    <circle
                      cx="72"
                      cy="72"
                      r="60"
                      stroke="currentColor"
                      strokeWidth="6"
                      fill="transparent"
                      className="text-border-base dark:text-obsidian-800"
                    />
                    <motion.circle
                      cx="72"
                      cy="72"
                      r="60"
                      stroke="var(--color-brand-primary, #1C6B4A)"
                      strokeWidth="6"
                      fill="transparent"
                      strokeDasharray={Math.PI * 120}
                      initial={{ strokeDashoffset: Math.PI * 120 }}
                      animate={{
                        strokeDashoffset: (Math.PI * 120) * (1 - (user?.score ?? 80) / 100),
                      }}
                      transition={{ duration: 1.5, ease: 'easeOut' }}
                      className="drop-shadow-[0_0_15px_rgba(75,174,130,0.4)]"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-4xl font-digits font-bold text-primary">
                      {user?.score ?? 80}
                    </span>
                    <span className="text-[9px] font-bold text-muted uppercase tracking-widest mt-0.5">
                      Sovereign Index
                    </span>
                  </div>
                </div>

                <div className="w-full space-y-3">
                  {[
                    {
                      label: 'Asset Synthesis',
                      value: `${assetSynthesisPct}%`,
                      color: 'text-brand-primary',
                    },
                    {
                      label: 'Guardian Quorum',
                      value: `${guardianQuorumPct}%`,
                      color: 'text-amber-500',
                    },
                    {
                      label: 'Mandate Coverage',
                      value: `${mandateCoveragePct}%`,
                      color: 'text-trust-500',
                    },
                  ].map((m, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest"
                    >
                      <span className="text-muted">{m.label}</span>
                      <span className={cn(m.color, 'font-digits')}>{m.value}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* ── Dynamic Intelligence Feed ── */}
            <div className="space-y-4">
              {confirmedCount < 2 && (
                <motion.div
                  {...fadeUp(0.4)}
                  className="p-5 rounded-3xl border border-red-500/20 bg-red-500/5 flex items-start gap-4 group hover:bg-red-500/10 transition-all"
                >
                  <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center shrink-0">
                    <ShieldAlert className="text-red-500" size={18} />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xs font-bold text-primary uppercase tracking-widest mb-1 group-hover:text-red-400 transition-colors">
                      Quorum Threshold Vulnerability
                    </h4>
                    <p className="text-[10px] text-muted font-medium leading-relaxed mb-3">
                      You have {confirmedCount} active guardian(s). A minimum of 2 confirmed guardians is required
                      to establish a Shamir split recovery path.
                    </p>
                    <button
                      onClick={() => navigate('/guardians')}
                      className="text-[9px] font-bold text-red-500 uppercase tracking-[0.2em] flex items-center group-hover:translate-x-1 transition-transform"
                    >
                      Configure Guardians <ChevronRight size={10} className="ml-1" />
                    </button>
                  </div>
                </motion.div>
              )}

              {missingInstructions > 0 && (
                <motion.div
                  {...fadeUp(0.5)}
                  className="p-5 rounded-3xl border border-amber-500/20 bg-amber-500/5 flex items-start gap-4 group hover:bg-amber-500/10 transition-all"
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
                    <Lightbulb className="text-amber-500" size={18} />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xs font-bold text-primary uppercase tracking-widest mb-1 group-hover:text-amber-400 transition-colors">
                      Incomplete Recovery Steps
                    </h4>
                    <p className="text-[10px] text-muted font-medium leading-relaxed mb-3">
                      {missingInstructions} vault item(s) lack decrypted succession instructions for your designated heirs.
                    </p>
                    <button
                      onClick={() => navigate('/assets')}
                      className="text-[9px] font-bold text-amber-500 uppercase tracking-[0.2em] flex items-center group-hover:translate-x-1 transition-transform"
                    >
                      Update Instructions <ChevronRight size={10} className="ml-1" />
                    </button>
                  </div>
                </motion.div>
              )}

              <motion.div
                {...fadeUp(0.6)}
                className="p-5 rounded-3xl border border-brand-primary/20 bg-brand-primary/5 flex items-start gap-4 group hover:bg-brand-primary/10 transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center shrink-0">
                  <Cpu className="text-brand-primary" size={18} />
                </div>
                <div className="flex-1">
                  <h4 className="text-xs font-bold text-primary uppercase tracking-widest mb-1 group-hover:text-brand-primary transition-colors">
                    Zero-Knowledge Privacy
                  </h4>
                  <p className="text-[10px] text-muted font-medium leading-relaxed mb-3">
                    Your queries are processed through our zero-knowledge redaction engine. Mnemonic phrases and private keys are never transmitted.
                  </p>
                  <button
                    onClick={() => navigate('/capsules')}
                    className="text-[9px] font-bold text-brand-primary uppercase tracking-[0.2em] flex items-center group-hover:translate-x-1 transition-transform"
                  >
                    Manage Time Capsules <ChevronRight size={10} className="ml-1" />
                  </button>
                </div>
              </motion.div>

              {confirmedCount >= 2 && missingInstructions === 0 && (
                <motion.div
                  {...fadeUp(0.7)}
                  className="p-5 rounded-3xl border border-green-500/20 bg-green-500/5 flex items-start gap-4 group hover:bg-green-500/10 transition-all"
                >
                  <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="text-green-500" size={18} />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xs font-bold text-primary uppercase tracking-widest mb-1 group-hover:text-green-400 transition-colors">
                      Core Protocol Hardened
                    </h4>
                    <p className="text-[10px] text-muted font-medium leading-relaxed">
                      Your recovery quorum and succession instructions meet institutional redundancy standards.
                    </p>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
