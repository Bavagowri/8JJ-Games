// src/pages/mobile/MobileAbout/MobileAbout.jsx

import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import MobileHeader from "../../../components/mobile/MobileHeader/MobileHeader";
import MobileBottomNav from "../../../components/mobile/MobileBottomNav/MobileBottomNav";
import { useLanguage } from "../../../context/LanguageContext";
import { translate } from "../../../data/translations";
import SEO from "../../../components/SEO/SEO";
import "./MobileAbout.css";
import MobileBreadcrumb from "../../../components/mobile/MobileBreadcrumb/MobileBreadcrumb";
import {
  Gamepad2,
  Users,
  Globe,
  Target,
  Sparkles,
  Rocket,
  Dice5,
  Smartphone,
  Lock,
  BadgeCheck,
  RefreshCcw,
  MessageCircle,
  Facebook,
  Instagram,
  Send,
  Twitter,
  Phone,
} from "lucide-react";

const R2_BASE =
  import.meta.env.VITE_ASSETS_BASE_URL ||
  "https://assets.8jjgames.com";

const ABOUT_ICONS = {
  games: `${R2_BASE}/8jj_icons/icons/8jj-game-3.webp`,
  social: `${R2_BASE}/8jj_icons/icons/social.webp`,
  globe: `${R2_BASE}/8jj_icons/icons/globe-3.webp`,
  target: `${R2_BASE}/8jj_icons/icons/target.webp`,
  sparks: `${R2_BASE}/8jj_icons/icons/spark.webp`,
  rocket: `${R2_BASE}/8jj_icons/icons/rocket.webp`,
  instagram: `${R2_BASE}/8jj_icons/social-share/insta.webp`,
  fb: `${R2_BASE}/8jj_icons/social-share/fb.webp`,
  telegram: `${R2_BASE}/8jj_icons/social-share/telegram.webp`,
  x: `${R2_BASE}/8jj_icons/social-share/X.webp`,
  whatsapp: `${R2_BASE}/8jj_icons/social-share/whatsapp.webp`,

};

