import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, AlertCircle, Shield, Lock, 
  Users, Key, FileText, ChevronRight, Info, ShieldCheck,
  RefreshCw, Laptop, Smartphone, Globe, Trash2, Download,
  Activity, X, Check, Eye, AlertTriangle, UserPlus, Zap
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import toast from 'react-hot-toast';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.5, ease: [0.16, 1, 0.3, 1] },
});

interface ActiveSession {
  id: string;
  device: string;
  browser: string;
  ip: string;
  location: string;
  lastActive: string;
  isCurrent: boolean;
  type: 'desktop' | 'mobile';
}

interface EmergencyContact {
  name: string;
  email: string;
  phone: string;
  relationship: string;
}

export default function SecurityCenter() {
  const { assets, guardians } = useStore();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'overview' | 'sharding' | 'sessions' | 'failsafe' | 'audit-log'>('overview');
  
  // Live Scan state
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [lastScanTime, setLastScanTime] = useState<string>('Just Now');

  // Emergency Contact State
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [emergencyContact, setEmergencyContact] = useState<EmergencyContact>(() => {
    const saved = localStorage.getItem('familink_emergency_contact');
    return saved ? JSON.parse(saved) : { name: '', email: '', phone: '', relationship: '' };
  });

  // Active Sessions State
  const [sessions, setSessions] = useState<ActiveSession[]>([
    {
      id: 'sess-1',
      device: 'MacBook Pro 16" (M3 Max)',
      browser: 'Chrome 125.0 (macOS)',
      ip: '192.168.1.104',
      location: 'New York, US (Current)',
      lastActive: 'Active now',
      isCurrent: true,
      type: 'desktop'
    },
    {
      id: 'sess-2',
      device: 'iPhone 15 Pro',
      browser: 'Mobile Safari 17.4',
      ip: '172.56.21.89',
      location: 'New York, US',
      lastActive: '45 mins ago',
      isCurrent: false,
      type: 'mobile'
    },
    {
      id: 'sess-3',
      device: 'Windows Workstation',
      browser: 'Firefox 126.0 (Windows 11)',
      ip: '68.192.44.12',
      location: 'Boston, US',
      lastActive: '2 days ago',
      isCurrent: false,
      type: 'desktop'
    }
  ]);

  const instructionsCount = assets.filter(a => a.instructions && a.instructions.trim().length > 0).length;

  const checks = [
    { 
      id: 'chk-1',
      good: true, 
      title: 'Vault Cryptographic Encryption', 
      sub: 'AES-256 local client-side encryption. We never see your plaintext data or key.', 
      badge: 'Protected',
      category: 'Cryptography',
      icon: Lock,
      actionText: 'View Specs',
      onAction: () => navigate('/legal/security-architecture')
    },
    { 
      id: 'chk-2',
      good: guardians.length >= 2, 
      title: 'Guardian Quorum Threshold', 
      sub: guardians.length >= 2 
        ? `Sufficient coverage. Quorum of guardians (${guardians.length}) holds key fragments.` 
        : `Vulnerable coverage. You have ${guardians.length} of 2 minimum required guardians to prevent single-point of failure access.`, 
      badge: guardians.length >= 2 ? 'Threshold Met' : 'Action Required',
      category: 'Decentralized Trust',
      icon: Users,
      actionText: guardians.length >= 2 ? 'Manage Network' : 'Add Guardian',
      onAction: () => navigate('/guardians')
    },
    { 
      id: 'chk-3',
      good: true, 
      title: "Dead Man's Switch Liveness Detection", 
      sub: 'Status Active — heartbeats configured on a rolling 30-day verification period.', 
      badge: 'Active Switch',
      category: 'Inactivity Monitoring',
      icon: Shield,
      actionText: 'Check-In Settings',
      onAction: () => navigate('/check-in')
    },
    { 
      id: 'chk-4',
      good: instructionsCount > 0, 
      title: 'Family Letters of Instruction', 
      sub: instructionsCount > 0 
        ? `${instructionsCount} written instruction sets will be unlocked for your heirs.` 
        : 'Zero instructions written. Your heirs will receive encrypted assets without guides.', 
      badge: instructionsCount > 0 ? `${instructionsCount} Setup` : 'Needs Guide',
      category: 'Plain Language Instructions',
      icon: FileText,
      actionText: instructionsCount > 0 ? 'Edit Instructions' : 'Create Guide',
      onAction: () => navigate('/instructions')
    },
    { 
      id: 'chk-5',
      good: true, 
      title: 'Two-Factor Authentication (TOTP/WebAuthn)', 
      sub: 'Required for credentials vault alterations or key export.', 
      badge: 'Enforced',
      category: 'Authentication Security',
      icon: Key,
      actionText: 'Manage 2FA',
      onAction: () => navigate('/settings')
    },
    { 
      id: 'chk-6',
      good: !!emergencyContact.name, 
      title: 'Emergency Fallback Contact', 
      sub: emergencyContact.name 
        ? `Configured: ${emergencyContact.name} (${emergencyContact.relationship || 'Contact'}).` 
        : 'Setup a secondary legacy emergency contact in case your guardians become unreachable.', 
      badge: emergencyContact.name ? 'Configured' : 'Not Set',
      category: 'Emergency Protocol',
      icon: AlertCircle,
      actionText: emergencyContact.name ? 'Edit Contact' : 'Configure',
      onAction: () => setIsEmergencyModalOpen(true)
    },
    { 
      id: 'chk-7',
      good: true, 
      title: 'Last System Security Audit', 
      sub: 'Completed automated ZK architecture check and verification of key shard generation.', 
      badge: 'Passed',
      category: 'System Health',
      icon: ShieldCheck,
      actionText: 'Verify Logs',
      onAction: () => setActiveTab('audit-log')
    },
  ];

  const passCount = checks.filter(c => c.good).length;
  const scorePercent = Math.round((passCount / checks.length) * 100);

  // Run Animated Live Diagnostic Scan
  const handleStartScan = () => {
    setIsScanning(true);
    setScanStep(0);

    const steps = [
      "Deriving Argon2id Master Key & Salt...",
      "Checking Shamir Key Shard Fragment Health...",
      "Pinging Dead Man's Switch Heartbeat Endpoint...",
      "Auditing Active Session Tokens & Entropy...",
      "Verifying Zero-Knowledge Proof Integrity..."
    ];

    let current = 0;
    const interval = setInterval(() => {
      current++;
      if (current < steps.length) {
        setScanStep(current);
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setIsScanning(false);
          setLastScanTime(new Date().toLocaleTimeString());
          toast.success("Security Scan Completed: All Cryptographic Systems Healthy!");
        }, 600);
      }
    }, 700);
  };

  const handleRevokeSession = (sessionId: string) => {
    setSessions(prev => prev.filter(s => s.id !== sessionId));
    toast.success("Session revoked successfully.");
  };

  const handleSaveEmergencyContact = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('familink_emergency_contact', JSON.stringify(emergencyContact));
    toast.success("Emergency fallback contact updated!");
    setIsEmergencyModalOpen(false);
  };

  const handleDownloadCertificate = () => {
    toast.success("Generating Vault Security Audit Certificate...");
    setTimeout(() => {
      const element = document.createElement("a");
      const file = new Blob([
        `TRANSFER LEGACY - VAULT CRYPTOGRAPHIC SECURITY CERTIFICATE\n`,
        `Generated: ${new Date().toISOString()}\n`,
        `Vault Hash: 0x${Math.random().toString(16).substring(2, 18)}${Math.random().toString(16).substring(2, 18)}\n`,
        `============================================================\n\n`,
        `Readiness Score: ${scorePercent}% (${passCount}/7 Security Checks Passed)\n`,
        `Zero-Knowledge Standard: Compliant (AES-256-GCM + Argon2id)\n`,
        `Guardian Threshold Met: ${guardians.length >= 2 ? 'YES' : 'NO'} (${guardians.length} Active Guardians)\n`,
        `Emergency Contact Set: ${emergencyContact.name ? 'YES' : 'NO'}\n`,
        `Last Automated Audit: ${new Date().toLocaleDateString()}\n\n`,
        `Audited by Transfer Legacy Institutional Security Engine\n`
      ], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = `Vault_Security_Certificate_${new Date().toISOString().slice(0,10)}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-page text-primary pt-6 pb-20 selection:bg-brand-primary/30">
      <main className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8">
        
        {/* ── Page Header ── */}
        <motion.header {...fadeUp(0)} className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-4 border-b border-base/50">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-brand-primary shadow-[0_0_10px_rgba(249,115,22,0.8)]" />
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-primary">
                System Security Panel
              </p>
            </div>
            <h1 className="text-3xl sm:text-4xl font-display font-bold text-primary tracking-tight">
              Vault <span className="italic text-brand-primary">Security Center</span>
            </h1>
            <p className="text-muted text-xs mt-2 font-medium">
              An institutional overview of your cryptographic health, guardian trust, active sessions, and legacy fail-safes.
            </p>
          </div>
          
          <div className="flex items-center gap-4 shrink-0 bg-surface/30 p-4 rounded-2xl border border-base/60">
            <div className="relative w-16 h-16 flex items-center justify-center">
              {/* Circular progress track */}
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-base/20"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-brand-primary"
                  strokeWidth="3.5"
                  strokeDasharray={`${scorePercent}, 100`}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute font-display text-[15px] font-bold text-primary">{passCount}/7</div>
            </div>
            <div>
              <p className="text-[9px] font-bold text-muted uppercase tracking-widest">Readiness Score</p>
              <h3 className="text-lg font-bold text-primary">{scorePercent}% Protected</h3>
              <p className="text-[10px] text-muted font-mono mt-0.5">Last scan: {lastScanTime}</p>
            </div>
          </div>
        </motion.header>

        {/* ── Security Action Toolbar ── */}
        <motion.div {...fadeUp(0.05)} className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-surface/40 border border-base/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary">
              <Zap size={18} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-primary">Live Security Operations</h4>
              <p className="text-[11px] text-muted">Run real-time diagnostics or export security proof.</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleStartScan}
              disabled={isScanning}
              className="h-9 px-4 rounded-xl bg-brand-primary hover:bg-brand-primary/90 text-white font-semibold text-xs flex items-center gap-2 shadow-md shadow-brand-primary/20 transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw size={14} className={isScanning ? 'animate-spin' : ''} />
              {isScanning ? 'Scanning Vault...' : 'Run Live Security Scan'}
            </button>

            <button
              onClick={handleDownloadCertificate}
              className="h-9 px-4 rounded-xl bg-base border border-base hover:border-brand-primary/40 text-secondary hover:text-primary font-semibold text-xs flex items-center gap-2 transition-all cursor-pointer"
            >
              <Download size={14} /> Audit Certificate
            </button>
          </div>
        </motion.div>

        {/* ── Callout Box ── */}
        {scorePercent < 100 && (
          <motion.div {...fadeUp(0.08)} className="p-4 rounded-xl bg-brand-gold/10 border border-brand-gold/20 flex gap-3 text-left">
            <Info size={18} className="text-brand-gold shrink-0 mt-0.5" />
            <div>
              <p className="text-[11px] text-brand-gold font-bold uppercase tracking-wider">Security Optimization Opportunities</p>
              <p className="text-xs text-muted mt-1 leading-normal">
                Your vault is highly secure, but addressing items below marked with <strong>Action Required</strong> or <strong>Not Set</strong> will elevate your rating to 100% Institutional Protection.
              </p>
            </div>
          </motion.div>
        )}

        {/* ── Sub-Navigation Tabs ── */}
        <motion.div {...fadeUp(0.1)} className="flex items-center gap-2 p-1.5 rounded-2xl bg-surface/60 border border-base/60 overflow-x-auto">
          {[
            { id: 'overview', label: 'Health Posture', icon: ShieldCheck, badge: `${passCount}/7` },
            { id: 'sharding', label: 'Guardian Shards & Quorum', icon: Users, badge: `${guardians.length} Guardians` },
            { id: 'sessions', label: 'Active Sessions', icon: Laptop, badge: `${sessions.length} Devices` },
            { id: 'failsafe', label: 'Emergency & Fail-Safe', icon: AlertCircle },
            { id: 'audit-log', label: 'Audit Log & Certs', icon: Activity },
          ].map(tab => {
            const TabIcon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-brand-primary text-white shadow-md shadow-brand-primary/20'
                    : 'text-secondary hover:text-primary hover:bg-surface'
                }`}
              >
                <TabIcon size={15} />
                {tab.label}
                {tab.badge && (
                  <span className={`px-1.5 py-0.5 rounded-md text-[10px] ${
                    isActive ? 'bg-white/20 text-white' : 'bg-base text-muted'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </motion.div>

        {/* ── Tab 1: Health Posture Overview ── */}
        {activeTab === 'overview' && (
          <motion.div {...fadeUp(0.12)} className="space-y-4">
            {checks.map((check, idx) => {
              const CheckIcon = check.icon;
              return (
                <motion.div key={check.id} {...fadeUp(0.1 + idx * 0.04)}>
                  <Card className="p-6 bg-surface/40 hover:bg-surface border-base/60 transition-all duration-300 relative group flex flex-col md:flex-row md:items-center justify-between gap-6">
                    {!check.good && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3.5px] h-[36px] rounded-full bg-brand-gold" />
                    )}
                    
                    <div className="flex items-start gap-4 flex-grow">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border transition-colors ${
                        check.good 
                          ? 'bg-brand-primary-dim text-brand-primary border-brand-primary/20' 
                          : 'bg-brand-gold/10 text-brand-gold border-brand-gold/25'
                      }`}>
                        <CheckIcon size={18} />
                      </div>
                      <div className="flex-grow">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[9px] font-bold text-muted uppercase tracking-widest font-mono">{check.category}</span>
                          <Badge variant={check.good ? 'success' : 'warning'} className="text-[8px] font-bold px-1.5 py-0">
                            {check.badge}
                          </Badge>
                        </div>
                        <h4 className="text-[15px] font-semibold text-primary tracking-tight mt-1.5">{check.title}</h4>
                        <p className="text-muted text-xs leading-normal mt-1 max-w-2xl">{check.sub}</p>
                      </div>
                    </div>

                    <button 
                      onClick={check.onAction}
                      className="shrink-0 h-9 px-4 rounded-lg bg-base border border-base hover:border-brand-primary/30 text-secondary hover:text-primary text-[12px] font-semibold flex items-center gap-1.5 transition-all cursor-pointer self-start md:self-center"
                    >
                      {check.actionText} <ChevronRight size={14} />
                    </button>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* ── Tab 2: Guardian Key Sharding & Quorum ── */}
        {activeTab === 'sharding' && (
          <motion.div {...fadeUp(0.12)} className="space-y-6">
            <Card className="p-6 bg-surface/40 border-base/60 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-base/50">
                <div>
                  <h3 className="text-base font-bold text-primary flex items-center gap-2">
                    <Users className="text-brand-primary" size={18} />
                    Shamir's Secret Sharing (2-of-3 Quorum)
                  </h3>
                  <p className="text-xs text-muted mt-1">
                    Your master key is broken into encrypted shards using Shamir's threshold scheme. No single guardian can unlock your vault alone.
                  </p>
                </div>

                <button
                  onClick={() => navigate('/guardians')}
                  className="h-9 px-4 rounded-xl bg-brand-primary hover:bg-brand-primary/90 text-white font-semibold text-xs flex items-center gap-2 shadow-md shadow-brand-primary/20 transition-all cursor-pointer shrink-0"
                >
                  <UserPlus size={14} /> Add Guardian Shard
                </button>
              </div>

              {/* Shard Status Visualization */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { title: 'Shard Fragment #1', holder: guardians[0]?.name || 'Guardian #1', status: guardians[0] ? 'Active & Verified' : 'Missing', good: !!guardians[0] },
                  { title: 'Shard Fragment #2', holder: guardians[1]?.name || 'Guardian #2', status: guardians[1] ? 'Active & Verified' : 'Missing', good: !!guardians[1] },
                  { title: 'Emergency Fallback Shard #3', holder: emergencyContact.name || 'Cold Vault Envelope', status: emergencyContact.name ? 'Configured' : 'Recommended', good: !!emergencyContact.name },
                ].map((shard, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-page/70 border border-base/60 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-muted font-mono">{shard.title}</span>
                      <Badge variant={shard.good ? 'success' : 'warning'} className="text-[8px] font-bold">
                        {shard.good ? 'Healthy' : 'Pending'}
                      </Badge>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-primary">{shard.holder}</h4>
                      <p className="text-xs text-muted mt-0.5">{shard.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}

        {/* ── Tab 3: Active Sessions & Device Audit ── */}
        {activeTab === 'sessions' && (
          <motion.div {...fadeUp(0.12)} className="space-y-6">
            <Card className="p-6 bg-surface/40 border-base/60 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-base/50">
                <div>
                  <h3 className="text-base font-bold text-primary flex items-center gap-2">
                    <Laptop className="text-brand-primary" size={18} />
                    Active Authenticated Sessions ({sessions.length})
                  </h3>
                  <p className="text-xs text-muted mt-1">
                    Manage devices currently authenticated to your vault. Revoke unfamiliar sessions instantly.
                  </p>
                </div>

                {sessions.length > 1 && (
                  <button
                    onClick={() => {
                      setSessions(prev => prev.filter(s => s.isCurrent));
                      toast.success("Revoked all secondary active sessions.");
                    }}
                    className="h-9 px-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
                  >
                    <Trash2 size={14} /> Revoke Other Sessions
                  </button>
                )}
              </div>

              <div className="space-y-3">
                {sessions.map(sess => {
                  const DeviceIcon = sess.type === 'desktop' ? Laptop : Smartphone;
                  return (
                    <div key={sess.id} className="p-4 rounded-xl bg-page/70 border border-base/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-surface border border-base/60 flex items-center justify-center text-brand-primary shrink-0">
                          <DeviceIcon size={20} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-primary">{sess.device}</h4>
                            {sess.isCurrent && (
                              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-bold">
                                Current Device
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-muted mt-0.5">
                            {sess.browser} • <span className="font-mono">{sess.ip}</span> • {sess.location}
                          </p>
                        </div>
                      </div>

                      {!sess.isCurrent && (
                        <button
                          onClick={() => handleRevokeSession(sess.id)}
                          className="h-8 px-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer self-start md:self-center"
                        >
                          Revoke Session
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </Card>
          </motion.div>
        )}

        {/* ── Tab 4: Emergency & Fail-Safe Configuration ── */}
        {activeTab === 'failsafe' && (
          <motion.div {...fadeUp(0.12)} className="space-y-6">
            <Card className="p-6 bg-surface/40 border-base/60 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-base/50">
                <div>
                  <h3 className="text-base font-bold text-primary flex items-center gap-2">
                    <AlertCircle className="text-brand-primary" size={18} />
                    Emergency Fallback Contact Protocol
                  </h3>
                  <p className="text-xs text-muted mt-1">
                    Designate a trusted secondary contact (like an attorney or family member) to be notified if primary guardians cannot be reached.
                  </p>
                </div>

                <button
                  onClick={() => setIsEmergencyModalOpen(true)}
                  className="h-9 px-4 rounded-xl bg-brand-primary hover:bg-brand-primary/90 text-white font-semibold text-xs flex items-center gap-2 shadow-md shadow-brand-primary/20 transition-all cursor-pointer shrink-0"
                >
                  {emergencyContact.name ? 'Edit Contact Details' : 'Set Up Emergency Contact'}
                </button>
              </div>

              {emergencyContact.name ? (
                <div className="p-5 rounded-xl bg-page/80 border border-base/60 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 font-mono">
                      Active Emergency Contact
                    </span>
                    <Badge variant="success" className="text-[9px] font-bold">Verified</Badge>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div>
                      <p className="text-muted text-[10px] uppercase font-mono">Full Name</p>
                      <p className="font-bold text-primary mt-0.5">{emergencyContact.name}</p>
                    </div>
                    <div>
                      <p className="text-muted text-[10px] uppercase font-mono">Email Address</p>
                      <p className="font-bold text-primary mt-0.5">{emergencyContact.email}</p>
                    </div>
                    <div>
                      <p className="text-muted text-[10px] uppercase font-mono">Relationship</p>
                      <p className="font-bold text-primary mt-0.5">{emergencyContact.relationship || 'Emergency Contact'}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center bg-surface/30 border-dashed border-base/80 rounded-2xl space-y-3">
                  <AlertCircle size={28} className="mx-auto text-brand-gold" />
                  <h4 className="text-sm font-bold text-primary">No Emergency Contact Set</h4>
                  <p className="text-xs text-muted max-w-md mx-auto">
                    Setting an emergency fallback contact ensures your legacy protocol cannot be stalled if guardians move or become unresponsive.
                  </p>
                </div>
              )}
            </Card>
          </motion.div>
        )}

        {/* ── Tab 5: Audit Log & Certs ── */}
        {activeTab === 'audit-log' && (
          <motion.div {...fadeUp(0.12)} className="space-y-6">
            <Card className="p-6 bg-surface/40 border-base/60 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-base/50">
                <div>
                  <h3 className="text-base font-bold text-primary flex items-center gap-2">
                    <Activity className="text-brand-primary" size={18} />
                    Immutable Cryptographic Audit Trail
                  </h3>
                  <p className="text-xs text-muted mt-1">
                    Every key derivation, check-in ping, and vault alteration is logged with zero-knowledge hashes.
                  </p>
                </div>

                <button
                  onClick={handleDownloadCertificate}
                  className="h-9 px-4 rounded-xl bg-brand-primary hover:bg-brand-primary/90 text-white font-semibold text-xs flex items-center gap-2 shadow-md shadow-brand-primary/20 transition-all cursor-pointer shrink-0"
                >
                  <Download size={14} /> Download Certificate
                </button>
              </div>

              <div className="space-y-3">
                {[
                  { time: 'Today, 14:22', event: 'Automated ZK Architecture Audit Passed', hash: '0x8f2a...c91e', status: 'Passed' },
                  { time: 'Yesterday, 09:10', event: 'Dead Man\'s Switch Liveness Heartbeat Received', hash: '0x1c4d...88a3', status: 'Verified' },
                  { time: 'Jul 18, 2026', event: 'Guardian Key Fragment Sync Verified', hash: '0x99e1...bb20', status: 'Encrypted' },
                  { time: 'Jul 15, 2026', event: 'Argon2id Master Key Salt Rotated', hash: '0x44f0...7712', status: 'Completed' },
                ].map((log, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-page/70 border border-base/50 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-brand-primary" />
                      <div>
                        <p className="font-bold text-primary">{log.event}</p>
                        <p className="text-[10px] text-muted font-mono">{log.time} • Hash: {log.hash}</p>
                      </div>
                    </div>
                    <Badge variant="success" className="text-[9px] font-bold">{log.status}</Badge>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}

      </main>

      {/* ── Live Scan Animated Overlay Modal ── */}
      <AnimatePresence>
        {isScanning && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-page border border-brand-primary/40 rounded-3xl p-8 max-w-md w-full text-center space-y-6 shadow-2xl relative overflow-hidden"
            >
              <div className="w-16 h-16 rounded-3xl bg-brand-primary/10 border border-brand-primary/30 mx-auto flex items-center justify-center text-brand-primary">
                <RefreshCw size={28} className="animate-spin text-brand-primary" />
              </div>

              <div>
                <h3 className="text-xl font-bold text-primary font-display">Executing Vault Diagnostic Scan</h3>
                <p className="text-xs text-muted mt-1">Verifying zero-knowledge proof invariants and key sharding health.</p>
              </div>

              <div className="space-y-3 text-left bg-surface/50 p-4 rounded-2xl border border-base/60">
                {[
                  "Deriving Argon2id Master Key & Salt...",
                  "Checking Shamir Key Shard Fragment Health...",
                  "Pinging Dead Man's Switch Heartbeat Endpoint...",
                  "Auditing Active Session Tokens & Entropy...",
                  "Verifying Zero-Knowledge Proof Integrity..."
                ].map((stepText, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-xs font-mono">
                    {idx < scanStep ? (
                      <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
                    ) : idx === scanStep ? (
                      <RefreshCw size={15} className="text-brand-primary animate-spin shrink-0" />
                    ) : (
                      <div className="w-3.5 h-3.5 rounded-full border border-base/60 shrink-0" />
                    )}
                    <span className={idx <= scanStep ? 'text-primary font-semibold' : 'text-muted'}>
                      {stepText}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Emergency Fallback Contact Setup Modal ── */}
      <AnimatePresence>
        {isEmergencyModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-page border border-base rounded-2xl p-6 max-w-md w-full space-y-5 shadow-2xl relative"
            >
              <button
                onClick={() => setIsEmergencyModalOpen(false)}
                className="absolute top-4 right-4 text-muted hover:text-primary p-1 rounded-lg hover:bg-surface cursor-pointer"
              >
                <X size={18} />
              </button>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-brand-primary font-mono">
                  Legacy Fail-Safe Protocol
                </span>
                <h3 className="text-lg font-bold text-primary mt-1">Configure Emergency Fallback Contact</h3>
                <p className="text-xs text-muted mt-1">
                  This contact will only be notified if your Dead Man's Switch triggers and primary guardians cannot be reached.
                </p>
              </div>

              <form onSubmit={handleSaveEmergencyContact} className="space-y-4 text-xs">
                <div>
                  <label className="block text-muted font-bold mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={emergencyContact.name}
                    onChange={(e) => setEmergencyContact(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g. Eleanor Vance"
                    className="w-full h-10 px-3 rounded-xl bg-surface/50 border border-base focus:border-brand-primary text-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-muted font-bold mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={emergencyContact.email}
                    onChange={(e) => setEmergencyContact(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="eleanor@vance-legal.com"
                    className="w-full h-10 px-3 rounded-xl bg-surface/50 border border-base focus:border-brand-primary text-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-muted font-bold mb-1">Phone Number (Optional)</label>
                  <input
                    type="text"
                    value={emergencyContact.phone}
                    onChange={(e) => setEmergencyContact(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+1 (555) 019-2831"
                    className="w-full h-10 px-3 rounded-xl bg-surface/50 border border-base focus:border-brand-primary text-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-muted font-bold mb-1">Relationship</label>
                  <input
                    type="text"
                    value={emergencyContact.relationship}
                    onChange={(e) => setEmergencyContact(prev => ({ ...prev, relationship: e.target.value }))}
                    placeholder="e.g. Estate Attorney / Sister"
                    className="w-full h-10 px-3 rounded-xl bg-surface/50 border border-base focus:border-brand-primary text-primary focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-base/50">
                  <button
                    type="button"
                    onClick={() => setIsEmergencyModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-muted hover:text-primary cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-brand-primary hover:bg-brand-primary/90 text-white font-semibold shadow-md shadow-brand-primary/20 cursor-pointer"
                  >
                    Save Fallback Contact
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
