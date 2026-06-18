// react-app/src/components/MultiPanelBannerHardcoded/MultiPanelBannerHardcoded.jsx

import { useCallback, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import { translate } from "../../data/translations";
import "../UniversalBanner/templates/MultiPanelBannerV2.css";
import { loadBannerFont, BANNER_FONTS } from "../../utils/loadBannerFont";

const R2_BASE =
  import.meta.env.VITE_ASSETS_BASE_URL ||
  "https://assets.8jjgames.com";

const CONFIG = {
  maxPanels:    3,
  gap:          14,
  borderRadius: 16,
  cardHeight:   280,
  overflowTop:  60,
};

export default function MultiPanelBannerHardcoded() {
  useEffect(() => {
    loadBannerFont(BANNER_FONTS.MultiPanelBannerV2);
  }, []);


  

  const navigate       = useNavigate();
  const { lang }       = useLanguage();
  const [hovered, setHovered] = useState(null);

  const { maxPanels = 3, gap = 14, borderRadius = 16, cardHeight = 280, overflowTop = 60 } = CONFIG;

  // Panels are built at render time so translations are always fresh
  const PANELS = [
    {
      id:                   1,
      accentColor:          "#ff6b35",
      background_image_url: `${R2_BASE}/images/DONGGDONI1.webp`,
      logo_url:             `${R2_BASE}/images/BANDoni03.webp`,
      bgColor:              "#050d1a",
      title_highlight:      translate("mpb_featured",              lang),
      badge_text:           translate("mpb_new_release",           lang),
      title:                translate("mpb_shadow_realm_title",    lang),
      subtitle:             translate("mpb_shadow_realm_subtitle", lang),
      cta_text:             translate("mpb_predict_now",              lang),
      cta_link:             "/predictions",
    },
    {
      id:                   2,
      accentColor:          "#b87cff",
      background_image_url: `${R2_BASE}/images/BANNMID01.webp`,
      logo_url:             `${R2_BASE}/images/BANKoli01.webp`,
      bgColor:              "#120800",
      title_highlight:      translate("mpb_hot_pick",              lang),
      badge_text:           translate("mpb_top_rated",             lang),
      title:                translate("mpb_neon_striker_title",    lang),
      subtitle:             translate("mpb_neon_striker_subtitle", lang),
      cta_text:             translate("mpb_predict_now",              lang),
      cta_link:             "/predictions",
    },
    {
      id:                   3,
      accentColor:          "#00e5ff",
      background_image_url: `${R2_BASE}/images/BANNTWO22.webp`,
      logo_url:             `${R2_BASE}/images/BANBura03.webp`,
      bgColor:              "#0a0514",
      title_highlight:      translate("mpb_exclusive",             lang),
      badge_text:           translate("mpb_limited_time",          lang),
      title:                translate("mpb_void_runner_title",     lang),
      subtitle:             translate("mpb_void_runner_subtitle",  lang),
      cta_text:             translate("mpb_predict_now",              lang),
      cta_link:             "/predictions",
    },
  ];

  const handleCta = useCallback((panel, e) => {
    e?.stopPropagation();
    if (!panel.cta_link) return;
    if (panel.cta_link.startsWith("http")) {
      window.open(panel.cta_link, "_blank", "noopener");
    } else {
      navigate(panel.cta_link);
    }
  }, [navigate]);

  const panels = PANELS.slice(0, maxPanels);

  return (
    <div
      className="mpb2-stage MultiPanelBannerV2"
      style={{
        "--gap":      `${gap}px`,
        "--radius":   `${borderRadius}px`,
        "--ch":       `${cardHeight}px`,
        "--overflow": `${overflowTop}px`,
        paddingTop:   `${overflowTop}px`,
        gap:          `${gap}px`,
      }}
    >
      {panels.map((panel, i) => {
        const accent  = panel.accentColor || "#00e5ff";
        const bgImg   = panel.background_image_url;
        const charImg = panel.logo_url;
        const isLarge = panels.length === 3 && i === 0;
        const isHov   = hovered === i;

        return (
          <div
            key={panel.id}
            className={`mpb2-panel${isLarge ? " mpb2-panel--large" : ""}${isHov ? " mpb2-panel--hov" : ""}`}
            style={{ "--accent": accent }}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            onClick={(e) => handleCta(panel, e)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && handleCta(panel, e)}
            aria-label={panel.title || `Panel ${i + 1}`}
          >
            <div className="mpb2-card">
              {bgImg && (
                <img src={bgImg} alt="" className="mpb2-bg" draggable={false} />
              )}
              <div
                className="mpb2-bg-fallback"
                style={{ background: panel.bgColor || "#050d1a" }}
              />

              <div className="mpb2-ov-base" />
              <div className="mpb2-ov-left" />
              <div className="mpb2-scanlines" />
              <div className="mpb2-slash" />
              <div className="mpb2-shimmer" />

              <div className="mpb2-content">
                {panel.title_highlight && (
                  <div className="mpb2-eyebrow-wrap">
                    <span className="mpb2-eyebrow">{panel.title_highlight}</span>
                  </div>
                )}

                <div className="mpb2-text-block">
                  {panel.badge_text && (
                    <div className="mpb2-badge">
                      <span className="mpb2-badge-pip" />
                      <span className="mpb2-badge-text">{panel.badge_text}</span>
                    </div>
                  )}

                  {panel.title && (
                    <h3 className="mpb2-title">{panel.title}</h3>
                  )}

                  {panel.subtitle && (
                    <p className="mpb2-sub">{panel.subtitle}</p>
                  )}

                  {panel.cta_text && panel.cta_link && (
                    <button
                      className="mpb2-ctaz"
                      onClick={(e) => handleCta(panel, e)}
                    >
                      <div className="mpb2-cta-inner-row">
                        <span className="mpb2-cta-label">{panel.cta_text}</span>
                        <svg
                          className="mpb2-cta-arrow"
                          width="14" height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M5 12h14M13 6l6 6-6 6" />
                        </svg>
                      </div>
                      <span className="mpb2-cta-line" />
                    </button>
                  )}
                </div>
              </div>

              <div className="mpb2-char-glow" />
            </div>

            {charImg && (
              <img
                src={charImg}
                alt=""
                className={`mpb2-charz${isHov ? " mpb2-char--hov" : ""}`}
                draggable={false}
              />
            )}

            <div className="mpb2-podium" />
          </div>
        );
      })}
    </div>
  );
}





