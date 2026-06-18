// react-app/src/components/UniversalBanner/UniversalBanner.jsx

import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

// ── Desktop templates ─────────────────────────────────────────
import HeroBannerV2              from "./templates/HeroBannerV2";
import PromoBannerV2             from "./templates/PromoBannerV2";
import MultiPanelBannerV2        from "./templates/MultiPanelBannerV2";
import SplitHeroBannerV2         from "./templates/SplitHeroBannerV2";
import CountdownBannerV2         from "./templates/CountdownBannerV2";
import PromoBannerGridV2         from "./templates/PromoBannerGridV2";
import WideStripBannerV2         from "./templates/WideStripBannerV2";
import CarouselCardsBannerV2     from "./templates/CarouselCardsBannerV2";
import VideoHeroBannerV2         from "./templates/VideoHeroBannerV2";
import FloatingAnnouncementV2    from "./templates/FloatingAnnouncementV2";

// ── Mobile templates ──────────────────────────────────────────
import MobileHeroBannerV2        from "./templates/mobile/MobileHeroBannerV2";
import MobilePromoBannerV2       from "./templates/mobile/MobilePromoBannerV2";
import MobileStackedPromoV2      from "./templates/mobile/MobileStackedPromoV2";
import MobileSplitBannerV2       from "./templates/mobile/MobileSplitBannerV2";
import MobileCountdownBannerV2   from "./templates/mobile/MobileCountdownBannerV2";
import MobilePromoScrollV2       from "./templates/mobile/MobilePromoScrollV2";
import MobileAnnouncementBarV2   from "./templates/mobile/MobileAnnouncementBarV2";
import MobileRedeemBannerV2      from "./templates/mobile/MobileRedeemBannerV2";
import MobileVideoHeroBannerV2   from "./templates/mobile/MobileVideoHeroBannerV2";
import MobilePopupBannerV2       from "./templates/mobile/MobilePopupBannerV2";

import useIsMobile from "../../hooks/useIsMobile";

const API_BASE = import.meta.env.VITE_API_URL;

async function fetchBannerForPlacement(placementKey) {
  const res = await fetch(`${API_BASE}/api/banners/placement/${placementKey}`);
  if (!res.ok) throw new Error(`Banner fetch failed: ${res.status}`);
  return res.json();
}

/* ─────────────────────────────────────────────────────────────
   Props:
     placementKey      — required e.g. "home_hero"
     fallbackComponent — rendered when no active banner exists
     className         — optional wrapper class string
   ───────────────────────────────────────────────────────────── */
export default function UniversalBanner({
  placementKey,
  fallbackComponent = null,
  className = "",
}) {
  const navigate   = useNavigate();
  const isMobile   = useIsMobile();
  const [banner,  setBanner]  = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!placementKey) { setLoading(false); return; }
    let cancelled = false;

    (async () => {
      try {
        const data = await fetchBannerForPlacement(placementKey);
        if (!cancelled && data) setBanner(data);
      } catch (err) {
        console.warn(`[UniversalBanner] ${placementKey}:`, err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [placementKey]);

  const handleSlideClick = useCallback((target) => {
    if (!target) return;
    if (/^\d+$/.test(String(target))) navigate(`/game/${target}`);
    else if (target.startsWith("http")) window.open(target, "_blank", "noopener");
    else navigate(target);
  }, [navigate]);

  if (loading) return null;
  if (!banner)  return fallbackComponent || null;

  const config       = banner.config       || {};
  const templateType = banner.template_type;

  const props = {
    banner,
    slides:       banner.slides || [],
    config,
    onSlideClick: handleSlideClick,
  };

  // ── Floating / Popup types render outside layout flow ───────
  // These are fixed/absolute positioned — className wrapper not needed
  if (templateType === "floating_announcement") {
    return <FloatingAnnouncementV2 {...props} />;
  }
  if (templateType === "popup" && isMobile) {
    return <MobilePopupBannerV2 {...props} />;
  }

  // ── Mobile templates ─────────────────────────────────────────
  if (isMobile) {
    switch (templateType) {
      case "hero":             return <div className={className}><MobileHeroBannerV2       {...props} /></div>;
      case "promo":            return <div className={className}><MobilePromoBannerV2      {...props} /></div>;
      case "multi_panel":      return <div className={className}><MobileStackedPromoV2     {...props} /></div>;
      case "split_hero":       return <div className={className}><MobileSplitBannerV2      {...props} /></div>;
      case "countdown":        return <div className={className}><MobileCountdownBannerV2  {...props} /></div>;
      case "promo_grid":       return <div className={className}><MobilePromoScrollV2      {...props} /></div>;
      case "wide_strip":       return <div className={className}><WideStripBannerV2        {...props} /></div>;
      case "carousel_cards":   return <div className={className}><MobilePromoScrollV2      {...props} /></div>;
      case "video_hero":       return <div className={className}><MobileVideoHeroBannerV2  {...props} /></div>;
      case "announcement_bar": return <div className={className}><MobileAnnouncementBarV2  {...props} /></div>;
      case "redeem":           return <div className={className}><MobileRedeemBannerV2     {...props} /></div>;
      default: break;
    }
  }

  // ── Desktop templates ─────────────────────────────────────────
  switch (templateType) {
    case "hero":             return <div className={className}><HeroBannerV2           {...props} /></div>;
    case "promo":            return <div className={className}><PromoBannerV2          {...props} /></div>;
    case "multi_panel":      return <div className={className}><MultiPanelBannerV2     {...props} /></div>;
    case "split_hero":       return <div className={className}><SplitHeroBannerV2      {...props} /></div>;
    case "countdown":        return <div className={className}><CountdownBannerV2      {...props} /></div>;
    case "promo_grid":       return <div className={className}><PromoBannerGridV2      {...props} /></div>;
    case "wide_strip":       return <div className={className}><WideStripBannerV2      {...props} /></div>;
    case "carousel_cards":   return <div className={className}><CarouselCardsBannerV2  {...props} /></div>;
    case "video_hero":       return <div className={className}><VideoHeroBannerV2      {...props} /></div>;
    case "announcement_bar": return <div className={className}><WideStripBannerV2      {...props} /></div>;
    case "redeem":           return <div className={className}><PromoBannerV2          {...props} /></div>;
    default:
      console.warn(`[UniversalBanner] Unknown template_type: "${templateType}"`);
      return fallbackComponent || null;
  }
}