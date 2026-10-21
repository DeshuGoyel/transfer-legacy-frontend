import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UserPlus, 
  Trash2, 
  Shield, 
  Search,  
  ShieldCheck, 
  Calendar, 
  Settings as SettingsIcon,
  Check,
  Eye,
  EyeOff
} from 'lucide-react';
import { opsApi } from '../../../lib/opsApi';
import { useOpsStore } from '../../../store/useOpsStore';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Badge from '../../../components/ui/Badge';
import Card from '../../../components/ui/Card';
import Modal from '../../../components/ui/Modal';
import toast from 'react-hot-toast';
import { cn } from '../../../utils/cn';

const AVAILABLE_PERMISSIONS = [
  { id: 'read', label: 'Global Read', desc: 'View all basic resources' },
  { id: 'write', label: 'Global Write', desc: 'Create/Modify resources' },
  { id: 'delete', label: 'Global Delete', desc: 'Permanently remove items' },
  { id: 'cms.manage', label: 'Manage CMS', desc: 'Create and edit pages/content' },
  { id: 'admins.manage', label: 'Manage Admins', desc: 'User and role management' },
  { id: 'settings.manage', label: 'System Settings', desc: 'Branding and configuration' },
  { id: 'waitlist.manage', label: 'Waitlist', desc: 'Manage subscribers and status' },
  { id: 'audit.read', label: 'View Logs', desc: 'Access system activity logs' },
];

type Tab = 'admins' | 'roles';

interface Admin {
  id: string;
  email: string;
  role_id: string;
  role_name?: string;
  created_at?: string;
}

interface Role {
  id: string;
  name: string;
  description?: string;
  permissions?: string[];
}

