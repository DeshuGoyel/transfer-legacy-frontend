import React, { useEffect, lazy, Suspense } from 'react';
import CustomCursor from '../components/layout/CustomCursor';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import LandingSelector from '../pages/LandingSelector';
import NotificationDrawer from '../components/layout/NotificationDrawer';
import Sidebar from '../components/layout/Sidebar';
import { Toaster } from 'react-hot-toast';
import { useStore } from '../store/useStore';
import { useLocation } from 'react-router-dom';
import { cn } from '../utils/cn';
import { useVaultAutoLock } from '../hooks/useVaultAutoLock';
import CookieConsentBanner from '../components/common/CookieConsentBanner';

// Eager or lazy app routes
const Dashboard = lazy(() => import('../pages/Dashboard'));
const Assets = lazy(() => import('../pages/Assets'));
const Allocations = lazy(() => import('../pages/Allocations'));
const Guardians = lazy(() => import('../pages/Guardians'));
const Heirs = lazy(() => import('../pages/Heirs'));
const AIPlanner = lazy(() => import('../pages/AIPlanner'));
const TrustCenter = lazy(() => import('../pages/TrustCenter'));
const Settings = lazy(() => import('../pages/Settings'));
const Onboarding = lazy(() => import('../pages/Onboarding'));
const Login = lazy(() => import('../pages/Login'));
const CheckInCenter = lazy(() => import('../pages/CheckInCenter'));
const MemoryCapsules = lazy(() => import('../pages/MemoryCapsules'));
const DigitalObituary = lazy(() => import('../pages/DigitalObituary'));
const IdentityPassport = lazy(() => import('../pages/IdentityPassport'));
const DeveloperPortal = lazy(() => import('../pages/DeveloperPortal'));
const LegacyAnalytics = lazy(() => import('../pages/LegacyAnalytics'));
const ContactUs = lazy(() => import('../pages/ContactUs'));
const ForgotPassword = lazy(() => import('./ForgotPassword'));
const ResetPassword = lazy(() => import('./ResetPassword'));
const NotFound = lazy(() => import('./NotFound'));

// Feature Pages
const VaultSecurity = lazy(() => import('./features/VaultSecurity'));
const AssetTracking = lazy(() => import('./features/AssetTracking'));
const InheritanceLogic = lazy(() => import('./features/InheritanceLogic'));
const ZeroKnowledge = lazy(() => import('./features/ZeroKnowledge'));
const GuardianNetwork = lazy(() => import('./features/GuardianNetwork'));
const LegacyHealth = lazy(() => import('./features/LegacyHealth'));
const DigitalWill = lazy(() => import('./features/DigitalWill'));
const SeedPhraseSecurity = lazy(() => import('./features/SeedPhraseSecurity'));
const Reports = lazy(() => import('./Reports'));

// Resource Pages
const ResourceGuides = lazy(() => import('./resources/ResourceGuides'));
const FAQPage = lazy(() => import('./resources/FAQPage'));
const BlogPage = lazy(() => import('./resources/BlogPage'));
const BlogIndex = lazy(() => import('./blog/BlogIndex'));
const BlogPost = lazy(() => import('./blog/BlogPost'));
const Whitepaper = lazy(() => import('./resources/Whitepaper'));

// Tool Pages
const PlatformComparison = lazy(() => import('./tools/PlatformComparison'));
const ROICalculator = lazy(() => import('./tools/ROICalculator'));
const SuccessionPlanner = lazy(() => import('./tools/SuccessionPlanner'));
const InheritanceCalculator = lazy(() => import('./tools/InheritanceCalculator'));
const CryptoCalculator = lazy(() => import('./tools/CryptoCalculator'));

// Legal Pages
const TermsOfService = lazy(() => import('./legal/TermsOfService'));
const PrivacyProtocol = lazy(() => import('./legal/PrivacyProtocol'));
const SecurityArchitecture = lazy(() => import('./legal/SecurityArchitecture'));
const GlobalCompliance = lazy(() => import('./legal/GlobalCompliance'));

