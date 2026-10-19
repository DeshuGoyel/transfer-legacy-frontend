import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Shield,
  Users,
  Package,
  History,
  Settings,
  HelpCircle,
  LogOut,
  GitBranch,
  Cpu,
  ChevronRight,
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { cn } from '../../utils/cn';
import { LogoMark } from '../ui/Logo';

/* ── Nav sections ─────────────────────────────────────────── */
const sections = [
  {
    label: 'VAULT',
    items: [
      { icon: LayoutDashboard, label: 'Overview',     path: '/dashboard' },
      { icon: Package,         label: 'Accounts',     path: '/assets' },
    ],
  },
  {
    label: 'MANAGE',
    items: [
      { icon: Users,     label: 'Guardians',    path: '/guardians' },
      { icon: GitBranch, label: 'Instructions',  path: '/trust' },
      { icon: Shield,    label: "Dead Man's Switch", path: '/check-in' },
      { icon: Cpu,       label: 'AI Planner',   path: '/ai-planner' },
    ],
  },
  {
    label: 'ACCOUNT',
    items: [
      { icon: Settings,   label: 'Settings', path: '/settings' },
      { icon: HelpCircle, label: 'Support',  path: '/support' },
    ],
  },
];

/* ── Sidebar ──────────────────────────────────────────────── */
export default function Sidebar() {
  const { isMobileSidebarOpen, toggleMobileSidebar, user, logout, isSidebarCollapsed } = useStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleNavClick = () => {
    if (isMobileSidebarOpen) toggleMobileSidebar();
  };

  const planLabel = (user as { plan?: string } | null)?.plan || 'Family';

  return (
    <>
      {/* Mobile overlay */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 lg:hidden"
          onClick={toggleMobileSidebar}
        />
      )}

      <aside
        className={cn(
          'fixed left-0 top-0 h-screen w-[240px] z-40 flex flex-col select-none',
          'border-r border-[rgba(255,255,255,0.07)]',
          'transition-transform duration-200',
          isMobileSidebarOpen 
            ? 'translate-x-0' 
            : isSidebarCollapsed 
              ? '-translate-x-full' 
              : '-translate-x-full lg:translate-x-0',
        )}
        style={{ background: 'var(--color-bg-sidebar, #0A0910)' }}
      >
        {/* ── Brand ─────────────────────────────────────── */}
        <div className="h-14 flex items-center gap-3 px-5 border-b border-[rgba(255,255,255,0.07)] shrink-0">
          <LogoMark size={28} />
          <span
            className="font-display font-medium tracking-wide text-[16px]"
            style={{ color: '#E9E6DF', letterSpacing: '-0.01em' }}
          >
            Transfer Legacy
          </span>
        </div>

        {/* ── Navigation ────────────────────────────────── */}
        <nav className="flex-1 overflow-y-auto py-4 px-2">
          {sections.map((section) => (
            <div key={section.label} className="mb-5">
              {/* Section label */}
              <p
                className="px-3 mb-1.5 text-[10px] font-semibold tracking-[0.14em] uppercase"
                style={{ color: '#5C596A' }}
              >
                {section.label}
              </p>

              {/* Nav items */}
              {section.items.map((item) => (
                <NavLink
                  key={item.path + item.label}
                  to={item.path}
                  onClick={handleNavClick}
                  className={({ isActive }) =>
                    cn(
                      'group relative flex items-center gap-3 px-3 py-2 rounded-[6px] mb-0.5 transition-colors duration-150',
                      isActive
                        ? 'text-white'
                        : 'hover:bg-[rgba(255,255,255,0.04)]',
                    )
                  }
                  style={({ isActive }) =>
                    isActive
                      ? { background: 'var(--color-brand-primary-dim)', color: '#E9E6DF' }
                      : { color: '#9B97A3' }
                  }
                >
                  {({ isActive }) => (
                    <>
                      {/* Active left bar */}
                      {isActive && (
                        <span
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-[18px] rounded-full bg-brand-primary"
                        />
                      )}
                      <item.icon
                        size={15}
                        strokeWidth={isActive ? 2 : 1.75}
                        className={cn(isActive ? "text-brand-primary" : "text-muted", "shrink-0")}
                      />
                      <span className="text-[13px] font-medium">{item.label}</span>
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        {/* ── Legacy Score strip ────────────────────────── */}
        <div
          className="mx-3 mb-3 px-3 py-2.5 rounded-[8px] flex items-center justify-between border border-brand-primary/15"
          style={{ background: 'var(--color-brand-primary-dim)' }}
        >
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em]" style={{ color: '#5C596A' }}>
              Legacy Score
            </p>
            <p className="text-[22px] font-display font-light leading-none mt-0.5 text-brand-primary">
              {useStore.getState().user.score ?? 0}
            </p>
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-1 text-[11px] font-medium transition-opacity hover:opacity-75 text-brand-primary"
          >
            View <ChevronRight size={12} />
          </button>
        </div>

        {/* ── User profile ──────────────────────────────── */}
        <div
          className="p-3 border-t border-[rgba(255,255,255,0.07)] shrink-0"
        >
          <div className="flex items-center gap-3 px-2 py-2 rounded-[8px] hover:bg-[rgba(255,255,255,0.04)] transition-colors group">
            {/* Avatar */}
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-[11px] font-bold text-white bg-brand-primary"
            >
              {user.name.charAt(0).toUpperCase()}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-medium leading-tight truncate" style={{ color: '#E9E6DF' }}>
                {user.name}
              </p>
              <p className="text-[10px] leading-tight truncate mt-0.5" style={{ color: '#5C596A' }}>
                {planLabel} plan
              </p>
            </div>

            <button
              onClick={handleLogout}
              title="Log out"
              className="opacity-70 hover:opacity-100 transition-opacity p-1 rounded hover:bg-[rgba(239,68,68,0.12)] hover:text-red-400"
              style={{ color: '#5C596A' }}
            >
              <LogOut size={13} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
