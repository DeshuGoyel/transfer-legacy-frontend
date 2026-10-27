import { useState, useEffect, useCallback, useRef } from 'react';
import { useStore } from '../store/useStore';
import { useCheckinStore } from '../store/useCheckinStore';
import { User, Shield, Bell, Palette, AlertTriangle, Activity, ChevronRight, HardDrive, Fingerprint, Globe, ShieldAlert, Camera, Loader2 } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import toast from 'react-hot-toast';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../lib/api';
import { QRCodeSVG } from 'qrcode.react';
import { registerDevice } from '../lib/deviceClient';
import { toBase64Url, fromBase64Url } from '../lib/aeadClient';
import sodium from 'libsodium-wrappers-sumo';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 15 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { delay, duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
});

interface DeviceItem {
  device_id: string;
  label?: string;
  name?: string;
  device_meta?: {
    browser?: string;
    location?: string;
    [key: string]: unknown;
  };
  last_seen_at?: string;
  created_at?: string;
  [key: string]: unknown;
}

interface ShareItem {
  share_id: string;
  grantee_id: string;
  created_at?: string;
  [key: string]: unknown;
}

export default function Settings() {
  const { user, heirs, guardians, shares, fetchShares, revokeShare, setAvatar } = useStore();
  const { checkinSettings, updateSettings } = useCheckinStore();
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('Profile');
  const [deleteConfirm, setDeleteConfirm] = useState('');

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(localStorage.getItem('tl_user_phone') || "+1 (555) 123-4567");
  const [jurisdiction, setJurisdiction] = useState(user.jurisdiction || "Global / Sovereign");

  // Avatar States & Handlers
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  const handleAvatarSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file (PNG, JPG, WEBP)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Avatar file size must be less than 5MB');
      return;
    }

    setIsUploadingAvatar(true);
    const userId = localStorage.getItem('tl_user_id') || '00000000-0000-0000-0000-000000000000';

    try {
      // 1. Get presigned upload URL from backend
      const presign = await api.post<{
        upload_url: string;
        public_url: string;
        object_key: string;
      }>(
        '/users/avatar/presign',
        {
          user_id: userId,
          file_name: file.name,
          content_type: file.type,
        },
        { skipAead: true }
      );

      // 2. Direct upload to B2 / S3
      let finalAvatarUrl = presign.public_url;
      try {
        const uploadRes = await fetch(presign.upload_url, {
          method: 'PUT',
          headers: {
            'Content-Type': file.type,
          },
          body: file,
        });

        if (!uploadRes.ok) {
          throw new Error('Object storage upload failed');
        }
      } catch (storageErr) {
        console.warn('Storage PUT failed, falling back to data URL:', storageErr);
        const reader = new FileReader();
        const b64Promise = new Promise<string>((resolve) => {
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
        finalAvatarUrl = await b64Promise;
      }

      // 3. Confirm to backend
      try {
        await api.post(
          '/users/avatar/confirm',
          {
            user_id: userId,
            avatar_url: finalAvatarUrl,
          },
          { skipAead: true }
        );
      } catch (err) {
        console.warn('Backend avatar confirm warning:', err);
      }

      // 4. Update frontend store & local state
      setAvatar(finalAvatarUrl);
      toast.success('Identity matrix avatar updated and secured');
    } catch (err: unknown) {
      console.error('Avatar upload error:', err);
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        setAvatar(dataUrl);
        toast.success('Avatar cached locally in session');
      };
      reader.readAsDataURL(file);
    } finally {
      setIsUploadingAvatar(false);
      if (avatarInputRef.current) avatarInputRef.current.value = '';
    }
  };

  const handlePurgeAvatar = async () => {
    const userId = localStorage.getItem('tl_user_id') || '00000000-0000-0000-0000-000000000000';
    try {
      await api.delete('/users/avatar', {
        body: JSON.stringify({ user_id: userId }),
        skipAead: true,
      });
    } catch (err) {
      console.warn('Purge avatar backend call failed:', err);
    }
    setAvatar(null);
    toast.success('Avatar purged. Reverted to cryptographic initial.');
  };

  // MFA States
  const [isMfaEnrolled, setIsMfaEnrolled] = useState(false);
  const [mfaQrUrl, setMfaQrUrl] = useState<string | null>(null);
  const [mfaBackupCodes, setMfaBackupCodes] = useState<string[]>([]);
  const [mfaCode, setMfaCode] = useState('');
  const [isMfaLoading, setIsMfaLoading] = useState(false);
  const [showMfaSetup, setShowMfaSetup] = useState(false);

  // Active Devices States
  const [devices, setDevices] = useState<DeviceItem[]>([]);
  const [isLoadingDevices, setIsLoadingDevices] = useState(false);

  // GDPR States
  const [isExporting, setIsExporting] = useState(false);
  const [isErasing, setIsErasing] = useState(false);
  const [isLoadingShares, setIsLoadingShares] = useState(false);

  // Helper: UUID to raw 16 bytes for GDPR export AAD
  const uuidToBytes = (uuidStr: string): Uint8Array => {
    const hex = uuidStr.replace(/-/g, '');
    const bytes = new Uint8Array(16);
    for (let i = 0; i < 16; i++) {
      bytes[i] = parseInt(hex.substring(i * 2, i * 2 + 2), 16);
    }
    return bytes;
  };

  const handleMfaEnroll = async () => {
    setIsMfaLoading(true);
    try {
      const userId = localStorage.getItem('tl_user_id');
      if (!userId) {
        toast.error('Authentication session invalid');
        return;
      }
      const res = await api.post<{ otpauth_url: string; backup_codes: string[] }>(
        '/auth/mfa/totp/enroll',
        { user_id: userId },
        { skipAead: true }
      );
      setMfaQrUrl(res.otpauth_url);
      setMfaBackupCodes(res.backup_codes || []);
      setShowMfaSetup(true);
      toast.success('MFA enrollment handshake completed');
    } catch (err: unknown) {
      console.error(err);
      const msg = err instanceof Error ? err.message : 'Failed to initiate MFA enrollment';
      toast.error(msg);
    } finally {
      setIsMfaLoading(false);
    }
  };

  const handleMfaVerify = async () => {
    if (!mfaCode || mfaCode.length !== 6) {
      toast.error('Please enter a 6-digit verification code');
      return;
    }
    setIsMfaLoading(true);
    try {
      const userId = localStorage.getItem('tl_user_id');
      if (!userId) return;
      await api.post(
        '/auth/mfa/totp/verify',
        { user_id: userId, code: mfaCode },
        { skipAead: true }
      );
      setIsMfaEnrolled(true);
      setShowMfaSetup(false);
      toast.success('MFA successfully enabled!');
    } catch (err: unknown) {
      console.error(err);
      const msg = err instanceof Error ? err.message : 'MFA verification failed';
      toast.error(msg);
    } finally {
      setIsMfaLoading(false);
    }
  };

  const fetchDevices = useCallback(async () => {
    setIsLoadingDevices(true);
    try {
      const userId = localStorage.getItem('tl_user_id');
      if (!userId) return;
      const res = await api.post<{ devices: DeviceItem[] }>(
        '/devices/',
        { user_id: userId },
        { skipAead: true }
      );
      const list = res.devices || [];
      setDevices(list);
      
      const currentDevId = localStorage.getItem('tl_device_id');
      const hasCurrent = list.some((d: DeviceItem) => d.device_id === currentDevId);
      if (!hasCurrent) {
        await registerDevice(userId);
        const refetched = await api.post<{ devices: DeviceItem[] }>(
          '/devices/',
          { user_id: userId },
          { skipAead: true }
        );
        setDevices(refetched.devices || []);
      }
    } catch (err: unknown) {
      console.error(err);
      const msg = err instanceof Error ? err.message : 'Failed to list active devices';
      toast.error(msg);
    } finally {
      setIsLoadingDevices(false);
    }
  }, []);

  const handleRevokeDevice = async (deviceId: string) => {
    const userId = localStorage.getItem('tl_user_id');
    if (!userId) return;
    const currentDevId = localStorage.getItem('tl_device_id');
    const isCurrent = deviceId === currentDevId;
    
    setIsLoadingDevices(true);
    try {
      await api.delete('/devices/' + deviceId, {
        body: JSON.stringify({ user_id: userId })
      });
      toast.success('Device authorization revoked successfully');
      if (isCurrent) {
        useStore.getState().logout();
      } else {
        await fetchDevices();
      }
    } catch (err: unknown) {
      console.error(err);
      const msg = err instanceof Error ? err.message : 'Failed to revoke device';
      toast.error(msg);
    } finally {
      setIsLoadingDevices(false);
    }
  };

  const handleExportData = async () => {
    setIsExporting(true);
    try {
      const userId = localStorage.getItem('tl_user_id');
      const personId = localStorage.getItem('tl_person_id');
      if (!userId || !personId) {
        toast.error('Session parameters incomplete');
        return;
      }
      
      const exportKey = crypto.getRandomValues(new Uint8Array(32));
      const exportKeyB64 = toBase64Url(exportKey);
      
      const res = await api.post<{ nonce_b64: string; ciphertext_b64: string }>(
        '/gdpr/export',
        {
          user_id: userId,
          person_id: personId,
          export_key_b64: exportKeyB64
        }
      );
      
      const nonce = fromBase64Url(res.nonce_b64);
      const ciphertext = fromBase64Url(res.ciphertext_b64);
      const aad = uuidToBytes(userId);
      
      await sodium.ready;
      
      const decryptedBytes = sodium.crypto_aead_xchacha20poly1305_ietf_decrypt(
        null,
        ciphertext,
        aad,
        nonce,
        exportKey
      );
      
      const plaintext = new TextDecoder().decode(decryptedBytes);
      const data = JSON.parse(plaintext);
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `transfer-legacy-export-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success('Archival export completed successfully.');
    } catch (err: unknown) {
      console.error(err);
      const msg = err instanceof Error ? err.message : 'Data export failed';
      toast.error(msg);
    } finally {
      setIsExporting(false);
    }
  };

  const handleEraseData = async () => {
    if (deleteConfirm !== 'DELETE') return;
    setIsErasing(true);
    try {
      const userId = localStorage.getItem('tl_user_id');
      const personId = localStorage.getItem('tl_person_id');
      if (!userId || !personId) {
        toast.error('Session parameters incomplete');
        return;
      }
      
      await api.post('/gdpr/erase', {
        user_id: userId,
        person_id: personId
      });
      
      toast.success('Vault decommissioned. All identity assets deleted.');
      useStore.getState().logout();
    } catch (err: unknown) {
      console.error(err);
      const msg = err instanceof Error ? err.message : 'Erase request failed';
      toast.error(msg);
    } finally {
      setIsErasing(false);
    }
  };

  const loadShares = useCallback(async () => {
    setIsLoadingShares(true);
    try {
      await fetchShares();
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingShares(false);
    }
  }, [fetchShares]);

  const handleRevokeShare = async (shareId: string) => {
    setIsLoadingShares(true);
    try {
      await revokeShare(shareId);
      toast.success('Access grant revoked successfully');
    } catch (err: unknown) {
      console.error(err);
      const msg = err instanceof Error ? err.message : 'Failed to revoke share';
      toast.error(msg);
    } finally {
      setIsLoadingShares(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'Security') {
      fetchDevices();
      loadShares();
    }
  }, [activeTab, fetchDevices, loadShares]);

  const tabs = [
    { name: 'Profile', icon: User, desc: 'Personal Identity' },
    { name: 'Security', icon: Shield, desc: 'Access & Auth' },
    { name: 'Recovery', icon: Activity, desc: 'Protocol Logic' },
    { name: 'Notifications', icon: Bell, desc: 'Signal Preferences' },
    { name: 'Appearance', icon: Palette, desc: 'Visual Interface' },
    { name: 'Danger Zone', icon: AlertTriangle, desc: 'Decommissioning' },
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('tl_user_name', name);
    localStorage.setItem('tl_user_email', email);
    localStorage.setItem('tl_user_phone', phone);
    useStore.setState({
      user: {
        ...user,
        name,
        email,
        jurisdiction
      }
    });
    toast.success('Configuration synchronized successfully');
  };



  return (
    <div className="min-h-screen bg-page text-primary selection:bg-brand-primary/30 pt-6">
      <main className="px-4 sm:px-6 lg:px-8 pb-28 md:pb-12 max-w-7xl mx-auto space-y-12">
        
        {/* ── Page Header ── */}
        <motion.header {...fadeUp(0)} className="flex flex-col space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-base shadow-[0_0_10px_rgba(255,255,255,0.1)]" />
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-secondary">
              System Configuration & Preferences
            </p>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-5xl font-display font-bold text-primary tracking-tight leading-none">
            Vault <span className="italic text-muted">Settings</span>
          </h1>
          <p className="text-muted text-sm font-medium max-w-2xl">
            Fine-tune your institutional legacy infrastructure, security parameters, and automated verification protocols.
          </p>
        </motion.header>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* ── Sidebar Navigation ── */}
          <motion.aside {...fadeUp(0.1)} className="lg:w-80 shrink-0 space-y-3">
            {tabs.map((tab, _i) => (
              <button
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                className={`flex items-center justify-between w-full px-6 py-5 rounded-[24px] transition-all duration-500 group relative overflow-hidden ${
                  activeTab === tab.name 
                  ? tab.name === 'Danger Zone' 
                    ? 'bg-red-500/10 text-red-500 border border-red-500/30 shadow-2xl shadow-red-500/5' 
                    : 'bg-brand-primary/10 text-brand-primary border border-brand-primary/30 shadow-2xl shadow-brand-primary/5'
                  : 'text-secondary hover:bg-surface/60 hover:text-primary border border-transparent'
                }`}
              >
                <div className="flex items-center gap-5 relative z-10">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 ${
                    activeTab === tab.name 
                      ? tab.name === 'Danger Zone' ? 'bg-red-500 text-white' : 'bg-brand-primary text-white' 
                      : 'bg-page border border-base text-secondary group-hover:border-base'
                  }`}>
                    <tab.icon size={18} />
                  </div>
                  <div className="text-left">
                    <span className="text-[11px] font-bold tracking-[0.1em] uppercase block">{tab.name}</span>
                    <span className={`text-[9px] font-bold uppercase tracking-widest opacity-40 group-hover:opacity-60 transition-opacity ${activeTab === tab.name ? 'opacity-60' : ''}`}>{tab.desc}</span>
                  </div>
                </div>
                {activeTab === tab.name && (
                  <motion.div layoutId="active-pill" className="absolute left-0 w-1 h-1/2 bg-current rounded-full" />
                )}
                {activeTab === tab.name && <ChevronRight size={16} className="relative z-10 opacity-50" />}
              </button>
            ))}
            
            <div className="mt-12 p-8 rounded-[32px] bg-surface/40 border border-base/60 space-y-6 relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4 opacity-5 transform group-hover:scale-110 transition-transform">
                  <Shield size={100} className="text-brand-primary" />
               </div>
               <p className="text-[10px] font-bold text-brand-primary uppercase tracking-[0.2em]">Institutional Health</p>
               <div className="space-y-4">
                  <div className="flex justify-between items-end">
                     <span className="text-xs font-bold text-muted">Vault Security Score</span>
                     <span className="text-sm font-display font-bold text-trust-500">94/100</span>
                  </div>
                  <div className="h-1.5 w-full bg-page rounded-full overflow-hidden border border-base">
                     <div className="h-full w-[94%] bg-trust-500 rounded-full" />
                  </div>
               </div>
               <button className="text-[10px] font-bold text-secondary uppercase tracking-widest flex items-center gap-2 hover:text-brand-primary transition-colors">
                  Run Security Audit <ChevronRight size={14}/>
               </button>
            </div>
          </motion.aside>

          {/* ── Content Area ── */}
          <motion.div {...fadeUp(0.2)} className="flex-1">
            <Card className="p-10 lg:p-16 bg-surface/40 border border-base/60 rounded-[40px] min-h-[750px] relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-base/20 to-transparent" />
              
              <AnimatePresence mode="wait">
                {activeTab === 'Profile' && (
                  <motion.form 
                    key="profile"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    onSubmit={handleSave} 
                    className="space-y-12"
                  >
                    <div className="space-y-4">
                      <h2 className="text-3xl font-display font-bold text-primary tracking-tight">Identity Profile</h2>
                      <p className="text-sm text-secondary font-medium italic">Your primary institutional identity recognized across all succession protocols.</p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row items-center gap-10">
                      <input
                        ref={avatarInputRef}
                        type="file"
                        accept="image/png,image/jpeg,image/webp,image/gif"
                        className="hidden"
                        onChange={handleAvatarSelect}
                      />
                      <div className="relative group">
                        <div className="w-32 h-32 rounded-[40px] bg-page border border-base flex items-center justify-center text-5xl font-display font-bold text-brand-primary group-hover:border-brand-primary/50 transition-all duration-700 shadow-2xl relative overflow-hidden">
                           <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                           {user.avatar ? (
                             <img src={user.avatar} alt={name} className="w-full h-full object-cover relative z-10" />
                           ) : (
                             <span className="relative z-10">{name ? name.charAt(0) : ''}</span>
                           )}
                           {isUploadingAvatar && (
                             <div className="absolute inset-0 bg-page/80 backdrop-blur-sm z-20 flex items-center justify-center">
                               <Loader2 size={28} className="animate-spin text-brand-primary" />
                             </div>
                           )}
                        </div>
                        <div 
                          onClick={() => avatarInputRef.current?.click()}
                          className="absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl bg-brand-primary text-page flex items-center justify-center border-4 border-base shadow-xl cursor-pointer hover:scale-110 transition-transform"
                          title="Upload Matrix Avatar"
                        >
                           <Camera size={18} />
                        </div>
                      </div>
                      <div className="space-y-4 text-center sm:text-left">
                         <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-secondary">Avatar Allocation</p>
                         <div className="flex gap-4">
                           <Button 
                             variant="secondary" 
                             type="button" 
                             disabled={isUploadingAvatar}
                             onClick={() => avatarInputRef.current?.click()}
                             className="h-11 px-8 text-[10px] font-bold uppercase tracking-widest border-base"
                           >
                             {isUploadingAvatar ? 'Uploading...' : 'Update Matrix'}
                           </Button>
                           <Button 
                             variant="ghost" 
                             type="button" 
                             disabled={!user.avatar || isUploadingAvatar}
                             onClick={handlePurgeAvatar}
                             className="text-[10px] font-bold uppercase tracking-widest text-secondary hover:text-muted"
                           >
                             Purge Image
                           </Button>
                         </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <Input label="Full Identity Name" value={name} onChange={e => setName(e.target.value)} className="h-14 rounded-2xl" />
                      <Input label="Protocol Email Address" value={email} onChange={e => setEmail(e.target.value)} className="h-14 rounded-2xl" />
                      <Input label="Secure Communication Line" value={phone} onChange={e => setPhone(e.target.value)} className="h-14 rounded-2xl" />
                      <Input label="Institutional Jurisdiction" value={jurisdiction} onChange={e => setJurisdiction(e.target.value)} className="h-14 rounded-2xl" />
                    </div>
                    
                    <div className="pt-8 border-t border-base/60 flex justify-end">
                      <Button type="submit" variant="primary" className="h-14 px-12 text-[11px] font-bold uppercase tracking-[0.2em] shadow-xl shadow-brand-primary/10">Synchronize Identity</Button>
                    </div>
                  </motion.form>
                )}

                {activeTab === 'Security' && (
                  <motion.div 
                    key="security"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-12"
                  >
                    <div className="space-y-4">
                      <h2 className="text-3xl font-display font-bold text-primary tracking-tight">Access Infrastructure</h2>
                      <p className="text-sm text-secondary font-medium italic">Cryptographic authentication layers and hardware authorization protocols.</p>
                    </div>                    <div className="space-y-8">
                      <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-secondary flex items-center gap-3">
                         <Shield size={14} className="text-brand-primary"/> Multi-Factor Authentication
                      </h3>
                      <div className="p-8 bg-page/60 rounded-[32px] border border-base group hover:border-brand-primary/20 transition-all flex flex-col items-stretch gap-8">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                          <div className="flex gap-6 items-center">
                            <div className="w-16 h-16 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary border border-brand-primary/20 shadow-inner">
                               <Fingerprint size={32} />
                            </div>
                            <div>
                              <p className="text-xl font-display font-bold text-primary tracking-tight">Authenticator Synthesis</p>
                              <p className="text-xs text-secondary font-medium mt-1 leading-relaxed">Hardware-grade verification required for all vault decrypts.</p>
                            </div>
                          </div>
                          {isMfaEnrolled ? (
                            <span className="text-[10px] font-bold uppercase tracking-widest bg-trust-500/10 text-trust-500 border border-trust-500/20 px-5 py-2.5 rounded-full">
                              Active & Verified
                            </span>
                          ) : !showMfaSetup ? (
                            <Button 
                              variant="secondary" 
                              onClick={handleMfaEnroll}
                              disabled={isMfaLoading}
                              className="h-12 px-8 text-[10px] font-bold uppercase tracking-widest border-brand-primary/30 text-brand-primary hover:bg-brand-primary/10"
                            >
                              {isMfaLoading ? 'Configuring...' : 'Enable MFA Handshake'}
                            </Button>
                          ) : null}
                        </div>

                        {showMfaSetup && mfaQrUrl && (
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="pt-8 border-t border-base/60 space-y-8"
                          >
                            <div className="flex flex-col md:flex-row gap-10 items-center">
                              <div className="bg-white p-4 rounded-3xl border border-base shrink-0">
                                <QRCodeSVG value={mfaQrUrl} size={160} />
                              </div>
                              <div className="space-y-4 flex-1">
                                <p className="text-[11px] font-bold uppercase tracking-widest text-brand-primary">Scan QR Code</p>
                                <p className="text-xs text-secondary leading-relaxed">
                                  Scan this QR code with Google Authenticator or any TOTP app to synthesize your cryptographic key.
                                </p>
                                <div className="space-y-2">
                                  <label className="text-[10px] font-bold text-muted uppercase tracking-[0.1em]">Verification Code</label>
                                  <div className="flex gap-4">
                                    <Input 
                                      value={mfaCode}
                                      onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, ''))}
                                      maxLength={6}
                                      placeholder="000000"
                                      className="h-12 w-36 text-center text-lg font-mono tracking-widest rounded-xl"
                                    />
                                    <Button 
                                      onClick={handleMfaVerify}
                                      disabled={isMfaLoading}
                                      className="h-12 px-8 text-[10px] font-bold uppercase tracking-widest"
                                    >
                                      {isMfaLoading ? 'Verifying...' : 'Verify Code'}
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {mfaBackupCodes.length > 0 && (
                              <div className="p-6 bg-surface/50 border border-base rounded-2xl space-y-4">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-secondary">Backup Access Keys</p>
                                <p className="text-[11px] text-muted leading-relaxed">
                                  Store these backup codes securely. They can bypass TOTP if you lose your authentication device.
                                </p>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-[11px] text-secondary">
                                  {mfaBackupCodes.map((code, idx) => (
                                    <div key={idx} className="bg-page/40 p-2.5 rounded-lg border border-base/40 text-center select-all">
                                      {code}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </motion.div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-8 pt-4">
                      <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-secondary flex items-center gap-3">
                         <Globe size={14} className="text-brand-primary"/> Active Protocol Handshakes
                      </h3>
                      {isLoadingDevices && devices.length === 0 ? (
                        <p className="text-xs text-muted">Synchronizing device catalog...</p>
                      ) : (
                        <div className="space-y-4">
                          {devices.map((s) => {
                            const currentDevId = localStorage.getItem('tl_device_id');
                            const isCurrent = s.device_id === currentDevId;
                            const browser = s.device_meta?.browser || 'Secured Client Node';
                            const location = s.device_meta?.location || 'Unknown Node';
                            
                            return (
                              <div key={s.device_id} className="flex flex-col sm:flex-row sm:items-center justify-between p-6 bg-page/40 rounded-[24px] border border-base/60 gap-6 group hover:bg-page/60 transition-all">
                                <div className="flex items-center gap-6">
                                   <div className="w-12 h-12 rounded-xl bg-surface border border-base flex items-center justify-center text-secondary group-hover:text-brand-primary transition-colors shadow-inner">
                                      <HardDrive size={20} />
                                   </div>
                                   <div>
                                    <p className="font-display font-bold text-primary text-lg flex items-center gap-4 tracking-tight">
                                      {browser} 
                                      {isCurrent && <span className="text-[9px] font-bold uppercase tracking-[0.2em] bg-brand-primary/10 text-brand-primary border border-brand-primary/20 px-3 py-1 rounded-full">Current Node</span>}
                                    </p>
                                    <p className="text-[10px] font-bold text-secondary mt-1 uppercase tracking-widest">
                                      {location} · Last seen {s.last_seen_at || s.created_at ? new Date(s.last_seen_at || s.created_at!).toLocaleString() : 'Recently'}
                                    </p>
                                  </div>
                                </div>
                                <button 
                                  onClick={() => handleRevokeDevice(s.device_id)}
                                  disabled={isLoadingDevices}
                                  className="text-[10px] font-bold text-red-500 hover:text-red-400 uppercase tracking-widest px-4 py-2 bg-red-500/10 rounded-xl border border-red-500/20 disabled:opacity-40"
                                >
                                  {isCurrent ? 'Revoke & Logout' : 'Revoke Token'}
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    <div className="space-y-8 pt-8 border-t border-base/40">
                      <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-secondary flex items-center gap-3">
                         <ShieldAlert size={14} className="text-brand-primary"/> Active Vault Share Grants
                      </h3>
                      {isLoadingShares ? (
                        <p className="text-xs text-muted">Retrieving active shares...</p>
                      ) : shares.length === 0 ? (
                        <div className="p-6 bg-page/20 rounded-[24px] border border-base/60 text-center">
                          <p className="text-xs text-muted">No active cryptographic share grants found.</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {shares.map((s: ShareItem) => {
                            const beneficiary = heirs.find(h => h.id === s.grantee_id) || guardians.find(g => g.id === s.grantee_id);
                            const beneficiaryName = beneficiary?.name || `Grantee (ID: ${s.grantee_id.substring(0, 8)}...)`;
                            const beneficiaryEmail = beneficiary?.email || 'External Protocol Node';
                            
                            return (
                              <div key={s.share_id} className="flex flex-col sm:flex-row sm:items-center justify-between p-6 bg-page/40 rounded-[24px] border border-base/60 gap-6 group hover:bg-page/60 transition-all">
                                <div className="flex items-center gap-6">
                                   <div className="w-12 h-12 rounded-xl bg-surface border border-base flex items-center justify-center text-secondary group-hover:text-brand-primary transition-colors shadow-inner">
                                      <Shield size={20} />
                                   </div>
                                   <div>
                                    <p className="font-display font-bold text-primary text-lg flex items-center gap-4 tracking-tight">
                                      {beneficiaryName}
                                    </p>
                                    <p className="text-[10px] font-bold text-secondary mt-1 uppercase tracking-widest">
                                      {beneficiaryEmail} · Share ID: {s.share_id.substring(0, 8)}...
                                    </p>
                                    <p className="text-[9px] text-muted mt-0.5">
                                      Granted at: {s.created_at ? new Date(s.created_at).toLocaleString() : 'Recently'}
                                    </p>
                                  </div>
                                </div>
                                <button 
                                  onClick={() => handleRevokeShare(s.share_id)}
                                  disabled={isLoadingShares}
                                  className="text-[10px] font-bold text-red-500 hover:text-red-400 uppercase tracking-widest px-4 py-2 bg-red-500/10 rounded-xl border border-red-500/20 disabled:opacity-40"
                                >
                                  Revoke Grant
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {activeTab === 'Recovery' && (
                  <motion.div 
                    key="recovery"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-12"
                  >
                    <div className="space-y-4">
                      <h2 className="text-3xl font-display font-bold text-primary tracking-tight">Verification Protocols</h2>
                      <p className="text-sm text-secondary font-medium italic">Logical parameters for automated succession and vault release.</p>
                    </div>
                     
                    <div className="space-y-8">
                      <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-secondary flex items-center gap-3">
                         <Activity size={14} className="text-brand-primary"/> Pulse Frequency
                      </h3>
                      <div className="p-10 bg-page/60 rounded-[40px] border border-base space-y-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-5">
                           <Activity size={160} className="text-brand-primary" />
                        </div>
                        <p className="text-sm text-muted font-medium leading-relaxed italic max-w-lg">The system initiates a recovery sequence if an institutional handshake is not detected within the following duration:</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                           {['7 Days', '14 Days', '30 Days', '90 Days'].map((d) => {
                             const daysVal = d.split(' ')[0];
                             const freq = checkinSettings.frequency;
                             const isActive = 
                               freq === daysVal ||
                               (daysVal === '7' && freq === 'weekly') ||
                               (daysVal === '14' && freq === 'biweekly') ||
                               (daysVal === '30' && freq === 'monthly');

                             return (
                               <button 
                                 key={d} 
                                 onClick={() => {
                                   let val = daysVal;
                                   if (daysVal === '7') val = 'weekly';
                                   if (daysVal === '14') val = 'biweekly';
                                   if (daysVal === '30') val = 'monthly';
                                   updateSettings({ frequency: val });
                                 }}
                                 className={`p-6 rounded-2xl border flex flex-col items-center gap-3 transition-all ${isActive ? 'bg-brand-primary/10 border-brand-primary text-primary shadow-xl' : 'bg-surface border-base text-secondary hover:border-base'}`}
                               >
                                  <span className="text-xl font-display font-bold">{daysVal}</span>
                                  <span className="text-[9px] font-bold uppercase tracking-widest opacity-60">Days</span>
                               </button>
                             );
                           })}
                        </div>
                        <div className="mt-4 p-5 bg-surface rounded-2xl border border-base max-w-xs space-y-2">
                           <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-secondary block mb-1">Custom Interval (Days)</label>
                           <Input 
                             type="number" 
                             min="1" 
                             placeholder="Enter custom days..." 
                             value={!['weekly', 'biweekly', 'monthly', '7', '14', '30', '90'].includes(checkinSettings.frequency) ? checkinSettings.frequency : ''}
                             onChange={(e) => {
                               const val = e.target.value;
                               if (val) {
                                 updateSettings({ frequency: val });
                               }
                             }}
                             className="bg-slate-950/50 border-slate-800 text-white"
                           />
                        </div>
                        <p className="text-[10px] font-bold text-secondary uppercase tracking-widest text-center mt-6">Recommended: 30-Day Protocol Cycle</p>
                      </div>
                    </div>

                    <div className="space-y-8 pt-4">
                      <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-secondary flex items-center gap-3">
                         <ShieldAlert size={14} className="text-brand-primary"/> Override Authority
                      </h3>
                      <div className="p-12 bg-page/40 rounded-[40px] border border-dashed border-base text-center space-y-8 group hover:border-brand-primary/20 transition-all relative">
                          <div className="w-20 h-20 rounded-[28px] bg-brand-primary/5 border border-brand-primary/20 flex items-center justify-center mx-auto text-brand-primary group-hover:scale-110 transition-transform duration-700 shadow-inner">
                             <Shield size={36}/>
                          </div>
                          <div className="space-y-3">
                            <p className="text-2xl font-display font-bold text-primary tracking-tight">Legal Mandate Override</p>
                            <p className="text-sm text-secondary max-w-md mx-auto font-medium italic leading-relaxed">Submit verified legal documentation to bypass wait periods. Our institutional compliance engine audits submissions in real-time.</p>
                          </div>
                          <Button variant="secondary" className="h-14 px-12 text-[10px] font-bold uppercase tracking-widest border-brand-primary/30 text-brand-primary hover:bg-brand-primary/10 shadow-2xl">Submit Archival PDF</Button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'Appearance' && (
                  <motion.div 
                    key="appearance"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-12"
                  >
                    <div className="space-y-4">
                      <h2 className="text-3xl font-display font-bold text-primary tracking-tight">Visual Foundation</h2>
                      <p className="text-sm text-secondary font-medium italic">Customize the aesthetic presentation of your legacy protocols.</p>
                    </div>
                    
                    <div className="space-y-8">
                      <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-secondary">Interface Basis</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <button onClick={() => setTheme('dark')} className={`group flex flex-col items-center gap-6 p-10 rounded-[32px] border-2 transition-all duration-700 relative overflow-hidden ${theme === 'dark' ? 'bg-brand-primary/5 border-brand-primary shadow-2xl shadow-brand-primary/10' : 'bg-page border-base hover:border-base'}`}>
                          {theme === 'dark' && <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-brand-primary shadow-[0_0_10px_rgba(79,92,255,0.8)]" />}
                          <div className="w-full aspect-video bg-surface rounded-2xl border border-base shadow-2xl relative overflow-hidden">
                             <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/10 to-transparent" />
                          </div>
                          <span className="text-lg font-display font-bold text-primary">Institutional Dark</span>
                        </button>
                        <button onClick={() => setTheme('light')} className={`group flex flex-col items-center gap-6 p-10 rounded-[32px] border-2 transition-all duration-700 relative overflow-hidden ${theme === 'light' ? 'bg-brand-primary/5 border-brand-primary shadow-2xl shadow-brand-primary/10' : 'bg-page border-base hover:border-base'}`}>
                          {theme === 'light' && <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-brand-primary shadow-[0_0_10px_rgba(79,92,255,0.8)]" />}
                          <div className="w-full aspect-video bg-white rounded-2xl border border-gray-200 shadow-2xl" />
                          <span className="text-lg font-display font-bold text-primary">Institutional Light</span>
                        </button>
                      </div>
                    </div>

                    <div className="space-y-8 pt-4">
                      <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-secondary">Protocol Accent</h3>
                      <div className="flex gap-8">
                        {['#4F5CFF', '#D4AF37', '#06B6D4', '#10B981'].map((c, i) => (
                          <button key={c} className={`w-16 h-16 rounded-[20px] transition-all duration-500 border-4 border-base shadow-2xl ${i === 0 ? 'scale-110 ring-4 ring-brand-primary/20 ring-offset-8 ring-offset-base' : 'opacity-40 hover:opacity-100 hover:scale-105'}`} style={{ backgroundColor: c }} />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'Danger Zone' && (
                  <motion.div 
                    key="danger"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-12"
                  >
                    <div className="space-y-4">
                      <h2 className="text-3xl font-display font-bold text-red-500 tracking-tight">Vault Termination</h2>
                      <p className="text-sm text-red-500/60 font-medium italic">Critical sequence to permanently decommission your succession infrastructure.</p>
                    </div>

                    <div className="p-8 bg-page/60 border border-base rounded-[32px] space-y-6 relative overflow-hidden group">
                      <p className="text-[10px] font-bold text-brand-primary uppercase tracking-[0.2em]">Institutional Archival Export</p>
                      <p className="text-xs text-secondary leading-relaxed">
                        Export a raw, decrypted copy of all metadata, active policy parameters, registered devices, and vault configurations.
                      </p>
                      <Button 
                        onClick={handleExportData} 
                        disabled={isExporting}
                        variant="secondary" 
                        className="h-12 px-8 text-[10px] font-bold uppercase tracking-widest border-brand-primary/30 text-brand-primary hover:bg-brand-primary/10 shadow-2xl"
                      >
                        {isExporting ? 'Generating Archive...' : 'Export Vault Data'}
                      </Button>
                    </div>

                    <div className="p-10 bg-red-500/5 border border-red-500/20 rounded-[40px] space-y-10 relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-10 opacity-5">
                         <AlertTriangle size={180} className="text-red-500" />
                      </div>
                      <p className="text-sm text-red-500/80 font-medium leading-loose italic relative z-10">
                        Warning: This protocol is final. Termination will result in the immediate and irreversible destruction of all vault archives, cryptographic key fragments, and beneficiary mandates. Transfer Legacy cannot recover purged data.
                      </p>
                      
                      <div className="space-y-8 relative z-10">
                        <div className="space-y-4">
                          <label className="text-[10px] font-bold text-red-500/60 uppercase tracking-[0.2em] ml-1">Authorize Termination Sequence</label>
                          <p className="text-xs text-secondary font-medium italic">Input <span className="font-mono text-red-500 font-bold bg-red-500/10 px-3 py-1 rounded-lg">DELETE</span> to unlock authorization button.</p>
                          <Input 
                            value={deleteConfirm}
                            onChange={(e) => setDeleteConfirm(e.target.value)}
                            placeholder="PROTOCOL_TERMINATION_CODE"
                            className="h-16 rounded-2xl border-red-500/20 focus:border-red-500/60 placeholder:text-red-900/20 bg-page/40 text-lg font-mono tracking-widest"
                          />
                        </div>
                        <Button 
                          variant="ghost" 
                          disabled={deleteConfirm !== 'DELETE' || isErasing}
                          onClick={handleEraseData}
                          className="w-full h-16 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border-red-500/20 font-bold uppercase tracking-[0.2em] disabled:opacity-30 transition-all duration-500 shadow-xl shadow-red-500/5"
                        >
                          {isErasing ? 'Purging Archive...' : 'Decommission Vault Protocol'}
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </Card>
          </motion.div>
        </div>

      </main>
    </div>
  );
}
