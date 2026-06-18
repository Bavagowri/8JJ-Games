// react-app/src/pages/ResponsibleGaming/ResponsibleGaming.jsx
import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import ResponsibleGamingContent from "../../components/Legal/ResponsibleGamingContent";
import { useLanguage } from "../../context/LanguageContext";
import "./ResponsibleGaming.css";

// ─── Constants ────────────────────────────────────────────────
const SITE_URL   = "https://8jjgames.com";
const PAGE_URL   = `${SITE_URL}/responsible-gaming`;
const OG_IMAGE   = `${SITE_URL}/8JJ_games.png`;
const SITE_NAME  = "8JJ Games";
const TITLE      = "Responsible Gaming";
const FULL_TITLE = `${TITLE} | ${SITE_NAME}`;
const DESCRIPTION =
  "Learn about responsible gaming on 8JJ Games. We are committed to your wellbeing with healthy gaming tips, self-assessment tools, and support resources for safe, enjoyable play.";
const KEYWORDS =
  "responsible gaming, safe gaming, healthy gaming habits, gaming wellbeing, 8JJ Games responsible play, gaming self-assessment, gaming support resources, problem gaming help";

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
      "breadcrumb": { "@id": `${PAGE_URL}/#breadcrumb` },
      "about": {
        "@type": "Thing",
        "name": "Responsible Gaming",
        "description": "Guidelines and resources for maintaining healthy gaming habits."
      }
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${PAGE_URL}/#breadcrumb`,
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home",               "item": SITE_URL },
        { "@type": "ListItem", "position": 2, "name": "Responsible Gaming", "item": PAGE_URL }
      ]
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Does 8JJ Games involve real-money gambling?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No. 8JJ Games is a free sports prediction and entertainment platform. No real money is wagered or won. All contests are free to enter and virtual rewards have no monetary value."
          }
        },
        {
          "@type": "Question",
          "name": "How can I limit my gaming time on 8JJ Games?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "We recommend setting personal time limits, taking regular breaks, and using our self-assessment checklist. If you need help, contact us at 8jjcorporate@gmail.com."
          }
        },
        {
          "@type": "Question",
          "name": "Is 8JJ Games suitable for minors?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "8JJ Games requires users to be at least 18 years of age to create an account. We actively work to prevent underage access and encourage parental supervision."
          }
        }
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
export default function ResponsibleGamingPage() {
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
        <meta property="og:image:alt"   content={`${SITE_NAME} - Responsible Gaming`} />
        <meta property="og:site_name"   content={SITE_NAME} />
        <meta property="og:locale"      content="en_IN" />

        {/* Twitter Card */}
        <meta name="twitter:card"        content="summary_large_image" />
        <meta name="twitter:title"       content={FULL_TITLE} />
        <meta name="twitter:description" content={DESCRIPTION} />
        <meta name="twitter:image"       content={OG_IMAGE} />
        <meta name="twitter:image:alt"   content={`${SITE_NAME} - Responsible Gaming`} />

        {/* JSON-LD */}
        <script type="application/ld+json">{JSON.stringify(SCHEMA)}</script>
      </Helmet>

      {/* ── SEMANTIC PAGE STRUCTURE ── */}
      <main id="main-content" aria-label="Responsible Gaming">

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
              <span itemProp="name">Responsible Gaming</span>
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

          <ResponsibleGamingContent lang={lang} />
        </article>

        {/* ── Internal navigation — related legal pages ── */}
        <nav aria-label="Related legal pages" className="legal-related-nav hidden-SEO">
          <ul className="legal-related-list">
            <li>
              <Link to="/terms-of-service"    className="legal-related-link">Terms of Service</Link>
            </li>
            <li>
              <Link to="/terms-and-conditions" className="legal-related-link">Terms &amp; Conditions</Link>
            </li>
            <li>
              <Link to="/privacy-policy"      className="legal-related-link">Privacy Policy</Link>
            </li>
            <li>
              <Link to="/disclaimer"          className="legal-related-link">Disclaimer</Link>
            </li>
          </ul>
        </nav>

      </main>
    </>
  );
}