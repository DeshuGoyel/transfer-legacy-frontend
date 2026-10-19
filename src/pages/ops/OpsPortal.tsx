import { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, Navigate, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  ChevronRight,
  LogOut,
  ScrollText, 
  FileText, 
  LayoutDashboard, 
  Users, 
  ShieldCheck, 
  Settings as SettingsIcon,
  Palette,
  Phone,
  Menu,
  ClipboardList,
  CreditCard,
  Tag,
  Shield
} from 'lucide-react';
import { useOpsStore } from '../../store/useOpsStore';
import { cn } from '../../utils/cn';
import { useBodyClass } from '../../hooks/useBodyClass';
import { LogoMark } from '../../components/ui/Logo';

// Modules
import OpsDashboard from './modules/Dashboard';
import UserManagement from './modules/UserManagement';
import PlanManagement from './modules/PlanManagement';
import CouponManagement from './modules/CouponManagement';
import WaitlistManager from './modules/Waitlist';
import SystemSettings from './modules/SystemSettings';
import AdminMgmt from './modules/AdminMgmt';
import LeanCMS from './modules/LeanCMS';
import AuditLogs from './modules/AuditLogs';
import BrandingStudio from './modules/Branding';
import ContactSettings from './modules/ContactSettings';
import ReviewsManager from './modules/Reviews';

const NAV_GROUPS = [
  {
    name: 'Main',
    items: [
      { name: 'Overview', path: '/ops/dashboard', icon: LayoutDashboard },
      { name: 'Users', path: '/ops/users', icon: Users },
      { name: 'Waitlist', path: '/ops/waitlist', icon: ClipboardList },
    ]
  },
  {
    name: 'Monetization',
    items: [
      { name: 'Plans', path: '/ops/plans', icon: CreditCard },
      { name: 'Coupons', path: '/ops/coupons', icon: Tag },
    ]
  },
  {
    name: 'Staff & Security',
    items: [
      { name: 'Administrators', path: '/ops/admins', icon: ShieldCheck },
      { name: 'Claim Reviews', path: '/ops/reviews', icon: Shield },
    ]
  },
  {
    name: 'System',
    items: [
      { name: 'Lean CMS', path: '/ops/cms', icon: FileText },
      { name: 'Visual Identity', path: '/ops/branding', icon: Palette },
      { name: 'Configuration', path: '/ops/settings', icon: SettingsIcon },
      { name: 'Contact Setup', path: '/ops/contact', icon: Phone },
      { name: 'Audit Logs', path: '/ops/audit', icon: ScrollText },
    ]
  }
];

