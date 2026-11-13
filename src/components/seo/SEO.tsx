import { Helmet } from 'react-helmet-async';

export interface HrefLangAlternate {
  lang: string;
  href: string;
}

export interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  canonicalUrl?: string;
  canonical?: string; // Backwards compatibility for pages passing canonical
  type?: string;
  imageUrl?: string;
  schema?: unknown;
  noindex?: boolean;
  publishedTime?: string;
  hreflangs?: HrefLangAlternate[];
}

export function SEO({
  title,
  description,
  keywords = "crypto inheritance, digital will, what happens to crypto when you die, Bitcoin inheritance, seed phrase inheritance, password inheritance, digital legacy vault, private key inheritance, crypto estate planning",
  canonicalUrl,
  canonical,
  type = "website",
  imageUrl = "https://transferlegacy.com/og-image.png",
  schema,
  noindex = false,
  publishedTime,
  hreflangs = []
}: SEOProps) {
  // Normalize canonical URL: prioritize canonicalUrl, fallback to canonical, or clean path without query/hash
  let targetCanonical = canonicalUrl || canonical;
  if (!targetCanonical && typeof window !== 'undefined') {
    targetCanonical = window.location.origin + window.location.pathname;
  }
  if (!targetCanonical) {
    targetCanonical = "https://transferlegacy.com/";
  }

  const schemaString = typeof schema === 'object' ? JSON.stringify(schema) : schema;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      )}

      {/* Canonical URL */}
      <link rel="canonical" href={targetCanonical} />

      {/* Hreflang Alternates */}
      {hreflangs.map((item) => (
        <link key={item.lang} rel="alternate" hrefLang={item.lang} href={item.href} />
      ))}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="Transfer Legacy" />
      <meta property="og:locale" content="en_US" />
      <meta property="og:url" content={targetCanonical} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:site" content="@transferlegacy" />
      <meta property="twitter:creator" content="@transferlegacy" />
      <meta property="twitter:url" content={targetCanonical} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={imageUrl} />

      {/* Structured Data (Schema.org) */}
      {schemaString && (
        <script type="application/ld+json">
          {schemaString}
        </script>
      )}
    </Helmet>
  );
}

export default SEO;
