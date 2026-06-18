// react-app/src/pages/TermsConditions/TermsConditions.jsx
import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import TermsConditionsContent from "../../components/Legal/TermsConditionsContent";
import { useLanguage } from "../../context/LanguageContext";
import "./TermsConditions.css";

// ─── Constants ────────────────────────────────────────────────
const SITE_URL   = "https://8jjgames.com";
const PAGE_URL   = `${SITE_URL}/terms-and-conditions`;
const OG_IMAGE   = `${SITE_URL}/images/og-default.jpg`;
const SITE_NAME  = "8JJ Games";
const TITLE      = "Terms & Conditions";
const FULL_TITLE = `${TITLE} | ${SITE_NAME}`;
const DESCRIPTION =
  "Review the Terms and Conditions for 8JJ Games. Understand your rights, responsibilities, and the rules that govern participation in our free sports prediction contests and gaming platform.";
const KEYWORDS =
  "8JJ Games terms and conditions, gaming platform conditions, sports prediction platform rules, user rights, free games platform, contest conditions";

// ─── Schema ───────────────────────────────────────────────────
const SCHEMA = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": PAGE_URL,
      "url": PAGE_URL,
      "name": FULL_TITLE,
      "description": DESCRIPTION,
      "inLanguage": "en",
      "isPartOf": { "@id": `${SITE_URL}/#website` },
      "dateModified": "2026-02-16",
      "breadcrumb": { "@id": `${PAGE_URL}/#breadcrumb` }
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${PAGE_URL}/#breadcrumb`,
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home",                "item": SITE_URL },
        { "@type": "ListItem", "position": 2, "name": "Terms & Conditions",  "item": PAGE_URL }
      ]
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      "url": SITE_URL,
      "name": SITE_NAME,
      "publisher": { "@id": `${SITE_URL}/#organization` }
    },
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      "name": SITE_NAME,
      "url": SITE_URL,
      "logo": {
        "@type": "ImageObject",
        "url": `${SITE_URL}/images/logo.png`,
        "width": 200,
        "height": 60
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "email": "8jjcorporate@gmail.com",
        "contactType": "customer support"
      }
    }
  ]
};

// ─── Component ────────────────────────────────────────────────
export default function TermsConditionsPage() {
  const { lang } = useLanguage();

  return (
    <>
      {/* ── HEAD ── */}
      <Helmet>
        {/* Primary meta */}
        <title>{FULL_TITLE}</title>
        <meta name="description"        content={DESCRIPTION} />
        <meta name="keywords"           content={KEYWORDS} />
        <meta name="robots"             content="index, follow" />
        <link rel="canonical"           href={PAGE_URL} />

        {/* Open Graph */}
        <meta property="og:type"        content="website" />
        <meta property="og:url"         content={PAGE_URL} />
        <meta property="og:title"       content={FULL_TITLE} />
        <meta property="og:description" content={DESCRIPTION} />
        <meta property="og:image"       content={OG_IMAGE} />
        <meta property="og:image:width"  content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt"   content={`${SITE_NAME} - Terms & Conditions`} />
        <meta property="og:site_name"   content={SITE_NAME} />
        <meta property="og:locale"      content="en_IN" />

        {/* Twitter Card */}
        <meta name="twitter:card"        content="summary_large_image" />
        <meta name="twitter:title"       content={FULL_TITLE} />
        <meta name="twitter:description" content={DESCRIPTION} />
        <meta name="twitter:image"       content={OG_IMAGE} />
        <meta name="twitter:image:alt"   content={`${SITE_NAME} - Terms & Conditions`} />

        {/* JSON-LD */}
        <script type="application/ld+json">{JSON.stringify(SCHEMA)}</script>
      </Helmet>

      {/* ── SEMANTIC PAGE STRUCTURE ── */}
      <main id="main-content" aria-label="Terms and Conditions">

        {/* ── Breadcrumb nav ── */}
        <nav aria-label="Breadcrumb" className="legal-breadcrumb-nav">
          <ol className="legal-breadcrumb-list" itemScope itemType="https://schema.org/BreadcrumbList">
            <li
              className="legal-breadcrumb-item"
              itemScope
              itemType="https://schema.org/ListItem"
              itemProp="itemListElement"
            >
              <Link to="/" className="legal-breadcrumb-link" itemProp="item">
                <span itemProp="name">Home</span>
              </Link>
              <meta itemProp="position" content="1" />
            </li>

            <li className="legal-breadcrumb-separator" aria-hidden="true">/</li>

            <li
              className="legal-breadcrumb-item legal-breadcrumb-current"
              itemScope
              itemType="https://schema.org/ListItem"
              itemProp="itemListElement"
              aria-current="page"
            >
              <span itemProp="name">Terms &amp; Conditions</span>
              <meta itemProp="position" content="2" />
            </li>
          </ol>
        </nav>

      
        <article
          className="legal-article"
          itemScope
          itemType="https://schema.org/WebPage"
        >
          <meta itemProp="url"          content={PAGE_URL} />
          <meta itemProp="name"         content={FULL_TITLE} />
          <meta itemProp="description"  content={DESCRIPTION} />
          <meta itemProp="dateModified" content="2026-02-16" />

          <TermsConditionsContent lang={lang} />
        </article>

        {/* ── Internal navigation — related legal pages ── */}
        <nav aria-label="Related legal pages" className="legal-related-nav hidden-SEO">
          <ul className="legal-related-list">
            <li>
              <Link to="/terms-of-service"   className="legal-related-link">Terms of Service</Link>
            </li>
            <li>
              <Link to="/privacy-policy"     className="legal-related-link">Privacy Policy</Link>
            </li>
            <li>
              <Link to="/disclaimer"         className="legal-related-link">Disclaimer</Link>
            </li>
            <li>
              <Link to="/responsible-gaming" className="legal-related-link">Responsible Gaming</Link>
            </li>
          </ul>
        </nav>

      </main>
    </>
  );
}