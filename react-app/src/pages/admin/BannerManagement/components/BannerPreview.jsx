
// // react-app/src/pages/admin/BannerManagement/components/BannerPreview.jsx
// import { X, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
// import { useState } from 'react';

// const TEMPLATE_LABELS = {
//   hero:                  '🎠 Hero Carousel',
//   promo:                 '🎯 Promo Banner',
//   multi_panel:           '🪟 Multi-Panel',
//   split_hero:            '⬛ Split Hero',
//   countdown:             '⏱ Countdown',
//   promo_grid:            '🔲 Promo Grid',
//   wide_strip:            '📣 Wide Strip',
//   carousel_cards:        '🃏 Carousel Cards',
//   video_hero:            '🎬 Video Hero',
//   floating_announcement: '💬 Floating Announcement',
//   announcement_bar:      '📢 Announcement Bar',
//   redeem:                '🎟 Redeem Banner',
//   popup:                 '🪄 Popup Banner',
// };

// export default function BannerPreview({ formData, templates, placements, onClose, onConfirm }) {
//   const [currentSlide, setCurrentSlide] = useState(0);
//   const slides  = formData.slides  || [];
//   const total   = slides.length;
//   const current = slides[currentSlide] || {};

//   const template  = templates.find(t => t.id === formData.template_id);
//   const placement = placements.find(p => p.id === formData.placement_id);

//   const getConfigValue = (slide, key) => {
//     try {
//       const cfg = slide.config
//         ? (typeof slide.config === 'string' ? JSON.parse(slide.config) : slide.config)
//         : {};
//       return cfg[key] || null;
//     } catch(_) { return null; }
//   };

//   const accentColor = formData.config?.accentColor || '#00ff88';

//   return (
//     <div
//       style={{
//         position: 'fixed',
//         inset: 0,
//         background: 'rgba(0,0,0,0.85)',
//         backdropFilter: 'blur(6px)',
//         zIndex: 9999,
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center',
//         padding: 24,
//       }}
//       onClick={onClose}
//     >
//       <div
//         style={{
//           background: '#0d1627',
//           borderRadius: 20,
//           width: '100%',
//           maxWidth: 760,
//           maxHeight: '90vh',
//           overflow: 'hidden',
//           display: 'flex',
//           flexDirection: 'column',
//           border: '1px solid rgba(255,255,255,0.08)',
//           boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
//         }}
//         onClick={e => e.stopPropagation()}
//       >
//         {/* Header */}
//         <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
//           <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
//             <Eye size={18} style={{ color: '#00d9ff' }} />
//             <span style={{ fontWeight: 600, color: '#fff' }}>Banner Preview</span>
//           </div>
//           <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.5)', padding: 4 }}>
//             <X size={20} />
//           </button>
//         </div>

//         {/* Meta info */}
//         <div style={{ padding: '12px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: 16, flexWrap: 'wrap' }}>
//           <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>
//             <span style={{ color: 'rgba(255,255,255,0.25)' }}>Banner: </span>
//             <span style={{ color: '#fff', fontWeight: 500 }}>{formData.name || '—'}</span>
//           </div>
//           <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>
//             <span style={{ color: 'rgba(255,255,255,0.25)' }}>Template: </span>
//             <span style={{ color: '#00d9ff', fontWeight: 500 }}>{TEMPLATE_LABELS[formData.template_type] || template?.name || '—'}</span>
//           </div>
//           {placement && (
//             <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>
//               <span style={{ color: 'rgba(255,255,255,0.25)' }}>Placement: </span>
//               <span style={{ color: '#00ff88', fontWeight: 500 }}>{placement.name}</span>
//             </div>
//           )}
//           <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>
//             <span style={{ color: 'rgba(255,255,255,0.25)' }}>Slides: </span>
//             <span style={{ color: '#fff', fontWeight: 500 }}>{total}</span>
//           </div>
//         </div>

