import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Shield, Users, KeyRound, Wallet, CheckCircle2, Globe, Fingerprint, ShieldCheck } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import confetti from 'canvas-confetti';
import { useStore } from '../store/useStore';
import { api, ApiError } from '../lib/api';
import { initOpaqueRegistration, finishOpaqueRegistration, initOpaqueLogin, finishOpaqueLogin, deriveUserKeys } from '../lib/opaqueClient';
import toast from 'react-hot-toast';
import { fromBase64Url } from '../lib/aeadClient';


const steps = [
  { label: 'Initialization', icon: Shield },
  { label: 'Jurisdiction', icon: Globe },
  { label: 'Assets', icon: Wallet },
  { label: 'Guardians', icon: Users },
  { label: 'Heirs', icon: KeyRound },
  { label: 'Secure', icon: CheckCircle2 },
];

const jurisdictions = [
  { value: 'global', label: 'Global (International Standards)' },
  { value: 'india', label: 'India (IT Act & Digital Succession)' },
  { value: 'usa', label: 'United States (Federal & IRS Compliance)' },
  { value: 'uk', label: 'United Kingdom (HMRC Digital Estate)' },
  { value: 'uae', label: 'UAE (VARA & DIFC Regulations)' },
];

interface VerifyOtpResponseEnvelope {
  data: {
    verification_token: string;
  };
  requestId: string;
}

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [isInitializing, setIsInitializing] = useState(false);
  const navigate = useNavigate();
  const { addAsset, addGuardian, addHeir, setJurisdiction } = useStore();

  useEffect(() => {
    const { isAuthenticated } = useStore.getState();
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [navigate]);

  useEffect(() => {
    if (step === 6) {
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 }
      });
    }
  }, [step]);

  const [jurisdiction, setLocalJurisdiction] = useState('global');
  const [assetName, setAssetName] = useState('');
  const [guardianEmail, setGuardianEmail] = useState('');
  const [heirName, setHeirName] = useState('');
  const [heirEmail, setHeirEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showOtpEntry, setShowOtpEntry] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [isSendingOtp, setIsSendingOtp] = useState(false);

  const handleResendOtp = async () => {
    setIsSendingOtp(true);
    setError(null);
    try {
      await api.post('/auth/register/send-otp', { email }, { skipAead: true });
      toast.success('Verification code resent to your email!');
    } catch (err: unknown) {
      console.error('Failed to resend OTP:', err);
      let errorMessage = 'Failed to send OTP code.';
      if (err instanceof ApiError && err.status === 409) {
        errorMessage = 'This email is already registered. Please go to the Login page to log in.';
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
      toast.error(err instanceof ApiError && err.status === 409 ? 'Email already registered' : 'Resend failed');
    } finally {
      setIsSendingOtp(false);
    }
  };

  const nextStep = async () => {
    if (step === 1) {
      if (!fullName.trim() || !email.trim() || !password) {
        toast.error('All account fields are required');
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        toast.error('Please enter a valid email address');
        setError('Please enter a valid email address');
        return;
      }

      if (!showOtpEntry) {
        setIsSendingOtp(true);
        setError(null);
        try {
          await api.post('/auth/register/send-otp', { email }, { skipAead: true });
          toast.success('Verification code sent to your email!');
          setShowOtpEntry(true);
        } catch (err: unknown) {
          console.error('Failed to send OTP:', err);
          let errorMessage = 'Failed to send OTP code.';
          if (err instanceof ApiError && err.status === 409) {
            errorMessage = 'This email is already registered. Please go to the Login page to log in.';
          } else if (err instanceof Error) {
            errorMessage = err.message;
          }
          setError(errorMessage);
          toast.error(err instanceof ApiError && err.status === 409 ? 'Email already registered' : 'Failed to send OTP');
        } finally {
          setIsSendingOtp(false);
        }
        return;
      }

      if (!otpCode || otpCode.length !== 6) {
        toast.error('Please enter a valid 6-digit verification code');
        return;
      }

      setIsInitializing(true);
      setError(null);
      try {
        // 1. Verify OTP with backend to get registration verification token
        const verifyRes = await api.post<VerifyOtpResponseEnvelope>('/auth/register/verify-otp', {
          email,
          code: otpCode,
        }, { skipAead: true });
        const token = verifyRes.data.verification_token;

        // 2. Run real OPAQUE Registration Handshake against live backend
        const { userId, registrationRequest, blindFactor } = await initOpaqueRegistration(password);

        const initResponse = await api.post<{ registration_response: string; session_id: string }>('/auth/register/init', {
          user_id: userId,
          registration_request: registrationRequest,
          credential_identifier: email, // maps to auth.users mapping on backend!
          verification_token: token,
        });

        const finishData = await finishOpaqueRegistration(
          password,
          blindFactor,
          initResponse.registration_response,
          fullName,
          email
        );

        await api.post<unknown>('/auth/register/finish', {
          session_id: initResponse.session_id,
          registration_upload: finishData.registrationUpload,
          ed25519_pubkey: finishData.ed25519Pubkey,
          x25519_pubkey: finishData.x25519Pubkey,
          kyber768_pubkey: finishData.kyber768Pubkey,
          emk_blob: finishData.emkBlob,
          argon2_params: finishData.argon2Params,
          enc_legal_name: finishData.encLegalName,
          enc_email: finishData.encEmail,
        });

        // 3. Perform Automatic OPAQUE Login immediately
        const loginInit = await initOpaqueLogin(password);
        const loginInitResponse = await api.post<{ credential_response?: string; registration_response?: string; session_id: string }>('/auth/login/init', {
          user_id: userId,
          credential_request: loginInit.credentialRequest,
        });

        const loginFinishData = await finishOpaqueLogin(
          password,
          loginInit.blindFactor,
          (loginInitResponse.credential_response || loginInitResponse.registration_response) as string
        );

        const loginFinishResponse = await api.post<{ 
          session_token?: string; 
          token?: string;
          enc_legal_name?: string;
          emk_blob?: string;
        }>('/auth/login/finish', {
          session_id: loginInitResponse.session_id,
          credential_finalization: loginFinishData.registrationUpload,
        });

        let masterKey: Uint8Array | null = null;
        if (loginFinishResponse.emk_blob) {
          try {
            const sodium = (await import('libsodium-wrappers-sumo')).default;
            await sodium.ready;
            const exportKey = loginFinishData.exportKey;
            const kek = sodium.crypto_generichash(32, fromBase64Url(exportKey), null);
            const emkBlobString = new TextDecoder().decode(fromBase64Url(loginFinishResponse.emk_blob));
            const emk = JSON.parse(emkBlobString);
            const emkNonce = fromBase64Url(emk.nonce);
            const emkCiphertext = fromBase64Url(emk.ciphertext);
            masterKey = sodium.crypto_aead_xchacha20poly1305_ietf_decrypt(
              null,
              emkCiphertext,
              new Uint8Array(),
              emkNonce,
              kek
            );
            // Derive deterministic user keys and set them in store
            const userKeys = await deriveUserKeys(exportKey);
            useStore.setState({ userKeys });
          } catch (decErr) {
            console.warn('Failed to decrypt master key during automatic login:', decErr);
          }
        }

        const loginToken = loginFinishResponse.session_token || loginFinishResponse.token;
        if (!loginToken) {
          throw new Error('Automatic login did not return a session token');
        }

        // Set session token, user ID, and update authentication state
        localStorage.setItem('tl_session_token', loginToken);
        localStorage.setItem('tl_user_id', userId);
        localStorage.setItem('tl_user_name', fullName);
        localStorage.setItem('tl_user_email', email);
        localStorage.removeItem('tl_guardians');
        localStorage.removeItem('tl_heirs');
        useStore.setState({ 
          isAuthenticated: true,
          masterKey,
          assets: [],
          guardians: [],
          heirs: [],
          user: {
            name: fullName,
            email: email,
            avatar: null,
            score: 0,
            plan: localStorage.getItem('tl_user_plan') || "Always Free",
            nextCheckInDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            checkInHistory: []
          }
        });
        
        toast.success('Zero-knowledge vault registered and unlocked!');
        setStep(2);
      } catch (err: unknown) {
        console.error('Registration/Auto-Login failed:', err);
        let errorMessage = 'Registration failed. Please check connection.';
        if (err instanceof ApiError && err.status === 409) {
          errorMessage = 'This email is already registered. Please go to the Login page to log in.';
        } else if (err instanceof Error) {
          errorMessage = err.message;
        }
        setError(errorMessage);
        toast.error(err instanceof ApiError && err.status === 409 ? 'Email already registered' : 'Registration failed');
      } finally {
        setIsInitializing(false);
      }
      return;
    }
    if (step === 2) {
      setJurisdiction(jurisdiction);
    }
    if (step === 3 && assetName) {
      addAsset({ name: assetName, type: 'Crypto', value: 0, status: 'Protected', date: new Date().toISOString().split('T')[0] });
    }
    if (step === 4 && guardianEmail) {
      addGuardian({ name: 'Guardian', email: guardianEmail });
    }
    if (step === 5 && heirName && heirEmail) {
      addHeir({ name: heirName, email: heirEmail, relation: 'Family' });
    }
    setStep(s => s + 1);
  };

  const skipStep = () => setStep(s => s + 1);
  const finish = () => navigate('/dashboard');

  return (
    <div className="min-h-screen bg-page text-primary flex flex-col pt-16 relative overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 bg-aurora opacity-40 pointer-events-none" />
      <div className="absolute inset-0 bg-dot-matrix opacity-20 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-brand-primary/5 blur-[120px] pointer-events-none" />

      {/* Progress bar */}
      <div className="relative z-10 w-full max-w-2xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex space-x-2">
          {steps.map((s, i) => {
            const idx = i + 1;
            const isCompleted = idx < step;
            const isActive = idx === step;
            const Icon = s.icon;
            return (
              <div key={i} className="flex items-center gap-2">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full border transition-all duration-500 ${
                  isCompleted ? 'bg-brand-primary border-brand-primary text-inverse' :
                  isActive    ? 'bg-brand-primary/10 border-brand-primary text-brand-primary' :
                                'bg-surface/30 border-base text-muted'
                }`}>
                  {isCompleted ? <CheckCircle2 size={14} /> : <Icon size={14} />}
                </div>
                {i < steps.length - 1 && (
                  <div className={`w-8 h-px transition-all duration-500 ${isCompleted ? 'bg-brand-primary' : 'bg-base'}`} />
                )}
              </div>
            );
          })}
        </div>
        <button
          onClick={() => navigate('/')}
          className="text-[10px] font-bold uppercase tracking-widest text-muted hover:text-primary transition-colors"
        >
          Cancel
        </button>
      </div>

      {/* Step content */}
      <div className="relative z-10 flex-1 flex items-center justify-center p-6">
        <AnimatePresence mode="wait">

          {/* ── Initialization Overlay ── */}
          {isInitializing && (
            <motion.div
              key="initializing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-page/90 backdrop-blur-xl"
            >
              <div className="relative w-32 h-32 mb-8">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 border-2 border-brand-primary/20 rounded-full"
                />
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-4 border-2 border-brand-gold/20 rounded-full"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Fingerprint size={48} className="text-brand-primary animate-pulse" />
                </div>
                {/* Scanning line */}
                <motion.div
                  animate={{ top: ['0%', '100%', '0%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="absolute left-0 right-0 h-0.5 bg-brand-primary/50 shadow-[0_0_15px_rgba(79,92,255,0.5)] z-10"
                />
              </div>
              <div className="text-center">
                <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-brand-primary mb-2">Generating Secure Environment</p>
                <div className="flex gap-1 justify-center">
                  {[0, 1, 2].map(i => (
                    <motion.div
                      key={i}
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                      className="w-1.5 h-1.5 rounded-full bg-brand-primary"
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ── Step 1: Welcome ── */}
          {step === 1 && !isInitializing && (
            <motion.div
              key="1"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-md text-left bg-surface/40 border border-base/60 rounded-[32px] p-8 backdrop-blur-md shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center">
                  <Shield size={24} className="text-brand-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-display font-bold text-primary tracking-tight">
                    {showOtpEntry ? 'Verify Email' : 'Create Secure Vault'}
                  </h2>
                  <p className="text-[10px] font-bold text-brand-primary uppercase tracking-widest mt-0.5">
                    {showOtpEntry ? 'Onboarding Code Verification' : 'Sovereign Protocol Initialization'}
                  </p>
                </div>
              </div>

              {!showOtpEntry ? (
                <>
                  <div className="space-y-4 mb-6">
                    <Input
                      label="Full Legal Name"
                      placeholder="John Asha"
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      required
                    />
                    <Input
                      label="Email Address"
                      placeholder="john@example.com"
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                    />
                    <Input
                      label="Master Password"
                      placeholder="••••••••"
                      type="password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                    />
                  </div>

                  {error && (
                    <div className="p-3 mb-6 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium">
                      {error}
                    </div>
                  )}

                  <Button
                    variant="primary"
                    size="lg"
                    onClick={nextStep}
                    disabled={isSendingOtp}
                    fullWidth
                    className="h-14 text-[11px] font-bold uppercase tracking-widest shadow-xl shadow-brand-primary/20"
                  >
                    {isSendingOtp ? 'Sending...' : 'Begin Protocol'} <ArrowRight className="ml-2 inline" size={18} />
                  </Button>
                </>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    <p className="text-muted text-xs font-medium leading-relaxed">
                      We have sent a 6-digit verification code to <span className="text-primary font-bold">{email}</span>. Please enter it below.
                    </p>
                    <Input
                      label="Verification Code"
                      placeholder="e.g. 123456"
                      type="text"
                      maxLength={6}
                      value={otpCode}
                      onChange={e => setOtpCode(e.target.value.replace(/\D/g, ''))}
                      required
                      className="text-center tracking-[0.5em] text-lg font-bold"
                    />
                  </div>

                  {error && (
                    <div className="p-3 mb-6 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium">
                      {error}
                    </div>
                  )}

                  <Button
                    variant="primary"
                    size="lg"
                    onClick={nextStep}
                    fullWidth
                    className="h-14 text-[11px] font-bold uppercase tracking-widest shadow-xl shadow-brand-primary/20 mb-3"
                  >
                    Verify & Create Vault <ArrowRight className="ml-2 inline" size={18} />
                  </Button>

                  <div className="flex justify-between mt-4">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setShowOtpEntry(false)}
                      className="text-[10px] font-bold uppercase tracking-widest text-muted p-0"
                    >
                      <ArrowLeft className="mr-1 inline" size={12} /> Back
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={handleResendOtp}
                      disabled={isSendingOtp}
                      className="text-[10px] font-bold uppercase tracking-widest text-brand-primary p-0"
                    >
                      {isSendingOtp ? 'Sending...' : 'Resend Code'}
                    </Button>
                  </div>
                </>
              )}
            </motion.div>
          )}

          {/* ── Step 2: Jurisdiction ── */}
          {step === 2 && (
            <motion.div
              key="2"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-md"
            >
              <div className="p-8 bg-surface/40 border border-base/60 rounded-[32px] backdrop-blur-md shadow-2xl">
                <div className="w-14 h-14 rounded-2xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center mb-6">
                  <Globe size={26} className="text-brand-primary" />
                </div>
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-primary mb-2">Step 2 of 5</p>
                <h2 className="text-3xl font-display font-bold text-primary tracking-tight mb-2">Compliance Hub</h2>
                <p className="text-muted text-sm font-medium mb-8">We customize your vault protocols based on your regional inheritance laws and tax regulations.</p>
                
                <Select
                  label="Select Primary Jurisdiction"
                  options={jurisdictions}
                  value={jurisdiction}
                  onChange={e => setLocalJurisdiction(e.target.value)}
                />

                <div className="mt-6 p-4 bg-brand-primary/5 rounded-xl border border-brand-primary/10">
                  <p className="text-[11px] text-secondary font-medium leading-relaxed">
                    <span className="text-brand-primary font-bold">Note:</span> This ensures your digital assets are handled according to <span className="uppercase">{jurisdiction}</span> legal frameworks.
                  </p>
                </div>

                <div className="flex justify-between items-center mt-8">
                  <Button variant="ghost" onClick={skipStep} className="text-[10px] font-bold uppercase tracking-widest text-muted">Skip</Button>
                  <div className="flex space-x-3">
                    <Button variant="secondary" onClick={() => setStep(s => s - 1)} className="h-12 px-5"><ArrowLeft size={16} /></Button>
                    <Button onClick={nextStep} className="h-12 px-8 text-[10px] font-bold uppercase tracking-widest">
                      Continue <ArrowRight size={16} className="ml-2 inline" />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── Step 3: First Asset ── */}
          {step === 3 && (
            <motion.div
              key="3"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-md"
            >
              <div className="p-8 bg-surface/40 border border-base/60 rounded-[32px] backdrop-blur-md shadow-2xl">
                <div className="w-14 h-14 rounded-2xl bg-brand-primary-dim border border-brand-primary/20 flex items-center justify-center mb-6">
                  <Wallet size={26} className="text-brand-primary" />
                </div>
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-primary mb-2">Step 3 of 5</p>
                <h2 className="text-3xl font-display font-bold text-primary tracking-tight mb-2">First Asset</h2>
                <p className="text-muted text-sm font-medium mb-8">What's the most critical digital asset you want to protect in your vault?</p>
                <Input
                  label="Asset Designation"
                  placeholder="e.g. Ledger Cold Storage"
                  value={assetName}
                  onChange={e => setAssetName(e.target.value)}
                />
                <div className="flex justify-between items-center mt-8">
                  <Button variant="ghost" onClick={skipStep} className="text-[10px] font-bold uppercase tracking-widest text-muted">Skip</Button>
                  <div className="flex space-x-3">
                    <Button variant="secondary" onClick={() => setStep(s => s - 1)} className="h-12 px-5"><ArrowLeft size={16} /></Button>
                    <Button onClick={nextStep} disabled={!assetName} className="h-12 px-8 text-[10px] font-bold uppercase tracking-widest">
                      Continue <ArrowRight size={16} className="ml-2 inline" />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── Step 4: Guardian ── */}
          {step === 4 && (
            <motion.div
              key="4"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-md"
            >
              <div className="p-8 bg-surface/40 border border-base/60 rounded-[32px] backdrop-blur-md shadow-2xl">
                <div className="w-14 h-14 rounded-2xl bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center mb-6">
                  <Users size={26} className="text-brand-gold" />
                </div>
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-primary mb-2">Step 4 of 5</p>
                <h2 className="text-3xl font-display font-bold text-primary tracking-tight mb-2">Assign a Guardian</h2>
                <p className="text-muted text-sm font-medium mb-8">Guardians verify succession events. They never see your encrypted data - only approve the release.</p>
                <Input
                  label="Guardian Email"
                  placeholder="guardian@institution.com"
                  type="email"
                  value={guardianEmail}
                  onChange={e => setGuardianEmail(e.target.value)}
                />
                <div className="flex justify-between items-center mt-8">
                  <Button variant="ghost" onClick={skipStep} className="text-[10px] font-bold uppercase tracking-widest text-muted">Skip</Button>
                  <div className="flex space-x-3">
                    <Button variant="secondary" onClick={() => setStep(s => s - 1)} className="h-12 px-5"><ArrowLeft size={16} /></Button>
                    <Button onClick={nextStep} disabled={!guardianEmail} className="h-12 px-8 text-[10px] font-bold uppercase tracking-widest">
                      Continue <ArrowRight size={16} className="ml-2 inline" />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── Step 5: Heir ── */}
          {step === 5 && (
            <motion.div
              key="5"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-md"
            >
              <div className="p-8 bg-surface/40 border border-base/60 rounded-[32px] backdrop-blur-md shadow-2xl">
                <div className="w-14 h-14 rounded-2xl bg-trust-500/10 border border-trust-500/20 flex items-center justify-center mb-6">
                  <KeyRound size={26} className="text-trust-500" />
                </div>
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-primary mb-2">Step 5 of 5</p>
                <h2 className="text-3xl font-display font-bold text-primary tracking-tight mb-2">Register an Heir</h2>
                <p className="text-muted text-sm font-medium mb-8">Who receives your digital estate when succession triggers? Institutional protocol requires one valid heir.</p>
                <div className="space-y-4">
                  <Input label="Heir Full Name" placeholder="e.g. Emily Asha" value={heirName} onChange={e => setHeirName(e.target.value)} />
                  <Input label="Heir Email" placeholder="heir@email.com" type="email" value={heirEmail} onChange={e => setHeirEmail(e.target.value)} />
                </div>
                <div className="flex justify-between items-center mt-8">
                  <Button variant="ghost" onClick={skipStep} className="text-[10px] font-bold uppercase tracking-widest text-muted">Skip</Button>
                  <div className="flex space-x-3">
                    <Button variant="secondary" onClick={() => setStep(s => s - 1)} className="h-12 px-5"><ArrowLeft size={16} /></Button>
                    <Button onClick={nextStep} disabled={!heirName || !heirEmail} className="h-12 px-8 text-[10px] font-bold uppercase tracking-widest">
                      Finalize <ArrowRight size={16} className="ml-2 inline" />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── Step 6: Complete ── */}
          {step === 6 && (
            <motion.div
              key="6"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-md text-center"
            >
              {/* Confetti triggered via useEffect */}

              <div className="w-20 h-20 rounded-[28px] bg-trust-500/10 border border-trust-500/30 flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_rgba(16,185,129,0.15)]">
                <ShieldCheck size={36} className="text-trust-500" />
              </div>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-trust-500 mb-4">Vault Initialized</p>
              <h2 className="text-4xl sm:text-5xl font-display font-bold text-primary tracking-tight leading-[0.95] mb-3">
                Your Legacy is <span className="italic text-trust-500">Secured</span>
              </h2>
              <p className="text-secondary text-base mb-10 font-medium max-w-sm mx-auto">Your digital succession vault is live under <span className="uppercase text-brand-primary">{jurisdiction}</span> law.</p>

              {/* Score gauge */}
              <div className="flex justify-center mb-10">
                <div className="relative w-44 h-44 flex items-center justify-center">
                  <svg className="transform -rotate-90 w-full h-full">
                    <circle cx="88" cy="88" r="76" stroke="rgba(255,255,255,0.05)" strokeWidth="10" fill="transparent" />
                    <motion.circle
                      cx="88" cy="88" r="76"
                      stroke="#D4AF37"
                      strokeWidth="10"
                      fill="transparent"
                      strokeLinecap="round"
                      strokeDasharray={2 * Math.PI * 76}
                      initial={{ strokeDashoffset: 2 * Math.PI * 76 }}
                      animate={{ strokeDashoffset: (2 * Math.PI * 76) * (1 - 0.75) }}
                      transition={{ duration: 2, ease: 'easeOut', delay: 0.5 }}
                      style={{ filter: 'drop-shadow(0 0 14px rgba(212,175,55,0.6))' }}
                    />
                  </svg>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="absolute flex flex-col items-center"
                  >
                    <span className="text-5xl font-bold tabular-nums text-primary leading-none">75</span>
                    <span className="text-[10px] font-bold text-muted uppercase tracking-widest mt-1">/ 100</span>
                  </motion.div>
                </div>
              </div>

              <Button variant="primary" size="lg" onClick={finish} fullWidth className="h-14 text-[11px] font-bold uppercase tracking-widest shadow-xl shadow-brand-primary/20">
                Enter Your Vault <ArrowRight className="ml-2 inline" size={18} />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
