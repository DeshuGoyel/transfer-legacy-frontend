import { Link } from 'react-router-dom';
import { HelpCircle, ArrowRight } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { SEO } from '../components/seo/SEO';

export default function CryptoDeathGuide() {
  const faqSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Can a lawyer access my crypto after I die?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Only if you have securely provided them with the private keys or seed phrase. However, giving a lawyer your seed phrase while you are alive is highly insecure. Transfer Legacy solves this by encrypting the keys so neither the lawyer nor the company can see them, releasing them only after verified death."
        }
      },
      {
        "@type": "Question",
        "name": "Does Coinbase transfer crypto after death?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, centralized exchanges like Coinbase and Binance have procedures for deceased users. However, your family must know the accounts exist, have your death certificate, and navigate complex legal probate processes which can take months."
        }
      },
      {
        "@type": "Question",
        "name": "What happens to a Ledger or Trezor when you die?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "If your heirs do not have the PIN code or the 24-word recovery seed phrase, the crypto on a hardware wallet is permanently inaccessible. It cannot be hacked or bypassed by the manufacturer."
        }
      },
      {
        "@type": "Question",
        "name": "What is a crypto dead man's switch?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "A dead man's switch is an automated system that checks if you are alive (e.g., via periodic email clicks). If you fail to respond for a set period, the system assumes you have passed away and automatically sends your encrypted data or keys to your heirs."
        }
      },
      {
        "@type": "Question",
        "name": "How do I leave Bitcoin to my children?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "You should use a secure digital legacy vault like Transfer Legacy. You place your wallet details in the zero-knowledge vault, assign trusted guardians to verify your passing, and the AI guides your children on how to recover the Bitcoin safely."
        }
      }
    ]
  });

  return (
    <div className="bg-secondary text-text min-h-screen font-sans pt-20">
      <SEO 
        title="What Happens To Crypto When You Die? | Transfer Legacy"
        description="The ultimate guide on what happens to your Bitcoin, hardware wallets, and seed phrases when you die. Learn how to prevent permanent loss."
        schema={faqSchema}
      />
      
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="mb-12">
          <p className="text-primary font-semibold tracking-wide uppercase mb-3">Crypto Estate Planning Guide</p>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 leading-tight">
            What Happens to Crypto When You Die? The $189B Warning.
          </h1>
          <p className="text-xl text-muted">
            The decentralized nature of Web3 is its greatest strength, but it's also a fatal flaw when it comes to inheritance.
          </p>
        </header>

        <article className="prose prose-invert prose-lg max-w-none">
          <p>
            If you pass away today, what happens to your cryptocurrency? For traditional assets like real estate or bank accounts, the legal system takes over. Probate courts assign executors, banks freeze accounts, and eventually, the wealth is transferred to your heirs.
          </p>
          <p>
            <strong>Cryptocurrency does not care about the legal system.</strong>
          </p>
          <p>
            If you hold your digital wealth in a self-custodial wallet - whether it's a Ledger, Trezor, MetaMask, or Trust Wallet - the blockchain enforces one absolute rule: <em>Not your keys, not your coins.</em>
          </p>

          <div className="bg-surface/50 border border-border rounded-2xl p-8 my-10">
            <h3 className="text-2xl font-bold mt-0 mb-4">The Tragic Reality of Lost Crypto</h3>
            <p className="mb-0">
              According to blockchain analytics firms, roughly 20% of all Bitcoin currently in existence is lost forever. That equates to roughly <strong>$189 billion</strong>. While some of this is due to early miners throwing away hard drives, a rapidly growing percentage is due to unexpected deaths where the owner had no crypto inheritance plan.
            </p>
          </div>

          <h2>The Hardware Wallet Dilemma</h2>
          <p>
            Many crypto investors mistakenly believe that keeping their hardware wallet in a physical safe is enough. But consider this from your spouse or child's perspective:
          </p>
          <ol>
            <li>Do they know the safe exists?</li>
            <li>Do they know the PIN to the hardware device?</li>
            <li>If the device breaks, do they know what a "seed phrase" is?</li>
            <li>Do they know how to restore a wallet using that seed phrase?</li>
          </ol>
          <p>
            If the answer to any of these is "no," your crypto is as good as gone.
          </p>

          <h2>Centralized Exchanges (Coinbase, Binance, Kraken)</h2>
          <p>
            If your funds are on a centralized exchange, the process is slightly different but equally stressful. Because exchanges are regulated financial entities, they have procedures for deceased users.
          </p>
          <p>
            However, your family must first <strong>know the account exists</strong>. If you used an obscure exchange or a DeFi platform, no one will ever know to look there. Secondly, recovering funds from an exchange post-mortem requires death certificates, legal probate documents, and often months of back-and-forth with customer support.
          </p>

          <h2>The Solution: A Zero-Knowledge Digital Legacy Vault</h2>
          <p>
            Writing your seed phrase on a piece of paper and handing it to a lawyer is a terrible idea. It creates a massive security vulnerability while you are alive.
          </p>
          <p>
            The modern, secure solution is a <strong>Zero-Knowledge Digital Vault</strong> like <Link to="/" className="text-primary hover:underline">Transfer Legacy</Link>.
          </p>

          <h3>How Transfer Legacy Protects You</h3>
          <ul>
            <li><strong>Zero-Knowledge Architecture:</strong> Your seed phrases and passwords are encrypted locally. No one at Transfer Legacy can read them.</li>
            <li><strong>Fragmented Guardian Protocol:</strong> You don't trust just one person. You split the "unlock key" among several trusted guardians (e.g., your spouse, best friend, and attorney).</li>
            <li><strong>Dead Man's Switch:</strong> The vault is only unlocked when a verified event occurs - either through a timed check-in failure or verification by your guardians.</li>
            <li><strong>AI Heir Guidance:</strong> Your family receives plain-English, step-by-step instructions on how to access the funds, shielding them from the technical complexity of the blockchain.</li>
          </ul>

          <div className="mt-12 p-8 bg-gradient-to-br from-primary/20 to-purple-500/10 rounded-2xl border border-primary/30 text-center">
            <h3 className="text-2xl font-bold mt-0 mb-4 text-white">Don't let your wealth vanish.</h3>
            <p className="mb-6">Set up your digital will in 15 minutes. Ensure your family is protected forever.</p>
            <Link to="/onboarding">
              <Button size="lg" className="w-full sm:w-auto">
                Create Your Vault <ArrowRight className="ml-2" size={20} />
              </Button>
            </Link>
          </div>
        </article>

        <section className="mt-20 pt-12 border-t border-border">
          <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {JSON.parse(faqSchema).mainEntity.map((faq: unknown, i: number) => (
              <Card key={i} className="p-6">
                <h3 className="text-lg font-bold text-text mb-2 flex items-start">
                  <HelpCircle className="text-primary mr-3 mt-1 flex-shrink-0" size={20} />
                  {faq.name}
                </h3>
                <p className="text-muted leading-relaxed ml-8">{faq.acceptedAnswer.text}</p>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
