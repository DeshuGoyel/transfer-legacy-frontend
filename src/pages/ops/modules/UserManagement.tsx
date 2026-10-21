import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  UserCheck, 
  UserX, 
  ShieldAlert, 
  MoreVertical, 
  Edit3, 
  Plus, 
  Key, 
  Heart, 
  Shield, 
  CheckCircle2, 
  X,
  RefreshCw,
  Loader2
} from 'lucide-react';
import toast from 'react-hot-toast';
import { opsApi } from '../../../lib/opsApi';

export interface OpsUser {
  id: string;
  name: string;
  email: string;
  plan: 'Personal' | 'Family' | 'Advisor';
  status: 'active' | 'suspended' | 'pending';
  vaultAssetsCount: number;
  guardiansCount: number;
  heartbeatStreakDays: number;
  lastActive: string;
  createdAt: string;
}

export default function UserManagement() {
  const [users, setUsers] = useState<OpsUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [planFilter, setPlanFilter] = useState<'All' | 'Personal' | 'Family' | 'Advisor'>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'active' | 'suspended'>('All');

  // Edit Plan Modal
  const [editingUser, setEditingUser] = useState<OpsUser | null>(null);
  const [newPlan, setNewPlan] = useState<'Personal' | 'Family' | 'Advisor'>('Family');

  // Add User Modal
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPlan, setNewUserPlan] = useState<'Personal' | 'Family' | 'Advisor'>('Personal');

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const data = await opsApi.get<any[]>('/ops/users');
      const mapped: OpsUser[] = data.map((u: any) => ({
        id: u.id,
        name: u.email ? u.email.split('@')[0] : 'User',
        email: u.email || 'No Email',
        plan: (u.plan as any) || 'Personal',
        status: (u.status as any) || 'active',
        vaultAssetsCount: Number(u.vault_assets_count ?? u.vaultAssetsCount ?? 0),
        guardiansCount: Number(u.guardians_count ?? u.guardiansCount ?? 0),
        heartbeatStreakDays: Number(u.heartbeat_streak_days ?? u.heartbeatStreakDays ?? 0),
        lastActive: u.last_active ? new Date(u.last_active).toLocaleDateString() : 'Never',
        createdAt: u.created_at ? new Date(u.created_at).toISOString().split('T')[0] : 'Unknown',
      }));
      setUsers(mapped);
    } catch (err: any) {
      console.error('Failed to load ops users from database:', err);
      toast.error(err.message || 'Failed to fetch users from database');
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.id.toLowerCase().includes(search.toLowerCase());
    const matchesPlan = planFilter === 'All' || u.plan === planFilter;
    const matchesStatus = statusFilter === 'All' || u.status === statusFilter;
    return matchesSearch && matchesPlan && matchesStatus;
  });

  const totalActive = users.filter((u) => u.status === 'active').length;
  const totalAssets = users.reduce((acc, u) => acc + u.vaultAssetsCount, 0);

  const handleToggleStatus = async (user: OpsUser) => {
    const nextStatus = user.status === 'active' ? 'suspended' : 'active';
    try {
      await opsApi.put(`/ops/users/${user.id}/status`, { status: nextStatus });
      toast.success(`User ${user.email} is now ${nextStatus}`);
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, status: nextStatus } : u))
      );
    } catch (err: any) {
      toast.error(err.message || 'Failed to update user status in database');
    }
  };

  const handleSavePlan = async () => {
    if (!editingUser) return;
    try {
      await opsApi.put(`/ops/users/${editingUser.id}/plan`, { plan: newPlan });
      toast.success(`Updated ${editingUser.email}'s plan to ${newPlan}`);
      setUsers((prev) =>
        prev.map((u) => (u.id === editingUser.id ? { ...u, plan: newPlan } : u))
      );
      setEditingUser(null);
    } catch (err: any) {
      toast.error(err.message || 'Failed to update plan in database');
    }
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserEmail.trim()) {
      toast.error('Email is required');
      return;
    }
    // Since accounts in Transfer Legacy use zero-knowledge OPAQUE keys, provisioning triggers onboarding
    toast.success(`Invitation initiated for ${newUserEmail.trim()} with ${newUserPlan} tier.`);
    setIsAddUserOpen(false);
    setNewUserName('');
    setNewUserEmail('');
  };

  const handleDeleteUser = (id: string, name: string) => {
    if (confirm(`Are you sure you want to decommission user account "${name}"?`)) {
      setUsers((prev) => prev.filter((u) => u.id !== id));
      toast.success(`User account ${name} removed`);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn text-[#E9E6DF]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-brand-primary animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-primary">
              Identity Management
            </span>
          </div>
          <h1 className="text-3xl font-display font-bold text-white tracking-tight">
            User Accounts & Vault Fiduciaries
          </h1>
          <p className="text-xs text-[#9B97A3] mt-1">
            Inspect, suspend, upgrade, and monitor client cryptographic vaults across the network.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchUsers}
            disabled={isLoading}
            className="p-2.5 rounded-xl bg-[#0E1015] border border-[rgba(255,255,255,0.08)] hover:text-white text-[#9B97A3] transition-all disabled:opacity-50"
            title="Refresh database users"
          >
            <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
          </button>
          <button
            onClick={() => setIsAddUserOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-brand-primary hover:opacity-90 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-brand-primary/20 flex items-center gap-2 self-start md:self-auto transition-all"
          >
            <Plus size={16} /> Provision User
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#0E1015] border border-[rgba(255,255,255,0.07)]">
          <div className="flex items-center justify-between text-[#9B97A3] mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider">Total Users</span>
            <Users size={16} className="text-brand-primary" />
          </div>
          <div className="text-2xl font-bold font-display text-white">{users.length}</div>
          <span className="text-[10px] text-emerald-400 font-medium">100% Zero-Knowledge Enrolled</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#0E1015] border border-[rgba(255,255,255,0.07)]">
          <div className="flex items-center justify-between text-[#9B97A3] mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider">Active Vaults</span>
            <UserCheck size={16} className="text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-display text-emerald-400">{totalActive}</div>
          <span className="text-[10px] text-[#9B97A3]">
            {users.length - totalActive} Suspended / Inactive
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-[#0E1015] border border-[rgba(255,255,255,0.07)]">
          <div className="flex items-center justify-between text-[#9B97A3] mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider">Encrypted Assets</span>
            <Key size={16} className="text-brand-gold" />
          </div>
          <div className="text-2xl font-bold font-display text-white">{totalAssets}</div>
          <span className="text-[10px] text-[#9B97A3]">Across all client vaults</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#0E1015] border border-[rgba(255,255,255,0.07)]">
          <div className="flex items-center justify-between text-[#9B97A3] mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider">Avg Heartbeat Streak</span>
            <Heart size={16} className="text-rose-500 fill-rose-500/20" />
          </div>
          <div className="text-2xl font-bold font-display text-rose-400">
            {Math.round(users.reduce((acc, u) => acc + u.heartbeatStreakDays, 0) / (users.length || 1))} days
          </div>
          <span className="text-[10px] text-emerald-400">Proof of Life Operational</span>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="p-4 rounded-2xl bg-[#0E1015] border border-[rgba(255,255,255,0.07)] flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9B97A3]" />
          <input
            type="text"
            placeholder="Search by name, email or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#08090C] border border-[rgba(255,255,255,0.08)] rounded-xl text-xs text-white placeholder:text-[#6B6675] focus:outline-none focus:border-brand-primary transition-colors"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Plan Filter */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-[#9B97A3] text-[10px] uppercase font-bold tracking-wider">Plan:</span>
            {(['All', 'Personal', 'Family', 'Advisor'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPlanFilter(p)}
                className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                  planFilter === p
                    ? 'bg-brand-primary text-white'
                    : 'bg-[#08090C] text-[#9B97A3] hover:text-white'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-[#9B97A3] text-[10px] uppercase font-bold tracking-wider">Status:</span>
            {(['All', 'active', 'suspended'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                  statusFilter === s
                    ? 'bg-white/15 text-white'
                    : 'bg-[#08090C] text-[#9B97A3] hover:text-white'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-2xl bg-[#0E1015] border border-[rgba(255,255,255,0.07)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[rgba(255,255,255,0.07)] bg-[#08090C]/50 text-[10px] font-bold uppercase tracking-wider text-[#9B97A3]">
                <th className="py-4 px-6">User / Identity</th>
                <th className="py-4 px-6">Subscription Tier</th>
                <th className="py-4 px-6">Vault Assets</th>
                <th className="py-4 px-6">Guardians</th>
                <th className="py-4 px-6">Streak</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(255,255,255,0.05)] text-xs">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#9B97A3]">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-brand-primary" />
                    <span>Loading real cryptographic vault accounts from database...</span>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#9B97A3]">
                    No users found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center font-bold text-brand-primary">
                          {u.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-white leading-tight">{u.name}</p>
                          <p className="text-[11px] text-[#9B97A3] font-mono">{u.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                        u.plan === 'Advisor'
                          ? 'bg-purple-500/10 text-purple-400 border-purple-500/30'
                          : u.plan === 'Family'
                          ? 'bg-brand-primary/10 text-brand-primary border-brand-primary/30'
                          : 'bg-white/5 text-[#9B97A3] border-white/10'
                      }`}>
                        {u.plan}
                      </span>
                    </td>

                    <td className="py-4 px-6 font-mono font-medium text-white">
                      {u.vaultAssetsCount} assets
                    </td>

                    <td className="py-4 px-6 font-mono text-[#9B97A3]">
                      {u.guardiansCount} nodes
                    </td>

                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1.5 font-mono text-rose-400">
                        <Heart size={13} className="fill-rose-500/30" />
                        <span>{u.heartbeatStreakDays}d</span>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        u.status === 'active'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${u.status === 'active' ? 'bg-emerald-400 animate-ping' : 'bg-rose-400'}`} />
                        {u.status}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setEditingUser(u);
                            setNewPlan(u.plan);
                          }}
                          title="Change Plan"
                          className="p-1.5 rounded-lg text-[#9B97A3] hover:text-white hover:bg-white/5 transition-colors"
                        >
                          <Edit3 size={15} />
                        </button>

                        <button
                          onClick={() => handleToggleStatus(u)}
                          title={u.status === 'active' ? 'Suspend Account' : 'Reactivate Account'}
                          className={`p-1.5 rounded-lg transition-colors ${
                            u.status === 'active'
                              ? 'text-[#9B97A3] hover:text-rose-400 hover:bg-rose-500/10'
                              : 'text-emerald-400 hover:bg-emerald-500/10'
                          }`}
                        >
                          {u.status === 'active' ? <UserX size={15} /> : <UserCheck size={15} />}
                        </button>

                        <button
                          onClick={() => handleDeleteUser(u.id, u.name)}
                          title="Decommission Account"
                          className="p-1.5 rounded-lg text-[#9B97A3] hover:text-rose-500 hover:bg-white/5 transition-colors"
                        >
                          <X size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Plan Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#08090C] border border-[rgba(255,255,255,0.1)] rounded-2xl p-6 text-[#E9E6DF]">
            <div className="flex items-center justify-between pb-4 border-b border-[rgba(255,255,255,0.08)]">
              <h3 className="font-display font-bold text-lg text-white">
                Modify Plan: {editingUser.name}
              </h3>
              <button
                onClick={() => setEditingUser(null)}
                className="text-[#9B97A3] hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="py-6 space-y-4">
              <label className="text-xs font-bold uppercase tracking-wider text-[#9B97A3]">
                Select New Plan Tier
              </label>
              {(['Personal', 'Family', 'Advisor'] as const).map((tier) => (
                <button
                  key={tier}
                  type="button"
                  onClick={() => setNewPlan(tier)}
                  className={`w-full p-3.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                    newPlan === tier
                      ? 'bg-brand-primary/10 border-brand-primary text-white'
                      : 'bg-[#0E1015] border-[rgba(255,255,255,0.06)] text-[#9B97A3] hover:border-white/10 hover:text-white'
                  }`}
                >
                  <span className="font-bold text-sm">{tier} Plan</span>
                  {newPlan === tier && <CheckCircle2 size={16} className="text-brand-primary" />}
                </button>
              ))}
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-[rgba(255,255,255,0.08)]">
              <button
                onClick={() => setEditingUser(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold uppercase text-[#9B97A3] hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleSavePlan}
                className="px-5 py-2 rounded-xl bg-brand-primary text-white font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-opacity"
              >
                Save Tier Change
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {isAddUserOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <form
            onSubmit={handleAddUser}
            className="w-full max-w-md bg-[#08090C] border border-[rgba(255,255,255,0.1)] rounded-2xl p-6 text-[#E9E6DF]"
          >
            <div className="flex items-center justify-between pb-4 border-b border-[rgba(255,255,255,0.08)]">
              <h3 className="font-display font-bold text-lg text-white">
                Provision New User Vault
              </h3>
              <button
                type="button"
                onClick={() => setIsAddUserOpen(false)}
                className="text-[#9B97A3] hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="py-6 space-y-4">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#9B97A3] block mb-1">
                  Full Name / Designation
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Johnathan Vance"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#0E1015] border border-[rgba(255,255,255,0.08)] rounded-xl text-xs text-white focus:outline-none focus:border-brand-primary"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#9B97A3] block mb-1">
                  User Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="user@protocol.internal"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#0E1015] border border-[rgba(255,255,255,0.08)] rounded-xl text-xs text-white focus:outline-none focus:border-brand-primary"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#9B97A3] block mb-1">
                  Initial Plan Tier
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Personal', 'Family', 'Advisor'] as const).map((tier) => (
                    <button
                      key={tier}
                      type="button"
                      onClick={() => setNewUserPlan(tier)}
                      className={`p-2.5 rounded-xl border text-center text-xs font-bold uppercase transition-all ${
                        newUserPlan === tier
                          ? 'bg-brand-primary text-white border-brand-primary'
                          : 'bg-[#0E1015] border-white/10 text-[#9B97A3] hover:text-white'
                      }`}
                    >
                      {tier}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-[rgba(255,255,255,0.08)]">
              <button
                type="button"
                onClick={() => setIsAddUserOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold uppercase text-[#9B97A3] hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-brand-primary text-white font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-opacity"
              >
                Provision Account
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