// SEO & Knowledge Hub Pages
const ResourcesHub = lazy(() => import('./seo/ResourcesHub'));
const CryptoInheritanceGuide = lazy(() => import('./seo/CryptoInheritanceGuide'));
const DigitalWillPillar = lazy(() => import('./seo/DigitalWillPillar'));
const WhatHappensToCrypto = lazy(() => import('./seo/WhatHappensToCrypto'));
const DocumentStorage = lazy(() => import('./seo/DocumentStorage'));
const SeedPhraseInheritance = lazy(() => import('./seo/SeedPhraseInheritance'));
const PrivateKeyInheritance = lazy(() => import('./seo/PrivateKeyInheritance'));
const PassBitcoinToFamily = lazy(() => import('./seo/PassBitcoinToFamily'));
const TransferCryptoWallet = lazy(() => import('./seo/TransferCryptoWallet'));
const PasswordInheritance = lazy(() => import('./seo/PasswordInheritance'));
const CompareDGLegacy = lazy(() => import('./seo/CompareDGLegacy'));
const CompareInheriti = lazy(() => import('./seo/CompareInheriti'));
const CompareTraditionalWills = lazy(() => import('./seo/CompareTraditionalWills'));
const CompareCasa = lazy(() => import('./seo/CompareCasa'));
const CompareUnchained = lazy(() => import('./seo/CompareUnchained'));
const Compare1Password = lazy(() => import('./seo/Compare1Password'));
const BestCryptoInheritance = lazy(() => import('./seo/BestCryptoInheritance'));
const WhitepaperSEO = lazy(() => import('./seo/Whitepaper'));
const LegalTemplates = lazy(() => import('./seo/LegalTemplates'));

// Regional SEO Pages
const CryptoInheritanceIndia = lazy(() => import('./seo/regions/CryptoInheritanceIndia'));
const DigitalWillIndia = lazy(() => import('./seo/regions/DigitalWillIndia'));
const CryptoInheritanceUSA = lazy(() => import('./seo/regions/CryptoInheritanceUSA'));
const DigitalAssetLawUSA = lazy(() => import('./seo/regions/DigitalAssetLawUSA'));
const CryptoInheritanceUK = lazy(() => import('./seo/regions/CryptoInheritanceUK'));
const CryptoInheritanceUAE = lazy(() => import('./seo/regions/CryptoInheritanceUAE'));

// Ops
const OpsLogin = lazy(() => import('./ops/Login'));
const OpsPortal = lazy(() => import('./ops/OpsPortal'));

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useStore();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useStore();
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <>{children}</>;
}

// Routes that are public/pre-login - no sidebar, navbar, or footer
const PUBLIC_ROUTES = new Set(['/', '/login', '/onboarding', '/contact', '/contact-us', '/forgot-password', '/reset-password']);

// Dashboard/app routes - use normal system cursor
const APP_ROUTE_PREFIXES = ['/dashboard', '/assets', '/allocations', '/guardians', '/heirs', '/ai-planner', '/trust', '/settings', '/checkin', '/check-in', '/capsules', '/obituary', '/passport', '/identity', '/developer', '/activity', '/analytics', '/reports'];

function RouteFallback() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-primary border-t-transparent" />
    </div>
  );
}

