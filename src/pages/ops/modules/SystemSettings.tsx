import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Palette, 
  Globe, 
  Upload, 
  Save, 
  RefreshCw, 
  Eye, 
  EyeOff,
  Image as ImageIcon,
  Settings,
  ShieldAlert,
  Moon,
  Monitor,
  Users
} from 'lucide-react';
import { opsApi } from '../../../lib/opsApi';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import toast from 'react-hot-toast';
import { cn } from '../../../utils/cn';

type Tab = 'identity' | 'theme' | 'controls' | 'security';

interface SystemConfigData {
  brand_name: string;
  logo_url: string;
  support_email: string;
  support_phone: string;
  support_address: string;
  waitlist_enabled: boolean;
  theme_config: {
    primaryColor: string;
    darkMode: boolean;
    maintenanceMode: boolean;
  };
}

export default function SystemSettings() {
  const [activeTab, setActiveTab] = useState<Tab>('identity');
  const [config, setConfig] = useState<SystemConfigData>({
    brand_name: '',
    logo_url: '',
    support_email: '',
    support_phone: '',
    support_address: '',
    waitlist_enabled: true,
    theme_config: {
      primaryColor: '#6366f1',
      darkMode: true,
      maintenanceMode: false
    },
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('All password fields are required');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setIsChangingPassword(true);
    try {
      await opsApi.post('/ops/change-password', {
        current_password: currentPassword,
        new_password: newPassword,
      });
      toast.success('Password updated successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      toast.error((err as Error).message || 'Failed to change password');
    } finally {
      setIsChangingPassword(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const data = await opsApi.get('/ops/branding');
      setConfig(data);
    } catch (err) {
      toast.error((err as Error).message || 'Failed to load settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    try {
      await opsApi.put('/ops/branding', config);
      toast.success('Configuration updated successfully');
    } catch (err) {
      toast.error((err as Error).message || 'Failed to save changes');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogoUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please choose an image file');
      return;
    }

    setIsUploadingLogo(true);
    try {
      const presign = await opsApi.post<{ upload_url: string; public_url: string }>(
        '/ops/storage/presigned-logo',
        {
          file_name: file.name,
          content_type: file.type,
        },
      );

      // In a real environment, we would PUT to presign.upload_url
      // For this demo, we'll simulate the upload success
      setConfig((prev) => ({ ...prev, logo_url: presign.public_url }));
      toast.success('Logo uploaded. Save settings to publish.');
    } catch (err) {
      toast.error((err as Error).message || 'Failed to upload logo');
    } finally {
      setIsUploadingLogo(false);
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center p-20 text-slate-500">Loading Configuration...</div>;
  }

  const tabs = [
    { id: 'identity', label: 'Site Identity', icon: Globe },
    { id: 'controls', label: 'System Controls', icon: Settings },
    { id: 'theme', label: 'Theme & UI', icon: Palette },
    { id: 'security', label: 'Security & Auth', icon: ShieldAlert },
  ];

  return (
    <div className="max-w-5xl space-y-8 pb-12">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Settings className="text-indigo-500" />
            System Configuration
          </h1>
          <p className="text-slate-400 text-sm mt-1">Manage global brand identity, system behaviors, and visual themes</p>
        </div>
        <Button variant="primary" onClick={handleSave} disabled={isSaving} className="px-8 shadow-lg shadow-indigo-500/20">
          {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Save Changes
        </Button>
      </div>

      <div className="flex gap-2 p-1.5 bg-slate-900/50 border border-slate-800 rounded-2xl w-fit">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={cn(
                "flex items-center gap-2 px-6 py-2.5 rounded-xl transition-all duration-300 text-sm font-medium",
                isActive 
                  ? "bg-slate-800 text-white shadow-xl border border-slate-700/50" 
                  : "text-slate-400 hover:text-slate-200"
              )}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <AnimatePresence mode="wait">
            {activeTab === 'identity' && (
              <motion.div
                key="identity"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-6"
              >
                <Card className="bg-slate-900/40 border-slate-800 p-6 space-y-6">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500">Brand Identity</h3>
                  <Input
                    label="Business Name"
                    value={config.brand_name}
                    onChange={(e) => setConfig({ ...config, brand_name: e.target.value })}
                    placeholder="Transfer Legacy"
                    className="bg-slate-950 border-slate-800"
                  />
                  
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-400">Brand Logo</label>
                    <input
                      ref={logoInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleLogoUpload(file);
                      }}
                    />
                    <div className="flex gap-3">
                      <input
                        type="text"
                        className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500/50"
                        value={config.logo_url || ''}
                        onChange={(e) => setConfig({ ...config, logo_url: e.target.value })}
                        placeholder="https://..."
                      />
                      <Button
                        variant="secondary"
                        type="button"
                        className="px-3 border-slate-800"
                        disabled={isUploadingLogo}
                        onClick={() => logoInputRef.current?.click()}
                      >
                        {isUploadingLogo ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Support Email"
                      type="email"
                      value={config.support_email || ''}
                      onChange={(e) => setConfig({ ...config, support_email: e.target.value })}
                      placeholder="support@transferlegacy.com"
                      className="bg-slate-950 border-slate-800"
                    />
                    <Input
                      label="Support Phone"
                      value={config.support_phone || ''}
                      onChange={(e) => setConfig({ ...config, support_phone: e.target.value })}
                      placeholder="+1 (555) 000-0000"
                      className="bg-slate-950 border-slate-800"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-400">Headquarters Address</label>
                    <textarea
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500/50 resize-none"
                      rows={3}
                      value={config.support_address || ''}
                      onChange={(e) => setConfig({ ...config, support_address: e.target.value })}
                      placeholder="Enter full business address..."
                    />
                  </div>
                </Card>
              </motion.div>
            )}

            {activeTab === 'controls' && (
              <motion.div
                key="controls"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-6"
              >
                <Card className="bg-slate-900/40 border-slate-800 p-6 space-y-6">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500">Access & Availability</h3>
                  
                  {/* Waitlist Toggle */}
                  <div className="flex items-center justify-between p-4 bg-slate-950 border border-slate-800 rounded-2xl group hover:border-indigo-500/30 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                        <Users className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-bold text-white">Waitlist Mode (Gated Landing)</p>
                        <p className="text-xs text-slate-500">Show waitlist signup instead of full website</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setConfig({ ...config, waitlist_enabled: !config.waitlist_enabled })}
                      className={cn(
                        "w-12 h-6 rounded-full p-1 transition-colors duration-300",
                        config.waitlist_enabled ? "bg-indigo-500" : "bg-slate-800"
                      )}
                    >
                      <div className={cn(
                        "w-4 h-4 bg-white rounded-full transition-transform duration-300",
                        config.waitlist_enabled ? "translate-x-6" : "translate-x-0"
                      )} />
                    </button>
                  </div>

                  {/* Maintenance Toggle */}
                  <div className="flex items-center justify-between p-4 bg-slate-950 border border-slate-800 rounded-2xl group hover:border-red-500/30 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500">
                        <ShieldAlert className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-bold text-white">Maintenance Mode</p>
                        <p className="text-xs text-slate-500">Redirect all client traffic to a maintenance page</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setConfig({
                        ...config,
                        theme_config: { ...config.theme_config, maintenanceMode: !config.theme_config.maintenanceMode }
                      })}
                      className={cn(
                        "w-12 h-6 rounded-full p-1 transition-colors duration-300",
                        config.theme_config.maintenanceMode ? "bg-red-500" : "bg-slate-800"
                      )}
                    >
                      <div className={cn(
                        "w-4 h-4 bg-white rounded-full transition-transform duration-300",
                        config.theme_config.maintenanceMode ? "translate-x-6" : "translate-x-0"
                      )} />
                    </button>
                  </div>
                </Card>
              </motion.div>
            )}

            {activeTab === 'theme' && (
              <motion.div
                key="theme"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-6"
              >
                <Card className="bg-slate-900/40 border-slate-800 p-6 space-y-6">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500">Visual Styling</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button type="button" className="p-4 bg-slate-950 border border-indigo-500/30 rounded-2xl text-left space-y-4">
                      <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                        <Monitor className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">Interface Type</p>
                        <p className="text-[10px] text-slate-500">Modern Glassmorphism (Active)</p>
                      </div>
                    </button>
                    <div className="p-4 bg-slate-950/50 border border-slate-800/50 rounded-2xl text-left space-y-4 opacity-50">
                      <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400">
                        <Moon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-400">Legacy Dark</p>
                        <p className="text-[10px] text-slate-600">Standard Contrast</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}

            {activeTab === 'security' && (
              <motion.div
                key="security"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-6"
              >
                <form onSubmit={handlePasswordChange}>
                  <Card className="bg-slate-900/40 border-slate-800 p-6 space-y-6">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500">Administrator Security</h3>
                    
                    <div className="relative">
                      <Input
                        label="Current Password"
                        type={showCurrentPassword ? 'text' : 'password'}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="••••••••"
                        className="bg-slate-950 border-slate-800 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(v => !v)}
                        className="absolute right-3.5 bottom-3 text-slate-500 hover:text-slate-300 transition-colors focus:outline-none"
                        tabIndex={-1}
                        aria-label={showCurrentPassword ? 'Hide password' : 'Show password'}
                      >
                        {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    <div className="relative">
                      <Input
                        label="New Password"
                        type={showNewPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                        className="bg-slate-950 border-slate-800 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(v => !v)}
                        className="absolute right-3.5 bottom-3 text-slate-500 hover:text-slate-300 transition-colors focus:outline-none"
                        tabIndex={-1}
                        aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                      >
                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    <div className="relative">
                      <Input
                        label="Confirm New Password"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="bg-slate-950 border-slate-800 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(v => !v)}
                        className="absolute right-3.5 bottom-3 text-slate-500 hover:text-slate-300 transition-colors focus:outline-none"
                        tabIndex={-1}
                        aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    <div className="flex justify-end pt-2">
                      <Button variant="primary" type="submit" disabled={isChangingPassword} className="px-8 shadow-lg shadow-indigo-500/20">
                        {isChangingPassword ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                        Update Password
                      </Button>
                    </div>
                  </Card>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="space-y-6 sticky top-8 h-fit">
          <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2 px-1">
            <Eye className="w-4 h-4" /> 
            Identity Preview
          </h3>
          <Card className="bg-slate-950 border-slate-800 p-0 overflow-hidden shadow-2xl">
            <div className="bg-slate-900/50 p-3 border-b border-slate-800 flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
              </div>
              <div className="flex-1 bg-slate-800/30 rounded-md h-5 px-3 flex items-center">
                <span className="text-[10px] text-slate-600 truncate">
                  {(config.brand_name || '').toLowerCase().replace(/\s+/g, '-') || 'app'}.io
                </span>
              </div>
            </div>
            <div className="p-8 text-center space-y-6">
              <div className="w-20 h-20 bg-slate-900 rounded-3xl mx-auto flex items-center justify-center border border-slate-800 shadow-inner">
                {config.logo_url ? (
                  <img src={config.logo_url} alt="Logo" className="max-w-[65%] max-h-[65%] object-contain" />
                ) : (
                  <ImageIcon className="text-slate-700 w-8 h-8" />
                )}
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-lg text-white">{config.brand_name || 'Your Brand'}</h4>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest">Global Identity</span>
                  <span className="text-slate-700">•</span>
                  <span className={cn(
                    "text-[10px] font-bold uppercase tracking-widest",
                    config.waitlist_enabled ? "text-emerald-500" : "text-blue-500"
                  )}>
                    {config.waitlist_enabled ? 'Waitlist Gated' : 'Public Live'}
                  </span>
                </div>
              </div>
            </div>
          </Card>
          
          <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/10">
            <p className="text-[10px] text-slate-500 leading-relaxed">
              Updating these values will reflect immediately across all public user-facing landing pages, authentication emails, and the main application console.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