//         {/* Slide preview */}
//         <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
//           {slides.length === 0 ? (
//             <div style={{ textAlign: 'center', padding: '60px 20px', color: 'rgba(255,255,255,0.3)' }}>
//               <Eye size={40} style={{ opacity: 0.2, marginBottom: 12 }} />
//               <p>No slides configured yet</p>
//             </div>
//           ) : (
//             <>
//               {/* Slide visual */}
//               <div style={{
//                 position: 'relative',
//                 borderRadius: 14,
//                 overflow: 'hidden',
//                 height: 260,
//                 background: '#111',
//                 marginBottom: 16,
//               }}>
//                 {current.background_image_url ? (
//                   <img
//                     src={current.background_image_url}
//                     alt=""
//                     style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
//                     onError={e => { e.target.style.display = 'none'; }}
//                   />
//                 ) : (
//                   <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #0d1b2a, #1a3a5c)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//                     <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 13 }}>No background image set</span>
//                   </div>
//                 )}

//                 {/* Overlay */}
//                 <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.3) 60%, transparent 100%)' }} />

//                 {/* Character */}
//                 {current.logo_url && (
//                   <img
//                     src={current.logo_url}
//                     alt=""
//                     style={{ position: 'absolute', right: 16, bottom: 0, height: '90%', objectFit: 'contain' }}
//                     onError={e => { e.target.style.display = 'none'; }}
//                   />
//                 )}

//                 {/* Content overlay */}
//                 <div style={{ position: 'absolute', bottom: 0, left: 0, padding: '16px 20px' }}>
//                   {current.badge_text && (
//                     <div style={{ display: 'inline-block', background: accentColor, color: '#000', fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 4, marginBottom: 6, letterSpacing: 0.5 }}>
//                       {current.badge_text}
//                     </div>
//                   )}
//                   {current.title_highlight && (
//                     <div style={{ fontSize: 12, color: accentColor, marginBottom: 4 }}>{current.title_highlight}</div>
//                   )}
//                   {current.title && (
//                     <div style={{ fontSize: 22, fontWeight: 800, color: '#fff', lineHeight: 1.2, marginBottom: 6 }}>{current.title}</div>
//                   )}
//                   {current.subtitle && (
//                     <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', marginBottom: 10, maxWidth: 320 }}>{current.subtitle}</div>
//                   )}
//                   {current.cta_text && (
//                     <div style={{ display: 'inline-block', background: accentColor, color: '#000', fontSize: 12, fontWeight: 700, padding: '7px 16px', borderRadius: 6 }}>
//                       {current.cta_text}
//                     </div>
//                   )}
//                 </div>

//                 {/* Video/Code indicators */}
//                 {getConfigValue(current, 'videoUrl') && (
//                   <div style={{ position: 'absolute', top: 10, left: 10, background: 'rgba(0,0,0,0.6)', borderRadius: 4, padding: '3px 8px', fontSize: 11, color: '#fff' }}>
//                     🎬 Video
//                   </div>
//                 )}
//                 {getConfigValue(current, 'promoCode') && (
//                   <div style={{ position: 'absolute', top: 10, left: 10, background: `${accentColor}20`, border: `1px solid ${accentColor}50`, borderRadius: 4, padding: '3px 8px', fontSize: 11, color: accentColor, fontFamily: 'monospace', fontWeight: 700 }}>
//                     {getConfigValue(current, 'promoCode')}
//                   </div>
//                 )}

//                 {/* Slide counter */}
//                 {total > 1 && (
//                   <div style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(0,0,0,0.5)', borderRadius: 6, padding: '3px 8px', fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>
//                     {currentSlide + 1} / {total}
//                   </div>
//                 )}
//               </div>

//               {/* Slide navigation */}
//               {total > 1 && (
//                 <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 16 }}>
//                   <button
//                     onClick={() => setCurrentSlide(s => Math.max(s - 1, 0))}
//                     disabled={currentSlide === 0}
//                     style={{ padding: '6px 12px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12 }}
//                   >
//                     <ChevronLeft size={14} /> Prev
//                   </button>
//                   <div style={{ display: 'flex', gap: 6 }}>
//                     {slides.map((_, i) => (
//                       <button
//                         key={i}
//                         onClick={() => setCurrentSlide(i)}
//                         style={{ width: i === currentSlide ? 20 : 8, height: 8, borderRadius: 4, border: 'none', background: i === currentSlide ? accentColor : 'rgba(255,255,255,0.2)', cursor: 'pointer', transition: 'all 0.2s', padding: 0 }}
//                       />
//                     ))}
//                   </div>
//                   <button
//                     onClick={() => setCurrentSlide(s => Math.min(s + 1, total - 1))}
//                     disabled={currentSlide === total - 1}
//                     style={{ padding: '6px 12px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12 }}
//                   >
//                     Next <ChevronRight size={14} />
//                   </button>
//                 </div>
//               )}

