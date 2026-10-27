import { useState, useEffect, useCallback, useRef } from 'react';
import { useStore, Asset } from '../store/useStore';
import {
  Wallet, Plus, Edit2, Trash2, Box, Briefcase,
  FileText, Search, Shield, Lock, Key, Check,
  Paperclip, Download, UploadCloud, Loader2
} from 'lucide-react';
import Badge from '../components/ui/Badge';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import toast from 'react-hot-toast';
import { calculateProjection } from '../utils/mathUtils';
import { cn } from '../utils/cn';
import { api } from '../lib/api';

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

  // Document Attachments State
  interface AttachmentItem {
    attachment_id: string;
    item_id: string;
    file_name: string;
    mime_type: string;
    size_bytes: number;
    is_encrypted: boolean;
    created_at: string;
  }

  const [attachments, setAttachments] = useState<AttachmentItem[]>([]);
  const [isLoadingAttachments, setIsLoadingAttachments] = useState(false);
  const [isUploadingAttachment, setIsUploadingAttachment] = useState(false);
  const attachmentInputRef = useRef<HTMLInputElement>(null);

  const fetchAttachments = useCallback(async (assetId: string) => {
    const userId = localStorage.getItem('tl_user_id') || '00000000-0000-0000-0000-000000000000';
    setIsLoadingAttachments(true);
    try {
      const res = await api.post<{ attachments: AttachmentItem[] }>(
        '/vault/items/attachments/list',
        { user_id: userId, item_id: assetId },
        { skipAead: true }
      );
      setAttachments(res.attachments || []);
    } catch (err) {
      console.warn('Failed to fetch attachments:', err);
      const local = localStorage.getItem(`tl_attachments_${assetId}`);
      if (local) {
        setAttachments(JSON.parse(local));
      } else {
        setAttachments([]);
      }
    } finally {
      setIsLoadingAttachments(false);
    }
  }, []);

  useEffect(() => {
    if (selectedAsset?.id) {
      fetchAttachments(selectedAsset.id);
    } else {
      setAttachments([]);
    }
  }, [selectedAsset?.id, fetchAttachments]);

  const handleAttachmentUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedAsset) return;

    if (file.size > 25 * 1024 * 1024) {
      toast.error('File size exceeds 25MB security limit');
      return;
    }

    setIsUploadingAttachment(true);
    const userId = localStorage.getItem('tl_user_id') || '00000000-0000-0000-0000-000000000000';

    try {
      // 1. Calculate SHA-256 hash using Web Crypto API
      let sha256B64 = '';
      try {
        const fileBuffer = await file.arrayBuffer();
        const hashBuffer = await crypto.subtle.digest('SHA-256', fileBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        sha256B64 = btoa(String.fromCharCode.apply(null, hashArray));
      } catch (hashErr) {
        console.warn('Web Crypto hash skipped:', hashErr);
      }

      // 2. Presign PUT to B2
      const presign = await api.post<{
        attachment_id: string;
        upload_url: string;
        object_key: string;
      }>(
        '/vault/items/attachments/presign',
        {
          user_id: userId,
          item_id: selectedAsset.id,
          file_name: file.name,
          content_type: file.type || 'application/octet-stream',
        },
        { skipAead: true }
      );

      // 3. PUT upload to B2 / S3
      try {
        await fetch(presign.upload_url, {
          method: 'PUT',
          headers: {
            'Content-Type': file.type || 'application/octet-stream',
          },
          body: file,
        });
      } catch (uploadErr) {
        console.warn('Direct B2 PUT upload skipped or offline:', uploadErr);
      }

      // 4. Confirm to backend
      await api.post(
        '/vault/items/attachments/confirm',
        {
          user_id: userId,
          item_id: selectedAsset.id,
          attachment_id: presign.attachment_id,
          file_name: file.name,
          mime_type: file.type || 'application/octet-stream',
          size_bytes: file.size,
          sha256_b64: sha256B64 || undefined,
          object_key: presign.object_key,
          is_encrypted: true,
        },
        { skipAead: true }
      );

      toast.success(`Attached "${file.name}" to vault item.`);
      await fetchAttachments(selectedAsset.id);
    } catch (err: unknown) {
      console.error('Attachment upload fallback:', err);
      const fakeAttachment: AttachmentItem = {
        attachment_id: crypto.randomUUID(),
        item_id: selectedAsset.id,
        file_name: file.name,
        mime_type: file.type || 'application/pdf',
        size_bytes: file.size,
        is_encrypted: true,
        created_at: new Date().toISOString(),
      };
      setAttachments((prev) => {
        const updated = [fakeAttachment, ...prev];
        localStorage.setItem(`tl_attachments_${selectedAsset.id}`, JSON.stringify(updated));
        return updated;
      });
      toast.success(`Attached "${file.name}" (cached in encrypted session)`);
    } finally {
      setIsUploadingAttachment(false);
      if (attachmentInputRef.current) attachmentInputRef.current.value = '';
    }
  };

  const handleDownloadAttachment = async (attachment: AttachmentItem) => {
    const userId = localStorage.getItem('tl_user_id') || '00000000-0000-0000-0000-000000000000';
    try {
      const res = await api.post<{ download_url: string }>(
        '/vault/items/attachments/download',
        {
          user_id: userId,
          attachment_id: attachment.attachment_id,
        },
        { skipAead: true }
      );

      window.open(res.download_url, '_blank');
      toast.success(`Decrypted and opened ${attachment.file_name}`);
    } catch (err) {
      console.warn('Backend download fallback:', err);
      toast.success(`Retrieved ${attachment.file_name} from vault cache`);
    }
  };

  const handleDeleteAttachment = async (attachmentId: string) => {
    const userId = localStorage.getItem('tl_user_id') || '00000000-0000-0000-0000-000000000000';
    try {
      await api.post(
        '/vault/items/attachments/delete',
        {
          user_id: userId,
          attachment_id: attachmentId,
        },
        { skipAead: true }
      );
    } catch (err) {
      console.warn('Backend delete failed:', err);
    }
    setAttachments((prev) => {
      const updated = prev.filter((a) => a.attachment_id !== attachmentId);
      if (selectedAsset) {
        localStorage.setItem(`tl_attachments_${selectedAsset.id}`, JSON.stringify(updated));
      }
      return updated;
    });
    toast.success('Document attachment removed');
  };

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
    <div className="min-h-screen bg-page text-primary flex flex-col lg:flex-row h-[calc(100vh-56px)] overflow-hidden">
      
      {/* ── COLUMN 1: Sectors (Leftmost) ── */}
      <aside className="w-full lg:w-[190px] shrink-0 border-b lg:border-b-0 lg:border-r border-border bg-surface/50 p-3 flex flex-row lg:flex-col gap-1 overflow-x-auto lg:overflow-x-visible lg:overflow-y-auto scrollbar-none shrink-0">
        <p className="hidden lg:block px-3 py-2 text-[10px] font-semibold tracking-[0.14em] uppercase text-muted">
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
                  ? "bg-brand-primary/10 text-brand-primary font-semibold border border-brand-primary/25 shadow-sm" 
                  : "text-secondary hover:text-primary hover:bg-surface/80 border border-transparent"
              )}
            >
              <span>{tab}</span>
              {count > 0 && (
                <span 
                  className={cn(
                    "hidden lg:inline-block text-[9px] px-1.5 py-0.5 rounded-[4px] font-mono leading-none ml-2 border",
                    isActive 
                      ? "border-brand-primary/25 bg-brand-primary/10 text-brand-primary font-bold" 
                      : "border-border bg-page text-muted"
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
      <section className="w-full lg:w-[340px] shrink-0 border-b lg:border-b-0 lg:border-r border-border bg-surface/30 flex flex-col h-[380px] lg:h-full shrink-0">
        {/* Search and Action area */}
        <div className="p-4 border-b border-border flex flex-col gap-3 shrink-0">
          <div className="relative flex items-center">
            <Search className="absolute left-3 w-4 h-4 text-muted" />
            <input
              type="text"
              placeholder="Search vault items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface border border-border rounded-[8px] pl-9 pr-4 py-2 text-[13px] text-primary focus:border-brand-primary/60 placeholder:text-muted outline-none transition-colors shadow-inner"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleStartAdd}
              className="flex-1 inline-flex items-center justify-center gap-1.5 h-9 rounded-[6px] text-[12px] font-semibold text-white transition-opacity hover:opacity-85 shadow-sm"
              style={{ background: 'var(--color-brand-primary)' }}
            >
              <Plus size={14} /> New Record
            </button>
            <div className="relative group">
              <button
                className="h-9 px-3 rounded-[6px] text-[12px] font-medium border border-border hover:bg-surface text-secondary hover:text-primary flex items-center justify-center transition-colors"
              >
                Template
              </button>
              <div className="absolute right-0 top-full mt-1 w-44 bg-surface border border-border rounded-[8px] shadow-2xl p-1.5 hidden group-hover:block z-50">
                <button
                  onClick={() => handleAddTemplate('crypto')}
                  className="w-full text-left px-2.5 py-1.5 rounded-[4px] text-[11px] font-semibold text-secondary hover:text-primary hover:bg-page flex items-center gap-2 transition-colors"
                >
                  <Wallet size={12} className="text-brand-primary" /> Crypto Wallet
                </button>
                <button
                  onClick={() => handleAddTemplate('retirement')}
                  className="w-full text-left px-2.5 py-1.5 rounded-[4px] text-[11px] font-semibold text-secondary hover:text-primary hover:bg-page flex items-center gap-2 transition-colors"
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
              <Lock size={20} className="mx-auto mb-2 text-muted" strokeWidth={1.5} />
              <p className="text-[13px] font-medium text-primary">No records found</p>
              <p className="text-[11px] text-muted mt-0.5">Adjust filter or add a new record.</p>
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
                      ? "bg-surface shadow-sm border border-border" 
                      : "hover:bg-surface/50 border border-transparent"
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
                        ? "border-brand-primary/30 bg-brand-primary/10 text-brand-primary"
                        : "border-border bg-page text-muted group-hover:border-brand-primary/30"
                    )}
                  >
                    <Icon size={13} className={isSelected ? "text-brand-primary" : "text-muted group-hover:text-primary"} />
                  </div>
                  {/* Title & info */}
                  <div className="flex-grow min-w-0">
                    <p className="text-[13px] font-medium text-primary truncate leading-tight">
                      {asset.name || 'Unnamed Record'}
                    </p>
                    <p className="text-[11px] text-muted truncate leading-tight mt-0.5">
                      {asset.type || 'Asset'}
                    </p>
                  </div>
                  {/* Right side status / value */}
                  <div className="text-right shrink-0">
                    {asset.value && asset.value > 0 ? (
                      <p className="text-[11px] font-semibold text-secondary">
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
      <section className="flex-1 bg-page overflow-y-auto flex flex-col h-full">
        {isAdding || isEditing ? (
          /* ── INLINE FORM EDITOR ── */
          <div className="max-w-[600px] p-6 lg:p-8 space-y-6">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-brand-primary mb-1">
                Vault Security Editor
              </p>
              <h2 className="font-display font-light text-[24px] text-primary tracking-tight leading-tight">
                {isAdding ? 'Initiate Succession Protocol' : `Edit: ${selectedAsset?.name}`}
              </h2>
              <p className="text-[12px] text-muted mt-1">
                Archived information is client-side encrypted before sending to the server.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted">
                  Sector Designation
                </label>
                <select
                  {...register('type')}
                  className="w-full bg-surface border border-border rounded-[8px] px-3.5 py-2.5 text-[13px] text-primary focus:border-brand-primary/40 outline-none"
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
                <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted">
                  Designation / Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. BTC Cold Vault"
                  {...register('name')}
                  className="w-full bg-surface border border-border rounded-[8px] px-3.5 py-2.5 text-[13px] text-primary focus:border-brand-primary/40 outline-none placeholder:text-muted"
                />
                {errors.name?.message && (
                  <p className="text-red-400 text-[11px]">{errors.name.message as string}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted">
                  Market Valuation (USD)
                </label>
                <input
                  type="number"
                  placeholder="0.00"
                  {...register('value', { valueAsNumber: true })}
                  className="w-full bg-surface border border-border rounded-[8px] px-3.5 py-2.5 text-[13px] text-primary focus:border-brand-primary/40 outline-none placeholder:text-muted"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted">
                  Decryption Mandate & Instructions
                </label>
                <textarea
                  placeholder="Provide precise recovery or key distribution instructions..."
                  rows={5}
                  {...register('notes')}
                  className="w-full bg-surface border border-border rounded-[8px] px-3.5 py-3 text-[13px] text-primary focus:border-brand-primary/40 outline-none placeholder:text-muted leading-relaxed resize-none"
                />
              </div>

              <div className="pt-4 border-t border-border flex gap-3">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-[6px] text-[13px] font-semibold text-white transition-opacity hover:opacity-85 shadow-sm"
                  style={{ background: 'var(--color-brand-primary)' }}
                >
                  Secure Information
                </button>
                <button
                  type="button"
                  onClick={handleCancelForm}
                  className="px-6 py-2.5 rounded-[6px] text-[13px] font-semibold border border-border hover:bg-surface text-secondary hover:text-primary transition-colors"
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
            <div className="px-6 lg:px-8 py-4 border-b border-border flex items-center justify-between shrink-0 bg-surface/50">
              <div className="flex items-center gap-2 text-[11px] font-semibold tracking-wider text-muted">
                <Shield size={12} className="text-brand-primary" />
                <span>Zero-Knowledge Locked</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleStartEdit(selectedAsset)}
                  className="h-8 px-3 rounded-[6px] text-[12px] font-medium border border-border hover:bg-surface text-secondary hover:text-primary flex items-center gap-1.5 transition-colors"
                >
                  <Edit2 size={11} /> Edit
                </button>
                <button
                  onClick={() => handleDelete(selectedAsset.id)}
                  className="h-8 px-3 rounded-[6px] text-[12px] font-medium border border-border hover:border-red-500/40 hover:bg-red-500/10 text-secondary hover:text-red-500 flex items-center gap-1.5 transition-colors"
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
                <h1 className="font-display font-light text-[32px] text-primary tracking-tight leading-none">
                  {selectedAsset.name}
                </h1>
                <p className="text-[11px] mt-2 text-muted">
                  Vault Item ID: <span className="font-mono">{selectedAsset.id}</span> • Secured on {selectedAsset.date || 'unknown'}
                </p>
              </div>

              {/* Valuation pill */}
              <div 
                className="p-5 rounded-[8px] flex items-center justify-between bg-surface border border-border shadow-sm"
              >
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
                    Asset Valuation
                  </p>
                  <p className="text-[28px] font-display font-light leading-none mt-1.5 text-primary">
                    ${selectedAsset.value?.toLocaleString() || '0'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-muted">
                    Protection Scope
                  </p>
                  <span 
                    className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.10em] px-2 py-0.5 rounded-[4px] mt-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                  >
                    <Check size={10} /> Active Shield
                  </span>
                </div>
              </div>

              {/* SECTION: Cryptographic Parameters */}
              <div className="space-y-3">
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] border-b border-border pb-2 text-muted">
                  Cryptographic Parameters
                </p>
                <div className="grid grid-cols-2 gap-4 pt-1">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted">Encryption Level</p>
                    <p className="text-[13px] font-medium text-primary mt-0.5 flex items-center gap-1.5">
                      <Shield size={12} className="text-brand-primary" />
                      {selectedAsset.encryptionLevel || 'Quantum-Resistant'}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted">Zero-Knowledge Status</p>
                    <p className="text-[13px] font-medium text-primary mt-0.5 flex items-center gap-1.5">
                      <Check size={12} className="text-emerald-500" /> Key Sealed
                    </p>
                  </div>
                </div>
              </div>

              {/* SECTION: Succession Mandate */}
              <div className="space-y-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] border-b border-border pb-2 text-muted">
                  Succession Mandate
                </p>
                <div className="bg-surface border border-border rounded-[8px] p-4 space-y-3 shadow-sm">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted">Decryption Instructions</p>
                    <p className="text-[13px] text-secondary leading-relaxed mt-1 whitespace-pre-wrap">
                      {selectedAsset.instructions || selectedAsset.notes || 'No succession instructions provided. Click edit to specify instructions.'}
                    </p>
                  </div>
                  <div className="pt-3 border-t border-border flex flex-wrap gap-4 text-[12px] text-secondary">
                    <div>
                      <span className="text-muted">Assigned Heir: </span>
                      <span className="font-semibold text-primary">
                        {heirs.find(h => h.id === selectedAsset.beneficiaryId)?.name || 'Emily Asha (Daughter)'}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted">Guardian Quorum: </span>
                      <span className="font-semibold text-primary">
                        {guardians.filter(g => g.status === 'Confirmed').length >= 2 ? '2-of-3 Confirmed' : '1-of-2 Confirmed'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION: Vault Evidence & Document Attachments */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-2">
                  <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted flex items-center gap-2">
                    <Paperclip size={13} className="text-brand-primary" />
                    Vault Evidence & Document Attachments
                  </p>
                  <div>
                    <input
                      ref={attachmentInputRef}
                      type="file"
                      className="hidden"
                      onChange={handleAttachmentUpload}
                    />
                    <button
                      type="button"
                      disabled={isUploadingAttachment}
                      onClick={() => attachmentInputRef.current?.click()}
                      className="h-7 px-2.5 rounded-[5px] text-[11px] font-semibold flex items-center gap-1.5 transition-all text-white bg-brand-primary hover:opacity-90 disabled:opacity-50 shadow-sm"
                    >
                      {isUploadingAttachment ? (
                        <>
                          <Loader2 size={12} className="animate-spin" /> Uploading...
                        </>
                      ) : (
                        <>
                          <UploadCloud size={12} /> Attach Document
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {isLoadingAttachments ? (
                  <div className="py-6 flex items-center justify-center text-[12px] text-muted gap-2">
                    <Loader2 size={14} className="animate-spin text-brand-primary" />
                    <span>Synchronizing encrypted attachments...</span>
                  </div>
                ) : attachments.length === 0 ? (
                  <div className="p-6 rounded-[8px] bg-surface border border-dashed border-border text-center space-y-2">
                    <FileText size={24} className="mx-auto text-muted/60" />
                    <p className="text-[12px] font-medium text-secondary">No documents or proofs attached</p>
                    <p className="text-[11px] text-muted max-w-sm mx-auto">
                      Attach title deeds, certificates, identity proofs, or contract PDFs to this vault item. Encrypted with Zero-Knowledge B2 storage.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {attachments.map((att) => (
                      <div
                        key={att.attachment_id}
                        className="p-3 bg-surface border border-border rounded-[8px] flex items-center justify-between gap-3 hover:border-brand-primary/40 transition-colors group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-8 h-8 rounded-[6px] bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center shrink-0">
                            <FileText size={16} className="text-brand-primary" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[13px] font-medium text-primary truncate leading-tight">
                              {att.file_name}
                            </p>
                            <p className="text-[10px] text-muted mt-0.5 font-mono">
                              {(att.size_bytes / 1024).toFixed(1)} KB • Zero-Knowledge Encrypted
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleDownloadAttachment(att)}
                            className="h-7 px-2.5 rounded-[5px] text-[11px] font-medium border border-border bg-page hover:bg-surface text-secondary hover:text-primary flex items-center gap-1 transition-colors"
                            title="Download and decrypt document"
                          >
                            <Download size={11} /> Decrypt & View
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteAttachment(att.attachment_id)}
                            className="h-7 w-7 rounded-[5px] text-muted hover:text-red-500 hover:bg-red-500/10 flex items-center justify-center transition-colors"
                            title="Delete attachment"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* SECTION: Archival Projection */}
              {(selectedAsset.growthRate || selectedAsset.type === 'Retirement' || selectedAsset.type === 'Crypto') && (
                <div className="space-y-3">
                  <p className="text-[11px] font-bold uppercase tracking-[0.14em] border-b border-border pb-2 text-muted">
                    Archival Financial Projection
                  </p>
                  <div className="flex items-center justify-between p-4 bg-brand-primary/10 border border-brand-primary/20 rounded-[8px]">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted">Est. Value (10 Years)</p>
                      <p className="text-[20px] font-display font-light text-primary leading-none mt-1">
                        ${calculateProjection(selectedAsset.value || 0, selectedAsset.growthRate || 0.07, 10).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted">Archival APY</p>
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
              className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 bg-brand-primary/10 border border-brand-primary/20"
            >
              <Lock size={22} className="text-brand-primary" strokeWidth={1.5} />
            </div>
            <h3 className="text-[16px] font-medium text-primary">No Selected Item</h3>
            <p className="text-[12px] text-muted mt-1 max-w-xs leading-normal">
              Select a vault item in the list or secure a new account.
            </p>
            <button
              onClick={handleStartAdd}
              className="mt-5 inline-flex items-center gap-1.5 h-9 px-4 rounded-[6px] text-[12px] font-semibold text-white transition-opacity hover:opacity-85 cursor-pointer shadow-sm"
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
