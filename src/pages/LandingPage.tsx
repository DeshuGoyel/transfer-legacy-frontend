import { useEffect } from 'react';
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

export default function LandingPage() {
  // Restore normal cursor for landing page
  useEffect(() => {
    document.body.classList.add('landing-page');
    return () => document.body.classList.remove('landing-page');
  }, []);

  return (
    <div className="bg-page text-primary min-h-screen font-sans selection:bg-brand-primary/30 overflow-x-hidden relative">
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
