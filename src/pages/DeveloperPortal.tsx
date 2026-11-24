import { useState, Suspense } from 'react';
import { toast } from 'react-hot-toast';
import { 
  Terminal, 
  Shield, 
  Code2, 
  Database, 
  Key, 
  Lock, 
  Network, 
  Cpu, 
  ExternalLink, 
  CheckCircle2,
  Activity,
  Globe,
  Zap,
  Boxes,
  Plus,
  Server
} from 'lucide-react';
import Card from '../components/ui/Card';
import { useB2BStore } from '../store/useB2BStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import GuardianNetwork3D from '../components/3d/GuardianNetwork3D';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.5, ease: [0.16, 1, 0.3, 1] },
});

export default function DeveloperPortal() {
  const [activeTab, setActiveTab] = useState<'architecture' | 'api' | 'contracts' | 'security'>('api');
  const { connectedNodes, lastPing, registerNode, pingNode } = useB2BStore();


  const handleConnectBank = () => {
    const instName = window.prompt("Enter Institution or Custodian Name:", "Private Wealth Partners");
    if (!instName || !instName.trim()) return;
    registerNode({
      name: instName.trim(),
      type: 'custodian',
      status: 'active',
      permissions: ['read_assets', 'verify_death']
    });
    toast.success(`Node registered for ${instName.trim()}`);
  };

  const tabs = [
    { id: 'api', label: 'B2B API', icon: Key },
    { id: 'architecture', label: 'Architecture', icon: Network },
    { id: 'contracts', label: 'Smart Contracts', icon: Code2 },
    { id: 'security', label: 'Security Specs', icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-page text-primary pt-6">
      <main className="px-4 sm:px-6 lg:px-8 pb-24 max-w-7xl mx-auto space-y-10">
        
        {/* ── Page Header ── */}
        <motion.header {...fadeUp(0)} className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-brand-primary shadow-[0_0_10px_rgba(79,92,255,0.8)]" />
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-primary">
                Institutional Infrastructure
              </p>
            </div>
            <h1 className="text-4xl sm:text-5xl font-display font-bold text-primary tracking-tight leading-none">
              Developer <span className="italic text-brand-primary">Portal</span>
            </h1>
            <p className="text-muted text-sm mt-3 font-medium">
              Enterprise-grade APIs and zero-knowledge protocol documentation.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button className="px-5 py-2.5 bg-surface border border-base rounded-xl text-xs font-bold uppercase tracking-widest text-primary hover:border-brand-primary/50 transition-all">
              API Documentation
            </button>
          </div>
        </motion.header>

        {/* ── Navigation Tabs ── */}
        <div className="flex flex-wrap gap-2 p-1.5 bg-surface/30 border border-base/60 rounded-2xl w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as unknown)}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
                activeTab === tab.id 
                  ? 'bg-brand-primary text-obsidian-950 shadow-lg shadow-brand-primary/20' 
                  : 'text-muted hover:text-primary hover:bg-surface/50'
              }`}
            >
              <tab.icon size={14} />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {activeTab === 'api' && (
                <motion.div
                  key="api"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-8"
                >
                  <Card className="bg-surface/30 border-base/60 p-8">
                    <div className="flex justify-between items-center mb-8">
                      <h3 className="text-xl font-display font-bold text-primary flex items-center gap-3">
                        <Server className="text-brand-primary" size={20} />
                        Connected B2B Nodes
                      </h3>
                      <button 
                        onClick={handleConnectBank}
                        className="flex items-center gap-2 px-4 py-2 bg-brand-primary/10 border border-brand-primary/20 text-brand-primary rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-brand-primary/20 transition-all"
                      >
                        <Plus size={14} />
                        Add Institution
                      </button>
                    </div>
                    
                    <div className="space-y-4">
                      {connectedNodes.length === 0 ? (
                        <div className="text-center py-12 border border-dashed border-base rounded-2xl">
                          <p className="text-muted text-sm">No external institutional nodes connected.</p>
                        </div>
                      ) : (
                        connectedNodes.map((node) => (
                          <div key={node.id} className="p-6 rounded-2xl border border-base bg-page/40 hover:bg-page transition-all group">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                                  <Server size={24} />
                                </div>
                                <div>
                                  <h4 className="font-bold text-sm text-primary tracking-tight">{node.name}</h4>
                                  <div className="flex gap-2 mt-1.5">
                                    <span className="text-[9px] uppercase px-2 py-0.5 rounded bg-surface border border-base text-muted font-bold tracking-widest">{node.type}</span>
                                    <span className={`text-[9px] uppercase px-2 py-0.5 rounded border font-bold tracking-widest ${node.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                                      {node.status}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-6">
                                <div className="text-right hidden sm:block">
                                  <p className="text-[9px] text-muted font-bold uppercase tracking-widest">Last Activity</p>
                                  <p className="text-xs font-mono text-primary mt-0.5">{lastPing[node.id] ? new Date(lastPing[node.id]).toLocaleTimeString() : 'Never'}</p>
                                </div>
                                <button 
                                  onClick={() => {
                                    pingNode(node.id);
                                    toast.success(`Node ${node.name} pinged`);
                                  }}
                                  className="p-3 rounded-xl bg-surface hover:bg-brand-primary/10 text-muted hover:text-brand-primary transition-all border border-base group-hover:border-brand-primary/30"
                                >
                                  <Activity size={18} />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </Card>

                  <Card className="bg-surface/30 border-base/60 p-8">
                    <h3 className="text-xl font-display font-bold text-primary mb-8 flex items-center gap-3">
                      <Code2 className="text-brand-primary" size={20} />
                      Quick Integration
                    </h3>
                    <div className="rounded-2xl bg-obsidian-950 overflow-hidden border border-base">
                      <div className="flex items-center gap-2 px-4 py-2 border-b border-base bg-surface/50">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-500/50" />
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
                        <span className="text-[10px] font-bold text-muted ml-2 uppercase tracking-widest font-mono">protocol.js</span>
                      </div>
                      <pre className="p-6 text-[11px] font-mono leading-relaxed text-obsidian-200 overflow-x-auto">
                        <code>{`import { TransferProtocol } from '@transfer/sdk';

const protocol = new TransferProtocol({
  apiKey: process.env.TL_API_KEY,
  mode: 'institutional'
});

// Initialize zero-knowledge vault
const vault = await protocol.initializeVault({
  owner: user.publicKey,
  scheme: 'shamir-3-of-5'
});`}</code>
                      </pre>
                    </div>
                  </Card>
                </motion.div>
              )}

              {activeTab === 'architecture' && (
                <motion.div
                  key="architecture"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-8"
                >
                  <Card className="bg-surface/30 border-base/60 p-0 overflow-hidden relative min-h-[550px] shadow-2xl">
                    <div className="absolute inset-0 z-0">
                      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
                        <ambientLight intensity={0.5} />
                        <pointLight position={[10, 10, 10]} intensity={1} color="#4F5CFF" />
                        <Suspense fallback={null}>
                          <GuardianNetwork3D 
                            guardians={[
                              { id: '1', status: 'Confirmed' },
                              { id: '2', status: 'Confirmed' },
                              { id: '3', status: 'Pending' },
                              { id: '4', status: 'Confirmed' },
                              { id: '5', status: 'Confirmed' },
                            ]} 
                          />
                        </Suspense>
                      </Canvas>
                    </div>
                    
                    <div className="relative z-10 p-10 pointer-events-none">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-brand-primary text-obsidian-950 flex items-center justify-center">
                          <Boxes size={24} />
                        </div>
                        <h3 className="text-2xl font-display font-bold text-primary tracking-tight">
                          Distributed Nodal Network
                        </h3>
                      </div>
                      <p className="text-sm text-muted max-w-md leading-relaxed font-medium">
                        Real-time visualization of the sovereign guardian network. Data is fragmented via Shamir's Secret Sharing and distributed across geographically distinct secure nodes.
                      </p>
                    </div>

                    <div className="absolute bottom-8 left-8 right-8 z-10 grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {[
                        { label: 'Active Nodes', value: '256', icon: Activity },
                        { label: 'Regions', value: '12', icon: Globe },
                        { label: 'Quorum Type', value: 'BFT', icon: Shield },
                        { label: 'Latency', value: '18ms', icon: Zap },
                      ].map((stat, i) => (
                        <div key={i} className="bg-page/80 backdrop-blur-md border border-base p-5 rounded-2xl pointer-events-auto shadow-xl group hover:border-brand-primary/40 transition-all">
                          <p className="text-[10px] font-bold text-muted uppercase tracking-widest">{stat.label}</p>
                          <div className="flex items-center justify-between mt-3">
                            <span className="text-2xl font-display font-bold text-primary">{stat.value}</span>
                            <stat.icon size={16} className="text-brand-primary" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="bg-surface/30 border-base/60 p-8 hover:bg-surface/40 transition-all">
                      <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center mb-6">
                        <Lock className="text-brand-primary" size={20} />
                      </div>
                      <h4 className="font-display font-bold text-lg text-primary mb-3 tracking-tight">Encryption Layer</h4>
                      <p className="text-sm text-muted leading-relaxed font-medium">
                        Hardware-level AES-256-GCM encryption with HSM integration. Private keys never leave the secure enclave of the client device, ensuring true sovereign ownership.
                      </p>
                    </Card>
                    <Card className="bg-surface/30 border-base/60 p-8 hover:bg-surface/40 transition-all">
                      <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center mb-6">
                        <Database className="text-brand-primary" size={20} />
                      </div>
                      <h4 className="font-display font-bold text-lg text-primary mb-3 tracking-tight">Storage Protocol</h4>
                      <p className="text-sm text-muted leading-relaxed font-medium">
                        Decentralized storage with 12x redundancy across the network. Data is sharded, salted, and hashed before distribution, making it computationally impossible to reconstruct without owner authorization.
                      </p>
                    </Card>
                  </div>
                </motion.div>
              )}

              {activeTab === 'contracts' && (
                <motion.div
                  key="contracts"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-8"
                >
                  <Card className="bg-surface/30 border-base/60 p-8">
                    <h3 className="text-xl font-display font-bold text-primary mb-8 flex items-center gap-3">
                      <Code2 className="text-brand-primary" size={20} />
                      Verified Smart Contracts
                    </h3>
                    <div className="space-y-4">
                      {[
                        { name: 'EscrowProtocol.sol', address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e', version: 'v2.4.1', audit: 'Passed' },
                        { name: 'GuardianRegistry.sol', address: '0x9a2e35Cc6634C0532925a3b844Bc454e4438f772', version: 'v1.8.0', audit: 'Passed' },
                        { name: 'InheritanceVault.sol', address: '0x1c2f35Cc6634C0532925a3b844Bc454e4438f119', version: 'v3.1.0', audit: 'Verified' },
                      ].map((contract, i) => (
                        <div key={i} className="flex items-center justify-between p-6 rounded-2xl border border-base bg-page/40 hover:bg-page transition-all group">
                          <div>
                            <div className="flex items-center gap-3">
                              <h4 className="font-bold text-sm text-primary tracking-tight">{contract.name}</h4>
                              <span className="text-[9px] font-bold text-muted bg-surface px-2 py-0.5 rounded-md border border-base uppercase tracking-widest">{contract.version}</span>
                            </div>
                            <p className="text-[10px] text-brand-primary font-mono mt-2.5 truncate max-w-[200px] sm:max-w-none">{contract.address}</p>
                          </div>
                          <div className="flex items-center gap-6">
                            <span className="px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-[9px] font-bold uppercase tracking-widest">
                              {contract.audit}
                            </span>
                            <ExternalLink size={16} className="text-muted group-hover:text-primary transition-colors cursor-pointer" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>

                  <Card className="bg-surface/30 border-base/60 p-8">
                    <h3 className="text-lg font-display font-bold text-primary mb-6 flex items-center gap-2">
                      <Terminal size={18} className="text-brand-primary" />
                      Protocol Interface (Solidity)
                    </h3>
                    <div className="rounded-2xl bg-obsidian-950 border border-base overflow-hidden">
                      <pre className="p-8 text-[11px] font-mono leading-relaxed text-obsidian-200 overflow-x-auto">
                        <code>{`// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract TransferLegacyVault {
    address public owner;
    address[] public designatedHeirs;
    uint256 public heartbeatTimeout;
    uint256 public lastHeartbeat;
    
    event Heartbeat(uint256 timestamp);
    event RecoveryTriggered(address triggerer, uint256 timestamp);

    function ping() external {
        require(msg.sender == owner, "Only owner can ping");
        lastHeartbeat = block.timestamp;
        emit Heartbeat(block.timestamp);
    }
}`}</code>
                      </pre>
                    </div>
                  </Card>
                </motion.div>
              )}

              {activeTab === 'security' && (
                <motion.div
                  key="security"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-8"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="bg-surface/30 border-base/60 p-10 hover:border-brand-primary/40 transition-all">
                      <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 flex items-center justify-center mb-8">
                        <Shield className="text-brand-primary" size={24} />
                      </div>
                      <h3 className="text-2xl font-display font-bold text-primary mb-4 tracking-tight">Zero-Knowledge Proofs</h3>
                      <p className="text-sm text-muted leading-relaxed mb-8 font-medium">
                        We leverage zk-SNARKs to verify the validity of inheritance triggers without ever exposing the underlying private conditions, asset values, or identity markers.
                      </p>
                      <ul className="space-y-4">
                        {[
                          'Non-interactive verification (zk-SNARK)',
                          'Circuit-level privacy guarantees',
                          'Optimized gas for on-chain triggers'
                        ].map((item, i) => (
                          <li key={i} className="flex items-center gap-3 text-xs font-bold text-primary uppercase tracking-wider">
                            <CheckCircle2 size={16} className="text-brand-primary" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </Card>
                    <Card className="bg-surface/30 border-base/60 p-10 hover:border-brand-primary/40 transition-all">
                      <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 flex items-center justify-center mb-8">
                        <Cpu className="text-brand-primary" size={24} />
                      </div>
                      <h3 className="text-2xl font-display font-bold text-primary mb-4 tracking-tight">Post-Quantum Ready</h3>
                      <p className="text-sm text-muted leading-relaxed mb-8 font-medium">
                        Our hybrid cryptographic scheme anticipates future threats by combining classical ECC with Dilithium and Kyber lattice-based algorithms.
                      </p>
                      <ul className="space-y-4">
                        {[
                          'NIST-standard lattice algorithms',
                          'Hybrid classical-quantum signatures',
                          'Future-proof sovereign identity'
                        ].map((item, i) => (
                          <li key={i} className="flex items-center gap-3 text-xs font-bold text-primary uppercase tracking-wider">
                            <CheckCircle2 size={16} className="text-brand-primary" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </Card>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="space-y-8">
            <Card className="bg-surface border-base p-8">
              <h3 className="text-lg font-display font-bold text-primary mb-6 tracking-tight flex items-center gap-2">
                <Activity size={18} className="text-brand-primary" />
                Network Health
              </h3>
              <div className="space-y-6">
                {[
                  { label: 'API Gateway', status: 'Operational', color: 'text-brand-primary' },
                  { label: 'Guardian Network', status: 'Operational', color: 'text-brand-primary' },
                  { label: 'Smart Contracts', status: 'Secure', color: 'text-brand-primary' },
                  { label: 'Legacy Sync', status: 'Syncing', color: 'text-amber-500' }
                ].map((s, i) => (
                  <div key={i} className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                    <span className="text-muted">{s.label}</span>
                    <div className="flex items-center gap-2">
                      <span className={`w-1 h-1 rounded-full ${s.color === 'text-brand-primary' ? 'bg-brand-primary animate-pulse' : 'bg-amber-500'}`} />
                      <span className={s.color}>{s.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <div className="p-8 rounded-[32px] bg-gradient-to-br from-brand-primary/10 to-transparent border border-brand-primary/20 group relative overflow-hidden">
              <div className="absolute inset-0 bg-brand-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="flex items-center gap-3 mb-4 relative z-10">
                <div className="w-10 h-10 rounded-xl bg-brand-primary text-obsidian-950 flex items-center justify-center">
                  <Database size={20} />
                </div>
                <h4 className="font-display font-bold text-primary tracking-tight">Enterprise Node</h4>
              </div>
              <p className="text-sm text-muted leading-relaxed mb-6 font-medium relative z-10">
                Apply to become an institutional guardian node and participate in the sovereign security network.
              </p>
              <button className="w-full py-4 bg-brand-primary text-obsidian-950 font-bold rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all relative z-10 shadow-lg shadow-brand-primary/20">
                Submit Application
              </button>
            </div>

            <Card className="bg-surface/30 border-base/60 p-8">
              <h3 className="text-xs font-bold text-muted uppercase tracking-widest mb-4">Latest Protocol Update</h3>
              <p className="text-xs text-primary font-medium leading-relaxed">
                v2.4.1 implemented Schnorr signatures for aggregate guardian verification, reducing gas costs by 40%.
              </p>
              <button className="text-[9px] font-bold text-brand-primary uppercase tracking-[0.2em] mt-4 flex items-center hover:translate-x-1 transition-transform">
                Read Changelog <ExternalLink size={10} className="ml-1" />
              </button>
            </Card>
          </div>
        </div>

      </main>
    </div>
  );
}
