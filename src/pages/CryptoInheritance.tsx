import { Link } from 'react-router-dom';
import { Shield, AlertTriangle, HelpCircle, CheckCircle2 } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { SEO } from '../components/seo/SEO';

export default function CryptoInheritance() {
  const faqSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How does crypto inheritance work?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Crypto inheritance involves securely transferring access to digital assets like Bitcoin and Ethereum to heirs after the owner's death. Unlike traditional assets, crypto requires passing on cryptographic private keys or seed phrases. Transfer Legacy automates this using zero-knowledge encryption and Shamir's Secret Sharing."
        }
      },
      {
        "@type": "Question",
        "name": "Is a digital will legally binding?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, depending on your jurisdiction. In the USA, RUFADAA allows executors to access digital accounts. In the UAE (DIFC) and UK, crypto is recognized as distinct property. Transfer Legacy acts as the secure execution mechanism for your legal digital will."
        }
      },
      {
        "@type": "Question",
        "name": "What happens if I lose my seed phrase before I die?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "If you lose your seed phrase and have no backup, the assets are lost. However, if you have stored your seed phrase in Transfer Legacy, your designated guardians can assist in recovering it under specific, pre-authorized conditions."
        }
      },
      {
        "@type": "Question",
        "name": "How is Transfer Legacy different from a hardware wallet?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "A hardware wallet secures your crypto while you are alive, but it cannot pass itself to your family. Transfer Legacy is the inheritance protocol that ensures your family gets the hardware wallet PIN and seed phrase securely when you are gone."
        }
      },
      {
        "@type": "Question",
        "name": "Can Transfer Legacy steal my crypto?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Absolutely not. We use strict zero-knowledge encryption. Your data is encrypted locally on your device before it ever reaches our servers. We do not have the decryption keys - only your designated heirs and guardians do."
        }
      }
    ]
  });

  return (
    <div className="bg-secondary text-text min-h-screen font-sans">
      <SEO 
        title="Crypto Inheritance & Digital Estate Planning Guide | Transfer Legacy"
        description="The ultimate guide to crypto inheritance. Learn how to securely pass Bitcoin, seed phrases, and digital assets to your family. Stop the $189B loss."
        schema={faqSchema}
      />
      
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden border-b border-border bg-[#020409]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(79,92,255,0.15),transparent_50%)]" />
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary mb-6 border border-primary/20">
            <Shield size={16} />
            <span className="text-sm font-semibold tracking-wide uppercase">The Ultimate Guide</span>
          </div>
          <h1 className="text-5xl md:text-5xl font-bold tracking-tight mb-6 leading-tight">
            Crypto Inheritance:<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">
              How to Secure Your Digital Wealth
            </span>
          </h1>
          <p className="text-xl text-muted max-w-3xl mx-auto mb-10 leading-relaxed">
            Over $189 billion in cryptocurrency is permanently lost because owners passed away without a proper digital estate plan. Learn how to protect your Bitcoin, secure your seed phrases, and ensure your family isn't locked out of your legacy.
          </p>
          <Link to="/onboarding">
            <Button size="lg" className="text-lg py-4 px-10 glow-blue rounded-full">
              Create Your Digital Will Today
            </Button>
          </Link>
        </div>
      </section>

      {/* Main Content Article */}
      <article className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 prose prose-invert prose-lg">
        
        <h2>The $189 Billion Problem: What Happens to Crypto When You Die?</h2>
        <p>
          Unlike a traditional bank account, cryptocurrency operates on cryptographic mathematical proofs rather than human trust. If you hold Bitcoin, Ethereum, or any digital asset in a self-custodial wallet (like a Ledger, Trezor, or MetaMask), <strong>you are your own bank</strong>.
        </p>
        <p>
          But what happens when the bank dies? 
        </p>
        <div className="bg-danger/10 border border-danger/20 rounded-xl p-6 my-8 text-danger-foreground">
          <h4 className="flex items-center gap-2 text-danger mt-0 mb-2"><AlertTriangle /> Real-World Consequence</h4>
          <p className="mb-0">In 2021, a crypto investor tragically passed away in an accident. He held over $4 million in Bitcoin on a hardware wallet. His widow knew the wallet existed but didn't have the 24-word seed phrase. Despite hiring cybersecurity experts, the funds remain locked on the blockchain forever. His family lost everything.</p>
        </div>
        <p>
          This is not an isolated incident. Chainalysis estimates that up to 20% of all Bitcoin ever mined - worth over $189 billion - is lost forever. A massive portion of this is due to sudden death without a <strong>crypto inheritance</strong> plan.
        </p>

        <h2>Why Traditional Wills Fail Digital Assets</h2>
        <p>
          You might think, "I have a will, my lawyer will handle it." Unfortunately, traditional estate planning is entirely unequipped for Web3 and digital assets.
        </p>
        <ul>
          <li><strong>Lawyers aren't cryptographers:</strong> Handing a lawyer your seed phrase on a piece of paper is a massive security risk. If their office is burglarized or their files are hacked, your funds are instantly stolen while you are still alive.</li>
          <li><strong>Probate is public:</strong> In many jurisdictions, a probated will becomes public record. Do you want the world to know you have $500,000 in Bitcoin and exactly how to access it?</li>
          <li><strong>Speed of execution:</strong> Crypto markets are highly volatile. Probate can take months or years. Your heirs need immediate, secure access.</li>
        </ul>

        <h2>The Anatomy of a Digital Will for Cryptocurrency</h2>
        <p>
          A comprehensive digital will for your cryptocurrency requires a zero-trust, mathematically enforced protocol. This is exactly what <strong>Transfer Legacy</strong> provides. A proper plan must cover:
        </p>
        <ol>
          <li><strong>Asset Inventory:</strong> A secure mapping of where your assets are (Hardware wallets, Coinbase, Binance, DeFi smart contracts).</li>
          <li><strong>Credential Transfer:</strong> The automated, encrypted handover of Passwords, Seed Phrases, and Private Keys.</li>
          <li><strong>2FA and Security Keys:</strong> Instructions and access to your YubiKey, Google Authenticator, or backup codes.</li>
          <li><strong>Legal Directives:</strong> A Letter of Instruction to your heirs and executors.</li>
        </ol>

        <h2>How Transfer Legacy Solves Crypto Inheritance</h2>
        <p>
          Transfer Legacy was built on first-principles thinking to solve the single point of failure in digital inheritance. We use <strong>Zero-Knowledge Encryption</strong> and a <strong>Multi-Guardian Protocol</strong>.
        </p>
        
        <h3>1. Zero-Knowledge Vault</h3>
        <p>
          When you enter your seed phrase or passwords into Transfer Legacy, the data is encrypted <em>locally on your device</em> before it is ever transmitted to our servers. We mathematically cannot read your data. If our servers are ever breached, the attackers get nothing but randomized ciphertext.
        </p>

        <h3>2. Shamir's Secret Sharing (The Guardian Protocol)</h3>
        <p>
          Instead of giving one person the "master key" to your vault, Transfer Legacy splits the key into fragments using an advanced cryptographic algorithm called Shamir's Secret Sharing. You distribute these fragments to trusted "Guardians" (e.g., your spouse, your sibling, and your lawyer). 
        </p>
        <p>
          No single Guardian can access your vault. But if you pass away, a predefined threshold of Guardians (e.g., 2 out of 3) must verify your passing. Only then do the fragments recombine, unlocking the vault for your designated heirs.
        </p>

        <h2>Transfer Legacy vs. The Alternatives</h2>
        <div className="overflow-x-auto my-8">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-surface/50">
                <th className="p-4">Feature</th>
                <th className="p-4 text-primary font-bold">Transfer Legacy</th>
                <th className="p-4">Paper in a Safe</th>
                <th className="p-4">DGLegacy / LastPass</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border/50">
                <td className="p-4">Zero-Knowledge Encrypted</td>
                <td className="p-4"><CheckCircle2 className="text-primary inline mr-2"/> Yes</td>
                <td className="p-4 text-muted">N/A</td>
                <td className="p-4">Varies (Often No)</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="p-4">Protection against theft while alive</td>
                <td className="p-4"><CheckCircle2 className="text-primary inline mr-2"/> Absolute</td>
                <td className="p-4 text-danger">Low (Fire, Burglary)</td>
                <td className="p-4 text-muted">Moderate</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="p-4">Multi-Party Guardian Verification</td>
                <td className="p-4"><CheckCircle2 className="text-primary inline mr-2"/> Yes</td>
                <td className="p-4 text-danger">No</td>
                <td className="p-4 text-danger">No</td>
              </tr>
              <tr>
                <td className="p-4">AI-Guided Heir Recovery</td>
                <td className="p-4"><CheckCircle2 className="text-primary inline mr-2"/> Yes</td>
                <td className="p-4 text-danger">No</td>
                <td className="p-4 text-danger">No</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2>Global Legal Context</h2>
        <p>
          The legal landscape for <strong>crypto estate planning</strong> is rapidly evolving. Transfer Legacy is built to assist with compliance globally:
        </p>
        <ul>
          <li><strong>USA:</strong> Under RUFADAA (Revised Uniform Fiduciary Access to Digital Assets Act), adopted in 47 states, executors have the legal right to access digital accounts if explicitly granted.</li>
          <li><strong>India:</strong> The October 2025 Madras High Court ruling established that cryptocurrency is recognized as property and is fully inheritable under the Succession Act.</li>
          <li><strong>UAE:</strong> The DIFC Digital Assets Law explicitly recognizes digital assets as property, providing a robust framework for estate planning.</li>
          <li><strong>UK:</strong> The Law Commission recently recognized crypto as a distinct category of personal property.</li>
        </ul>

      </article>

      {/* CTA Section */}
      <section className="py-20 bg-surface/30 border-y border-border text-center px-4">
        <h2 className="text-4xl font-bold mb-6">Transfer ends. Legacy begins.</h2>
        <p className="text-xl text-muted max-w-2xl mx-auto mb-8">
          Don't wait until it's too late. Protect your family's financial future and secure your digital legacy in under 15 minutes.
        </p>
        <Link to="/onboarding">
          <Button size="lg" className="text-lg py-4 px-10 glow-blue rounded-full">
            Start Your Digital Will Now
          </Button>
        </Link>
      </section>

      {/* FAQ Section */}
      <section className="py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Crypto Inheritance FAQs</h2>
        </div>
        
        <div className="space-y-6">
          {JSON.parse(faqSchema).mainEntity.map((faq: unknown, i: number) => (
            <Card key={i} className="p-6">
              <h3 className="text-xl font-bold text-text mb-3 flex items-start">
                <HelpCircle className="text-primary mr-3 mt-1 flex-shrink-0" size={24} />
                {faq.name}
              </h3>
              <p className="text-muted leading-relaxed ml-9">{faq.acceptedAnswer.text}</p>
            </Card>
          ))}
        </div>
      </section>

    </div>
  );
}
