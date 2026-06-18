// react-app/src/pages/PrivacyPolicy/PrivacyPolicy.jsx
import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import PrivacyPolicyContent from "../../components/Legal/PrivacyPolicyContent";
// PrivacyPolicyContent reads lang internally via useLanguage() — no prop needed.
// useLanguage is kept here only for any future page-level lang logic.
import { useLanguage } from "../../context/LanguageContext";
import "./PrivacyPolicy.css";

// ─── Constants ────────────────────────────────────────────────
const SITE_URL   = "https://8jjgames.com";
const PAGE_URL   = `${SITE_URL}/privacy-policy`;
const OG_IMAGE   = `${SITE_URL}/8JJ_games.png`;
const SITE_NAME  = "8JJ Games";
const TITLE      = "Privacy Policy";
const FULL_TITLE = `${TITLE} | ${SITE_NAME}`;
const DESCRIPTION =
  "Read the 8JJ Games Privacy Policy. Learn how we collect, use, and protect your personal data, including account information, gameplay activity, device data, and your rights as a user.";
const KEYWORDS =
  "8JJ Games privacy policy, data protection, personal data, user privacy, data collection, GDPR, gaming platform privacy, data security, user rights";

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
        { "@type": "ListItem", "position": 1, "name": "Home",           "item": SITE_URL },
        { "@type": "ListItem", "position": 2, "name": "Privacy Policy", "item": PAGE_URL }
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
      },
      "privacyPolicy": PAGE_URL
    }
  ]
};

// ─── Component ────────────────────────────────────────────────
export default function PrivacyPolicyPage() {
  // eslint-disable-next-line no-unused-vars
  const { lang } = useLanguage(); // retained for future page-level lang use

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
        <meta property="og:image:alt"   content={`${SITE_NAME} - Privacy Policy`} />
        <meta property="og:site_name"   content={SITE_NAME} />
        <meta property="og:locale"      content="en_IN" />

        {/* Twitter Card */}
        <meta name="twitter:card"        content="summary_large_image" />
        <meta name="twitter:title"       content={FULL_TITLE} />
        <meta name="twitter:description" content={DESCRIPTION} />
        <meta name="twitter:image"       content={OG_IMAGE} />
        <meta name="twitter:image:alt"   content={`${SITE_NAME} - Privacy Policy`} />

        {/* JSON-LD */}
        <script type="application/ld+json">{JSON.stringify(SCHEMA)}</script>
      </Helmet>

      {/* ── SEMANTIC PAGE STRUCTURE ── */}
      <main id="main-content" aria-label="Privacy Policy">

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
              <span itemProp="name">Privacy Policy</span>
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

          <PrivacyPolicyContent />
        </article>

        {/* ── Internal navigation — related legal pages ── */}
        <nav aria-label="Related legal pages" className="legal-related-nav hidden-SEO">
          <ul className="legal-related-list">
            <li>
              <Link to="/terms-of-service"     className="legal-related-link">Terms of Service</Link>
            </li>
            <li>
              <Link to="/terms-and-conditions"  className="legal-related-link">Terms &amp; Conditions</Link>
            </li>
            <li>
              <Link to="/disclaimer"           className="legal-related-link">Disclaimer</Link>
            </li>
            <li>
              <Link to="/responsible-gaming"   className="legal-related-link">Responsible Gaming</Link>
            </li>
          </ul>
        </nav>

      </main>
    </>
  );
}