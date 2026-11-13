import { useState, useMemo } from 'react';
import { useStore, Allocation } from '../store/useStore';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { PieChart, HeartHandshake, Box, Wallet, Users, Plus, Trash2, ArrowRight, AlertCircle, Briefcase, ShieldCheck, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { PieChart as RePieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 15 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { delay, duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
});

export default function Allocations() {
  const { assets, heirs, charities, allocations, addAllocation, updateAllocation, removeAllocation } = useStore();
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(assets.length > 0 ? assets[0].id : null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState<'heir' | 'charity'>('heir');

  const selectedAsset = assets.find(a => a.id === selectedAssetId);
  const assetAllocations = allocations.filter(a => a.assetId === selectedAssetId);
  const totalAllocated = assetAllocations.reduce((sum, a) => sum + a.percentage, 0);
  const remainingPercent = 100 - totalAllocated;

  const handleSliderChange = (id: string, newValue: number, oldValue: number) => {
    const diff = newValue - oldValue;
    if (diff > remainingPercent) {
      updateAllocation(id, oldValue + remainingPercent);
    } else {
      updateAllocation(id, newValue);
    }
  };

  const addRecipient = (recipientId: string, type: 'heir' | 'charity') => {
    if (assetAllocations.find(a => a.recipientId === recipientId)) {
      toast.error('Protocol conflict: Recipient already assigned.');
      return;
    }
    if (remainingPercent <= 0) {
      toast.error('Resource depletion: Asset is fully allocated.');
      return;
    }
    addAllocation({
      assetId: selectedAssetId!,
      recipientId,
      type,
      percentage: Math.min(25, remainingPercent)
    });
    setIsModalOpen(false);
    toast.success('Recipient synchronized');
  };

  const getRecipientDetails = (a: Allocation) => {
    if (a.type === 'heir') {
      const h = heirs.find(heir => heir.id === a.recipientId);
      return { name: h?.name || 'Unknown Heir', icon: Users, color: '#4F5CFF' }; // brand-primary
    } else {
      const c = charities.find(charity => charity.id === a.recipientId);
      return { name: c?.name || 'Institutional Charity', icon: HeartHandshake, color: '#D4AF37' }; // brand-gold
    }
  };

  const chartData = useMemo(() => {
    const data = assetAllocations.map(a => {
      const details = getRecipientDetails(a);
      return { name: details.name, value: a.percentage, color: details.color };
    });
    if (remainingPercent > 0) {
      data.push({ name: 'Unassigned Protocol', value: remainingPercent, color: 'rgba(255,255,255,0.05)' });
    }
    return data;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assetAllocations, remainingPercent]);

  return (
    <div className="min-h-screen bg-page text-primary selection:bg-brand-primary/30 pt-6">
      <main className="px-4 sm:px-6 lg:px-8 pb-28 md:pb-12 max-w-7xl mx-auto space-y-10">
        
        {/* ── Page Header ── */}
        <motion.header {...fadeUp(0)} className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-brand-primary" />
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-primary">
                Asset Allocation Protocol
              </p>
            </div>
            <h1 className="text-4xl sm:text-5xl font-display font-bold text-primary tracking-tight leading-none">
              Smart <span className="italic text-brand-primary">Allocations</span>
            </h1>
            <p className="text-muted text-sm mt-3 font-medium">
              Precisely route institutional assets to beneficiaries and mandates.
            </p>
          </div>
        </motion.header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* ── Asset Inventory Sidebar ── */}
          <motion.div {...fadeUp(0.1)} className="lg:col-span-3 space-y-4">
            <div className="flex items-center justify-between px-2 mb-2">
              <p className="text-[10px] font-bold uppercase tracking-widest text-primary0">Vault Inventory</p>
              <Badge variant="default" className="text-[9px]">{assets.length} Assets</Badge>
            </div>
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 scrollbar-hide">
              {assets.length === 0 ? (
                <div className="p-10 text-center border border-dashed border-base rounded-2xl bg-surface/20">
                  <p className="text-xs text-muted font-bold uppercase tracking-widest leading-relaxed">No assets detected in primary vault.</p>
                </div>
              ) : (
                assets.map(asset => (
                  <button
                    key={asset.id}
                    onClick={() => setSelectedAssetId(asset.id)}
                    className={`w-full text-left p-5 rounded-2xl transition-all duration-300 border flex items-center gap-4 group ${
                      selectedAssetId === asset.id 
                        ? 'bg-brand-primary/10 border-brand-primary/40 shadow-[0_0_20px_rgba(79,92,255,0.1)]' 
                        : 'bg-surface/50 border-base text-primary0 hover:border-base hover:bg-surface'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${selectedAssetId === asset.id ? 'bg-brand-primary text-white shadow-md' : 'bg-surface/80 text-secondary border border-base'}`}>
                      {asset.type === 'Crypto' ? <Wallet size={18} /> :
                       asset.type === 'Retirement' ? <Briefcase size={18} /> : <Box size={18} />}
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <p className={`font-bold text-sm tracking-tight truncate ${selectedAssetId === asset.id ? 'text-primary' : ''}`}>{asset.name}</p>
                      <p className="text-[10px] font-mono mt-1 opacity-60">${asset.value?.toLocaleString() || 0}</p>
                    </div>
                    {selectedAssetId === asset.id && <ChevronRight size={14} className="text-brand-primary" />}
                  </button>
                ))
              )}
            </div>
          </motion.div>

          {/* ── Distribution Matrix Canvas ── */}
          <motion.div {...fadeUp(0.2)} className="lg:col-span-9">
            <Card variant="default" className="bg-surface/50 border-base min-h-[600px] flex flex-col relative overflow-hidden">
              {!selectedAssetId || !selectedAsset ? (
                <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                  <div className="w-20 h-20 rounded-full bg-page border border-base flex items-center justify-center mb-6 opacity-30">
                    <PieChart size={32} />
                  </div>
                  <h3 className="text-xl font-display font-bold text-secondary">Awaiting Asset Selection</h3>
                  <p className="text-sm text-primary0 mt-2 max-w-xs font-medium italic">Select an asset from your vault inventory to configure distribution protocols.</p>
                </div>
              ) : (
                <>
                  <div className="p-8 border-b border-base bg-surface/30 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                      <h2 className="text-2xl font-display font-bold text-primary tracking-tight">{selectedAsset.name}</h2>
                      <p className="text-sm text-primary0 mt-1 font-medium">Vault Allocation Value: <strong className="text-brand-primary font-mono tracking-tight">${selectedAsset.value?.toLocaleString() || 0}</strong></p>
                    </div>
                    <div className={`px-5 py-2.5 rounded-2xl border text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-3 shadow-inner ${
                      remainingPercent === 0 
                        ? 'bg-brand-primary/10 border-brand-primary/30 text-brand-primary' 
                        : 'bg-brand-gold/10 border-brand-gold/30 text-brand-gold'
                    }`}>
                      {remainingPercent === 0 ? <ShieldCheck size={14} /> : <AlertCircle size={14} />}
                      {remainingPercent === 0 ? 'Full Protocol Sync' : `${remainingPercent}% Buffer Remaining`}
                    </div>
                  </div>

                  <div className="flex-1 p-8 lg:p-12 grid grid-cols-1 xl:grid-cols-2 gap-12 items-start">
                    
                    {/* ── Recipient Sliders ── */}
                    <div className="space-y-8">
                      <div className="flex justify-between items-end">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-primary0">Beneficiary Matrix</h3>
                        <Button variant="secondary" onClick={() => setIsModalOpen(true)} className="h-8 px-4 text-[10px] font-bold uppercase tracking-widest">
                          <Plus size={14} className="mr-2" /> Add Mandate
                        </Button>
                      </div>

                      {assetAllocations.length === 0 ? (
                         <div className="p-12 text-center border border-dashed border-base rounded-3xl bg-page/30">
                           <p className="text-xs text-primary0 font-bold uppercase tracking-widest mb-6 leading-relaxed italic">No beneficiaries assigned to this asset.</p>
                           <Button variant="primary" onClick={() => setIsModalOpen(true)} className="h-11 px-8 font-bold">Initialize Distribution</Button>
                         </div>
                      ) : (
                        <div className="space-y-5">
                          <AnimatePresence>
                            {assetAllocations.map(a => {
                              const details = getRecipientDetails(a);
                              const Icon = details.icon;
                              const valueAmount = (selectedAsset.value || 0) * (a.percentage / 100);
                              
                              return (
                                <motion.div 
                                  key={a.id}
                                  initial={{ opacity: 0, x: 10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  exit={{ opacity: 0, scale: 0.95 }}
                                  className="p-6 bg-page/50 rounded-2xl border border-base hover:border-brand-primary/30 transition-all group"
                                >
                                  <div className="flex justify-between items-start mb-6">
                                    <div className="flex items-center gap-4">
                                      <div className="w-10 h-10 rounded-xl bg-surface border border-base flex items-center justify-center" style={{ color: details.color }}>
                                        <Icon size={16} />
                                      </div>
                                      <div>
                                        <span className="block font-bold text-sm text-primary tracking-tight">{details.name}</span>
                                        <span className="block text-[9px] uppercase tracking-widest text-muted font-bold mt-1">{a.type} ALLOCATION</span>
                                      </div>
                                    </div>
                                    <button onClick={() => removeAllocation(a.id)} className="text-muted hover:text-red-500 transition-colors p-2 hover:bg-red-500/10 rounded-lg">
                                      <Trash2 size={16} />
                                    </button>
                                  </div>
                                  
                                  <div className="flex items-center gap-6">
                                    <input 
                                      type="range" 
                                      min="1" 
                                      max="100" 
                                      value={a.percentage}
                                      onChange={(e) => handleSliderChange(a.id, parseInt(e.target.value), a.percentage)}
                                      className="flex-1 h-1.5 bg-surface/80 rounded-full appearance-none cursor-pointer accent-brand-primary" 
                                    />
                                    <span className="w-14 text-right font-mono font-bold text-brand-primary text-lg">{a.percentage}%</span>
                                  </div>
                                  
                                  <div className="mt-4 flex justify-end">
                                    <span className="text-[10px] font-bold text-muted uppercase tracking-widest">Est. Value: <span className="text-primary font-mono">${valueAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span></span>
                                  </div>
                                </motion.div>
                              );
                            })}
                          </AnimatePresence>
                        </div>
                      )}
                    </div>

                    {/* ── Visual Allocation Visualization ── */}
                    <div className="flex flex-col items-center justify-center p-10 bg-page/30 rounded-3xl border border-base/50 h-full min-h-[400px]">
                       <div className="w-full h-72 relative">
                         <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
                            <p className="text-[10px] font-bold text-muted uppercase tracking-[0.2em] mb-1">Vault Sync</p>
                            <p className="text-2xl font-bold tabular-nums tracking-tight text-primary">{100 - remainingPercent}%</p>
                         </div>
                         <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                            <RePieChart>
                              <Pie
                                data={chartData}
                                cx="50%"
                                cy="50%"
                                innerRadius={85}
                                outerRadius={120}
                                paddingAngle={8}
                                dataKey="value"
                                stroke="none"
                              >
                                {chartData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Pie>
                              <Tooltip 
                                formatter={(value: unknown) => [`${value}%`, 'Protocol Sync']}
                                contentStyle={{ backgroundColor: 'var(--color-bg-surface)', border: '1px solid var(--color-border)', borderRadius: '16px', color: 'var(--color-text-primary)', fontSize: '12px', fontWeight: 'bold' }}
                                itemStyle={{ color: '#818cf8' }}
                              />
                            </RePieChart>
                         </ResponsiveContainer>
                       </div>
                       
                       {assetAllocations.length > 0 && (
                         <div className="mt-10 grid grid-cols-2 gap-x-8 gap-y-3">
                            {chartData.map((d, i) => (
                              <div key={i} className="flex items-center gap-3">
                                <span className="w-2.5 h-2.5 rounded-full shadow-[0_0_10px_rgba(0,0,0,0.5)]" style={{ backgroundColor: d.color }}></span>
                                <span className="text-[10px] font-bold text-primary0 uppercase tracking-widest truncate max-w-[120px]">{d.name}</span>
                              </div>
                            ))}
                         </div>
                       )}
                    </div>

                  </div>
                </>
              )}
            </Card>
          </motion.div>
        </div>

      </main>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Recipient Authorization">
         <div className="flex p-1 bg-page rounded-2xl border border-base mb-8 shadow-inner">
           <button 
             onClick={() => setModalTab('heir')}
             className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest rounded-xl transition-all duration-300 ${modalTab === 'heir' ? 'bg-brand-primary text-white shadow-lg' : 'text-secondary hover:text-primary'}`}
           >
             Heirs
           </button>
           <button 
             onClick={() => setModalTab('charity')}
             className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest rounded-xl transition-all duration-300 flex items-center justify-center gap-2 ${modalTab === 'charity' ? 'bg-brand-gold text-white shadow-lg' : 'text-secondary hover:text-primary'}`}
           >
             <HeartHandshake size={14} /> Charities
           </button>
         </div>

         <div className="max-h-[400px] overflow-y-auto space-y-3 pr-2 scrollbar-hide">
           {modalTab === 'heir' ? (
             heirs.length === 0 ? <p className="text-center text-muted font-bold uppercase tracking-widest p-12 text-[10px] italic">No registered heirs detected.</p> :
             heirs.map(heir => (
               <button 
                 key={heir.id}
                 onClick={() => addRecipient(heir.id, 'heir')}
                 className="w-full text-left p-5 rounded-2xl border border-base bg-surface/50 hover:border-brand-primary/40 hover:bg-surface transition-all flex justify-between items-center group shadow-sm"
               >
                 <div>
                   <p className="font-bold text-primary tracking-tight group-hover:text-brand-primary transition-colors">{heir.name}</p>
                   <p className="text-[10px] font-mono text-muted mt-1 uppercase tracking-widest">{heir.email}</p>
                 </div>
                 <ArrowRight size={18} className="text-muted group-hover:text-brand-primary group-hover:translate-x-1 transition-all" />
               </button>
             ))
           ) : (
             charities.map(charity => (
               <button 
                 key={charity.id}
                 onClick={() => addRecipient(charity.id, 'charity')}
                 className="w-full text-left p-5 rounded-2xl border border-base bg-surface/50 hover:border-brand-gold/40 hover:bg-surface transition-all flex justify-between items-center group shadow-sm"
               >
                 <div className="pr-4">
                   <p className="font-bold text-primary tracking-tight group-hover:text-brand-gold transition-colors">{charity.name}</p>
                   <p className="text-[9px] text-brand-gold/60 font-bold uppercase tracking-widest mt-1 mb-2">{charity.category}</p>
                   <p className="text-xs text-primary0 italic line-clamp-1">{charity.description}</p>
                 </div>
                 <Plus size={18} className="text-muted group-hover:text-brand-gold transition-all flex-shrink-0" />
               </button>
             ))
           )}
         </div>
      </Modal>
    </div>
  );
}
