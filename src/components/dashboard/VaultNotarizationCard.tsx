import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, ExternalLink, Shield, RefreshCw, Lock } from 'lucide-react';
import { useNotarizationStore } from '../../store/useNotarizationStore';
import { useStore } from '../../store/useStore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

export default function VaultNotarizationCard() {
  const { notarizeVault, getLatestHash } = useNotarizationStore();
  const { user, activePolicyId, assets, logActivity } = useStore();
  const [isNotarizing, setIsNotarizing] = useState(false);
  const navigate = useNavigate();
  const latestHash = getLatestHash();

  const userPlan = (user?.plan || 'Always Free').toLowerCase();
  const isEntitled = userPlan.includes('family') || userPlan.includes('personal') || userPlan.includes('pro') || userPlan.includes('enterprise');

  const handleNotarize = async () => {
    if (!isEntitled) {
      toast.error("Blockchain notarization requires a Family or Institutional plan.");
      navigate('/settings');
      return;
    }

    try {
      setIsNotarizing(true);
      const res = await notarizeVault(
        "manual_notarization",
        {
          assetCount: assets.length,
          policyId: activePolicyId,
          timestamp: Date.now()
        },
        activePolicyId
      );
      if (logActivity) {
        logActivity('Vault cryptographic state anchored to decentralized ledger', 'ShieldCheck');
      }
      toast.success("Vault state successfully anchored with cryptographic proof!");
    } catch (err) {
      toast.error((err as Error).message || "Failed to notarize vault.");
    } finally {
      setIsNotarizing(false);
    }
  };

  const handleViewExplorer = () => {
    if (!latestHash) return;
    if (latestHash.blockchainRef.startsWith('0x')) {
      const url = latestHash.chain === 'ethereum'
        ? `https://etherscan.io/tx/${latestHash.blockchainRef}`
        : `https://polygonscan.com/tx/${latestHash.blockchainRef}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      window.open(`/trust?anchor=${latestHash.hash}`, '_blank');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 relative overflow-hidden group hover:border-brand-primary/40 transition-all duration-500 bg-surface/30 border border-border-base rounded-[32px]"
    >
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-brand-success/5 rounded-full blur-3xl group-hover:bg-brand-success/10 transition-colors duration-700 pointer-events-none" />
      
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div>
          <h3 className="text-lg font-display font-bold text-primary flex items-center gap-2">
            Vault Notarized <ShieldCheck className="text-brand-success" size={20} />
          </h3>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted mt-1">Blockchain Anchoring</p>
        </div>
        <Shield size={60} className="absolute -top-4 -right-4 text-brand-success/5 group-hover:text-brand-success/10 transition-colors pointer-events-none" />
      </div>

      <div className="min-h-[140px] flex flex-col justify-center">
        {!isEntitled ? (
          <div className="text-sm text-secondary font-medium mb-4 bg-page/50 p-5 rounded-2xl border border-border-base shadow-inner text-center space-y-2">
            <div className="flex items-center justify-center gap-1.5 text-amber-400 text-xs font-bold uppercase tracking-wider">
              <Lock size={14} /> Institutional Tier Required
            </div>
            <p className="text-xs text-muted">
              Decentralized ledger anchoring is available on Family and Institutional plans. Upgrade to anchor immutable cryptographic estate proofs on Polygon.
            </p>
          </div>
        ) : latestHash ? (
          <div className="space-y-4 relative z-10">
            <div className="flex justify-between items-center text-sm border-b border-border-base/50 pb-3">
              <span className="text-[10px] font-bold text-muted uppercase tracking-widest">Last Notarized</span>
              <span className="text-primary font-bold">{new Date(latestHash.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between items-center text-sm border-b border-border-base/50 pb-3">
              <span className="text-[10px] font-bold text-muted uppercase tracking-widest">Network</span>
              <span className="text-brand-primary font-bold capitalize">{latestHash.chain}</span>
            </div>
            <div className="flex flex-col gap-2 pt-1">
              <span className="text-[10px] font-bold text-muted uppercase tracking-widest">Transaction / Anchor Ref</span>
              <div className="bg-page/50 p-3 rounded-xl truncate text-[11px] font-mono text-brand-success border border-brand-success/20 shadow-inner">
                {latestHash.blockchainRef}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-sm text-secondary font-medium mb-6 bg-page/50 p-5 rounded-2xl border border-border-base shadow-inner text-center">
            Your vault hasn't been notarized yet. Timestamp your instructions on the blockchain to make them legally defensible.
          </div>
        )}
      </div>

      <div className="flex gap-3 relative z-10 mt-6">
        {!isEntitled ? (
          <button 
            className="flex-1 py-4 rounded-2xl text-[11px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-lg bg-surface hover:bg-brand-primary/10 border border-brand-primary/30 text-brand-primary"
            onClick={() => navigate('/settings')}
          >
            Upgrade to Notarize
          </button>
        ) : (
          <button 
            className={`flex-1 py-4 rounded-2xl text-[11px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-lg ${
              isNotarizing 
                ? 'bg-brand-success/20 text-brand-success border border-brand-success/30 cursor-wait' 
                : 'bg-brand-success text-white hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]'
            }`}
            onClick={handleNotarize}
            disabled={isNotarizing}
          >
            {isNotarizing ? (
              <>
                <RefreshCw size={14} className="animate-spin" />
                Anchoring...
              </>
            ) : 'Notarize Now'}
          </button>
        )}
        {latestHash && isEntitled && (
          <button 
            className="w-14 rounded-2xl bg-surface border border-border-base flex items-center justify-center text-muted hover:text-brand-primary hover:border-brand-primary/30 transition-all"
            title="View on Explorer"
            onClick={handleViewExplorer}
          >
             <ExternalLink size={16} />
          </button>
        )}
      </div>
    </motion.div>
  );
}