//               {/* Slide data table */}
//               <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: '14px 16px', fontSize: 12 }}>
//                 <div style={{ color: 'rgba(255,255,255,0.4)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10, fontSize: 11 }}>
//                   Slide {currentSlide + 1} Data
//                 </div>
//                 {[
//                   ['Title',      current.title],
//                   ['Eyebrow',    current.title_highlight],
//                   ['Subtitle',   current.subtitle],
//                   ['Badge',      current.badge_text],
//                   ['CTA Text',   current.cta_text],
//                   ['CTA Link',   current.cta_link],
//                   ['BG Image',   current.background_image_url ? '✓ Set' : null],
//                   ['Char Image', current.logo_url ? '✓ Set' : null],
//                   ['Video URL',  getConfigValue(current, 'videoUrl')],
//                   ['Promo Code', getConfigValue(current, 'promoCode')],
//                   ['targetDate', getConfigValue(current, 'targetDate')],
//                 ].filter(([, v]) => v).map(([label, val]) => (
//                   <div key={label} style={{ display: 'flex', gap: 8, padding: '4px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
//                     <span style={{ color: 'rgba(255,255,255,0.35)', minWidth: 90 }}>{label}</span>
//                     <span style={{ color: 'rgba(255,255,255,0.75)', wordBreak: 'break-all' }}>{val}</span>
//                   </div>
//                 ))}
//               </div>
//             </>
//           )}
//         </div>

//         {/* Footer */}
//         <div style={{ padding: '14px 20px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
//           <button onClick={onClose}
//             style={{ padding: '9px 20px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff', cursor: 'pointer', fontSize: 13 }}>
//             Close
//           </button>
//           {onConfirm && (
//             <button onClick={onConfirm}
//               style={{ padding: '9px 20px', background: 'linear-gradient(135deg, #00d9ff, #2b7ae2)', border: 'none', borderRadius: 8, color: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: 13 }}>
//               Save Banner
//             </button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }




// react-app/src/pages/admin/BannerManagement/components/BannerPreview.jsx
//
// BUG FIX — Accent color was hardcoded to '#00ff88' fallback because:
//   1. formData.config?.accentColor was empty (banner config not yet saved)
//   2. Per-slide accentColor set in StepSlides is stored in slide.config.accentColor
//      but was never read here
//
// FIX: Read accent color priority:
//   slide.config.accentColor  (per-slide override)
//   → formData.config.accentColor  (banner-level config from StepConfiguration)
//   → '#00d9ff'  (neutral cyan, NOT hardcoded green)

import { X, Eye, ChevronLeft, ChevronRight, Layers, BarChart2 } from 'lucide-react';
import { useState } from 'react';

const TEMPLATE_LABELS = {
  hero:                  '🎠 Hero Carousel',
  promo:                 '🎯 Promo Banner',
  multi_panel:           '🪟 Multi-Panel',
  split_hero:            '⬛ Split Hero',
  countdown:             '⏱ Countdown',
  promo_grid:            '🔲 Promo Grid',
  wide_strip:            '📣 Wide Strip',
  carousel_cards:        '🃏 Carousel Cards',
  video_hero:            '🎬 Video Hero',
  floating_announcement: '💬 Floating Announcement',
  announcement_bar:      '📢 Announcement Bar',
  redeem:                '🎟 Redeem Banner',
  popup:                 '🪄 Popup Banner',
};

// Safely parse a slide's config JSON into an object
function parseSlideConfig(slide) {
  if (!slide?.config) return {};
  if (typeof slide.config === 'object') return slide.config;
  try { return JSON.parse(slide.config); } catch { return {}; }
}

