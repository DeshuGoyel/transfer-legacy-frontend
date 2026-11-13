import { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { Bell, Menu, X, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../utils/cn';
import ThemeToggle from './ThemeToggle';
import { LogoMark } from '../ui/Logo';
import toast from 'react-hot-toast';
import { useCheckinStore } from '../../store/useCheckinStore';

const navLinks = [
  { label: 'How It Works', href: '#how' },
  { label: 'Security', href: '#security' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
];

export default function Navbar({ variant = 'app' }: { variant?: 'app' | 'marketing' }) {
  const branding = useStore((state) => state.branding);
  // ── Marketing variant state ──
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    if (variant !== 'marketing') return;
    const onScroll = () => {
      setScrolled(window.scrollY > 10);
      const sections = navLinks.map(l => document.querySelector(l.href)).filter(Boolean) as HTMLElement[];
      let current = '';
      for (const section of sections) {
        if (window.scrollY >= section.offsetTop - 300) current = '#' + section.id;
      }
      setActiveSection(current);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [variant]);

  const scrollTo = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // ── App variant state ──
  const {
    user,
    toggleNotifications,
    notifications,
    fetchNotifications,
    isMobileSidebarOpen,
    toggleMobileSidebar,
    isSidebarCollapsed,
    toggleSidebar,
    performCheckIn,
  } = useStore();

  useEffect(() => {
    if (variant !== 'marketing') {
      fetchNotifications();
    }
  }, [variant, fetchNotifications]);

  const checkinSettings = useCheckinStore((state) => state.checkinSettings);
  const completeCheckin = useCheckinStore((state) => state.completeCheckin);
  const [isSyncingHeartbeat, setIsSyncingHeartbeat] = useState(false);

  const handleHeartbeatSync = async () => {
    if (isSyncingHeartbeat) return;
    setIsSyncingHeartbeat(true);
    try {
      await performCheckIn('Header Pulse');
      completeCheckin('tap');
      toast.success('Heartbeat synchronized. Vault secured!');
    } catch (err) {
      console.error('Failed to sync heartbeat:', err);
      toast.error('Heartbeat sync failed');
    } finally {
      setIsSyncingHeartbeat(false);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  if (variant === 'marketing') {
    return (
      <>
        <nav
          className={cn(
            'fixed top-0 left-0 right-0 z-50 transition-all duration-500 h-[72px] flex items-center',
            scrolled
              ? 'bg-surface/80 backdrop-blur-2xl border-b border-base shadow-2xl'
              : 'bg-transparent'
          )}
        >
          <div className="max-w-7xl mx-auto px-6 w-full flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 overflow-hidden flex items-center justify-center">
                <img src="/logo-dark.png" alt="Transfer Legacy" className="w-full h-full object-contain dark:block hidden" />
                <img src="/logo-light.jpeg" alt="Transfer Legacy" className="w-full h-full object-contain dark:hidden block" />
              </div>
              <span className="font-bold text-[18px] tracking-tight text-primary uppercase letter-spacing-[0.05em]">
                Transfer{' '}
                <span
                  className="font-bold"
                  style={{
                    background: 'linear-gradient(135deg, var(--color-brand-primary), var(--color-gradient-purple))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  Legacy
                </span>
              </span>
            </Link>

            {/* Desktop Links */}
            <div className="hidden lg:flex items-center gap-2">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => scrollTo(link.href)}
                  className={cn(
                    'px-4 py-2 rounded-xl text-[11px] font-bold uppercase tracking-[0.2em] transition-all duration-300',
                    activeSection === link.href
                      ? 'text-brand-primary bg-brand-primary/10 shadow-[inset_0_0_12px_rgba(212,167,44,0.1)]'
                      : 'text-secondary hover:text-primary hover:bg-surface/50'
                  )}
                >
                  {link.label}
                </button>
              ))}
            </div>

            {/* Actions */}
            <div className="hidden md:flex items-center gap-4">
              <ThemeToggle />
              {!branding.waitlist_enabled && (
                <Link
                  to="/login"
                  className="px-5 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-[0.2em] text-secondary border border-base hover:border-strong hover:bg-surface/50 transition-all duration-300 flex items-center justify-center"
                >
                  Sign in
                </Link>
              )}
              {branding.waitlist_enabled ? (
                <button
                  onClick={() => scrollTo('#waitlist')}
                  className="px-6 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-[0.2em] transition-all duration-300 shadow-[0_0_25px_rgba(249,115,22,0.2)] hover:shadow-[0_0_35px_rgba(249,115,22,0.4)]"
                  style={{
                    background: 'linear-gradient(135deg, var(--color-gradient-pink) 0%, var(--color-brand-primary) 50%, var(--color-gradient-purple) 100%)',
                    color: 'white',
                  }}
                >
                  Join Waitlist
                </button>
              ) : (
                <Link
                  to="/onboarding"
                  className="px-6 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-[0.2em] transition-all duration-300 shadow-[0_0_25px_rgba(249,115,22,0.2)] hover:shadow-[0_0_35px_rgba(249,115,22,0.4)] flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, var(--color-gradient-pink) 0%, var(--color-brand-primary) 50%, var(--color-gradient-purple) 100%)',
                    color: 'white',
                  }}
                >
                  Get Started
                </Link>
              )}
            </div>

            {/* Hamburger */}
            <button
              className="md:hidden text-primary p-2 rounded-xl hover:bg-surface/50 transition-colors"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              transition={{ type: 'tween', duration: 0.28 }}
              className="fixed inset-0 z-[100] bg-page flex flex-col px-8 pt-24 pb-12"
            >
              <div className="absolute top-0 right-0 w-64 h-64 pointer-events-none opacity-20"
                style={{ background: 'radial-gradient(circle at top right, var(--color-brand-primary), transparent 60%)' }}
              />
              <button
                className="absolute top-5 right-6 text-secondary hover:text-primary transition-colors"
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
              >
                <X size={26} />
              </button>

              <nav className="flex flex-col gap-5">
                {navLinks.map((link, i) => (
                  <motion.button
                    key={link.label}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    onClick={() => scrollTo(link.href)}
                    className="text-3xl font-bold text-primary hover:text-brand-primary text-left transition-colors"
                  >
                    {link.label}
                  </motion.button>
                ))}
              </nav>

              <div className="mt-auto flex flex-col gap-3">
                {branding.waitlist_enabled ? (
                  <button
                    onClick={() => scrollTo('#waitlist')}
                    className="w-full py-4 rounded-2xl text-base font-bold text-white shadow-[0_0_30px_rgba(249,115,22,0.3)]"
                    style={{
                      background: 'linear-gradient(135deg, var(--color-gradient-pink) 0%, var(--color-brand-primary) 50%, var(--color-gradient-purple) 100%)',
                    }}
                  >
                    Claim Your Spot
                  </button>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setMobileOpen(false)}
                      className="w-full py-4 rounded-2xl text-base font-bold text-secondary border border-base bg-surface/50 hover:border-strong transition-all duration-300 flex items-center justify-center"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/onboarding"
                      onClick={() => setMobileOpen(false)}
                      className="w-full py-4 rounded-2xl text-base font-bold text-white shadow-[0_0_30px_rgba(249,115,22,0.3)] flex items-center justify-center"
                      style={{
                        background: 'linear-gradient(135deg, var(--color-gradient-pink) 0%, var(--color-brand-primary) 50%, var(--color-gradient-purple) 100%)',
                      }}
                    >
                      Get Started
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  }

  const handleSidebarToggle = () => {
    if (window.innerWidth < 1024) {
      toggleMobileSidebar();
    } else {
      toggleSidebar();
    }
  };

  // App Layout
  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 h-14 flex items-center border-b border-[rgba(255,255,255,0.07)] transition-all duration-200",
        isSidebarCollapsed ? "lg:pl-0" : "lg:pl-[240px]"
      )}
      style={{ background: 'var(--color-bg-page)' }}
    >
      <div className="flex items-center justify-between w-full px-5">
        <div className="flex items-center gap-3">
          {/* Toggle sidebar button */}
          <button
            onClick={handleSidebarToggle}
            className="p-1.5 rounded-md transition-colors hover:bg-[rgba(255,255,255,0.05)]"
            style={{ color: '#9B97A3' }}
            aria-label="Toggle menu"
          >
            {isMobileSidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>

          {/* Logo and name */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <LogoMark size={22} />
            <span
              className="font-display text-[13px] font-medium tracking-wide text-primary transition-opacity group-hover:opacity-75"
              style={{ letterSpacing: '-0.01em' }}
            >
              Transfer Legacy
            </span>
          </Link>

          {/* Home etc. Links in Title Bar */}
          <div className="hidden lg:flex items-center gap-6 ml-8 border-l border-border pl-8">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                cn(
                  "text-[12px] font-medium transition-colors hover:text-primary",
                  isActive ? "text-brand-primary" : "text-secondary"
                )
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/assets"
              className={({ isActive }) =>
                cn(
                  "text-[12px] font-medium transition-colors hover:text-primary",
                  isActive ? "text-brand-primary" : "text-secondary"
                )
              }
            >
              Vault
            </NavLink>
            <NavLink
              to="/guardians"
              className={({ isActive }) =>
                cn(
                  "text-[12px] font-medium transition-colors hover:text-primary",
                  isActive ? "text-brand-primary" : "text-secondary"
                )
              }
            >
              Guardians
            </NavLink>
            <NavLink
              to="/settings"
              className={({ isActive }) =>
                cn(
                  "text-[12px] font-medium transition-colors hover:text-primary",
                  isActive ? "text-brand-primary" : "text-secondary"
                )
              }
            >
              Settings
            </NavLink>
          </div>
        </div>

        <div className="flex items-center gap-1.5 ml-auto">
          {/* Heartbeat Pulse Indicator & Manual Sync */}
          <button
            onClick={handleHeartbeatSync}
            disabled={isSyncingHeartbeat}
            className="relative p-2 rounded-md transition-colors hover:bg-surface/50 text-rose-500 hover:text-rose-400 group flex items-center justify-center"
            aria-label="Heartbeat Pulse"
            title={`Heartbeat Active (Streak: ${checkinSettings?.currentStreak ?? 1}) - Click to sync`}
          >
            <Heart 
              size={17} 
              className={cn(
                "fill-rose-500/20 text-rose-500 transition-transform group-hover:scale-110",
                isSyncingHeartbeat ? "animate-spin" : "animate-pulse"
              )} 
            />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping opacity-75" />
          </button>

          <button
            onClick={toggleNotifications}
            className="relative p-2 rounded-md transition-colors hover:bg-surface/50 text-secondary hover:text-primary"
            aria-label="Notifications"
          >
            <Bell size={17} strokeWidth={1.75} />
            {unreadCount > 0 && (
              <span
                className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-brand-primary"
              />
            )}
          </button>

          <ThemeToggle />

          <Link
            to="/settings"
            className="ml-1 flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-[8px] border border-border hover:border-brand-primary/40 transition-colors bg-surface"
          >
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0 bg-brand-primary"
            >
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <span className="hidden sm:inline text-[12px] font-medium text-primary">
              {user.name.split(' ')[0]}
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
