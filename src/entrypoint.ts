interface Env {
  ASSETS: {
    fetch: (request: Request) => Promise<Response>;
  };
}

const VALID_STATIC_ROUTES = new Set([
  '/',
  '/dashboard',
  '/analytics',
  '/assets',
  '/allocations',
  '/guardians',
  '/heirs',
  '/ai-planner',
  '/trust',
  '/settings',
  '/onboarding',
  '/login',
  '/forgot-password',
  '/reset-password',
  '/contact',
  '/contact-us',
  '/checkin',
  '/check-in',
  '/capsules',
  '/obituary',
  '/passport',
  '/identity',
  '/developer',
  '/activity',
  '/features/vault-security',
  '/features/asset-tracking',
  '/features/inheritance-logic',
  '/features/zero-knowledge',
  '/features/guardian-network',
  '/features/legacy-health',
  '/resources/guides',
  '/resources/faq',
  '/resources/blog',
  '/resources/whitepaper',
  '/whitepaper',
  '/legal-templates',
  '/tools/compare',
  '/tools/roi-calculator',
  '/tools/planner',
  '/tools/crypto-risk-calculator',
  '/legal/privacy',
  '/legal/terms',
  '/legal/security-architecture',
  '/legal/compliance',
  '/resources',
  '/crypto-inheritance',
  '/digital-will',
  '/what-happens-to-crypto-when-you-die',
  '/store-important-documents-for-family',
  '/seed-phrase-inheritance',
  '/private-key-inheritance',
  '/how-to-pass-bitcoin-to-family',
  '/transfer-crypto-wallet-to-family',
  '/password-inheritance',
  '/transfer-legacy-vs-dglegacy',
  '/transfer-legacy-vs-inheriti',
  '/transfer-legacy-vs-traditional-wills',
  '/crypto-inheritance-india',
  '/digital-will-india',
  '/crypto-inheritance-usa',
  '/digital-asset-inheritance-usa',
  '/crypto-inheritance-uk',
  '/crypto-inheritance-uae',
  '/features/digital-wills',
  '/features/seed-phrase',
  '/features/inheritance-calculator',
  '/reports',
  '/llms.txt',
  '/robots.txt',
  '/sitemap.xml',
]);

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    try {
      // 1. Try to serve static file from ASSETS binding
      const response = await env.ASSETS.fetch(request);
      if (response.status !== 404) {
        return response;
      }
    } catch (e) {
      console.error("Error fetching static asset:", e);
    }

    const url = new URL(request.url);
    const cleanPath = url.pathname.replace(/\/$/, '') || '/';

    const isValid = 
      VALID_STATIC_ROUTES.has(cleanPath) || 
      cleanPath.startsWith('/ops') || 
      cleanPath.startsWith('/assets/');

    // 2. Fetch index.html template for SPA hydration
    const indexRequest = new Request(new URL('/', request.url).toString(), request);
    const indexResponse = await env.ASSETS.fetch(indexRequest);

    // If route is valid, serve index.html with 200 OK
    if (isValid) {
      return indexResponse;
    }

    // 3. True 404 HTTP Status for crawlers (prevents Soft 404 penalty in search engines)
    return new Response(indexResponse.body, {
      status: 404,
      statusText: 'Not Found',
      headers: indexResponse.headers,
    });
  }
};