export default function OpsPortal() {
  useBodyClass('allow-cursor');
  const { isAuthenticated, isHydrated, admin, logout } = useOpsStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Protected route check - Wait for hydration to avoid flash-redirect
  useEffect(() => {
    if (isHydrated && !isAuthenticated) {
      navigate('/ops/login', { replace: true });
    }
  }, [isHydrated, isAuthenticated, navigate]);

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-[#08090C] flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/ops/login');
  };

  return (
    <div className="min-h-screen bg-[#08090C] text-[#E9E6DF] flex flex-col md:flex-row overflow-hidden font-sans">
      {/* Mobile Header */}
      <div className="md:hidden h-16 bg-[#0E1015] border-b border-[rgba(255,255,255,0.08)] flex items-center justify-between px-6 z-[60]">
        <div className="flex items-center gap-3">
          <LogoMark size={24} />
          <span className="font-display font-bold text-white tracking-tight">Ops Center</span>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-[#9B97A3] hover:text-white"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Backdrop (Mobile) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[40] md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {(isMobileMenuOpen || window.innerWidth >= 768) && (
          <motion.aside 
            initial={window.innerWidth < 768 ? { x: -300 } : false}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={cn(
              "fixed inset-y-0 left-0 z-50 bg-[#0E1015] border-r border-[rgba(255,255,255,0.08)]",
              "md:sticky md:top-0 md:translate-x-0",
              isSidebarOpen ? "w-64" : "w-20",
              !isMobileMenuOpen && "hidden md:block"
            )}
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="h-16 flex items-center px-6 border-b border-[rgba(255,255,255,0.08)]">
                <LogoMark size={26} className="mr-3 flex-shrink-0" />
                {isSidebarOpen && (
                  <div className="flex items-center gap-2">
                    <span className="font-display font-bold text-base tracking-tight text-white truncate">
                      Transfer Legacy
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-brand-primary/20 text-brand-primary border border-brand-primary/30">
                      OPS
                    </span>
                  </div>
                )}
              </div>

              {/* Navigation */}
              <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-7 custom-scrollbar">
                {NAV_GROUPS.map((group) => (
                  <div key={group.name} className="space-y-1.5">
                    {isSidebarOpen && (
                      <h3 className="px-4 text-[10px] font-bold text-[#6B6675] uppercase tracking-[0.2em] mb-2 font-mono">
                        {group.name}
                      </h3>
                    )}
                    <div className="space-y-1">
                      {group.items.map((item) => {
                        const isActive = location.pathname === item.path;
                        const Icon = item.icon;

                        return (
                          <Link
                            key={item.path}
                            to={item.path}
                            className={cn(
                              "flex items-center px-4 py-2.5 rounded-xl transition-all duration-200 group relative text-xs",
                              isActive 
                                ? "bg-brand-primary/10 text-brand-primary font-bold shadow-[inset_0_0_15px_rgba(244,63,94,0.08)]" 
                                : "text-[#9B97A3] hover:bg-white/[0.03] hover:text-white"
                            )}
                          >
                            <Icon className={cn("w-4 h-4 flex-shrink-0 transition-transform duration-200", isActive ? "text-brand-primary scale-110" : "group-hover:text-brand-primary group-hover:scale-110")} />
                            {isSidebarOpen && (
                              <span className="ml-3 truncate font-medium">{item.name}</span>
                            )}
                            {isActive && (
                              <motion.div 
                                layoutId="active-ops-pill"
                                className="absolute left-0 w-1 h-5 bg-brand-primary rounded-r-full"
                              />
                            )}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </nav>

              {/* User Section */}
              <div className="p-4 border-t border-[rgba(255,255,255,0.08)] bg-[#08090C]/60">
                <div className={cn("flex items-center", isSidebarOpen ? "space-x-3" : "justify-center")}>
                  <div className="w-9 h-9 rounded-xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary font-bold text-xs">
                    {admin?.email.charAt(0).toUpperCase()}
                  </div>
                  {isSidebarOpen && (
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-white truncate">{admin?.email}</p>
                      <p className="text-[10px] uppercase tracking-widest text-brand-primary font-bold font-mono">
                        {admin?.role_name}
                      </p>
                    </div>
                  )}
                </div>
                <button 
                  onClick={handleLogout}
                  className={cn(
                    "mt-3 flex items-center w-full py-1.5 text-[#9B97A3] hover:text-rose-400 transition-colors text-xs font-semibold",
                    isSidebarOpen ? "space-x-2 px-3" : "justify-center"
                  )}
                >
                  <LogOut className="w-4 h-4" />
                  {isSidebarOpen && <span>Sign Out</span>}
                </button>
              </div>
            </div>

            {/* Toggle Button */}
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-[#0E1015] border border-[rgba(255,255,255,0.15)] flex items-center justify-center text-white shadow-xl hover:border-brand-primary transition-colors hidden md:flex"
            >
              {isSidebarOpen ? <X className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
            </button>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main 
        className={cn(
          "flex-1 transition-all duration-300 overflow-y-auto bg-[#08090C] h-[calc(100vh-4rem)] md:h-screen",
        )}
      >
        <div className="p-8 max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="dashboard" element={<OpsDashboard />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="plans" element={<PlanManagement />} />
              <Route path="coupons" element={<CouponManagement />} />
              <Route path="waitlist" element={<WaitlistManager />} />
              <Route path="admins" element={<AdminMgmt />} />
              <Route path="settings" element={<SystemSettings />} />
              <Route path="branding" element={<BrandingStudio />} />
              <Route path="contact" element={<ContactSettings />} />
              <Route path="cms" element={<LeanCMS />} />
              <Route path="audit" element={<AuditLogs />} />
              <Route path="reviews" element={<ReviewsManager />} />
              <Route path="*" element={<Navigate to="/ops/dashboard" replace />} />
            </Routes>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
