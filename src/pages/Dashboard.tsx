import { useEffect } from 'react';
import { useStore, Asset } from '../store/useStore';
import {
  Building2, Mail, TrendingUp, Bitcoin, Cloud, Briefcase,
  Lock, Plus, Users, KeyRound, ChevronRight, Shield,
  CheckCircle2, Clock, AlertCircle,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import ProofOfLifeCard from '../components/dashboard/ProofOfLifeCard';
import ActivityFeed from '../components/dashboard/ActivityFeed';

/* ── Asset type → icon mapping ─────────────────────────────── */
const typeIconMap: Record<string, React.ElementType> = {
  bank:       Building2,
  email:      Mail,
  gmail:      Mail,
  investment: TrendingUp,
  zerodha:    TrendingUp,
  crypto:     Bitcoin,
  icloud:     Cloud,
  business:   Briefcase,
};

function assetIcon(type?: string): React.ElementType {
  if (!type) return Lock;
  const key = type.toLowerCase();
  for (const k of Object.keys(typeIconMap)) {
    if (key.includes(k)) return typeIconMap[k];
  }
  return Lock;
}

/* ── Status pill ──────────────────────────────────────────── */
function StatusPill({ status }: { status?: string }) {
  const s = (status || '').toLowerCase();
  if (s === 'secured' || s === 'active' || s === 'confirmed') {
    return (
      <span
        className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.1em] px-2 py-0.5 rounded-[4px]"
        style={{ background: 'rgba(34,197,94,0.10)', color: '#22C55E' }}
      >
        <CheckCircle2 size={9} /> Secured
      </span>
    );
  }
  if (s === 'pending') {
    return (
      <span
        className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.1em] px-2 py-0.5 rounded-[4px]"
        style={{ background: 'rgba(245,158,11,0.10)', color: '#F59E0B' }}
      >
        <Clock size={9} /> Pending
      </span>
    );
  }
  return (
    <span
      className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.1em] px-2 py-0.5 rounded-[4px]"
      style={{ background: 'rgba(155,151,163,0.10)', color: '#9B97A3' }}
    >
      <AlertCircle size={9} /> {status || 'Unknown'}
    </span>
  );
}

/* ── Vault row ────────────────────────────────────────────── */
function VaultRow({ asset, onClick }: { asset: Asset; onClick: () => void }) {
  const Icon = assetIcon(asset.type);
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-4 px-5 py-3.5 text-left border-b border-base last:border-0 transition-colors hover:bg-surface/40 group cursor-pointer"
    >
      <div
        className="w-8 h-8 rounded-[8px] flex items-center justify-center shrink-0 bg-brand-primary-dim border border-brand-primary/15"
      >
        <Icon size={14} className="text-brand-primary" strokeWidth={1.75} />
      </div>

      {/* Name + type */}
      <div className="flex-grow min-w-0">
        <p className="text-[13px] font-medium truncate text-primary">
          {asset.name || 'Unnamed account'}
        </p>
        <p className="text-[11px] truncate mt-0.5 text-secondary/70">
          {asset.type || 'Asset'}
        </p>
      </div>

      {/* Value */}
      {asset.value > 0 && (
        <p className="text-[13px] font-semibold shrink-0 hidden sm:block text-secondary">
          ${asset.value.toLocaleString()}
        </p>
      )}

      {/* Status */}
      <div className="shrink-0">
        <StatusPill status={asset.status} />
      </div>

      {/* Arrow */}
      <ChevronRight size={14} className="shrink-0 text-secondary/30 group-hover:text-secondary transition-colors" />
    </button>
  );
}

/* ── Stat pill ────────────────────────────────────────────── */
function StatPill({ label, value, sub }: { label: string; value: React.ReactNode; sub?: string }) {
  return (
    <div
      className="flex-grow flex-shrink basis-0 min-w-[125px] px-4 py-3.5 rounded-[8px] bg-surface border border-base"
    >
      <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-secondary/60">
        {label}
      </p>
      <p className="text-[20px] font-display font-light leading-none mt-1.5 text-primary">
        {value}
      </p>
      {sub && (
        <p className="text-[10px] mt-1.5 text-secondary/50 font-medium">
          {sub}
        </p>
      )}
    </div>
  );
}

/* ── Empty state ──────────────────────────────────────────── */
function EmptyVault({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div
        className="w-12 h-12 rounded-[10px] flex items-center justify-center mb-4 bg-brand-primary-dim border border-brand-primary/15"
      >
        <Lock size={20} className="text-brand-primary" strokeWidth={1.5} />
      </div>
      <p className="text-[15px] font-medium mb-1 text-primary">
        Your vault is empty
      </p>
      <p className="text-[13px] mb-6 text-secondary/60">
        Add your first account — bank, Gmail, Zerodha, crypto — and it'll be protected here.
      </p>
      <button
        onClick={onAdd}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-[6px] text-[13px] font-semibold text-white transition-opacity hover:opacity-85 cursor-pointer"
        style={{ background: 'var(--color-brand-primary)' }}
      >
        <Plus size={14} /> Protect an account
      </button>
    </div>
  );
}

