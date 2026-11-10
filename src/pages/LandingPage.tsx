import { useEffect, useMemo } from 'react';
import Footer from '../components/layout/Footer';
import Hero from '../components/sections/Hero';
import SocialProof from '../components/sections/SocialProof';
import Problem from '../components/sections/Problem';
import Features from '../components/sections/Features';
import Security from '../components/sections/Security';
import Pricing from '../components/sections/Pricing';
import Testimonials from '../components/sections/Testimonials';
import FAQ from '../components/sections/FAQ';
import FinalCTA from '../components/sections/FinalCTA';
import SEO from '../components/seo/SEO';

export default function LandingPage() {
  // Restore normal cursor for landing page
  useEffect(() => {
    document.body.classList.add('landing-page');
    return () => document.body.classList.remove('landing-page');
  }, []);

  const homeSchema = useMemo(() => [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Transfer Legacy",
      "url": "https://transferlegacy.com/",
      "description": "Secure zero-knowledge digital inheritance vault for cryptocurrency and digital assets."
    },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Transfer Legacy",
      "url": "https://transferlegacy.com/",
      "logo": "https://transferlegacy.com/logo-dark.png",
      "founder": [
        {
          "@type": "Person",
          "name": "Deshu Goyel",
          "jobTitle": "Founder & CEO"
        },
        {
          "@type": "Person",
          "name": "Vikash Kumar Singh",
          "jobTitle": "Co-Founder & CTO"
        }
      ],
      "sameAs": [
        "https://twitter.com/transferlegacy",
        "https://linkedin.com/company/transferlegacy"
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Can Transfer Legacy see my private key or vault data?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No. We utilize a strict client-side zero-knowledge architecture. Your passwords, documents, and private keys are encrypted directly on your local device using XChaCha20-Poly1305 before uploading. We store only scrambled ciphertext - we physically cannot decrypt your data."
          }
        },
        {
          "@type": "Question",
          "name": "How does the Dead Man's Switch actually work?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "We monitor your pings. If you miss your check-in interval, we send warning alerts via email and SMS. If you remain inactive past the grace period, your guardians are authorized to submit their shards. Shards are mathematically compiled, and only then is the key reconstituted to decrypt the vault."
          }
        },
        {
          "@type": "Question",
          "name": "What happens if Transfer Legacy goes out of business?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Your vault is encrypted client-side. We also provide a downloadable open-source recovery script. Even if our servers permanently go offline, your family can run the script locally and reassemble your legacy offline using the guardian shards."
          }
        },
        {
          "@type": "Question",
          "name": "How is this different from sharing passwords in 1Password?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Standard sharing grants immediate access. Transfer Legacy is built for inheritance. Access is sealed behind a liveness trigger. No single person (not even a guardian) can view your data until the switch conditions are met, protecting you from premature disclosure."
          }
        },
        {
          "@type": "Question",
          "name": "Is this legally binding in my country?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. Transfer Legacy is a cryptographic storage and transfer protocol. In most jurisdictions, digital assets can be passed via private contract or trusts. We recommend storing a copy of your formal will alongside your digital assets."
          }
        }
      ]
    }
  ], []);

  return (
    <div className="bg-page text-primary min-h-screen font-sans selection:bg-brand-primary/30 overflow-x-hidden relative">
      <SEO 
        title="Transfer Legacy | Secure Crypto Inheritance Vault"
        description="The only zero-knowledge platform that securely and automatically transfers your Bitcoin, Ethereum, seed phrases, and digital assets to your family."
        canonicalUrl="https://transferlegacy.com/"
        schema={homeSchema}
      />
      <main>
        {/* 1. Hero - YC-grade layout */}
        <Hero />
        
        {/* 2. Logo / trust bar */}
        <SocialProof />
        
        {/* 3. Problem - big Cormorant stat + 4-card grid */}
        <Problem />
        
        {/* 4. Feature 1, 2, 3 - alternating rows */}
        <Features />
        
        {/* 5. Security - inverted theme drama */}
        <Security />

        {/* 6. Pricing - monthly/yearly toggle */}
        <Pricing />

        {/* 7. Testimonials - 3 minimal cards */}
        <Testimonials />

        {/* 8. FAQ - accordion */}
        <FAQ />

        {/* 9. Final CTA - headline + Waitlist */}
        <FinalCTA />
      </main>

      {/* 10. Footer */}
      <Footer variant="marketing" />
    </div>
  );
}