export default function AdminMgmt() {
  const [activeTab, setActiveTab] = useState<Tab>('admins');
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  
  const currentAdmin = useOpsStore(state => state.admin);

  // Form state for new admin
  const [newAdmin, setNewAdmin] = useState({
    email: '',
    password: '',
    role_id: '',
  });
  const [showAdminPassword, setShowAdminPassword] = useState(false);

  const [roleForm, setRoleForm] = useState({
    name: '',
    description: '',
    permissions: [] as string[],
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [adminsRes, rolesRes] = await Promise.all([
        opsApi.get<Admin[]>('/ops/admins'),
        opsApi.get<Role[]>('/ops/roles'),
      ]);
      setAdmins(adminsRes);
      setRoles(rolesRes);
      if (rolesRes.length > 0) {
        setNewAdmin(prev => ({ ...prev, role_id: rolesRes[0].id }));
      }
    } catch (err) {
      toast.error((err as Error).message || 'Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await opsApi.post('/ops/admins', newAdmin);
      toast.success('Administrator created');
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      toast.error((err as Error).message || 'Failed to create admin');
    }
  };

  const handleDelete = async (id: string) => {
    if (id === currentAdmin?.id) {
      toast.error("You cannot delete your own account");
      return;
    }
    if (!window.confirm('Are you sure you want to remove this administrator?')) return;

    try {
      await opsApi.delete(`/ops/admins/${id}`);
      toast.success('Administrator removed');
      fetchData();
    } catch (err) {
      toast.error((err as Error).message || 'Delete failed');
    }
  };

  const handleRoleAction = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        name: roleForm.name,
        description: roleForm.description,
        permissions: roleForm.permissions,
      };

      if (editingRole) {
        await opsApi.put(`/ops/roles/${editingRole.id}`, payload);
        toast.success('Role updated');
      } else {
        await opsApi.post('/ops/roles', payload);
        toast.success('Role created');
      }

      setIsRoleModalOpen(false);
      setEditingRole(null);
      fetchData();
    } catch (err) {
      toast.error((err as Error).message || 'Action failed');
    }
  };

  const openRoleModal = (role?: Role) => {
    if (role) {
      setEditingRole(role);
      setRoleForm({
        name: role.name,
        description: role.description || '',
        permissions: role.permissions || [],
      });
    } else {
      setEditingRole(null);
      setRoleForm({ name: '', description: '', permissions: ['read'] });
    }
    setIsRoleModalOpen(true);
  };

  const filteredAdmins = admins.filter(a => 
    (a.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (a.role_name || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <ShieldCheck className="text-indigo-500" />
            Control Center
          </h1>
          <p className="text-slate-400 text-sm mt-1">Manage system access and security roles</p>
        </div>
        <div className="flex items-center gap-3">
          {activeTab === 'roles' ? (
             <Button 
                variant="primary" 
                className="rounded-xl flex items-center gap-2"
                onClick={() => openRoleModal()}
              >
                <Shield className="w-4 h-4" />
                Create Role
              </Button>
          ) : (
            <Button 
              variant="primary" 
              className="rounded-xl flex items-center gap-2"
              onClick={() => setIsModalOpen(true)}
            >
              <UserPlus className="w-4 h-4" />
              Add Administrator
            </Button>
          )}
        </div>
      </div>

      <div className="flex gap-2 p-1 bg-slate-900/50 border border-slate-800 rounded-xl w-fit mb-6">
        <button 
          onClick={() => setActiveTab('admins')}
          className={cn(
            "px-4 py-1.5 rounded-lg text-xs font-medium transition-all",
            activeTab === 'admins' ? "bg-slate-800 text-white shadow-lg" : "text-slate-500 hover:text-slate-300"
          )}
        >
          Administrators
        </button>
        <button 
          onClick={() => setActiveTab('roles')}
          className={cn(
            "px-4 py-1.5 rounded-lg text-xs font-medium transition-all",
            activeTab === 'roles' ? "bg-slate-800 text-white shadow-lg" : "text-slate-500 hover:text-slate-300"
          )}
        >
          Roles & Permissions
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'admins' ? (
          <motion.div
            key="admins"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="space-y-6"
          >
            <div className="flex gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search by email or role..."
                  className="w-full bg-slate-900/50 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500/50 transition-all font-sans"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <Card className="bg-slate-900/40 border-slate-800 rounded-2xl overflow-hidden p-0">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-800/30 text-slate-400 text-xs uppercase tracking-widest font-bold">
                    <th className="px-6 py-4">Administrator</th>
                    <th className="px-6 py-4">Role</th>
                    <th className="px-6 py-4">Last Login</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {isLoading ? (
                    <tr><td colSpan={4} className="px-6 py-12 text-center text-slate-500">Loading...</td></tr>
                  ) : filteredAdmins.length === 0 ? (
                    <tr><td colSpan={4} className="px-6 py-12 text-center text-slate-500 font-sans">No administrators found</td></tr>
                  ) : filteredAdmins.map((admin) => (
                    <tr key={admin.id} className="hover:bg-slate-800/20 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-indigo-400 font-bold text-xs">
                            {admin.email.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-white">{admin.email}</div>
                            <div className="text-[10px] text-slate-500 font-mono">{admin.id.split('-')[0]}...</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={admin.role_name === 'super_admin' ? 'info' : 'default'} className="lowercase">
                          {admin.role_name.replace('_', ' ')}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <Calendar className="w-3 h-3" />
                          {admin.last_login ? new Date(admin.last_login).toLocaleDateString() : 'Never'}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => handleDelete(admin.id)}
                          className="p-2 text-slate-500 hover:text-red-400 transition-colors rounded-lg hover:bg-red-500/10"
                          disabled={admin.id === currentAdmin?.id}
                          title={admin.id === currentAdmin?.id ? "Cannot delete self" : "Delete Admin"}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="roles"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {roles.map(role => (
                <Card key={role.id} className="bg-slate-900/40 border-slate-800 p-6 flex flex-col gap-4 group hover:border-indigo-500/20 transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                        <Shield className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-white capitalize">{role.name.replace('_', ' ')}</h4>
                        <p className="text-[10px] text-slate-500 font-mono">{role.id.split('-')[0]}...</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => openRoleModal(role)}
                      className="p-2 text-slate-600 hover:text-white transition-colors"
                    >
                      <SettingsIcon className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed min-h-[3rem]">
                    {role.description || 'No description provided for this security role.'}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {role.permissions.map((p: string) => (
                      <span key={p} className="px-2 py-0.5 rounded-md bg-slate-950 text-[10px] text-slate-500 border border-slate-800">
                        {p}
                      </span>
                    ))}
                  </div>
                </Card>
              ))}
              <button 
                onClick={() => openRoleModal()}
                className="flex flex-col items-center justify-center gap-3 p-8 rounded-2xl bg-slate-950 border border-dashed border-slate-800 text-slate-600 hover:border-indigo-500/30 hover:text-indigo-400 transition-all group"
              >
                <div className="w-12 h-12 rounded-full border border-dashed border-slate-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <UserPlus className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest">New Role</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create Admin Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="Register New Admin"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            value={newAdmin.email}
            onChange={(e) => setNewAdmin(prev => ({ ...prev, email: e.target.value }))}
            required
            className="bg-slate-950 border-slate-800"
          />
          <div className="relative">
            <Input
              label="Initial Password"
              type={showAdminPassword ? 'text' : 'password'}
              value={newAdmin.password}
              onChange={(e) => setNewAdmin(prev => ({ ...prev, password: e.target.value }))}
              required
              className="bg-slate-950 border-slate-800 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowAdminPassword(v => !v)}
              className="absolute right-3.5 bottom-3 text-slate-500 hover:text-slate-300 transition-colors focus:outline-none"
              tabIndex={-1}
              aria-label={showAdminPassword ? 'Hide password' : 'Show password'}
            >
              {showAdminPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-muted font-sans">Assign Role</label>
            <select
              value={newAdmin.role_id}
              onChange={(e) => setNewAdmin(prev => ({ ...prev, role_id: e.target.value }))}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500/50"
            >
              {roles.map(role => (
                <option key={role.id} value={role.id}>{role.name}</option>
              ))}
            </select>
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" className="px-8">
              Create Account
            </Button>
          </div>
        </form>
      </Modal>

      {/* Role Config Modal */}
      <Modal 
        isOpen={isRoleModalOpen} 
        onClose={() => setIsRoleModalOpen(false)}
        title={editingRole ? `Update Role: ${editingRole.name}` : "Create Security Role"}
      >
        <form onSubmit={handleRoleAction} className="space-y-4">
          <Input
            label="Role Name"
            value={roleForm.name}
            onChange={(e) => setRoleForm(prev => ({ ...prev, name: e.target.value }))}
            required
            placeholder="e.g. support_staff"
            className="bg-slate-950 border-slate-800"
          />
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-muted">Role Description</label>
            <textarea
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500/50 text-sm h-24 resize-none"
              value={roleForm.description}
              onChange={(e) => setRoleForm(prev => ({ ...prev, description: e.target.value }))}
              placeholder="What can this role do?"
            />
          </div>
          <div className="space-y-3">
            <label className="text-sm font-medium text-muted">Select Permissions</label>
            <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
              {AVAILABLE_PERMISSIONS.map((perm) => {
                const isSelected = roleForm.permissions.includes(perm.id);
                return (
                  <button
                    key={perm.id}
                    type="button"
                    onClick={() => {
                      const newPerms = isSelected
                        ? roleForm.permissions.filter(p => p !== perm.id)
                        : [...roleForm.permissions, perm.id];
                      setRoleForm({ ...roleForm, permissions: newPerms });
                    }}
                    className={cn(
                      "flex items-start gap-3 p-3 rounded-xl border text-left transition-all",
                      isSelected 
                        ? "bg-indigo-500/10 border-indigo-500/50" 
                        : "bg-slate-950 border-slate-800 hover:border-slate-700"
                    )}
                  >
                    <div className={cn(
                      "mt-0.5 w-4 h-4 rounded border flex items-center justify-center transition-colors",
                      isSelected ? "bg-indigo-500 border-indigo-500" : "bg-transparent border-slate-700"
                    )}>
                      {isSelected && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <div>
                      <p className={cn("text-xs font-bold", isSelected ? "text-indigo-400" : "text-slate-300")}>
                        {perm.label}
                      </p>
                      <p className="text-[10px] text-slate-500 mt-0.5">{perm.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
          
          <div className="pt-4 flex justify-end gap-3">
            <Button type="button" variant="secondary" onClick={() => setIsRoleModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" className="px-8">
              {editingRole ? "Save Changes" : "Create Role"}
            </Button>
          </div>
        </form>
      </Modal>
    </motion.div>
  );
}