export default function MobileAbout() {
  const navigate = useNavigate();
  const { lang } = useLanguage();

  // JSON-LD Schema
  useEffect(() => {
    const aboutPageSchema = {
      "@context": "https://schema.org",
      "@type": "AboutPage",
      "name": "About 8JJ Games",
      "description": "Learn about 8JJ Games - your destination for free online gaming. Discover our mission, values, and commitment to providing the best browser-based gaming experience.",
      "url": "https://8jjgames.com/about",
      "mainEntity": {
        "@type": "Organization",
        "name": "8JJ Games",
        "url": "https://8jjgames.com",
        "logo": "https://8jjgames.com/8JJ_games.png",
        "description": "Free online gaming platform featuring over 1000 browser-based games.",
        "foundingDate": "2020"
      }
    };

    const schemaScript = document.createElement('script');
    schemaScript.type = 'application/ld+json';
    schemaScript.text = JSON.stringify(aboutPageSchema);
    schemaScript.id = 'mobile-about-schema';
    document.head.appendChild(schemaScript);

    return () => {
      const existingScript = document.getElementById('mobile-about-schema');
      if (existingScript) document.head.removeChild(existingScript);
    };
  }, []);

  return (
    <>
      <SEO
        title="About Us - 8JJ Games | Free Mobile Gaming"
        description="Learn about 8JJ Games, your destination for 1000+ free online games. Play instantly on mobile - no download required!"
        keywords="about 8jj games, free mobile games, online gaming platform, browser games"
        url="/about"
        type="website"
      />

      <div className="mobile-about-wrapper">
        <MobileHeader />

        <MobileBreadcrumb
          items={[
            { label: translate("home", lang) || "Home", path: "/", icon: "" },
            { label: translate("aboutz", lang) || "About", icon: "" }
          ]}
        />
        <main className="mobile-about-page">
          {/* Hero Section */}
          <section className="mobile-about-hero">
            <div className="mobile-about-hero-bg">
              <div className="mobile-about-hero-gradient"></div>
            </div>
            <div className="mobile-about-hero-content">
              <div className="mobile-about-logo-wrapper">
                <img
                  src="/8JJ_games.png"
                  alt="8JJ Games Logo"
                  className="mobile-about-logo"
                />
              </div>
              <h1 className="mobile-about-hero-title">{translate("about_welcome_title", lang) || "About 8JJ Games"}</h1>
              <p className="mobile-about-hero-subtitle">
                {translate("about_welcome_subtitle", lang) || "Your ultimate destination for free online gaming entertainment"}
              </p>
            </div>
          </section>

          {/* Stats Section */}
          <section className="mobile-about-stats">
            <div className="mobile-about-stat-card">
              <Gamepad2 className="mobile-about-stat-icon" />
              <div className="mobile-about-stat-number">1500+</div>
              <div className="mobile-about-stat-label">
                {translate("about_stat_free_games", lang) || "Free Games"}
              </div>
            </div>

            <div className="mobile-about-stat-card">
              <Users className="mobile-about-stat-icon" />
              <div className="mobile-about-stat-number">1M+</div>
              <div className="mobile-about-stat-label">
                {translate("about_stat_happy_players", lang) || "Happy Players"}
              </div>
            </div>

            <div className="mobile-about-stat-card">
              <Globe className="mobile-about-stat-icon" />
              <div className="mobile-about-stat-number">150+</div>
              <div className="mobile-about-stat-label">
                {translate("about_stat_countries", lang) || "Countries"}
              </div>
            </div>
          </section>


          {/* Story Section */}
          <section className="mobile-about-section">
            <div className="mobile-about-section-header">
              <h2 className="mobile-about-section-title">{translate("about_story_title", lang) || "Our Story"}</h2>
              <div className="mobile-about-title-underline"></div>
            </div>
            <div className="mobile-about-section-content">
              <p className="mobile-about-text">
                {translate("about_story_paragraph_1", lang) ||
                  "Founded in 2020, 8JJ Games was born from a simple passion: making quality gaming accessible to everyone, everywhere. We believe that great games shouldn't require expensive consoles, powerful computers, or lengthy downloads. Every person with an internet connection deserves access to engaging, fun, and diverse gaming experiences."}
              </p>
              <p className="mobile-about-text">
                {translate("about_story_paragraph_2", lang) ||
                  "Today, we're proud to offer over 1,000 carefully curated games across dozens of genres. From action-packed shooters to brain-teasing puzzles, relaxing casual games to competitive sports titles - we've built a library that serves gamers of all ages and preferences. Our platform has welcomed millions of players from over 150 countries, creating a truly global gaming community."}
              </p>
            </div>
          </section>

          {/* Mission Cards */}
          <section className="mobile-about-section">
            <div className="mobile-about-section-header">
              <h2 className="mobile-about-section-title">{translate("about_mission_title", lang) || "Our Mission"}</h2>
              <div className="mobile-about-title-underline"></div>
            </div>
            <div className="mobile-about-mission-grid">
              <div className="mobile-about-mission-card">
                <Target className="mobile-about-mission-icon-svg" />
                <h3 className="mobile-about-mission-title">
                  {translate("about_mission_accessibility_title", lang) || "Accessibility First"}
                </h3>
                <p className="mobile-about-mission-text">
                  {translate("about_mission_accessibility_text", lang)}
                </p>
              </div>

              <div className="mobile-about-mission-card">
                <Sparkles className="mobile-about-mission-icon-svg" />
                <h3 className="mobile-about-mission-title">
                  {translate("about_mission_quality_title", lang) || "Quality Content"}
                </h3>
                <p className="mobile-about-mission-text">
                  {translate("about_mission_quality_text", lang)}
                </p>
              </div>

              <div className="mobile-about-mission-card">
                <Rocket className="mobile-about-mission-icon-svg" />
                <h3 className="mobile-about-mission-title">
                  {translate("about_mission_innovation_title", lang) || "Continuous Innovation"}
                </h3>
                <p className="mobile-about-mission-text">
                  {translate("about_mission_innovation_text", lang)}
                </p>
              </div>
            </div>
          </section>

          {/* Features List */}
          <section className="mobile-about-section">
            <div className="mobile-about-section-header">
              <h2 className="mobile-about-section-title">{translate("about_values_title", lang) || "What Makes Us Special"}</h2>
              <div className="mobile-about-title-underline"></div>
            </div>
            <div className="mobile-about-feature-item">
              <Dice5 className="mobile-about-feature-icon" />
              <div className="mobile-about-feature-content">
                <h3>{translate("about_value_diverse_title", lang)}</h3>
                <p>{translate("about_value_diverse_text", lang)}</p>
              </div>
            </div>

            <div className="mobile-about-feature-item">
              <Smartphone className="mobile-about-feature-icon" />
              <div className="mobile-about-feature-content">
                <h3>{translate("about_value_crossplatform_title", lang)}</h3>
                <p>{translate("about_value_crossplatform_text", lang)}</p>
              </div>
            </div>

            <div className="mobile-about-feature-item">
              <Lock className="mobile-about-feature-icon" />
              <div className="mobile-about-feature-content">
                <h3>{translate("about_value_safe_title", lang)}</h3>
                <p>{translate("about_value_safe_text", lang)}</p>
              </div>
            </div>

            <div className="mobile-about-feature-item">
              <BadgeCheck className="mobile-about-feature-icon" />
              <div className="mobile-about-feature-content">
                <h3>{translate("about_value_free_title", lang)}</h3>
                <p>{translate("about_value_free_text", lang)}</p>
              </div>
            </div>

            <div className="mobile-about-feature-item">
              <RefreshCcw className="mobile-about-feature-icon" />
              <div className="mobile-about-feature-content">
                <h3>{translate("about_value_updates_title", lang)}</h3>
                <p>{translate("about_value_updates_text", lang)}</p>
              </div>
            </div>

            <div className="mobile-about-feature-item">
              <MessageCircle className="mobile-about-feature-icon" />
              <div className="mobile-about-feature-content">
                <h3>{translate("about_value_community_title", lang)}</h3>
                <p>{translate("about_value_community_text", lang)}</p>
              </div>
            </div>
          </section>

          {/* Contact CTA */}
          <section className="mobile-about-cta">
            <div className="mobile-about-cta-content">
              <h2 className="mobile-about-cta-title">
                {translate("about_cta_title", lang) || "Ready to Start Playing?"}
              </h2>
              <p className="mobile-about-cta-text">
                {translate("about_cta_text", lang) ||
                  "Join millions of players worldwide and discover your next favorite game. It's completely free!"}
              </p>
              <div className="mobile-about-cta-buttons">
                <button
                  className="mobile-about-cta-btn primary"
                  onClick={() => navigate('/')}
                >
                  {translate("about_cta_explore", lang) || "Explore Games"}
                </button>
                <button
                  className="mobile-about-cta-btn secondary"
                  onClick={() => navigate('/contact')}
                >
                  {translate("about_cta_contact", lang) || "Contact Us"}
                </button>
              </div>
            </div>
          </section>

          {/* Social Links */}
          <section className="mobile-about-social">
            <h3 className="mobile-about-social-title">Connect With Us</h3>
            <div className="mobile-about-social-links">

              <a className="mobile-about-social-link" aria-label="Facebook">
                <Facebook />
              </a>

              <a className="mobile-about-social-link" aria-label="Instagram">
                <Instagram />
              </a>

              <a className="mobile-about-social-link" aria-label="Telegram">
                <Send />
              </a>

              <a className="mobile-about-social-link" aria-label="X">
                <Twitter />
              </a>

              <a className="mobile-about-social-link" aria-label="Whatsapp">
                <Phone />
              </a>

            </div>
          </section>

          <div className="mobile-footer-space" />
        </main>

        <MobileBottomNav />
      </div>
    </>
  );
}