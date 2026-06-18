
// react-app/src/components/SEO/SEO.jsx 

import { useEffect } from "react";
import { Helmet } from "react-helmet-async";

function SEO({ 
  title, 
  description, 
  keywords,
  image,
  url,
  type = "website",
  gameSchema = null,
  author = "8JJ Games",
  publishDate,
  modifiedDate,
  noindex = false
}) {
  const siteTitle = "8JJ Games";
  const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;
  const siteUrl = "https://8jjgames.com";
  
  const defaultDescription = "Play thousands of free online games on 8JJ Games. Browse popular games, trending titles, and games by category.";
  const metaDescription = description || defaultDescription;

  // Ensure absolute URLs
  const fullUrl = url?.startsWith('http') ? url : `${siteUrl}${url || ''}`;
  const fullImage = image?.startsWith('http') ? image : `${siteUrl}${image || '/images/og-default.jpg'}`;

  // ===================================
  // IMMEDIATE TITLE UPDATE (PREVENTS FLASH)
  // ===================================
  useEffect(() => {
    // Update title IMMEDIATELY before Helmet takes over
    // This prevents the flash of %VITE_SITE_NAME% during load
    if (fullTitle) {
      document.title = fullTitle;
    }
  }, [fullTitle]);

  return (
    <Helmet defer={false}>
      {/* ===================================
          PRIMARY META TAGS
      =================================== */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={metaDescription} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="author" content={author} />
      
      {/* ===================================
          CANONICAL URL
      =================================== */}
      {url && <link rel="canonical" href={fullUrl} />}

      {/* ===================================
          OPEN GRAPH / FACEBOOK
      =================================== */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:image:alt" content={fullTitle} />
      <meta property="og:site_name" content="8JJ Games - Free Online Games" />
      <meta property="og:locale" content="en_US" />
      
      {/* Image dimensions for better social sharing */}
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      {/* ===================================
          TWITTER CARD
      =================================== */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={fullImage} />
      <meta name="twitter:image:alt" content={fullTitle} />
      <meta name="twitter:creator" content="@8jjgames" />
      <meta name="twitter:site" content="@8jjgames" />

      {/* ===================================
          ROBOTS & INDEXING
      =================================== */}
      {noindex ? (
        <>
          <meta name="robots" content="noindex, follow" />
          <meta name="googlebot" content="noindex, follow" />
        </>
      ) : (
        <>
          <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
          <meta name="googlebot" content="index, follow" />
          <meta name="bingbot" content="index, follow" />
        </>
      )}
      
      {/* ===================================
          MOBILE WEB APP
      =================================== */}
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="apple-mobile-web-app-title" content="8JJ Games" />
      
      {/* ===================================
          THEME COLOR
      =================================== */}
      <meta name="theme-color" content="#667eea" />
      
      {/* ===================================
          PUBLICATION DATES (for articles/games)
      =================================== */}
      {publishDate && <meta property="article:published_time" content={publishDate} />}
      {modifiedDate && <meta property="article:modified_time" content={modifiedDate} />}
      
      {/* ===================================
          GAME-SPECIFIC META TAGS
      =================================== */}
      {type === 'game' && (
        <>
          <meta property="og:type" content="website" />
          <meta name="game" content={title || "Free Online Game"} />
        </>
      )}

      {/* ===================================
          JSON-LD SCHEMA (if provided)
      =================================== */}
      {gameSchema && (
        <script type="application/ld+json">
          {JSON.stringify(gameSchema)}
        </script>
      )}
    </Helmet>
  );
}

export default SEO;