// react-app/src/components/UniversalBanner/templates/PromoBannerGridV2.jsx

import { useCallback, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./PromoBannerGridV2.css";
import { loadBannerFont, BANNER_FONTS } from '../../../utils/loadBannerFont';

export default function PromoBannerGridV2({ banner, slides, config, onSlideClick }) {
  useEffect(() => { loadBannerFont(BANNER_FONTS.PromoBannerGridV2); }, []);
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(null);
  const [pressed, setPressed] = useState(null);

  const {
    gap          = 16,
    borderRadius = 14,
    cardHeight   = 190,
  } = config || {};

  // Use ALL slides — no artificial cap
  const cards = slides || [];
  const n     = cards.length;

  const handleClick = useCallback((slide, e) => {
    e?.stopPropagation();
    if (!slide.cta_link) return;
    onSlideClick?.(slide.cta_link);
    slide.cta_link.startsWith("http")
      ? window.open(slide.cta_link, "_blank", "noopener")
      : navigate(slide.cta_link);
  }, [navigate, onSlideClick]);

  const handlePress = (id) => {
    setPressed(id);
    setTimeout(() => setPressed(null), 200);
  };

  if (!n) return null;

  const h  = cardHeight;
  const h2 = Math.round(h * 0.48);  // half-row height (with gap)
  const gv = `${gap}px`;            // gap shorthand

  // ─────────────────────────────────────────────────
  // Card factory — renders a single card with all
  // inner content. Shared by every layout branch.
  // ─────────────────────────────────────────────────
  const renderCard = (slide, i, extraClass = "", extraStyle = {}, sizeClass = "") => {
    let sc = {};
    try {
      sc = slide.config
        ? (typeof slide.config === "string" ? JSON.parse(slide.config) : slide.config)
        : {};
    } catch (_) {}

    const accent       = sc.accentColor || "#00e5ff";
    const urgencyLabel = sc.urgencyLabel || null;
    const statLabel    = sc.statLabel    || null;
    const cardId       = slide.id != null ? slide.id : i;
    const isHov        = hovered === cardId;
    const isPrs        = pressed === cardId;

    return (
      <div
        key={cardId}
        className={`pbg2-card${extraClass ? ` ${extraClass}` : ""}${sizeClass ? ` ${sizeClass}` : ""}${isHov ? " pbg2-card--hov" : ""}${isPrs ? " pbg2-card--press" : ""}`}
        style={{ "--accent": accent, ...extraStyle }}
        onClick={(e) => { handleClick(slide, e); handlePress(cardId); }}
        onMouseEnter={() => setHovered(cardId)}
        onMouseLeave={() => setHovered(null)}
        onMouseDown={() => handlePress(cardId)}
        onTouchStart={() => handlePress(cardId)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && handleClick(slide, e)}
        aria-label={slide.title || `Promo card ${i + 1}`}
      >
        {(slide.background_image_url || slide.background) && (
          <img src={slide.background_image_url || slide.background} alt=""
            className="pbg2-bg" draggable={false} loading={i < 3 ? "eager" : "lazy"} />
        )}
        <div className="pbg2-bg-fallback" style={{ background: sc.bgColor || "#050d1a" }} />
        <div className="pbg2-ov-base" />
        <div className="pbg2-ov-left" />
        <div className="pbg2-scanlines" />
        <div className="pbg2-accent-glow" />
        <div className="pbg2-shimmer" />
        {slide.logo_url && (
          <img src={slide.logo_url} alt="" className="pbg2-char" draggable={false} />
        )}
        <div className="pbg2-cut-corner" />
        <div className="pbg2-content">
          <div className="pbg2-badge-row">
            {slide.badge_text && (
              <div className="pbg2-badge">
                <span className="pbg2-badge-pip" />
                <span className="pbg2-badge-text">{slide.badge_text}</span>
              </div>
            )}
            {urgencyLabel && (
              <div className="pbg2-urgency">
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
                </svg>
                {urgencyLabel}
              </div>
            )}
          </div>
          {slide.title    && <h3 className="pbg2-title">{slide.title}</h3>}
          {slide.subtitle && <p  className="pbg2-sub">{slide.subtitle}</p>}
          <div className="pbg2-footer">
            {statLabel && (
              <span className="pbg2-stat">
                <span className="pbg2-stat-dot" />
                {statLabel}
              </span>
            )}
            {slide.cta_text && slide.cta_link && (
              <button className="pbg2-cta" onClick={(e) => handleClick(slide, e)}>
                <span className="pbg2-cta-fill" />
                <span className="pbg2-cta-inner">
                  <span className="pbg2-cta-text">{slide.cta_text}</span>
                  <svg className="pbg2-cta-arrow" width="11" height="11"
                    viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M13 6l6 6-6 6"/>
                  </svg>
                </span>
              </button>
            )}
          </div>
        </div>
        <div className="pbg2-left-bar" />
      </div>
    );
  };

  // ─────────────────────────────────────────────────
  // LAYOUT ENGINE
  // Each branch renders its own JSX structure —
  // using flex/grid sub-containers where CSS Grid
  // alone cannot express the required layout.
  // ─────────────────────────────────────────────────

  // ── n=1: Full-width single hero ──────────────────
  if (n === 1) {
    return (
      <div className="pbg2-grid PromoBannerGridV2"
        style={{ "--gap": gv, "--radius": `${borderRadius}px`, "--ch": `${h}px`, margin: "20px 0" }}>
        {renderCard(cards[0], 0, "pbg2-card--feature", { height: h }, "pbg2-sz-hero")}
      </div>
    );
  }

  // ── n=2: 70/30 horizontal split ──────────────────
  if (n === 2) {
    return (
      <div className="pbg2-grid PromoBannerGridV2"
        style={{ "--gap": gv, "--radius": `${borderRadius}px`, "--ch": `${h}px`,
          display: "flex", gap: gv, margin: "20px 0" }}>
        {renderCard(cards[0], 0, "pbg2-card--feature", { flex: "7", height: h }, "pbg2-sz-hero")}
        {renderCard(cards[1], 1, "",                   { flex: "3", height: h }, "pbg2-sz-mid")}
      </div>
    );
  }

  // ── n=3: Equal 33/33/33 with staggered depth ─────
  // Cards side-by-side with translateY offsets giving
  // a carousel/stacked depth illusion.
  if (n === 3) {
    return (
      <div className="pbg2-grid PromoBannerGridV2 pbg2-stagger-wrap"
        style={{ "--gap": gv, "--radius": `${borderRadius}px`, "--ch": `${h}px`,
          display: "flex", gap: gv, alignItems: "flex-start",
          paddingBottom: "24px", margin: "20px 0" }}>
        {renderCard(cards[0], 0, "pbg2-stagger-0", { flex: "1", height: h }, "pbg2-sz-mid")}
        {renderCard(cards[1], 1, "pbg2-stagger-1", { flex: "1", height: h, zIndex: 2 }, "pbg2-sz-hero")}
        {renderCard(cards[2], 2, "pbg2-stagger-2", { flex: "1", height: h }, "pbg2-sz-mid")}
      </div>
    );
  }

  // ── n=4: 60/40 — left 1 hero | right: top 2×50 + bottom 1 ──
  //
  //  ┌──────────────┬────────┬────────┐
  //  │              │  [1]   │  [2]   │
  //  │    [0]       ├────────┴────────┤
  //  │              │      [3]        │
  //  └──────────────┴─────────────────┘
  if (n === 4) {
    return (
      <div className="pbg2-grid PromoBannerGridV2"
        style={{ "--gap": gv, "--radius": `${borderRadius}px`, "--ch": `${h}px`,
          display: "flex", gap: gv, margin: "20px 0" }}>
        {/* Left: single tall hero */}
        {renderCard(cards[0], 0, "pbg2-card--feature", { flex: "6", height: h * 2 + gap }, "pbg2-sz-hero")}
        {/* Right column sub-grid */}
        <div style={{ flex: "4", display: "flex", flexDirection: "column", gap: gv }}>
          {/* Top row: 2 equal small cards */}
          <div style={{ display: "flex", gap: gv, flex: "1" }}>
            {renderCard(cards[1], 1, "", { flex: "1", height: h }, "pbg2-sz-sm")}
            {renderCard(cards[2], 2, "", { flex: "1", height: h }, "pbg2-sz-sm")}
          </div>
          {/* Bottom row: 1 full-width mid card */}
          {renderCard(cards[3], 3, "", { height: h }, "pbg2-sz-mid")}
        </div>
      </div>
    );
  }

  // ── n=5: 50/50 — left 1 hero | right 2×2 grid ───
  //
  //  ┌──────────────┬────────┬────────┐
  //  │              │  [1]   │  [2]   │
  //  │    [0]       ├────────┼────────┤
  //  │              │  [3]   │  [4]   │
  //  └──────────────┴────────┴────────┘
  if (n === 5) {
    return (
      <div className="pbg2-grid PromoBannerGridV2"
        style={{ "--gap": gv, "--radius": `${borderRadius}px`, "--ch": `${h}px`,
          display: "flex", gap: gv, margin: "20px 0" }}>
        {/* Left hero */}
        {renderCard(cards[0], 0, "pbg2-card--feature", { flex: "1", height: h * 2 + gap }, "pbg2-sz-hero")}
        {/* Right 2×2 sub-grid */}
        <div style={{ flex: "1", display: "grid",
          gridTemplateColumns: "1fr 1fr", gridTemplateRows: `${h}px ${h}px`, gap: gv }}>
          {cards.slice(1).map((s, j) => renderCard(s, j + 1, "", {}, "pbg2-sz-mid"))}
        </div>
      </div>
    );
  }

  // ── n=6: 60/40 — left 1 hero | right: top 3 unequal + bottom 2 equal ──
  //
  //  ┌──────────────┬──────┬────────┬──────┐
  //  │              │ [1]  │  [2]   │ [3]  │
  //  │    [0]       ├──────┴──┬─────┴──────┤
  //  │              │   [4]   │    [5]     │
  //  └──────────────┴─────────┴────────────┘
  if (n === 6) {
    return (
      <div className="pbg2-grid PromoBannerGridV2"
        style={{ "--gap": gv, "--radius": `${borderRadius}px`, "--ch": `${h}px`,
          display: "flex", gap: gv, margin: "20px 0" }}>
        {/* Left hero */}
        {renderCard(cards[0], 0, "pbg2-card--feature", { flex: "6", height: h * 2 + gap }, "pbg2-sz-hero")}
        {/* Right column */}
        <div style={{ flex: "4", display: "flex", flexDirection: "column", gap: gv }}>
          {/* Top row: 3 unequal ~30/40/30 — small cards */}
          <div style={{ display: "flex", gap: gv, height: h }}>
            {renderCard(cards[1], 1, "", { flex: "3", height: h }, "pbg2-sz-sm")}
            {renderCard(cards[2], 2, "", { flex: "4", height: h }, "pbg2-sz-sm")}
            {renderCard(cards[3], 3, "", { flex: "3", height: h }, "pbg2-sz-sm")}
          </div>
          {/* Bottom row: 2 equal — mid cards */}
          <div style={{ display: "flex", gap: gv, height: h }}>
            {renderCard(cards[4], 4, "", { flex: "1", height: h }, "pbg2-sz-mid")}
            {renderCard(cards[5], 5, "", { flex: "1", height: h }, "pbg2-sz-mid")}
          </div>
        </div>
      </div>
    );
  }

  // ── n=7: 60/40 — left hero | right: top 3 equal + bottom 2 unequal (40/60) ──
  //
  //  ┌──────────────┬────────┬──────────┬───────┐
  //  │              │  [1]   │   [2]    │  [3]  │
  //  │    [0]       ├────────┴──┬───────┴───────┤
  //  │              │   [4]     │      [5,6]    │  <- [5] 40%, [6] 60%
  //  └──────────────┴───────────┴───────────────┘
  if (n === 7) {
    return (
      <div className="pbg2-grid PromoBannerGridV2"
        style={{ "--gap": gv, "--radius": `${borderRadius}px`, "--ch": `${h}px`,
          display: "flex", gap: gv, margin: "20px 0" }}>
        {/* Left hero */}
        {renderCard(cards[0], 0, "pbg2-card--feature", { flex: "6", height: h * 2 + gap }, "pbg2-sz-hero")}
        {/* Right column */}
        <div style={{ flex: "4", display: "flex", flexDirection: "column", gap: gv }}>
          {/* Top row: 3 equal small cards */}
          <div style={{ display: "flex", gap: gv, height: h }}>
            {renderCard(cards[1], 1, "", { flex: "1", height: h }, "pbg2-sz-sm")}
            {renderCard(cards[2], 2, "", { flex: "1", height: h }, "pbg2-sz-sm")}
            {renderCard(cards[3], 3, "", { flex: "1", height: h }, "pbg2-sz-sm")}
          </div>
          {/* Bottom row: 40/60 mid cards */}
          <div style={{ display: "flex", gap: gv, height: h }}>
            {renderCard(cards[4], 4, "", { flex: "4", height: h }, "pbg2-sz-mid")}
            {renderCard(cards[5], 5, "", { flex: "6", height: h }, "pbg2-sz-mid")}
          </div>
        </div>
      </div>
    );
  }

  // ── n=8+: 3-col auto grid fallback ───────────────
  return (
    <div className="pbg2-grid PromoBannerGridV2"
      style={{ "--gap": gv, "--radius": `${borderRadius}px`, "--ch": `${h}px`,
        display: "grid", gridTemplateColumns: "1fr 1fr 1fr",
        gridAutoRows: `${h}px`, gap: gv, margin: "20px 0" }}>
      {cards.map((slide, i) => {
        let sc = {};
        try { sc = slide.config ? (typeof slide.config === "string" ? JSON.parse(slide.config) : slide.config) : {}; } catch (_) {}
        return renderCard(slide, i, "", { "--accent": sc.accentColor || "#00e5ff" }, "pbg2-sz-mid");
      })}
    </div>
  );

}