/* ── Dashboard ────────────────────────────────────────────── */
export default function Dashboard() {
  const { user, assets, guardians, heirs, fetchAssets } = useStore();
  const navigate = useNavigate();

  useEffect(() => { fetchAssets(); }, [fetchAssets]);

  const totalValue    = assets.reduce((acc, a) => acc + (a.value || 0), 0);
  const activeGuards  = guardians.filter((g) => g.status === 'Confirmed').length;

  return (
    <div className="min-h-screen pt-14 bg-page">
      <div className="max-w-[1100px] mx-auto px-5 sm:px-8 pb-20">

        {/* ── Page header ─────────────────────────────── */}
        <div className="flex items-center justify-between pt-8 pb-6">
          <div>
            <p
              className="text-[11px] font-semibold uppercase tracking-[0.15em] mb-1 text-brand-primary"
            >
              Your Vault
            </p>
            <h1
              className="font-display font-light text-[28px] leading-tight text-primary"
              style={{ letterSpacing: '-0.02em' }}
            >
              {user.name.split(' ')[0]}'s Legacy
            </h1>
          </div>

          <button
            onClick={() => navigate('/assets')}
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-[6px] text-[13px] font-semibold text-black transition-opacity hover:opacity-85 cursor-pointer"
            style={{ background: 'var(--color-brand-primary)' }}
          >
            <Plus size={14} /> Add account
          </button>
        </div>

        {/* ── Stat pills ──────────────────────────────── */}
        <div className="flex flex-wrap gap-3 mb-8">
          <StatPill label="Accounts" value={assets.length} sub="in vault" />
          <StatPill
            label="Protected value"
            value={totalValue > 0 ? `$${(totalValue / 1000).toFixed(0)}k` : '—'}
            sub={totalValue > 0 ? 'estimated value' : 'add your accounts'}
          />
          <StatPill
            label="Guardians"
            value={activeGuards}
            sub={`${guardians.length} assigned`}
          />
          <StatPill
            label="Heirs"
            value={heirs.length}
            sub="beneficiaries"
          />
        </div>

        {/* ── Main 2-column grid ───────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-5">

          {/* LEFT — vault list */}
          <div>
            {/* Vault card */}
            <div
              className="rounded-[10px] overflow-hidden bg-surface border border-base"
            >
              {/* Card header */}
              <div
                className="flex items-center justify-between px-5 py-3.5 border-b border-base"
              >
                <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-secondary">
                  Protected Accounts
                </p>
                <button
                  onClick={() => navigate('/assets')}
                  className="flex items-center gap-1 text-[12px] font-semibold transition-opacity hover:opacity-85 cursor-pointer text-brand-primary"
                >
                  View all <ChevronRight size={12} />
                </button>
              </div>

              {/* Rows */}
              {assets.length === 0 ? (
                <EmptyVault onAdd={() => navigate('/assets')} />
              ) : (
                <div>
                  {assets.slice(0, 8).map((asset: Asset) => (
                    <VaultRow
                      key={asset.id}
                      asset={asset}
                      onClick={() => navigate('/assets')}
                    />
                  ))}
                  {assets.length > 8 && (
                    <div className="px-5 py-3 text-center border-t border-base">
                      <button
                        onClick={() => navigate('/assets')}
                        className="text-[12px] font-semibold transition-opacity hover:opacity-85 cursor-pointer text-brand-primary"
                      >
                        + {assets.length - 8} more accounts
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Quick actions row */}
            <div className="mt-5 grid grid-cols-3 gap-3">
              {[
                { icon: Shield,   label: 'Secure account', to: '/assets' },
                { icon: Users,    label: 'Add guardian',   to: '/guardians' },
                { icon: KeyRound, label: 'Assign heir',    to: '/heirs' },
              ].map(({ icon: Icon, label, to }) => (
                <Link
                  key={to}
                  to={to}
                  className="flex items-center gap-2.5 px-4 py-3.5 rounded-[8px] border border-base hover:border-border-strong transition-colors group bg-surface"
                >
                  <Icon size={14} style={{ color: 'var(--color-brand-primary)' }} strokeWidth={1.75} className="shrink-0" />
                  <span className="text-[12px] font-medium text-secondary group-hover:text-primary transition-colors">
                    {label}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* RIGHT — status panel */}
          <div className="space-y-4">

            {/* Legacy Score */}
            <div
              className="rounded-[10px] p-5 bg-surface border border-base"
            >
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] mb-3 text-secondary/60">
                Legacy Score
              </p>
              <div className="flex items-end justify-between">
                <span
                  className="font-display font-light text-[52px] leading-none text-brand-primary"
                  style={{ letterSpacing: '-0.02em' }}
                >
                  {user.score ?? 0}
                </span>
                <span className="text-[11px] mb-1 text-secondary/50">/ 100</span>
              </div>
              <div className="mt-3.5 h-1 rounded-full overflow-hidden bg-muted/10">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${user.score ?? 0}%`, background: 'var(--color-brand-primary)' }}
                />
              </div>
              <p className="text-[11px] mt-3.5 text-secondary/60 leading-relaxed font-light">
                {(user.score ?? 0) < 60
                  ? 'Add more accounts and assign guardians to improve your score.'
                  : 'Your vault is well protected. Keep your check-ins active.'}
              </p>
            </div>

            {/* Proof of Life */}
            <ProofOfLifeCard />

            {/* Audit log */}
            <div
              className="rounded-[10px] overflow-hidden bg-surface border border-base"
            >
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-base">
                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-secondary/60">
                  Audit Log
                </p>
                <button
                  onClick={() => navigate('/activity')}
                  className="flex items-center gap-1 text-[11px] font-semibold transition-opacity hover:opacity-85 cursor-pointer text-brand-primary"
                >
                  All <ChevronRight size={11} />
                </button>
              </div>
              <div className="p-2">
                <ActivityFeed />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
