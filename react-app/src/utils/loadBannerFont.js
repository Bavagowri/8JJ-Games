// react-app/src/utils/loadBannerFont.js
const loaded = new Set();

export function loadBannerFont(url) {
  if (!url || loaded.has(url)) return;
  loaded.add(url);
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = url;
  document.head.appendChild(link);
}

export const BANNER_FONTS = {
  PromoBannerGridV2:
    'https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@400;500;600;700&family=Outfit:wght@300;400;500;600;700;800&display=swap',
  CarouselCardsBannerV2:
    'https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;600;700&family=Barlow+Condensed:wght@400;600;700;800;900&family=Barlow:wght@400;500&display=swap',
  HeroBannerV2:
    'https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,700;0,900;1,700;1,900&family=Rajdhani:wght@500;600;700&family=DM+Sans:wght@300;400;500&display=swap',
  CountdownBannerV2:
    'https://fonts.googleapis.com/css2?family=Anton&family=DM+Sans:wght@300;400;500&family=Oswald:wght@400;500;600;700&display=swap',
  WideStripBannerV2:
    'https://fonts.googleapis.com/css2?family=Exo+2:wght@400;600;700;800;900&family=Share+Tech+Mono&display=swap',
  MultiPanelBannerV2:
    'https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@400;600;700;800;900&family=DM+Sans:wght@300;400;500;600&display=swap',
  SplitHeroBannerV2:
    'https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Syne+Mono&family=Inter:wght@300;400;500&display=swap',
  VideoHeroBannerV2:
    'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700;800;900&family=Nunito+Sans:wght@300;400;600;700&display=swap',
  MobileSplitBannerV2:
    'https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Syne+Mono&family=Inter:wght@300;400;500&display=swap',
  MobileCountdownBannerV2:
    'https://fonts.googleapis.com/css2?family=Anton&family=DM+Sans:wght@300;400;500&family=Oswald:wght@400;500;600;700&display=swap',
  MobilePromoScrollV2:
    'https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;600;700&family=Barlow+Condensed:wght@400;600;700;800;900&family=Barlow:wght@400;500&display=swap',
  MobileHeroBannerV2:
    'https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;900&family=Rajdhani:wght@500;700&display=swap',
  MobilePromoBannerV2:
    'https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=JetBrains+Mono:wght@400;700&family=Mulish:wght@400;600;700;900&display=swap',
  MobileStackedPromoV2:
    'https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@400;600;700;800;900&family=DM+Sans:wght@300;400;500;600&family=Orbitron:wght@600;800&display=swap',
  MobileVideoHeroBannerV2:
    'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700;800;900&family=Nunito+Sans:wght@300;400;600;700&display=swap',
};
