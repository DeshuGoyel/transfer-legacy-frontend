import { motion } from 'framer-motion';
import SEO from '../../components/seo/SEO';
import { Award, CheckCircle2, Shield, Star, ArrowRight, Zap, AlertTriangle } from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';

const BestCryptoInheritance = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useStore();

  const services = [
    {
      rank: 1,
      name: "Transfer Legacy",
      rating: "9.9 / 10",
      badge: "Best Overall for Sovereign Self-Custody",
      pricing: "Free Tier / $9/mo Pro",
      bestFor: "Investors holding crypto, seed phrases, centralized exchanges, and legal wills",
      pros: [
        "100% Zero-Knowledge Client-Side Encryption (AES-256-GCM)",
        "Shamir's Secret Sharing (SSS) key fragmentation with Guardian Quorums",
        "Automated Proof-of-Life heartbeats (email, SMS, hardware token)",
        "Built-in US/UK/IN/UAE tax and digital asset legal logic",
        "0% Assets Under Management (AUM) fees"
      ],
      cons: [
        "Currently web-first with PWA mobile support"
      ]
    },
    {
      rank: 2,
      name: "Safe Haven (Inheriti)",
      rating: "8.6 / 10",
      badge: "Best Blockchain-Patented Alternative",
      pricing: "Requires SHA token staking + setup fees",
      bestFor: "DeFi enthusiasts familiar with VeChain / BSC ecosystems",
      pros: [
        "Patented blockchain distribution",
        "Decentralized validator network",
        "Hardware security key (FIDO2) integration"
      ],
      cons: [
        "Complex token staking requirement",
        "Limited localized legal/probate directives",
        "High setup friction for non-technical heirs"
      ]
    },
    {
      rank: 3,
      name: "Casa (Casa Covenant)",
      rating: "8.4 / 10",
      badge: "Best for Bitcoin-Only Multisig",
      pricing: "$250 to $1,000+ / month (Gold/Platinum tiers)",
      bestFor: "High-net-worth Bitcoin holders using multiple hardware wallets",
      pros: [
        "Institutional multisig 3-of-5 architecture",
        "Dedicated account management support",
        "Excellent mobile app interface"
      ],
      cons: [
        "Very expensive for retail investors",
        "Supports Bitcoin & Ethereum only (No passwords or bank logins)",
        "Heirs must navigate complex multisig hardware ceremonies"
      ]
    },
    {
      rank: 4,
      name: "Unchained Capital",
      rating: "8.1 / 10",
      badge: "Best for US Institutional Collaborative Custody",
      pricing: "$1,000+ setup fee + ongoing custody fees",
      bestFor: "US investors seeking collaborative custody with IRA support",
      pros: [
        "Direct legal support team",
        "Bitcoin financial services (lending, IRA) integration",
        "Cold storage multi-institution custody"
      ],
      cons: [
        "Strict KYC and full identity disclosure required",
        "US-centric with limited international support",
        "Bitcoin only"
      ]
    },
    {
      rank: 5,
      name: "Vault12",
      rating: "7.7 / 10",
      badge: "Best for Mobile Mesh Networks",
      pricing: "Freemium / Monthly subscription",
      bestFor: "Mobile-centric users with trusted personal contacts",
      pros: [
        "Peer-to-peer mobile guardian network",
        "Supports seed phrases and digital documents",
        "Clean mobile UX"
      ],
      cons: [
        "Guardians must keep app installed on active phones",
        "No automated proof-of-life heartbeat dead man's switch",
        "Risk of guardian device loss or uninstallation"
      ]
    }
  ];

  const roundupSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Top 7 Best Crypto Inheritance Solutions of 2026",
    "description": "An exhaustive comparison of the best crypto inheritance, digital estate planning, and self-custody succession platforms.",
    "itemListElement": services.map((s) => ({
      "@type": "ListItem",
      "position": s.rank,
      "name": s.name,
      "description": `${s.badge} - ${s.bestFor}`
    }))
  };

  return (
    <div className="min-h-screen bg-page text-primary pt-24 pb-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-aurora opacity-25 pointer-events-none" />

      <SEO
        title="7 Best Crypto Inheritance Solutions in 2026 (Ranked & Reviewed)"
        description="Comprehensive 2026 roundup of the best crypto estate planning and inheritance services: Transfer Legacy, Casa, Unchained, Safe Haven Inheriti, and Vault12 compared."
        canonicalUrl="https://transferlegacy.com/best-crypto-inheritance-services"
        schema={roundupSchema}
      />

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-brand-gold/10 text-brand-gold border border-brand-gold/20 px-4 py-2 rounded-full mb-6"
          >
            <Award className="w-4 h-4" />
            <span className="font-bold tracking-widest uppercase text-[10px]">2026 Industry Benchmark</span>
          </motion.div>

          <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 tracking-tight text-primary">
            The 7 Best <span className="italic text-brand-primary">Crypto Inheritance</span> Solutions
          </h1>

          <p className="text-lg md:text-xl text-secondary max-w-3xl mx-auto leading-relaxed font-medium">
            Over $140 billion in digital wealth has already been lost forever. We audited the leading cryptographic vaults, multisig custody platforms, and digital estate protocols to find the safest ways to pass digital wealth to heirs.
          </p>
        </div>

        {/* Methodology Notice */}
        <div className="bg-surface/40 border border-base/60 rounded-2xl p-6 mb-16 backdrop-blur-sm flex items-start gap-4">
          <Shield className="w-6 h-6 text-brand-primary shrink-0 mt-1" />
          <div className="text-xs md:text-sm text-secondary leading-relaxed">
            <strong className="text-primary block font-bold mb-1">Audit Methodology:</strong> Every platform in this ranking is evaluated across four core criteria: Zero-Knowledge Privacy (can the provider steal your keys?), Inheritance Automation (does it include a dead man's switch?), Asset Breadth (keys, exchanges, passwords, wills), and Total Cost of Ownership.
          </div>
        </div>

        {/* Services List */}
        <div className="space-y-12">
          {services.map((service) => (
            <Card
              key={service.rank}
              className={`p-8 md:p-10 border transition-all ${
                service.rank === 1
                  ? "border-brand-primary/60 bg-surface/60 shadow-2xl shadow-brand-primary/10 relative"
                  : "border-base/60 bg-surface/30"
              }`}
            >
              {service.rank === 1 && (
                <div className="absolute -top-3.5 left-8 px-4 py-1 rounded-full bg-brand-primary text-obsidian-950 font-bold text-[10px] uppercase tracking-widest shadow-md">
                  ★ Editor's #1 Choice
                </div>
              )}

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-display font-bold text-brand-primary">#{service.rank}</span>
                    <h2 className="text-2xl md:text-3xl font-display font-bold text-primary">{service.name}</h2>
                  </div>
                  <p className="text-xs font-bold text-brand-gold mt-1">{service.badge}</p>
                </div>

                <div className="text-left md:text-right">
                  <div className="text-lg font-bold text-primary">{service.rating}</div>
                  <div className="text-xs text-muted">{service.pricing}</div>
                </div>
              </div>

              <p className="text-sm text-secondary mb-6 italic">
                <strong>Best For:</strong> {service.bestFor}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-base/40">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-3 flex items-center gap-1.5">
                    <CheckCircle2 size={14} /> Advantages
                  </h4>
                  <ul className="space-y-2 text-xs md:text-sm text-secondary">
                    {service.pros.map((pro, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-emerald-400 font-bold">•</span>
                        <span>{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-red-400/80 mb-3 flex items-center gap-1.5">
                    <AlertTriangle size={14} /> Considerations
                  </h4>
                  <ul className="space-y-2 text-xs md:text-sm text-secondary">
                    {service.cons.map((con, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-red-400/70 font-bold">•</span>
                        <span>{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {service.rank === 1 && (
                <div className="mt-8 pt-6 border-t border-brand-primary/20 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <span className="text-xs text-secondary font-medium">Free forever tier available. No credit card required.</span>
                  <Button
                    size="sm"
                    className="w-full sm:w-auto"
                    onClick={() => navigate(isAuthenticated ? '/dashboard' : '/onboarding')}
                  >
                    Deploy Sovereign Vault <ArrowRight size={14} className="ml-1 inline" />
                  </Button>
                </div>
              )}
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 bg-gradient-to-br from-brand-primary to-blue-900 text-obsidian-950 rounded-[36px] p-10 md:p-14 text-center">
          <h3 className="text-3xl md:text-4xl font-display font-bold mb-4 tracking-tight">
            Protect Your Legacy in Under 2 Minutes
          </h3>
          <p className="text-base font-medium mb-8 max-w-xl mx-auto opacity-90">
            Join thousands of sovereign crypto holders securing Bitcoin, Ethereum, and digital portfolios for the next generation.
          </p>
          <Button
            size="lg"
            variant="outline"
            className="bg-obsidian-950 text-white border-obsidian-950 hover:bg-obsidian-900 px-8 py-3.5 rounded-xl font-bold"
            onClick={() => navigate(isAuthenticated ? '/dashboard' : '/onboarding')}
          >
            Start Free Vault Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BestCryptoInheritance;
