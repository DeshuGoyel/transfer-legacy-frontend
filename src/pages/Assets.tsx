import { useState, useEffect } from 'react';
import { useStore, Asset } from '../store/useStore';
import {
  Wallet, Plus, Edit2, Trash2, Box, Briefcase,
  FileText, Search, Shield, Lock, Key, Check
} from 'lucide-react';
import Badge from '../components/ui/Badge';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import toast from 'react-hot-toast';
import { calculateProjection } from '../utils/mathUtils';
import { cn } from '../utils/cn';

const assetSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  type: z.string().min(1, 'Type is required'),
  value: z.number().optional().or(z.nan()),
  notes: z.string().optional()
});

const typeIconMap: Record<string, React.ElementType> = {
  crypto: Wallet,
  wallet: Wallet,
  nft: Box,
  document: FileText,
  legal: FileText,
  account: Key,
  login: Key,
  retirement: Briefcase,
  bank: Briefcase,
  institutional: Briefcase
};

function getAssetIcon(type?: string): React.ElementType {
  if (!type) return Lock;
  const key = type.toLowerCase();
  for (const k of Object.keys(typeIconMap)) {
    if (key.includes(k)) return typeIconMap[k];
  }
  return Lock;
}

export default function Assets() {
  const { assets, addAsset, updateAsset, deleteAsset, fetchAssets, heirs, guardians } = useStore();
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  const tabs = ['All', 'Crypto', 'NFTs', 'Documents', 'Accounts', 'Institutional', 'Other'];

  const filteredAssets = assets.filter(a => {
    // 1. Filter by search query
    const matchSearch = (a.name || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
                        (a.type || '').toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchSearch) return false;

    // 2. Filter by sector tab
    if (activeTab === 'All') return true;
    const type = (a.type || '').toLowerCase();
    if (activeTab === 'Crypto') return type === 'crypto' || type === 'wallet';
    if (activeTab === 'NFTs') return type === 'nft';
    if (activeTab === 'Documents') return type === 'document' || type === 'legal';
    if (activeTab === 'Accounts') return type === 'account' || type === 'login';
    if (activeTab === 'Institutional') return type === 'retirement' || type === 'bank';
    return type !== 'crypto' && type !== 'wallet' && type !== 'nft' && 
           type !== 'document' && type !== 'legal' && type !== 'account' && 
           type !== 'login' && type !== 'retirement' && type !== 'bank';
  });

  // Keep track of the currently selected asset object
  const selectedAsset = assets.find(a => a.id === selectedAssetId) || filteredAssets[0] || null;

  // Sync selected ID if none is set or if the current choice is invalid
  useEffect(() => {
    if (selectedAsset && selectedAsset.id !== selectedAssetId) {
      setSelectedAssetId(selectedAsset.id);
    }
  }, [selectedAsset, selectedAssetId]);

  const getCount = (tab: string) => {
    return assets.filter(a => {
      if (tab === 'All') return true;
      const type = (a.type || '').toLowerCase();
      if (tab === 'Crypto') return type === 'crypto' || type === 'wallet';
      if (tab === 'NFTs') return type === 'nft';
      if (tab === 'Documents') return type === 'document' || type === 'legal';
      if (tab === 'Accounts') return type === 'account' || type === 'login';
      if (tab === 'Institutional') return type === 'retirement' || type === 'bank';
      return type !== 'crypto' && type !== 'wallet' && type !== 'nft' && 
             type !== 'document' && type !== 'legal' && type !== 'account' && 
             type !== 'login' && type !== 'retirement' && type !== 'bank';
    }).length;
  };

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(assetSchema)
  });

  const handleSelectAsset = (id: string) => {
    setSelectedAssetId(id);
    setIsEditing(false);
    setIsAdding(false);
  };

  const handleStartAdd = () => {
    setIsAdding(true);
    setIsEditing(false);
    reset({ name: '', type: 'Crypto', value: 0, notes: '' });
  };

  const handleStartEdit = (asset: Asset) => {
    setIsEditing(true);
    setIsAdding(false);
    reset({
      name: asset.name || '',
      type: asset.type || 'Crypto',
      value: asset.value || 0,
      notes: asset.instructions || asset.notes || ''
    });
  };

  const handleCancelForm = () => {
    setIsEditing(false);
    setIsAdding(false);
    reset();
  };

  const onSubmit = async (data: z.infer<typeof assetSchema>) => {
    try {
      const notesVal = data.notes || '';
      if (isEditing && selectedAssetId) {
        await updateAsset(selectedAssetId, {
          name: data.name,
          type: data.type,
          value: Number(data.value) || 0,
          instructions: notesVal,
          notes: notesVal,
        } as Partial<Asset>);
        toast.success('Vault record updated');
      } else if (isAdding) {
        await addAsset({
          name: data.name,
          type: data.type,
          value: Number(data.value) || 0,
          instructions: notesVal,
          notes: notesVal,
          status: 'Protected',
          date: new Date().toISOString().split('T')[0],
          tags: [data.type.toLowerCase()]
        } as Omit<Asset, 'id'>);
        
        toast.success('Asset secured in vault');
      }
      setIsEditing(false);
      setIsAdding(false);
      reset();
      fetchAssets();
    } catch (err) {
      toast.error('Failed to save asset record');
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to permanently delete this vault item?')) {
      await deleteAsset(id);
      toast.success('Removed from vault');
      setSelectedAssetId(null);
      fetchAssets();
    }
  };

  const handleAddTemplate = async (templateType: string) => {
    try {
      if (templateType === 'retirement') {
        await addAsset({
          name: 'Capital Trust Retirement',
          type: 'Retirement',
          value: 150000,
          growthRate: 0.07,
          status: 'Protected',
          date: new Date().toISOString().split('T')[0],
          tags: ['retirement', 'institutional', 'long-term'],
          notes: 'Institutional retirement fund. Managed via primary brokerage.'
        } as Omit<Asset, 'id'>);
        toast.success('Institutional template added');
      } else if (templateType === 'crypto') {
        await addAsset({
          name: 'Hardware Ledger (Cold Storage)',
          type: 'Crypto',
          value: 245000,
          growthRate: 0.12,
          status: 'Protected',
          date: new Date().toISOString().split('T')[0],
          tags: ['btc', 'cold'],
          notes: 'Seed phrase stored in safe. Emergency access granted to Sarah.'
        } as Omit<Asset, 'id'>);
        toast.success('Crypto Wallet template added');
      }
      fetchAssets();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-page text-primary flex flex-col lg:flex-row h-[calc(100vh-56px)] overflow-hidden" style={{ background: 'var(--color-bg-page)' }}>
      
      {/* ── COLUMN 1: Sectors (Leftmost) ── */}
      <aside className="w-full lg:w-[180px] shrink-0 border-b lg:border-b-0 lg:border-r border-[rgba(255,255,255,0.06)] bg-[#0C0C12]/40 p-3 flex flex-row lg:flex-col gap-1 overflow-x-auto lg:overflow-x-visible lg:overflow-y-auto scrollbar-none shrink-0">
        <p className="hidden lg:block px-3 py-2 text-[10px] font-semibold tracking-[0.14em] uppercase" style={{ color: '#5C596A' }}>
          Sectors
        </p>
        {tabs.map(tab => {
          const count = getCount(tab);
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setIsEditing(false);
                setIsAdding(false);
              }}
              className={cn(
                "flex items-center justify-between px-3 py-2 rounded-[6px] text-[12px] font-medium transition-all w-auto lg:w-full whitespace-nowrap lg:whitespace-normal shrink-0",
                isActive 
                  ? "bg-brand-primary-dim border border-brand-primary/18" 
                  : "hover:bg-[rgba(255,255,255,0.025)] border border-transparent"
              )}
              style={isActive ? { color: 'var(--color-brand-primary)' } : { color: '#9B97A3' }}
            >
              <span>{tab}</span>
              {count > 0 && (
                <span 
                  className={cn(
                    "hidden lg:inline-block text-[9px] px-1.5 py-0.5 rounded-[4px] font-mono leading-none ml-2 border",
                    isActive 
                      ? "border-brand-primary/25 bg-brand-primary-dim text-brand-primary" 
                      : "border-border-base bg-[#12131A] text-[#5C596A]"
                  )}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </aside>

      {/* ── COLUMN 2: Vault Item List (Center) ── */}
      <section className="w-full lg:w-[340px] shrink-0 border-b lg:border-b-0 lg:border-r border-[rgba(255,255,255,0.06)] bg-[#090A0F] flex flex-col h-[380px] lg:h-full shrink-0">
        {/* Search and Action area */}
        <div className="p-4 border-b border-[rgba(255,255,255,0.06)] flex flex-col gap-3 shrink-0">
          <div className="relative flex items-center">
            <Search className="absolute left-3 w-4 h-4" style={{ color: '#5C596A' }} />
            <input
              type="text"
              placeholder="Search vault items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#12131A] border border-border-base rounded-[8px] pl-9 pr-4 py-2 text-[13px] text-white focus:border-brand-primary/60 placeholder:text-[#5C596A] outline-none transition-colors"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleStartAdd}
              className="flex-1 inline-flex items-center justify-center gap-1.5 h-9 rounded-[6px] text-[12px] font-semibold text-white transition-opacity hover:opacity-85"
              style={{ background: 'var(--color-brand-primary)' }}
            >
              <Plus size={14} /> New Record
            </button>
            <div className="relative group">
              <button
                className="h-9 px-3 rounded-[6px] text-[12px] font-medium border border-[rgba(255,255,255,0.07)] hover:bg-[rgba(255,255,255,0.03)] text-[#9B97A3] flex items-center justify-center"
              >
                Template
              </button>
              <div className="absolute right-0 top-full mt-1 w-44 bg-[#12131A] border border-[rgba(255,255,255,0.08)] rounded-[8px] shadow-2xl p-1.5 hidden group-hover:block z-50">
                <button
                  onClick={() => handleAddTemplate('crypto')}
                  className="w-full text-left px-2.5 py-1.5 rounded-[4px] text-[11px] font-semibold text-[#9B97A3] hover:text-white hover:bg-[rgba(255,255,255,0.03)] flex items-center gap-2"
                >
                  <Wallet size={12} className="text-brand-primary" /> Crypto Wallet
                </button>
                <button
                  onClick={() => handleAddTemplate('retirement')}
                  className="w-full text-left px-2.5 py-1.5 rounded-[4px] text-[11px] font-semibold text-[#9B97A3] hover:text-white hover:bg-[rgba(255,255,255,0.03)] flex items-center gap-2"
                >
                  <Briefcase size={12} className="text-brand-primary" /> Retirement Account
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable list */}
        <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
          {filteredAssets.length === 0 ? (
            <div className="text-center py-12 px-4">
              <Lock size={20} className="mx-auto mb-2 text-[#5C596A]" strokeWidth={1.5} />
              <p className="text-[13px] font-medium text-[#E9E6DF]">No records found</p>
              <p className="text-[11px] text-[#5C596A] mt-0.5">Adjust filter or add a new record.</p>
            </div>
          ) : (
            filteredAssets.map(asset => {
              const Icon = getAssetIcon(asset.type);
              const isSelected = selectedAssetId === asset.id;
              return (
                <button
                  key={asset.id}
                  onClick={() => handleSelectAsset(asset.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-[6px] text-left transition-colors relative group",
                    isSelected 
                      ? "bg-[rgba(255,255,255,0.04)]" 
                      : "hover:bg-[rgba(255,255,255,0.015)]"
                  )}
                >
                  {/* Left orange/gold accent bar */}
                  {isSelected && (
                    <span 
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-[3.5px] h-[22px] rounded-full bg-brand-primary"
                    />
                  )}
                  {/* Icon */}
                  <div
                    className={cn(
                      "w-7 h-7 rounded-[6px] flex items-center justify-center shrink-0 border transition-colors",
                      isSelected
                        ? "border-brand-primary/30 bg-brand-primary-dim"
                        : "border-[rgba(255,255,255,0.05)] bg-[#12131A] group-hover:border-[rgba(255,255,255,0.12)]"
                    )}
                  >
                    <Icon size={13} style={isSelected ? { color: 'var(--color-brand-primary)' } : { color: '#9B97A3' }} />
                  </div>
                  {/* Title & info */}
                  <div className="flex-grow min-w-0">
                    <p className="text-[13px] font-medium text-[#E9E6DF] truncate leading-tight">
                      {asset.name || 'Unnamed Record'}
                    </p>
                    <p className="text-[11px] text-[#5C596A] truncate leading-tight mt-0.5">
                      {asset.type || 'Asset'}
                    </p>
                  </div>
                  {/* Right side status / value */}
                  <div className="text-right shrink-0">
                    {asset.value && asset.value > 0 ? (
                      <p className="text-[11px] font-semibold text-[#9B97A3]">
                        ${(asset.value / 1000).toFixed(0)}k
                      </p>
                    ) : null}
                    <Badge variant={asset.status === 'Protected' ? 'success' : 'warning'} className="text-[8px] font-bold tracking-widest px-1.5 py-0 mt-0.5">
                      {asset.status === 'Protected' ? 'Encrypted' : 'Incomplete'}
                    </Badge>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </section>

      {/* ── COLUMN 3: Vault Item Detail Panel / Form Editor (Rightmost) ── */}
      <section className="flex-1 bg-[#07080B] overflow-y-auto flex flex-col h-full">
        {isAdding || isEditing ? (
          /* ── INLINE FORM EDITOR ── */
          <div className="max-w-[600px] p-6 lg:p-8 space-y-6">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-brand-primary mb-1">
                Vault Security Editor
              </p>
              <h2 className="font-display font-light text-[24px] text-white tracking-tight leading-tight">
                {isAdding ? 'Initiate Succession Protocol' : `Edit: ${selectedAsset?.name}`}
              </h2>
              <p className="text-[12px] text-[#5C596A] mt-1">
                Archived information is client-side encrypted before sending to the server.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#5C596A]">
                  Sector Designation
                </label>
                <select
                  {...register('type')}
                  className="w-full bg-[#12131A] border border-border-base rounded-[8px] px-3.5 py-2.5 text-[13px] text-white focus:border-brand-primary/40 outline-none"
                >
                  <option value="Crypto">Cryptocurrency / Web3 Wallet</option>
                  <option value="NFT">Digital Collectible (NFT)</option>
                  <option value="Document">Legacy Document / Legal</option>
                  <option value="Account">Authorized Login / Password</option>
                  <option value="Retirement">Retirement Fund / Institutional</option>
                  <option value="Other">Other Assets</option>
                </select>
                {errors.type?.message && (
                  <p className="text-red-400 text-[11px]">{errors.type.message as string}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#5C596A]">
                  Designation / Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. BTC Cold Vault"
                  {...register('name')}
                  className="w-full bg-[#12131A] border border-border-base rounded-[8px] px-3.5 py-2.5 text-[13px] text-white focus:border-brand-primary/40 outline-none placeholder:text-[#5C596A]"
                />
                {errors.name?.message && (
                  <p className="text-red-400 text-[11px]">{errors.name.message as string}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#5C596A]">
                  Market Valuation (USD)
                </label>
                <input
                  type="number"
                  placeholder="0.00"
                  {...register('value', { valueAsNumber: true })}
                  className="w-full bg-[#12131A] border border-border-base rounded-[8px] px-3.5 py-2.5 text-[13px] text-white focus:border-brand-primary/40 outline-none placeholder:text-[#5C596A]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#5C596A]">
                  Decryption Mandate & Instructions
                </label>
                <textarea
                  placeholder="Provide precise recovery or key distribution instructions..."
                  rows={5}
                  {...register('notes')}
                  className="w-full bg-[#12131A] border border-border-base rounded-[8px] px-3.5 py-3 text-[13px] text-white focus:border-brand-primary/40 outline-none placeholder:text-[#5C596A] leading-relaxed resize-none"
                />
              </div>

              <div className="pt-4 border-t border-[rgba(255,255,255,0.06)] flex gap-3">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-[6px] text-[13px] font-semibold text-white transition-opacity hover:opacity-85"
                  style={{ background: 'var(--color-brand-primary)' }}
                >
                  Secure Information
                </button>
                <button
                  type="button"
                  onClick={handleCancelForm}
                  className="px-6 py-2.5 rounded-[6px] text-[13px] font-semibold border border-[rgba(255,255,255,0.07)] hover:bg-[rgba(255,255,255,0.03)] text-[#9B97A3] transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        ) : selectedAsset ? (
          /* ── VAULT DETAIL PANEL ── */
          <div className="flex-1 flex flex-col">
            {/* Header Actions */}
            <div className="px-6 lg:px-8 py-4 border-b border-[rgba(255,255,255,0.06)] flex items-center justify-between shrink-0 bg-[#0C0D13]/40">
              <div className="flex items-center gap-2 text-[11px] font-semibold tracking-wider text-[#5C596A]">
                <Shield size={12} className="text-brand-primary" />
                <span>Zero-Knowledge Locked</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleStartEdit(selectedAsset)}
                  className="h-8 px-3 rounded-[6px] text-[12px] font-medium border border-[rgba(255,255,255,0.07)] hover:bg-[rgba(255,255,255,0.03)] text-[#9B97A3] flex items-center gap-1.5 transition-colors"
                >
                  <Edit2 size={11} /> Edit
                </button>
                <button
                  onClick={() => handleDelete(selectedAsset.id)}
                  className="h-8 px-3 rounded-[6px] text-[12px] font-medium border border-[rgba(255,255,255,0.07)] hover:border-[rgba(239,68,68,0.15)] hover:bg-[rgba(239,68,68,0.05)] text-[#9B97A3] hover:text-red-400 flex items-center gap-1.5 transition-colors"
                >
                  <Trash2 size={11} /> Delete
                </button>
              </div>
            </div>

            {/* Content Area */}
            <div className="p-6 lg:p-8 space-y-8 flex-1 max-w-[700px]">
              {/* Asset Title Block */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-500">
                    {selectedAsset.type} Protocol Record
                  </p>
                </div>
                <h1 className="font-display font-light text-[32px] text-white tracking-tight leading-none">
                  {selectedAsset.name}
                </h1>
                <p className="text-[11px] mt-2" style={{ color: '#5C596A' }}>
                  Vault Item ID: <span className="font-mono">{selectedAsset.id}</span> • Secured on {selectedAsset.date || 'unknown'}
                </p>
              </div>

              {/* Valuation pill */}
              <div 
                className="p-5 rounded-[8px] flex items-center justify-between"
                style={{ background: 'var(--color-bg-surface)', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em]" style={{ color: '#5C596A' }}>
                    Asset Valuation
                  </p>
                  <p className="text-[28px] font-display font-light leading-none mt-1.5 text-white">
                    ${selectedAsset.value?.toLocaleString() || '0'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[#5C596A]">
                    Protection Scope
                  </p>
                  <span 
                    className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.10em] px-2 py-0.5 rounded-[4px] mt-1.5"
                    style={{ background: 'rgba(34,197,94,0.08)', color: '#22C55E', border: '1px solid rgba(34,197,94,0.12)' }}
                  >
                    <Check size={10} /> Active Shield
                  </span>
                </div>
              </div>

              {/* SECTION: Cryptographic Parameters */}
              <div className="space-y-3">
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] border-b border-[rgba(255,255,255,0.06)] pb-2" style={{ color: '#5C596A' }}>
                  Cryptographic Parameters
                </p>
                <div className="grid grid-cols-2 gap-4 pt-1">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-[#5C596A]">Encryption Level</p>
                    <p className="text-[13px] font-medium text-white mt-0.5 flex items-center gap-1.5">
                      <Shield size={12} className="text-brand-primary" />
                      {selectedAsset.encryptionLevel || 'Quantum-Resistant'}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-[#5C596A]">Zero-Knowledge Status</p>
                    <p className="text-[13px] font-medium text-white mt-0.5 flex items-center gap-1.5">
                      <Check size={12} style={{ color: '#22C55E' }} /> Key Sealed
                    </p>
                  </div>
                </div>
              </div>

              {/* SECTION: Succession Mandate */}
              <div className="space-y-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] border-b border-[rgba(255,255,255,0.06)] pb-2" style={{ color: '#5C596A' }}>
                  Succession Mandate
                </p>
                <div className="bg-[#0C0D13]/60 border border-[rgba(255,255,255,0.05)] rounded-[8px] p-4 space-y-3">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-[#5C596A]">Decryption Instructions</p>
                    <p className="text-[13px] text-[#9B97A3] leading-relaxed mt-1 whitespace-pre-wrap">
                      {selectedAsset.instructions || selectedAsset.notes || 'No succession instructions provided. Click edit to specify instructions.'}
                    </p>
                  </div>
                  <div className="pt-3 border-t border-[rgba(255,255,255,0.05)] flex flex-wrap gap-4 text-[12px] text-[#9B97A3]">
                    <div>
                      <span className="text-[#5C596A]">Assigned Heir: </span>
                      <span className="font-semibold text-white">
                        {heirs.find(h => h.id === selectedAsset.beneficiaryId)?.name || 'Emily Asha (Daughter)'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[#5C596A]">Guardian Quorum: </span>
                      <span className="font-semibold text-white">
                        {guardians.filter(g => g.status === 'Confirmed').length >= 2 ? '2-of-3 Confirmed' : '1-of-2 Confirmed'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION: Archival Projection */}
              {(selectedAsset.growthRate || selectedAsset.type === 'Retirement' || selectedAsset.type === 'Crypto') && (
                <div className="space-y-3">
                  <p className="text-[11px] font-bold uppercase tracking-[0.14em] border-b border-[rgba(255,255,255,0.06)] pb-2" style={{ color: '#5C596A' }}>
                    Archival Financial Projection
                  </p>
                  <div className="flex items-center justify-between p-4 bg-brand-primary-dim border border-brand-primary/10 rounded-[8px]">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-[#5C596A]">Est. Value (10 Years)</p>
                      <p className="text-[20px] font-display font-light text-white leading-none mt-1">
                        ${calculateProjection(selectedAsset.value || 0, selectedAsset.growthRate || 0.07, 10).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-[#5C596A]">Archival APY</p>
                      <p className="text-[14px] font-medium text-brand-primary mt-1">
                        +7.0% compounded
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* ── EMPTY STATE ── */
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 bg-brand-primary-dim border border-brand-primary/15"
            >
              <Lock size={22} className="text-brand-primary" strokeWidth={1.5} />
            </div>
            <h3 className="text-[16px] font-medium text-[#E9E6DF]">No Selected Item</h3>
            <p className="text-[12px] text-[#5C596A] mt-1 max-w-xs leading-normal">
              Select a vault item in the list or secure a new account.
            </p>
            <button
              onClick={handleStartAdd}
              className="mt-5 inline-flex items-center gap-1.5 h-9 px-4 rounded-[6px] text-[12px] font-semibold text-white transition-opacity hover:opacity-85 cursor-pointer"
              style={{ background: 'var(--color-brand-primary)' }}
            >
              <Plus size={14} /> Secure first account
            </button>
          </div>
        )}
      </section>

    </div>
  );
}
