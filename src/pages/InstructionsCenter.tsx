import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, CheckCircle2, Sparkles, Eye, Download, 
  Plus, Edit3, Shield, BookOpen, Info,
  Copy, X, Layers, Check, UserCheck, KeyRound, Building2, Wallet
} from 'lucide-react';
import { useStore, Asset } from '../store/useStore';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import toast from 'react-hot-toast';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.5, ease: [0.16, 1, 0.3, 1] },
});

// Pre-built succession instruction templates
const TEMPLATES = [
  {
    id: 'crypto',
    title: 'Crypto Hardware & Seed Phrase Recovery',
    category: 'Digital Assets',
    icon: Wallet,
    content: `1. Physical Hardware Location: Ledger Nano X is inside the fireproof home safe in the master bedroom closet.
2. PIN Hint: Combination of the year of marriage and birth month.
3. Seed Phrase Shards: 24-word recovery seed is split into 3 stainless steel plates. Fragment A is in the safe; Fragment B is held by Guardian Sarah.
4. Heir Action Steps: Plug hardware wallet into Ledger Live app. Use seed phrase to restore account on clean laptop if physical device is damaged.`
  },
  {
    id: 'banking',
    title: 'Bank & Institutional Accounts Guide',
    category: 'Financial Assets',
    icon: Building2,
    content: `1. Primary Account: Chase Private Client Checking ending in #4892.
2. Executor Access: Contact Relationship Manager Jonathan Vance at Chase Manhattan Branch (Tel: 212-555-0199).
3. Required Documents: Original Death Certificate and Letters Testamentary from the probate court.
4. Automatic Transfers: Beneficiary designation (TOD/POD) is filed directly with the bank to bypass probate delays.`
  },
  {
    id: 'passwords',
    title: 'Password Manager & Digital Footprint',
    category: 'Digital Property',
    icon: KeyRound,
    content: `1. Emergency Access: 1Password Emergency Access has been granted to designated Heir Alex.
2. Master Password Recovery Kit: Stored in sealed tamper-evident envelope #04 in safety deposit box #882 at First National Bank.
3. Two-Factor Authentication: Backup 2FA codes are printed and stored alongside the recovery kit envelope.`
  },
  {
    id: 'real-estate',
    title: 'Property Deed & Physical Vault Protocol',
    category: 'Physical Assets',
    icon: Layers,
    content: `1. Property Deed: Originals stored in blue legal accordion folder marked "Estate Deeds" in home office desk.
2. Attorney of Record: Henderson & Associates Law Firm (Ref Estate File #8911-TL).
3. Maintenance & Utilities: Monthly automatic payments scheduled through Chase Checking account.`
  }
];

