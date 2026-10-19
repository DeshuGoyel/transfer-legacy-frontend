import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Loader2, ArrowRight, ArrowLeft, Mail, CheckCircle2 } from 'lucide-react';
import { api } from '../lib/api';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';
import { useBodyClass } from '../hooks/useBodyClass';

export default function ForgotPassword() {
  useBodyClass('allow-cursor');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSent, setIsSent] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await api.post(
        '/auth/password/reset/request',
        { email },
        { skipAead: true }
      );

      setIsSent(true);
      toast.success('Reset link sent to your email!');
    } catch (err: unknown) {
      console.error('Password reset request error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Connection error occurred';
      setError(errorMessage);
      toast.error(errorMessage || 'Failed to request reset link');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020409] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-brand-primary/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[120px] animate-pulse delay-1000" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-[440px]"
      >
        {/* Brand Area */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 group mb-4">
            <div className="w-10 h-10 bg-brand-primary-dim border border-brand-primary/30 rounded-xl flex items-center justify-center group-hover:bg-brand-primary/20 transition-colors">
              <svg viewBox="0 0 24 24" className="w-5 h-5 stroke-brand-primary stroke-2 fill-none">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <span className="font-display text-2xl font-bold text-white tracking-wide">
              Transfer Legacy
            </span>
          </Link>
          <p className="text-slate-400 text-sm">Recover your zero-knowledge succession vault</p>
        </div>

        <div className="bg-slate-900/30 backdrop-blur-2xl border border-slate-800/80 rounded-[32px] p-8 shadow-2xl">
          <AnimatePresence mode="wait">
            {!isSent ? (
              <motion.div
                key="request-form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <h2 className="text-xl font-bold text-white mb-2">Forgot Password</h2>
                <p className="text-slate-400 text-xs mb-6 leading-relaxed">
                  Enter the email address registered with your account. We will email you a secure link to reset your master password and re-initialize your vault.
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="relative">
                    <Input
                      label="Email Address"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="bg-slate-950/50 border-slate-800/80 focus:border-brand-primary/50 pl-10 text-white"
                    />
                    <Mail className="absolute left-3.5 bottom-3.5 w-4 h-4 text-slate-500" />
                  </div>

                  {error && (
                    <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span className="text-xs">{error}</span>
                    </div>
                  )}

                  <div className="flex flex-col gap-3">
                    <Button
                      type="submit"
                      variant="primary"
                      className="w-full h-12 rounded-xl text-sm font-semibold bg-brand-primary hover:bg-brand-primary-hover text-white shadow-lg shadow-brand/20 transition-all flex items-center justify-center gap-2 group"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <>
                          <span>Send Reset Link</span>
                          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </>
                      )}
                    </Button>

                    <Button
                      type="button"
                      variant="ghost"
                      className="w-full h-10 text-xs font-semibold text-slate-400 hover:text-white transition-all flex items-center justify-center gap-2"
                      onClick={() => navigate('/login')}
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back to Login</span>
                    </Button>
                  </div>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="success-message"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-4"
              >
                <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                </div>
                
                <h2 className="text-xl font-bold text-white mb-2">Check your inbox</h2>
                <p className="text-slate-400 text-xs mb-8 leading-relaxed px-4">
                  We've sent a secure password recovery email to <strong className="text-slate-200">{email}</strong>. 
                  Click the link in the email to set your new password.
                </p>

                <Button
                  variant="secondary"
                  className="w-full h-12 rounded-xl text-sm font-semibold border border-slate-800 hover:bg-slate-800/50 text-white transition-all"
                  onClick={() => navigate('/login')}
                >
                  Return to Login
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
