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

function withCacheHeaders(res: Response, pathname: string): Response {
  const headers = new Headers(res.headers);
  if (pathname.startsWith('/assets/')) {
    headers.set('Cache-Control', 'public, max-age=31536000, immutable');
    headers.set('Access-Control-Allow-Origin', '*');
  } else if (
    pathname.endsWith('.png') ||
    pathname.endsWith('.jpg') ||
    pathname.endsWith('.jpeg') ||
    pathname.endsWith('.svg') ||
    pathname.endsWith('.webp') ||
    pathname.endsWith('.ico')
  ) {
    headers.set('Cache-Control', 'public, max-age=604800, stale-while-revalidate=86400');
  } else if (pathname === '/robots.txt' || pathname === '/sitemap.xml' || pathname.startsWith('/llms')) {
    headers.set('Cache-Control', 'public, max-age=86400');
  } else if (pathname.includes('OneSignalSDKWorker')) {
    headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
  } else {
    headers.set('Cache-Control', 'public, max-age=0, must-revalidate');
  }
  return new Response(res.body, {
    status: res.status,
    statusText: res.statusText,
    headers,
  });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const cleanPath = url.pathname.replace(/\/$/, '') || '/';

    try {
      // 1. Try to serve static file from ASSETS binding
      const response = await env.ASSETS.fetch(request);
      if (response.status !== 404) {
        return withCacheHeaders(response, url.pathname);
      }
    } catch (e) {
      console.error("Error fetching static asset:", e);
    }

    const isValid = 
      VALID_STATIC_ROUTES.has(cleanPath) || 
      cleanPath.startsWith('/ops') || 
      cleanPath.startsWith('/assets/');

    // 2. Fetch index.html template for SPA hydration
    const indexRequest = new Request(new URL('/', request.url).toString(), request);
    const indexResponse = await env.ASSETS.fetch(indexRequest);

    // If route is valid, serve index.html with 200 OK
    if (isValid) {
      return withCacheHeaders(indexResponse, '/');
    }

    // 3. True 404 HTTP Status for crawlers (prevents Soft 404 penalty in search engines)
    const notFoundHeaders = new Headers(indexResponse.headers);
    notFoundHeaders.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    return new Response(indexResponse.body, {
      status: 404,
      statusText: 'Not Found',
      headers: notFoundHeaders,
    });
  }
};