function AppLayout() {
  const { isNotificationOpen, isSidebarCollapsed } = useStore();
  const location = useLocation();
  const isPublicPage = PUBLIC_ROUTES.has(location.pathname);
  const isAppPage = APP_ROUTE_PREFIXES.some(p => location.pathname.startsWith(p));
  const isOpsPage = location.pathname.startsWith('/ops');
  const showLandingNavbar = !isAppPage && !isOpsPage && location.pathname !== '/login' && location.pathname !== '/onboarding';

  // Sidebar is always 240px - collapsed changes offset to 0
  const offsetClass = (isAppPage && !isSidebarCollapsed) ? 'lg:pl-[240px]' : '';

  return (
    <div className={cn("relative z-10 min-h-screen flex flex-col", isAppPage ? "pt-14" : "")}>
      {isAppPage && <Navbar />}
      {isAppPage && <Sidebar />}
      {showLandingNavbar && <Navbar variant="marketing" />}

      {/* Page content - offset for sidebar */}
      <main className={cn("flex-grow", offsetClass)}>
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/"            element={<LandingSelector />} />
            <Route path="/dashboard"   element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/analytics"   element={<ProtectedRoute><LegacyAnalytics /></ProtectedRoute>} />
            <Route path="/assets"      element={<ProtectedRoute><Assets /></ProtectedRoute>} />
            <Route path="/allocations" element={<ProtectedRoute><Allocations /></ProtectedRoute>} />
            <Route path="/guardians"   element={<ProtectedRoute><Guardians /></ProtectedRoute>} />
            <Route path="/heirs"       element={<ProtectedRoute><Heirs /></ProtectedRoute>} />
            <Route path="/ai-planner"  element={<ProtectedRoute><AIPlanner /></ProtectedRoute>} />
            <Route path="/trust"       element={<ProtectedRoute><TrustCenter /></ProtectedRoute>} />
            <Route path="/settings"    element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="/onboarding"  element={<Onboarding />} />
            <Route path="/login"       element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
            <Route path="/reset-password"  element={<PublicRoute><ResetPassword /></PublicRoute>} />
            <Route path="/contact"     element={<ContactUs />} />
            <Route path="/contact-us"  element={<ContactUs />} />
            <Route path="/checkin"     element={<ProtectedRoute><CheckInCenter /></ProtectedRoute>} />
            <Route path="/check-in"    element={<ProtectedRoute><CheckInCenter /></ProtectedRoute>} />
            <Route path="/capsules"    element={<ProtectedRoute><MemoryCapsules /></ProtectedRoute>} />
            <Route path="/obituary"    element={<ProtectedRoute><DigitalObituary /></ProtectedRoute>} />
            <Route path="/passport"    element={<ProtectedRoute><IdentityPassport /></ProtectedRoute>} />
            <Route path="/identity"    element={<ProtectedRoute><IdentityPassport /></ProtectedRoute>} />
            <Route path="/developer"   element={<ProtectedRoute><DeveloperPortal /></ProtectedRoute>} />
            <Route path="/activity"    element={<ProtectedRoute><LegacyAnalytics /></ProtectedRoute>} />

            {/* New Functional Feature Routes */}
            <Route path="/features/vault-security"          element={<VaultSecurity />} />
            <Route path="/features/asset-tracking"          element={<AssetTracking />} />
            <Route path="/features/inheritance-logic"       element={<InheritanceLogic />} />
            <Route path="/features/zero-knowledge"          element={<ZeroKnowledge />} />
            <Route path="/features/guardian-network"        element={<GuardianNetwork />} />
            <Route path="/features/legacy-health"           element={<LegacyHealth />} />
            
            <Route path="/resources/guides"                 element={<ResourceGuides />} />
            <Route path="/resources/faq"                    element={<FAQPage />} />
            <Route path="/resources/blog"                   element={<BlogIndex />} />
            <Route path="/resources/blog/:slug"             element={<BlogPost />} />
            <Route path="/blog"                             element={<BlogIndex />} />
            <Route path="/blog/:slug"                       element={<BlogPost />} />
            <Route path="/resources/whitepaper"             element={<Whitepaper />} />
            <Route path="/whitepaper"                       element={<WhitepaperSEO />} />
            <Route path="/legal-templates"                  element={<LegalTemplates />} />

            <Route path="/tools/compare"                    element={<PlatformComparison />} />
            <Route path="/tools/roi-calculator"             element={<ROICalculator />} />
            <Route path="/tools/planner"                    element={<SuccessionPlanner />} />
            <Route path="/tools/crypto-risk-calculator"     element={<CryptoCalculator />} />

            <Route path="/legal/privacy"                    element={<PrivacyProtocol />} />
            <Route path="/legal/terms"                      element={<TermsOfService />} />
            <Route path="/legal/security-architecture"       element={<SecurityArchitecture />} />
            <Route path="/legal/compliance"                 element={<GlobalCompliance />} />

            {/* SEO & Knowledge Hub Routes */}
            <Route path="/resources"                                element={<ResourcesHub />} />
            <Route path="/crypto-inheritance"                       element={<CryptoInheritanceGuide />} />
            <Route path="/digital-will"                             element={<DigitalWillPillar />} />
            <Route path="/what-happens-to-crypto-when-you-die"      element={<WhatHappensToCrypto />} />
            <Route path="/store-important-documents-for-family"     element={<DocumentStorage />} />
            <Route path="/seed-phrase-inheritance"                  element={<SeedPhraseInheritance />} />
            <Route path="/private-key-inheritance"                  element={<PrivateKeyInheritance />} />
            <Route path="/how-to-pass-bitcoin-to-family"            element={<PassBitcoinToFamily />} />
            <Route path="/transfer-crypto-wallet-to-family"         element={<TransferCryptoWallet />} />
            <Route path="/password-inheritance"                     element={<PasswordInheritance />} />
            
            {/* Comparison Routes */}
            <Route path="/transfer-legacy-vs-dglegacy"              element={<CompareDGLegacy />} />
            <Route path="/transfer-legacy-vs-inheriti"              element={<CompareInheriti />} />
            <Route path="/transfer-legacy-vs-traditional-wills"     element={<CompareTraditionalWills />} />
            <Route path="/transfer-legacy-vs-casa"                  element={<CompareCasa />} />
            <Route path="/transfer-legacy-vs-unchained"             element={<CompareUnchained />} />
            <Route path="/transfer-legacy-vs-1password"             element={<Compare1Password />} />
            <Route path="/best-crypto-inheritance-services"         element={<BestCryptoInheritance />} />

            {/* Regional Compliance & Law Routes */}
            <Route path="/crypto-inheritance-india"                 element={<CryptoInheritanceIndia />} />
            <Route path="/digital-will-india"                       element={<DigitalWillIndia />} />
            <Route path="/crypto-inheritance-usa"                   element={<CryptoInheritanceUSA />} />
            <Route path="/digital-asset-inheritance-usa"            element={<DigitalAssetLawUSA />} />
            <Route path="/crypto-inheritance-uk"                    element={<CryptoInheritanceUK />} />
            <Route path="/crypto-inheritance-uae"                   element={<CryptoInheritanceUAE />} />

            {/* Legacy Features & Tools */}
            <Route path="/features/digital-wills"           element={<DigitalWill />} />
            <Route path="/features/seed-phrase"             element={<SeedPhraseSecurity />} />
            <Route path="/features/inheritance-calculator"  element={<InheritanceCalculator />} />
            <Route path="/reports"                          element={<Reports />} />
            
            {/* Administrative Ops Routes */}
            <Route path="/ops/login" element={<OpsLogin />} />
            <Route path="/ops/*" element={<OpsPortal />} />
            
            {/* Standard 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>

      {/* Footer - also offset to prevent Sidebar overlap */}
      <div className={cn("transition-all duration-300", offsetClass)}>
        {!isPublicPage && !isOpsPage && !isAppPage && <Footer />}
      </div>

      {isNotificationOpen && <NotificationDrawer />}
    </div>
  );
}

function AppCursor() {
  const location = useLocation();
  // Only show custom cursor on the landing page - everywhere else uses the normal system cursor
  const isLandingOnly = location.pathname === '/';

  useEffect(() => {
    if (!isLandingOnly) {
      document.body.classList.remove('custom-cursor-active');
      document.body.style.cursor = 'auto';
    } else {
      document.body.classList.add('custom-cursor-active');
    }
    return () => {
      document.body.classList.remove('custom-cursor-active');
      document.body.style.cursor = 'auto';
    };
  }, [isLandingOnly]);

  return <CustomCursor />;
}

export default function MainWebsite() {
  return (
    <>
      <AppCursor />
      <AppLayout />
      <Toaster position="top-right" />
    </>
  );
}