export default function InstructionsCenter() {
  const { assets, updateAsset, heirs } = useStore();
  
  const [activeTab, setActiveTab] = useState<'asset-guides' | 'master-letter' | 'heir-preview' | 'templates'>('asset-guides');
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [instructionText, setInstructionText] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  
  // Master Family Letter State
  const defaultLetter = `Dearest Family & Beneficiaries,

If you are reading this letter, it means the Transfer Legacy protocol has been triggered after my liveness switch check-in period expired. Please do not panic. Everything you need to recover my digital footprint, financial accounts, and personal wishes has been structured systematically in this vault.

I have appointed trusted Guardians to assist you with key reconstruction. Each asset below contains plain-English step-by-step instructions so you do not have to guess or navigate complex technical barriers.

My primary wishes:
1. Ensure Sarah and Alex have immediate access to emergency liquid reserves.
2. Contact our family attorney to initiate estate distribution.
3. Preserve personal memory capsules and family photos saved in the digital vault.

With all my love and foresight,
[Vault Owner]`;

  const [masterLetter, setMasterLetter] = useState<string>(() => {
    return localStorage.getItem('familink_master_letter') || defaultLetter;
  });

  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    localStorage.setItem('familink_master_letter', masterLetter);
  }, [masterLetter]);

  const instructedAssetsCount = assets.filter(a => a.instructions && a.instructions.trim().length > 0).length;
  const coveragePercent = assets.length > 0 ? Math.round((instructedAssetsCount / assets.length) * 100) : 0;

  const handleOpenEdit = (asset: Asset) => {
    setSelectedAsset(asset);
    setInstructionText(asset.instructions || '');
    setIsEditModalOpen(true);
  };

  const handleSaveInstruction = async () => {
    if (!selectedAsset) return;
    try {
      await updateAsset(selectedAsset.id, { instructions: instructionText });
      toast.success(`Succession instructions updated for ${selectedAsset.name || 'Asset'}`);
      setIsEditModalOpen(false);
      setSelectedAsset(null);
    } catch {
      toast.error('Failed to update instructions');
    }
  };

  const handleApplyTemplateToAsset = (templateContent: string) => {
    setInstructionText(prev => prev ? `${prev}\n\n${templateContent}` : templateContent);
    toast.success('Template snippet appended to instructions!');
  };

  const handleCopyLetter = () => {
    navigator.clipboard.writeText(masterLetter);
    setIsCopied(true);
    toast.success('Master Family Letter copied to clipboard');
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleExportPDF = () => {
    toast.success('Generating attorney-ready Letter of Instruction PDF...');
    setTimeout(() => {
      const element = document.createElement("a");
      const file = new Blob([
        `TRANSFER LEGACY - OFFICIAL LETTER OF INSTRUCTION\n`,
        `Generated: ${new Date().toLocaleDateString()}\n\n`,
        `==================================================\n`,
        `MASTER FAMILY LETTER\n`,
        `==================================================\n\n`,
        `${masterLetter}\n\n`,
        `==================================================\n`,
        `ASSET SUCCESSION GUIDES (${instructedAssetsCount}/${assets.length} Coverages)\n`,
        `==================================================\n\n`,
        ...assets.map(a => 
          `ASSET: ${a.name || 'Unnamed Asset'} (${a.type || 'General'})\n` +
          `VALUE: $${(a.value || 0).toLocaleString()}\n` +
          `INSTRUCTIONS:\n${a.instructions || 'No detailed instructions written.'}\n` +
          `--------------------------------------------------\n`
        )
      ], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = `Transfer_Legacy_Letter_of_Instruction_${new Date().toISOString().slice(0,10)}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }, 800);
  };

  const filteredAssets = assets.filter(a => {
    if (filterCategory === 'all') return true;
    if (filterCategory === 'has-instruction') return a.instructions && a.instructions.trim().length > 0;
    if (filterCategory === 'missing-instruction') return !a.instructions || a.instructions.trim().length === 0;
    return true;
  });

  return (
    <div className="min-h-screen bg-page text-primary pt-6 pb-20 selection:bg-brand-primary/30">
      <main className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-8">
        
        {/* ── Page Header ── */}
        <motion.header {...fadeUp(0)} className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-base/50">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-brand-primary shadow-[0_0_10px_rgba(249,115,22,0.8)]" />
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-primary">
                Dedicated Plain-Language Protocol
              </p>
            </div>
            <h1 className="text-3xl sm:text-4xl font-display font-bold text-primary tracking-tight">
              Letters of <span className="italic text-brand-primary">Instruction</span>
            </h1>
            <p className="text-muted text-xs sm:text-sm mt-2 font-medium max-w-2xl">
              Ensure your heirs and executors never have to guess. Store plain-English recovery procedures, private access guides, and personal family notes.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleExportPDF}
              className="h-10 px-4 rounded-xl bg-brand-primary hover:bg-brand-primary/90 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-brand-primary/20 transition-all cursor-pointer"
            >
              <Download size={15} /> Export Official Spec
            </button>
          </div>
        </motion.header>

        {/* ── Coverage KPI Summary Banner ── */}
        <motion.div {...fadeUp(0.05)} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-5 bg-surface/40 border-base/60 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-muted uppercase tracking-widest">Instruction Coverage</p>
              <h3 className="text-2xl font-bold text-primary mt-1">{coveragePercent}%</h3>
              <p className="text-[11px] text-muted mt-0.5">{instructedAssetsCount} of {assets.length} assets guided</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary">
              <BookOpen size={22} />
            </div>
          </Card>

          <Card className="p-5 bg-surface/40 border-base/60 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-muted uppercase tracking-widest">Master Family Letter</p>
              <h3 className="text-2xl font-bold text-emerald-400 mt-1">Active</h3>
              <p className="text-[11px] text-muted mt-0.5">Plain-English family statement ready</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <FileText size={22} />
            </div>
          </Card>

          <Card className="p-5 bg-surface/40 border-base/60 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-muted uppercase tracking-widest">Protocol Readability</p>
              <h3 className="text-2xl font-bold text-primary mt-1">Institutional</h3>
              <p className="text-[11px] text-muted mt-0.5">Zero-knowledge sealed until trigger</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center text-brand-gold">
              <Shield size={22} />
            </div>
          </Card>
        </motion.div>

        {/* ── Sub-Navigation Tabs ── */}
        <motion.div {...fadeUp(0.1)} className="flex items-center gap-2 p-1.5 rounded-2xl bg-surface/60 border border-base/60 overflow-x-auto">
          {[
            { id: 'asset-guides', label: 'Asset Succession Guides', icon: Layers, count: assets.length },
            { id: 'master-letter', label: 'Master Family Letter', icon: FileText },
            { id: 'heir-preview', label: 'Simulate Heir View', icon: Eye },
            { id: 'templates', label: 'Instruction Templates', icon: Sparkles, count: TEMPLATES.length },
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
                {tab.count !== undefined && (
                  <span className={`px-1.5 py-0.5 rounded-md text-[10px] ${
                    isActive ? 'bg-white/20 text-white' : 'bg-base text-muted'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </motion.div>

        {/* ── Tab 1: Asset Succession Guides ── */}
        {activeTab === 'asset-guides' && (
          <motion.div {...fadeUp(0.15)} className="space-y-6">
            
            {/* Category Filter bar */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-muted uppercase tracking-wider">Filter:</span>
                {[
                  { id: 'all', label: 'All Vault Items' },
                  { id: 'has-instruction', label: 'Has Instructions' },
                  { id: 'missing-instruction', label: 'Needs Instructions' },
                ].map(f => (
                  <button
                    key={f.id}
                    onClick={() => setFilterCategory(f.id)}
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                      filterCategory === f.id
                        ? 'bg-base border border-brand-primary/40 text-brand-primary'
                        : 'bg-surface/30 border border-base/40 text-muted hover:text-primary'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              <p className="text-xs text-muted font-medium">
                Showing {filteredAssets.length} of {assets.length} items
              </p>
            </div>

            {/* Asset List */}
            {filteredAssets.length === 0 ? (
              <Card className="p-12 text-center bg-surface/30 border-dashed border-base/80">
                <Info size={28} className="mx-auto text-muted mb-3" />
                <h3 className="text-base font-bold text-primary">No assets match this filter</h3>
                <p className="text-xs text-muted mt-1">Select another filter above or add assets in the Accounts tab.</p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredAssets.map(asset => {
                  const hasInstr = asset.instructions && asset.instructions.trim().length > 0;
                  const assignedHeir = heirs.find(h => h.id === asset.beneficiaryId);

                  return (
                    <Card key={asset.id} className="p-5 bg-surface/40 hover:bg-surface border-base/60 transition-all duration-300 relative flex flex-col justify-between gap-4 group">
                      <div>
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary text-xs font-bold">
                              {asset.name ? asset.name.charAt(0).toUpperCase() : 'A'}
                            </div>
                            <div>
                              <h4 className="text-sm font-bold text-primary tracking-tight">{asset.name || 'Unnamed Asset'}</h4>
                              <p className="text-[10px] text-muted font-mono uppercase tracking-wider">{asset.type || 'General Asset'}</p>
                            </div>
                          </div>

                          <Badge variant={hasInstr ? 'success' : 'warning'} className="text-[9px] font-bold px-2 py-0.5">
                            {hasInstr ? 'Guided' : 'Needs Guide'}
                          </Badge>
                        </div>

                        {/* Instructions snippet */}
                        <div className="mt-3 p-3 rounded-xl bg-page/60 border border-base/40">
                          <p className="text-xs text-secondary leading-relaxed line-clamp-3">
                            {hasInstr ? asset.instructions : (
                              <span className="italic text-muted">
                                No succession instructions written. Your heir will receive this asset without step-by-step guidance.
                              </span>
                            )}
                          </p>
                        </div>

                        {/* Assigned Heir tag */}
                        <div className="mt-3 flex items-center justify-between text-[11px] text-muted">
                          <span className="flex items-center gap-1.5">
                            <UserCheck size={13} className="text-brand-primary" />
                            {assignedHeir ? `Heir: ${assignedHeir.name}` : 'No Heir Assigned'}
                          </span>
                          <span className="font-semibold text-primary font-mono">${(asset.value || 0).toLocaleString()}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleOpenEdit(asset)}
                        className="w-full h-9 px-3 rounded-lg bg-base border border-base hover:border-brand-primary/40 text-secondary hover:text-primary text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
                      >
                        <Edit3 size={13} /> {hasInstr ? 'Edit Instructions' : 'Write Instruction Guide'}
                      </button>
                    </Card>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}

        {/* ── Tab 2: Master Family Letter ── */}
        {activeTab === 'master-letter' && (
          <motion.div {...fadeUp(0.15)} className="space-y-6">
            <Card className="p-6 bg-surface/40 border-base/60 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-base/50">
                <div>
                  <h3 className="text-lg font-bold text-primary flex items-center gap-2">
                    <FileText className="text-brand-primary" size={18} />
                    Master Family Letter of Instruction
                  </h3>
                  <p className="text-xs text-muted mt-1">
                    This letter is presented at the top of your vault when your beneficiaries gain access. Write your general wishes, emotional notes, or executor guidance.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={handleCopyLetter}
                    className="h-9 px-3 rounded-lg bg-base border border-base hover:border-brand-primary/40 text-secondary hover:text-primary text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    {isCopied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                    {isCopied ? 'Copied' : 'Copy Text'}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-muted uppercase tracking-wider flex items-center justify-between">
                  <span>Plain-English Letter Content</span>
                  <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                    <CheckCircle2 size={12} /> Auto-Saved to Vault
                  </span>
                </label>
                <textarea
                  rows={14}
                  value={masterLetter}
                  onChange={(e) => setMasterLetter(e.target.value)}
                  className="w-full p-4 rounded-xl bg-page/80 border border-base/80 focus:border-brand-primary text-primary text-xs leading-relaxed font-sans focus:outline-none transition-all"
                  placeholder="Write your personal letter of instruction..."
                />
              </div>

              {/* Quick Snippets */}
              <div className="p-4 rounded-xl bg-brand-primary/5 border border-brand-primary/20 space-y-2">
                <p className="text-[11px] font-bold text-brand-primary uppercase tracking-wider">Quick Snippet Prompts</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Where to find physical safe keys",
                    "Contact details for family probate lawyer",
                    "Instructions for digital photo archives",
                    "Message of love & personal values"
                  ].map((prompt, idx) => (
                    <button
                      key={idx}
                      onClick={() => setMasterLetter(prev => prev + `\n\n- ${prompt}: [Details here]`)}
                      className="px-2.5 py-1 rounded-md bg-surface border border-base/60 text-[11px] text-secondary hover:text-primary hover:border-brand-primary/40 transition-all cursor-pointer"
                    >
                      + {prompt}
                    </button>
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* ── Tab 3: Simulate Heir View ── */}
        {activeTab === 'heir-preview' && (
          <motion.div {...fadeUp(0.15)} className="space-y-6">
            <Card className="p-6 bg-gradient-to-b from-surface/80 to-surface/40 border-brand-primary/30 space-y-6 relative overflow-hidden">
              {/* Watermark / Badge */}
              <div className="flex items-center justify-between pb-4 border-b border-base/50">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 font-mono">
                    Simulated Heir Access Portal (Preview Mode)
                  </span>
                </div>
                <Badge variant="success" className="text-[10px] font-bold px-2 py-0.5">
                  Protocol Unlocked Status
                </Badge>
              </div>

              {/* Master Letter Preview */}
              <div className="p-6 rounded-2xl bg-page/90 border border-base/60 space-y-4">
                <h3 className="text-base font-bold text-primary flex items-center gap-2">
                  <FileText size={18} className="text-brand-primary" />
                  Letter of Instruction from Vault Owner
                </h3>
                <div className="text-xs text-secondary leading-relaxed whitespace-pre-wrap font-serif italic p-4 rounded-xl bg-surface/50 border border-base/30">
                  {masterLetter}
                </div>
              </div>

              {/* Asset Guides Preview */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-primary uppercase tracking-wider flex items-center gap-2 font-mono">
                  <Layers size={16} className="text-brand-primary" />
                  Unlocked Asset Recovery Procedures ({assets.length} Total)
                </h3>

                <div className="space-y-3">
                  {assets.map((a, idx) => (
                    <div key={a.id} className="p-4 rounded-xl bg-page/70 border border-base/50 space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-primary flex items-center gap-2">
                          <span className="text-muted font-mono">#{idx + 1}</span> {a.name || 'Unnamed Asset'}
                        </span>
                        <span className="text-brand-primary font-mono">${(a.value || 0).toLocaleString()}</span>
                      </div>
                      <p className="text-xs text-secondary leading-relaxed bg-surface/40 p-3 rounded-lg border border-base/30">
                        {a.instructions || 'No detailed recovery instructions provided.'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* ── Tab 4: Instruction Templates ── */}
        {activeTab === 'templates' && (
          <motion.div {...fadeUp(0.15)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {TEMPLATES.map(tmpl => {
              const TIcon = tmpl.icon;
              return (
                <Card key={tmpl.id} className="p-6 bg-surface/40 border-base/60 space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary">
                        <TIcon size={20} />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-muted font-mono">{tmpl.category}</span>
                    </div>

                    <h4 className="text-base font-bold text-primary">{tmpl.title}</h4>

                    <div className="p-3.5 rounded-xl bg-page/80 border border-base/60 text-xs text-secondary leading-relaxed font-mono whitespace-pre-wrap">
                      {tmpl.content}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setMasterLetter(prev => `${prev}\n\n--- ${tmpl.title} ---\n${tmpl.content}`);
                      toast.success(`Appended template to Master Family Letter!`);
                    }}
                    className="w-full h-9 px-3 rounded-lg bg-base border border-base hover:border-brand-primary/40 text-secondary hover:text-primary text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Plus size={14} /> Append Snippet to Master Letter
                  </button>
                </Card>
              );
            })}
          </motion.div>
        )}

      </main>

      {/* ── Edit Asset Instruction Modal ── */}
      <AnimatePresence>
        {isEditModalOpen && selectedAsset && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-page border border-base rounded-2xl p-6 max-w-xl w-full space-y-5 shadow-2xl relative"
            >
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="absolute top-4 right-4 text-muted hover:text-primary p-1 rounded-lg hover:bg-surface cursor-pointer"
              >
                <X size={18} />
              </button>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-brand-primary font-mono">
                  Asset Succession Protocol
                </span>
                <h3 className="text-lg font-bold text-primary mt-1">
                  Write Recovery Instructions: <span className="text-brand-primary">{selectedAsset.name}</span>
                </h3>
                <p className="text-xs text-muted mt-1">
                  Provide plain-English steps for your designated heir to gain access or transfer this asset.
                </p>
              </div>

              <div className="space-y-2">
                <textarea
                  rows={7}
                  value={instructionText}
                  onChange={(e) => setInstructionText(e.target.value)}
                  className="w-full p-4 rounded-xl bg-surface/50 border border-base focus:border-brand-primary text-primary text-xs leading-relaxed focus:outline-none transition-all"
                  placeholder="e.g. Seed phrase is stored in hardware safe #2. Contact relationship manager John at Chase for transfer..."
                />
              </div>

              {/* Starter Snippet Quick Buttons */}
              <div className="space-y-1.5">
                <p className="text-[10px] font-bold text-muted uppercase tracking-wider">Quick Template Snippets</p>
                <div className="flex flex-wrap gap-2">
                  {TEMPLATES.map(t => (
                    <button
                      key={t.id}
                      onClick={() => handleApplyTemplateToAsset(t.content)}
                      className="px-2.5 py-1 rounded-md bg-surface border border-base text-[10px] text-secondary hover:text-primary transition-all cursor-pointer"
                    >
                      + {t.title.split(' ')[0]} Template
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-base/50">
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-muted hover:text-primary transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveInstruction}
                  className="px-5 py-2 rounded-xl bg-brand-primary hover:bg-brand-primary/90 text-white text-xs font-semibold shadow-md shadow-brand-primary/20 transition-all cursor-pointer"
                >
                  Save Instruction Guide
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