export default function BannerPreview({ formData, templates, placements, onClose, onConfirm }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides  = formData.slides || [];
  const total   = slides.length;
  const current = slides[currentSlide] || {};

  const template  = templates.find(t => t.id === formData.template_id);
  const placement = placements.find(p => p.id === formData.placement_id);

  // ── ACCENT COLOR FIX ────────────────────────────────────────────────────────
  // Priority: per-slide config > banner-level config > neutral default
  const slideConfig    = parseSlideConfig(current);
  const bannerConfig   = formData.config || {};
  const accentColor    =
    slideConfig.accentColor   ||   // per-slide override (set in StepSlides)
    bannerConfig.accentColor  ||   // banner-level config (set in StepConfiguration)
    '#00d9ff';                     // neutral default — NOT '#00ff88' (that was the bug)
  // ────────────────────────────────────────────────────────────────────────────

  const getSlideConfigValue = (slide, key) => {
    const cfg = parseSlideConfig(slide);
    return cfg[key] || null;
  };

  return (
    <div
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.88)',
        backdropFilter: 'blur(8px)',
        zIndex: 9999,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 24,
        animation: 'previewFadeIn 0.25s ease',
      }}
      onClick={onClose}
    >
      <style>{`
        @keyframes previewFadeIn { from { opacity:0; transform:scale(0.97); } to { opacity:1; transform:scale(1); } }
      `}</style>

      <div
        style={{
          background: 'linear-gradient(145deg, #0d1627, #0a1020)',
          borderRadius: 20,
          width: '100%', maxWidth: 780,
          maxHeight: '92vh',
          overflow: 'hidden',
          display: 'flex', flexDirection: 'column',
          border: '1px solid rgba(0,217,255,0.18)',
          boxShadow: '0 40px 100px rgba(0,0,0,0.7), 0 0 0 1px rgba(0,217,255,0.08)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div style={{
          padding: '14px 20px',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'rgba(0,217,255,0.04)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Eye size={17} style={{ color: '#00d9ff' }} />
            <span style={{ fontWeight: 700, color: '#fff', fontSize: 15 }}>Banner Preview</span>
          </div>
          <button onClick={onClose} style={{
            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
            cursor: 'pointer', color: 'rgba(255,255,255,0.5)', padding: '5px 9px',
            borderRadius: 7, display: 'flex', alignItems: 'center', transition: 'all 0.2s',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,71,87,0.12)'; e.currentTarget.style.color = '#ff4757'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; }}
          >
            <X size={17} />
          </button>
        </div>

        {/* ── Meta chips ── */}
        <div style={{
          padding: '10px 20px',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center',
        }}>
          {/* Banner name */}
          <MetaChip label="Banner" value={formData.name || '—'} color="rgba(255,255,255,0.7)" />

          {/* Template */}
          <MetaChip
            label="Template"
            value={TEMPLATE_LABELS[formData.template_type] || template?.name || '—'}
            color="#00d9ff"
          />

          {/* Placement */}
          {placement && (
            <MetaChip label="Placement" value={placement.name} color="#00ff88" />
          )}

          {/* Slide count */}
          <MetaChip label="Slides" value={String(total)} color="rgba(255,255,255,0.55)" />

          {/* Accent color swatch */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '4px 10px',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 20,
          }}>
            <div style={{
              width: 12, height: 12, borderRadius: '50%',
              background: accentColor,
              boxShadow: `0 0 6px ${accentColor}80`,
            }} />
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', fontFamily: 'monospace' }}>
              {accentColor}
            </span>
          </div>
        </div>

        {/* ── Slide content ── */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
          {total === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'rgba(255,255,255,0.3)' }}>
              <Layers size={48} style={{ opacity: 0.2, marginBottom: 14 }} />
              <p style={{ margin: 0 }}>No slides configured yet</p>
            </div>
          ) : (
            <>
              {/* Visual preview */}
              <div style={{
                position: 'relative',
                borderRadius: 14,
                overflow: 'hidden',
                height: 280,
                background: '#0a0e1a',
                marginBottom: 16,
                border: '1px solid rgba(0,217,255,0.12)',
              }}>
                {current.background_image_url ? (
                  <img
                    src={current.background_image_url}
                    alt=""
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    onError={e => { e.target.style.display = 'none'; }}
                  />
                ) : (
                  <div style={{
                    width: '100%', height: '100%',
                    background: 'linear-gradient(135deg, #0d1b2a 0%, #1a3a5c 60%, #0d2035 100%)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: 13 }}>No background image</span>
                  </div>
                )}

                {/* Gradient overlay */}
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(to right, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.4) 55%, transparent 100%)',
                }} />

                {/* Character image */}
                {current.logo_url && (
                  <img
                    src={current.logo_url}
                    alt=""
                    style={{
                      position: 'absolute', right: 20, bottom: 0,
                      height: '90%', objectFit: 'contain',
                      filter: 'drop-shadow(0 4px 20px rgba(0,0,0,0.5))',
                    }}
                    onError={e => { e.target.style.display = 'none'; }}
                  />
                )}

                {/* Content */}
                <div style={{ position: 'absolute', bottom: 0, left: 0, padding: '20px 24px', maxWidth: '60%' }}>
                  {current.badge_text && (
                    <div style={{
                      display: 'inline-block',
                      background: accentColor,
                      color: isLight(accentColor) ? '#000' : '#fff',
                      fontSize: 10, fontWeight: 800,
                      padding: '3px 10px', borderRadius: 4,
                      marginBottom: 7, letterSpacing: 0.7,
                      textTransform: 'uppercase',
                    }}>
                      {current.badge_text}
                    </div>
                  )}
                  {current.title_highlight && (
                    <div style={{ fontSize: 12, color: accentColor, marginBottom: 5, fontWeight: 600 }}>
                      {current.title_highlight}
                    </div>
                  )}
                  {current.title && (
                    <div style={{
                      fontSize: 22, fontWeight: 800, color: '#fff',
                      lineHeight: 1.2, marginBottom: 7,
                      textShadow: '0 2px 12px rgba(0,0,0,0.6)',
                    }}>
                      {current.title}
                    </div>
                  )}
                  {current.subtitle && (
                    <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.7)', marginBottom: 12, lineHeight: 1.5 }}>
                      {current.subtitle}
                    </div>
                  )}
                  {current.cta_text && (
                    <div style={{
                      display: 'inline-block',
                      background: accentColor,
                      color: isLight(accentColor) ? '#000' : '#fff',
                      fontSize: 12, fontWeight: 700,
                      padding: '8px 18px', borderRadius: 7,
                      boxShadow: `0 4px 14px ${accentColor}50`,
                    }}>
                      {current.cta_text}
                    </div>
                  )}
                </div>

                {/* Indicators */}
                {getSlideConfigValue(current, 'videoUrl') && (
                  <Pill top={10} left={12} bg="rgba(0,0,0,0.65)">🎬 Video</Pill>
                )}
                {getSlideConfigValue(current, 'promoCode') && (
                  <Pill top={10} left={12} bg={`${accentColor}20`} border={`${accentColor}55`} color={accentColor}>
                    {getSlideConfigValue(current, 'promoCode')}
                  </Pill>
                )}

                {/* Slide counter */}
                {total > 1 && (
                  <div style={{
                    position: 'absolute', top: 10, right: 12,
                    background: 'rgba(0,0,0,0.55)',
                    borderRadius: 6, padding: '3px 9px',
                    fontSize: 11, color: 'rgba(255,255,255,0.7)', fontWeight: 600,
                  }}>
                    {currentSlide + 1} / {total}
                  </div>
                )}
              </div>

              {/* Navigation */}
              {total > 1 && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 16 }}>
                  <NavBtn
                    onClick={() => setCurrentSlide(s => Math.max(s - 1, 0))}
                    disabled={currentSlide === 0}
                  >
                    <ChevronLeft size={14} /> Prev
                  </NavBtn>

                  {/* Dot indicators — uses accent color */}
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    {slides.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentSlide(i)}
                        style={{
                          width: i === currentSlide ? 22 : 8,
                          height: 8,
                          borderRadius: 4,
                          border: 'none',
                          background: i === currentSlide ? accentColor : 'rgba(255,255,255,0.18)',
                          cursor: 'pointer',
                          padding: 0,
                          transition: 'all 0.25s ease',
                          boxShadow: i === currentSlide ? `0 0 6px ${accentColor}80` : 'none',
                        }}
                      />
                    ))}
                  </div>

                  <NavBtn
                    onClick={() => setCurrentSlide(s => Math.min(s + 1, total - 1))}
                    disabled={currentSlide === total - 1}
                  >
                    Next <ChevronRight size={14} />
                  </NavBtn>
                </div>
              )}

              {/* Slide data */}
              <div style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 10, padding: '14px 18px',
              }}>
                <div style={{
                  fontSize: 10, fontWeight: 700,
                  color: 'rgba(255,255,255,0.3)',
                  textTransform: 'uppercase', letterSpacing: 1,
                  marginBottom: 12,
                }}>
                  Slide {currentSlide + 1} Data
                </div>
                {[
                  ['Title',       current.title],
                  ['Eyebrow',     current.title_highlight],
                  ['Subtitle',    current.subtitle],
                  ['Badge',       current.badge_text],
                  ['CTA Text',    current.cta_text],
                  ['CTA Link',    current.cta_link],
                  ['BG Image',    current.background_image_url ? '✓ Set' : null],
                  ['Char Image',  current.logo_url ? '✓ Set' : null],
                  ['Video URL',   getSlideConfigValue(current, 'videoUrl')],
                  ['Promo Code',  getSlideConfigValue(current, 'promoCode')],
                  ['Target Date', getSlideConfigValue(current, 'targetDate')],
                  ['Accent Color', slideConfig.accentColor || null],
                ].filter(([, v]) => v).map(([label, val]) => (
                  <div key={label} style={{
                    display: 'flex', gap: 12, padding: '5px 0',
                    borderBottom: '1px solid rgba(255,255,255,0.04)',
                    alignItems: 'flex-start',
                  }}>
                    <span style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.3)', minWidth: 100, flexShrink: 0 }}>
                      {label}
                    </span>
                    <span style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.75)', wordBreak: 'break-all', lineHeight: 1.4 }}>
                      {label === 'Accent Color' ? (
                        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span style={{ width: 10, height: 10, borderRadius: '50%', background: val, display: 'inline-block' }} />
                          {val}
                        </span>
                      ) : val}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* ── Footer ── */}
        <div style={{
          padding: '14px 20px',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          display: 'flex', justifyContent: 'flex-end', gap: 10,
          background: 'rgba(0,0,0,0.15)',
        }}>
          <button
            onClick={onClose}
            style={{
              padding: '9px 20px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 8, color: '#fff', cursor: 'pointer', fontSize: 13,
            }}
          >
            Close
          </button>
          {onConfirm && (
            <button
              onClick={onConfirm}
              style={{
                padding: '9px 20px',
                background: 'linear-gradient(135deg, #00d9ff, #2b7ae2)',
                border: 'none', borderRadius: 8,
                color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: 13,
                boxShadow: '0 4px 14px rgba(0,217,255,0.3)',
              }}
            >
              Save Banner
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Small helper components ── */

function MetaChip({ label, value, color }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 5,
      padding: '4px 10px',
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: 20,
    }}>
      <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.4 }}>
        {label}
      </span>
      <span style={{ fontSize: 11, color, fontWeight: 600 }}>{value}</span>
    </div>
  );
}

function NavBtn({ children, onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        display: 'flex', alignItems: 'center', gap: 4,
        padding: '6px 13px',
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 7, color: disabled ? 'rgba(255,255,255,0.2)' : '#fff',
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontSize: 12, fontWeight: 500,
        transition: 'all 0.2s',
      }}
    >
      {children}
    </button>
  );
}

function Pill({ top, left, bg, border, color = 'rgba(255,255,255,0.8)', children }) {
  return (
    <div style={{
      position: 'absolute', top, left,
      background: bg,
      border: border ? `1px solid ${border}` : 'none',
      borderRadius: 4, padding: '3px 8px',
      fontSize: 11, color,
      fontFamily: 'monospace', fontWeight: 700,
    }}>
      {children}
    </div>
  );
}

/** Very rough luminance check to decide text colour on accent background */
function isLight(hex = '') {
  const c = hex.replace('#', '');
  if (c.length < 6) return false;
  const r = parseInt(c.slice(0, 2), 16);
  const g = parseInt(c.slice(2, 4), 16);
  const b = parseInt(c.slice(4, 6), 16);
  return (r * 0.299 + g * 0.587 + b * 0.114) > 170;
}