import React, { useState } from 'react';
import { cn } from '../../utils/cn';

const features = [
  {
    id: 1,
    title: "01 / Zero-knowledge encryption",
    heading: "AES-256 client-side encryption",
    description: "Your data is encrypted in your browser before it ever leaves your device. We are the safe, not the bank.",
    filename: "encryption.ts",
    code: `const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
let encrypted = cipher.update(vaultData, 'utf8', 'hex');
encrypted += cipher.final('hex');
const authTag = cipher.getAuthTag();
// Data is now mathematically inaccessible without the key`
  },
  {
    id: 2,
    title: "02 / Proof of Life heartbeat",
    heading: "Verified check-ins",
    description: "Regular check-ins confirm you're active. If you stop responding, your guardians are notified and the succession process can begin.",
    filename: "heartbeat.ts",
    code: `async function verifySuccessionEvent(userId: string) {
  const status = await getCheckInStatus(userId);
  
  if (Date.now() > status.nextRequiredCheckIn + GRACE_PERIOD) {
    // Succession event triggered
    await triggerProtocol(userId);
    await notifyGuardians(userId);
    return true;
  }
  return false;
}`
  },
  {
    id: 3,
    title: "03 / Shamir's Secret Sharing",
    heading: "Distributed Trust",
    description: "Your vault key is cryptographically split across multiple guardians. No single guardian can access your vault alone - only a quorum together.",
    filename: "shamir.ts",
    code: `import { split, combine } from 'shamirs-secret-sharing';

// Split master key into 5 shares, requiring 3 to recover
const shares = split(masterKey, { shares: 5, threshold: 3 });

// Distribute shares to guardians...
// Later, combine shares to recover the key
const recoveredKey = combine(providedShares);`
  },
  {
    id: 4,
    title: "04 / Works with everything",
    heading: "Platform-agnostic",
    description: "Bank accounts, crypto, email, cloud storage, domain names, online businesses, subscriptions. We work with every service.",
    filename: "platform.ts",
    code: `export type DigitalAsset = 
  | BankAccount
  | CryptoWallet
  | EmailAccount
  | CloudStorage
  | DomainName
  | OnlineBusiness
  | Subscription;

// Vault securely stores and encrypts any asset type`
  }
];

export default function FeaturesInteractive() {
  const [activeFeature, setActiveFeature] = useState(1);

  const feature = features.find(f => f.id === activeFeature) || features[0];

  return (
    <section id="features" className="py-32 px-6 md:px-16 bg-blueprint-bg2 relative z-10">
      <div className="max-w-3xl mx-auto text-center mb-20">
        <div className="inline-block border border-blueprint-or/30 text-blueprint-or px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-8">
          Platform features
        </div>
        <h2 className="font-display text-4xl md:text-5xl font-medium text-white mb-6">
          Everything your family needs.<br/>Nothing they don't.
        </h2>
      </div>

      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-16">
        <div className="flex flex-col gap-4 min-w-[280px]">
          {features.map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFeature(f.id)}
              className={cn(
                "text-left px-6 py-4 rounded-xl font-mono text-sm tracking-wide transition-all border",
                activeFeature === f.id
                  ? "bg-blueprint-or/10 border-blueprint-or/30 text-blueprint-or"
                  : "border-transparent text-blueprint-muted hover:text-white hover:bg-white/5"
              )}
            >
              {f.title}
            </button>
          ))}
        </div>
        
        <div className="flex-1 animate-fade-in" key={feature.id}>
          <h3 className="font-display text-4xl font-medium mb-4 text-white">
            {feature.heading}
          </h3>
          <p className="text-blueprint-muted2 leading-relaxed mb-8 text-lg max-w-2xl">
            {feature.description}
          </p>
          <div className="bg-[#0d1117] rounded-xl border border-white/10 overflow-hidden font-mono text-sm shadow-2xl">
            <div className="bg-white/5 px-4 py-3 flex items-center justify-between border-b border-white/10">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
              </div>
              <div className="font-mono text-xs text-blueprint-muted">
                {feature.filename}
              </div>
            </div>
            <pre className="p-6 overflow-x-auto text-blueprint-sage2">
              <code>{feature.code}</code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}
