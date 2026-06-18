// react-app/src/components/UniversalBanner/templates/mobile/MobileRedeemBannerV2.jsx

import { useState, useCallback } from "react";
import "./MobileRedeemBannerV2.css";

export default function MobileRedeemBannerV2({ banner, slides, config, onSlideClick }) {
  const [copied, setCopied] = useState(false);

  const slide = slides?.[0] || {};

  let sc = {};
  try { sc = slide.config ? (typeof slide.config === "string" ? JSON.parse(slide.config) : slide.config) : {}; } catch(_) {}

  const {
    accentColor    = "#00ff88",
    overlayOpacity = 0.6,
  } = { ...config, ...sc };

  const promoCode = sc.promoCode || config?.promoCode || null;

  const handleCopy = useCallback(async (e) => {
    e.stopPropagation();
    if (!promoCode) return;
    try {
      await navigator.clipboard.writeText(promoCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch (_) {
      // Fallback for older browsers
      const el = document.createElement("textarea");
      el.value = promoCode;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  }, [promoCode]);

  const handleCta = useCallback((e) => {
    e.stopPropagation();
    if (!slide.cta_link) return;
    onSlideClick?.(slide.cta_link);
  }, [slide, onSlideClick]);

  if (!slides || slides.length === 0) return null;

  return (
    <div className="mrb2-wrap MobileRedeemBannerV2">
      {slide.background_image_url && (
        <img src={slide.background_image_url} alt="" className="mrb2-bg" draggable={false} />
      )}
      <div className="mrb2-overlay" style={{ opacity: overlayOpacity }} />
      <div className="mrb2-glow" style={{ background: `radial-gradient(ellipse at 80% 50%, ${accentColor}40 0%, transparent 65%)` }} />

      {/* Character */}
      {slide.logo_url && (
        <img src={slide.logo_url} alt="" className="mrb2-char" draggable={false} />
      )}

      <div className="mrb2-body">
        {slide.badge_text && (
          <span className="mrb2-badge" style={{ background: accentColor, color: "#000" }}>
            {slide.badge_text}
          </span>
        )}
        {slide.title_highlight && (
          <p className="mrb2-eyebrow" style={{ color: accentColor }}>{slide.title_highlight}</p>
        )}
        {slide.title && <h2 className="mrb2-title">{slide.title}</h2>}
        {slide.subtitle && <p className="mrb2-sub">{slide.subtitle}</p>}

        {/* Promo code display */}
        {promoCode && (
          <div className="mrb2-code-wrap" style={{ borderColor: `${accentColor}55` }}>
            <span className="mrb2-code-label">Promo Code</span>
            <div className="mrb2-code-row">
              <span className="mrb2-code" style={{ color: accentColor }}>{promoCode}</span>
              <button
                className="mrb2-copy"
                onClick={handleCopy}
                style={copied
                  ? { background: "#22c55e", color: "#000" }
                  : { background: accentColor, color: "#000" }
                }
                aria-label="Copy code"
              >
                {copied ? (
                  <>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6L9 17l-5-5"/>
                    </svg>
                    Copied!
                  </>
                ) : (
                  <>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
                    </svg>
                    Copy
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {slide.cta_text && slide.cta_link && (
          <button
            className="mrb2-cta"
            onClick={handleCta}
            style={{ background: accentColor, color: "#000" }}
          >
            {slide.cta_text}
          </button>
        )}
      </div>
    </div>
  );
}