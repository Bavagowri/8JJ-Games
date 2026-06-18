
// // react-app/src/pages/admin/BannerManagement/steps/StepConfiguration.jsx
// import { useState, useEffect } from 'react';
// import './Steps.css';

// const TEMPLATE_CONFIGS = {
//   hero: {
//     label: 'Hero Banner Carousel',
//     fields: [
//       { key: 'autoPlay',            type: 'toggle',  label: 'Auto Play',           default: true },
//       { key: 'interval',            type: 'number',  label: 'Interval (ms)',        default: 5000, min: 1000, max: 30000 },
//       { key: 'showArrows',          type: 'toggle',  label: 'Show Arrows',          default: true },
//       { key: 'showIndicators',      type: 'toggle',  label: 'Show Dots',            default: true },
//       { key: 'transitionDuration',  type: 'number',  label: 'Transition (ms)',      default: 500,  min: 100, max: 2000 },
//     ]
//   },
//   promo: {
//     label: 'Promo Banner',
//     fields: [
//       { key: 'autoPlay',       type: 'toggle', label: 'Auto Play',          default: true },
//       { key: 'interval',       type: 'number', label: 'Interval (ms)',       default: 6000, min: 1000, max: 30000 },
//       { key: 'showIndicators', type: 'toggle', label: 'Show Dots',           default: true },
//       { key: 'accentColor',    type: 'color',  label: 'Accent Color',        default: '#00ff88' },
//       { key: 'overlayOpacity', type: 'range',  label: 'Overlay Opacity',     default: 0.55, min: 0, max: 1, step: 0.05 },
//     ]
//   },
//   multi_panel: {
//     label: 'Multi-Panel Banner',
//     fields: [
//       { key: 'maxPanels',    type: 'select', label: 'Max Panels',    default: 3, options: [2, 3] },
//       { key: 'gap',          type: 'number', label: 'Gap (px)',       default: 16, min: 0, max: 40 },
//       { key: 'borderRadius', type: 'number', label: 'Border Radius (px)', default: 18, min: 0, max: 32 },
//       { key: 'showOverlay',  type: 'toggle', label: 'Show Overlay',  default: true },
//     ]
//   },
//   split_hero: {
//     label: 'Split Hero Banner',
//     fields: [
//       { key: 'autoPlay',       type: 'toggle', label: 'Auto Play',       default: true },
//       { key: 'interval',       type: 'number', label: 'Interval (ms)',    default: 6500, min: 1000, max: 30000 },
//       { key: 'showIndicators', type: 'toggle', label: 'Show Dots',        default: true },
//       { key: 'showArrows',     type: 'toggle', label: 'Show Arrows',      default: true },
//       { key: 'accentColor',    type: 'color',  label: 'Accent Color',     default: '#00e5ff' },
//       { key: 'leftBg',         type: 'color',  label: 'Left Panel BG',    default: '#06101e' },
//       { key: 'splitRatio',     type: 'number', label: 'Left Panel Width (%)', default: 44, min: 30, max: 60 },
//       { key: 'overlayOpacity', type: 'range',  label: 'Right Overlay Opacity', default: 0.42, min: 0, max: 1, step: 0.05 },
//     ]
//   },
//   countdown: {
//     label: 'Countdown Banner',
//     description: 'Set targetDate in each slide\'s per-slide config JSON: {"targetDate":"2026-06-01T00:00:00Z"}',
//     fields: [
//       { key: 'accentColor',    type: 'color',  label: 'Accent Color',     default: '#ff6b35' },
//       { key: 'timerLabel',     type: 'text',   label: 'Timer Label',       default: 'Offer ends in' },
//       { key: 'expiredText',    type: 'text',   label: 'Expired Text',      default: 'This offer has ended' },
//       { key: 'showDays',       type: 'toggle', label: 'Show Days Unit',    default: true },
//       { key: 'overlayOpacity', type: 'range',  label: 'Overlay Opacity',   default: 0.62, min: 0, max: 1, step: 0.05 },
//     ]
//   },
//   promo_grid: {
//     label: 'Promo Banner Grid',
//     fields: [
//       { key: 'columns',      type: 'select', label: 'Columns',         default: 3, options: [2, 3, 4] },
//       { key: 'rows',         type: 'select', label: 'Rows',            default: 2, options: [1, 2] },
//       { key: 'gap',          type: 'number', label: 'Gap (px)',         default: 14, min: 0, max: 40 },
//       { key: 'borderRadius', type: 'number', label: 'Border Radius',   default: 16, min: 0, max: 32 },
//       { key: 'cardHeight',   type: 'number', label: 'Card Height (px)', default: 180, min: 120, max: 400 },
//     ]
//   },
//   wide_strip: {
//     label: 'Wide Strip Banner',
//     fields: [
//       { key: 'scrollSpeed',  type: 'select', label: 'Scroll Speed',   default: 'medium', options: ['slow', 'medium', 'fast'] },
//       { key: 'showMarquee',  type: 'toggle', label: 'Show Marquee',   default: true },
//       { key: 'showIcon',     type: 'toggle', label: 'Show Icon',      default: true },
//       { key: 'accentColor',  type: 'color',  label: 'Accent Color',   default: '#ffd700' },
//       { key: 'stripBg',      type: 'color',  label: 'Strip BG Color', default: '#0a0f1a' },
//     ]
//   },
//   carousel_cards: {
//     label: 'Carousel Cards Banner',
//     fields: [
//       { key: 'visibleCards',  type: 'select', label: 'Visible Cards',      default: 3, options: [2, 3, 4] },
//       { key: 'cardHeight',    type: 'number', label: 'Card Height (px)',    default: 220, min: 120, max: 400 },
//       { key: 'gap',           type: 'number', label: 'Gap (px)',            default: 16, min: 0, max: 40 },
//       { key: 'borderRadius',  type: 'number', label: 'Border Radius (px)', default: 18, min: 0, max: 32 },
//       { key: 'accentColor',   type: 'color',  label: 'Accent Color',       default: '#00ff88' },
//       { key: 'showArrows',    type: 'toggle', label: 'Show Arrows',        default: true },
//     ]
//   },
//   video_hero: {
//     label: 'Video Hero Banner',
//     description: 'Set videoUrl in each slide\'s per-slide config JSON: {"videoUrl":"https://...","videoType":"video/mp4"}',
//     fields: [
//       { key: 'autoPlay',       type: 'toggle', label: 'Auto Play Slides',  default: true },
//       { key: 'interval',       type: 'number', label: 'Interval (ms)',      default: 8000, min: 2000, max: 60000 },
//       { key: 'showIndicators', type: 'toggle', label: 'Show Dots',          default: true },
//       { key: 'showArrows',     type: 'toggle', label: 'Show Arrows',        default: true },
//       { key: 'accentColor',    type: 'color',  label: 'Accent Color',       default: '#00ff88' },
//       { key: 'overlayOpacity', type: 'range',  label: 'Overlay Opacity',    default: 0.45, min: 0, max: 1, step: 0.05 },
//       { key: 'muted',          type: 'toggle', label: 'Muted Video',        default: true },
//       { key: 'height',         type: 'number', label: 'Banner Height (px)', default: 380, min: 200, max: 700 },
//     ]
//   },
//   floating_announcement: {
//     label: 'Floating Announcement',
//     fields: [
//       { key: 'position',        type: 'select', label: 'Position',           default: 'bottom-right', options: ['bottom-right', 'bottom-left'] },
//       { key: 'accentColor',     type: 'color',  label: 'Accent Color',       default: '#ff6b35' },
//       { key: 'pillLabel',       type: 'text',   label: 'Pill Label',          default: 'New Offer' },
//       { key: 'collapseAfterMs', type: 'number', label: 'Auto-collapse (ms, 0=never)', default: 0, min: 0, max: 30000 },
//     ]
//   },
//   announcement_bar: {
//     label: 'Announcement Bar',
//     fields: [
//       { key: 'accentColor', type: 'color',  label: 'Accent Color',  default: '#ffd700' },
//       { key: 'barBg',       type: 'color',  label: 'Bar BG Color',  default: '#0a0f1a' },
//       { key: 'scrollSpeed', type: 'text',   label: 'Scroll Speed',  default: '20s' },
//       { key: 'showDismiss', type: 'toggle', label: 'Show Dismiss',  default: true },
//     ]
//   },
//   redeem: {
//     label: 'Redeem Banner',
//     description: 'Set promoCode in each slide\'s per-slide config JSON: {"promoCode":"BONUS100"}',
//     fields: [
//       { key: 'accentColor',    type: 'color', label: 'Accent Color',    default: '#00ff88' },
//       { key: 'overlayOpacity', type: 'range', label: 'Overlay Opacity', default: 0.6, min: 0, max: 1, step: 0.05 },
//     ]
//   },
//   popup: {
//     label: 'Popup Banner',
//     fields: [
//       { key: 'accentColor', type: 'color',  label: 'Accent Color',         default: '#ff6b35' },
//       { key: 'showAfterMs', type: 'number', label: 'Show After (ms)',        default: 2000, min: 0, max: 30000 },
//       { key: 'showOnce',    type: 'toggle', label: 'Show Once Per Session', default: true },
//     ]
//   },
// };

// export default function StepConfiguration({ formData, onChange, templateType }) {
//   const configDef = TEMPLATE_CONFIGS[templateType];

//   const getDefaults = () => {
//     if (!configDef) return {};
//     return configDef.fields.reduce((acc, f) => {
//       acc[f.key] = f.default;
//       return acc;
//     }, {});
//   };

//   const [localConfig, setLocalConfig] = useState(() => {
//     const defaults = getDefaults();
//     const saved = formData.config || {};
//     return { ...defaults, ...saved };
//   });

//   // Re-init when template type changes
//   useEffect(() => {
//     const defaults = getDefaults();
//     const saved = formData.config || {};
//     setLocalConfig({ ...defaults, ...saved });
//   }, [templateType]); // eslint-disable-line

//   const update = (key, value) => {
//     const next = { ...localConfig, [key]: value };
//     setLocalConfig(next);
//     onChange({ config: next });
//   };

//   if (!configDef) {
//     return (
//       <div className="step-container">
//         <div className="step-header">
//           <h2 className="step-title">Configuration</h2>
//           <p className="step-subtitle">No configuration available for this template type.</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="step-container">
//       <div className="step-header">
//         <h2 className="step-title">Configuration</h2>
//         <p className="step-subtitle">
//           Customize <strong>{configDef.label}</strong> settings
//         </p>
//       </div>

//       {configDef.description && (
//         <div className="step-info-box" style={{
//           background: 'rgba(0,217,255,0.08)',
//           border: '1px solid rgba(0,217,255,0.25)',
//           borderRadius: 10,
//           padding: '12px 16px',
//           marginBottom: 24,
//           fontSize: 13,
//           color: 'rgba(255,255,255,0.75)',
//           lineHeight: 1.5,
//         }}>
//           💡 {configDef.description}
//         </div>
//       )}

//       <div className="config-grid">
//         {configDef.fields.map(field => (
//           <ConfigField
//             key={field.key}
//             field={field}
//             value={localConfig[field.key] ?? field.default}
//             onChange={(v) => update(field.key, v)}
//           />
//         ))}
//       </div>

//       {/* Raw JSON preview for power users */}
//       <div style={{ marginTop: 32 }}>
//         <h3 style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.45)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>
//           Config Preview (JSON)
//         </h3>
//         <pre style={{
//           background: 'rgba(0,0,0,0.3)',
//           border: '1px solid rgba(255,255,255,0.08)',
//           borderRadius: 8,
//           padding: '12px 16px',
//           fontSize: 12,
//           color: 'rgba(255,255,255,0.5)',
//           fontFamily: 'monospace',
//           overflowX: 'auto',
//           maxHeight: 160,
//           overflowY: 'auto',
//         }}>
//           {JSON.stringify(localConfig, null, 2)}
//         </pre>
//       </div>
//     </div>
//   );
// }

// function ConfigField({ field, value, onChange }) {
//   const labelStyle = {
//     display: 'block',
//     fontSize: 13,
//     fontWeight: 500,
//     color: 'rgba(255,255,255,0.7)',
//     marginBottom: 8,
//   };

//   const inputStyle = {
//     width: '100%',
//     background: 'rgba(255,255,255,0.06)',
//     border: '1px solid rgba(255,255,255,0.12)',
//     borderRadius: 8,
//     padding: '9px 12px',
//     color: '#fff',
//     fontSize: 14,
//     outline: 'none',
//     boxSizing: 'border-box',
//   };

//   switch (field.type) {
//     case 'toggle':
//       return (
//         <div className="config-field">
//           <label style={labelStyle}>{field.label}</label>
//           <button
//             type="button"
//             onClick={() => onChange(!value)}
//             style={{
//               display: 'flex',
//               alignItems: 'center',
//               gap: 10,
//               background: 'none',
//               border: 'none',
//               cursor: 'pointer',
//               padding: 0,
//             }}
//           >
//             <div style={{
//               width: 44,
//               height: 24,
//               borderRadius: 12,
//               background: value ? 'var(--premium-primary, #00d9ff)' : 'rgba(255,255,255,0.15)',
//               position: 'relative',
//               transition: 'background 0.2s',
//               flexShrink: 0,
//             }}>
//               <div style={{
//                 position: 'absolute',
//                 top: 3,
//                 left: value ? 23 : 3,
//                 width: 18,
//                 height: 18,
//                 borderRadius: '50%',
//                 background: '#fff',
//                 transition: 'left 0.2s',
//               }} />
//             </div>
//             <span style={{ fontSize: 13, color: value ? '#00d9ff' : 'rgba(255,255,255,0.45)' }}>
//               {value ? 'On' : 'Off'}
//             </span>
//           </button>
//         </div>
//       );

//     case 'color':
//       return (
//         <div className="config-field">
//           <label style={labelStyle}>{field.label}</label>
//           <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
//             <input
//               type="color"
//               value={value || field.default}
//               onChange={(e) => onChange(e.target.value)}
//               style={{
//                 width: 40,
//                 height: 36,
//                 border: '1px solid rgba(255,255,255,0.15)',
//                 borderRadius: 6,
//                 cursor: 'pointer',
//                 padding: 2,
//                 background: 'rgba(255,255,255,0.06)',
//               }}
//             />
//             <input
//               type="text"
//               value={value || field.default}
//               onChange={(e) => onChange(e.target.value)}
//               style={{ ...inputStyle, flex: 1 }}
//               placeholder={field.default}
//             />
//           </div>
//         </div>
//       );

//     case 'range':
//       return (
//         <div className="config-field">
//           <label style={labelStyle}>{field.label}: <strong style={{ color: '#00d9ff' }}>{value}</strong></label>
//           <input
//             type="range"
//             min={field.min ?? 0}
//             max={field.max ?? 1}
//             step={field.step ?? 0.1}
//             value={value ?? field.default}
//             onChange={(e) => onChange(parseFloat(e.target.value))}
//             style={{ width: '100%', accentColor: '#00d9ff' }}
//           />
//         </div>
//       );

//     case 'number':
//       return (
//         <div className="config-field">
//           <label style={labelStyle}>{field.label}</label>
//           <input
//             type="number"
//             min={field.min}
//             max={field.max}
//             value={value ?? field.default}
//             onChange={(e) => onChange(Number(e.target.value))}
//             style={inputStyle}
//           />
//         </div>
//       );

//     case 'select':
//       return (
//         <div className="config-field">
//           <label style={labelStyle}>{field.label}</label>
//           <select
//             value={value ?? field.default}
//             onChange={(e) => {
//               const v = e.target.value;
//               onChange(isNaN(v) ? v : Number(v));
//             }}
//             style={{ ...inputStyle, cursor: 'pointer' }}
//           >
//             {field.options.map(opt => (
//               <option key={opt} value={opt}>{opt}</option>
//             ))}
//           </select>
//         </div>
//       );

//     case 'text':
//     default:
//       return (
//         <div className="config-field">
//           <label style={labelStyle}>{field.label}</label>
//           <input
//             type="text"
//             value={value ?? field.default}
//             onChange={(e) => onChange(e.target.value)}
//             style={inputStyle}
//             placeholder={field.default}
//           />
//         </div>
//       );
//   }
// }




// react-app/src/pages/admin/BannerManagement/steps/StepConfiguration.jsx
import { useState, useEffect, useRef } from 'react';
import './Steps.css';

const TEMPLATE_CONFIGS = {
  hero: {
    label: 'Hero Banner Carousel',
    fields: [
      { key: 'autoPlay',           type: 'toggle', label: 'Auto Play',          default: true },
      { key: 'interval',           type: 'number', label: 'Interval (ms)',       default: 5000, min: 1000, max: 30000 },
      { key: 'showArrows',         type: 'toggle', label: 'Show Arrows',         default: true },
      { key: 'showIndicators',     type: 'toggle', label: 'Show Dots',           default: true },
      { key: 'transitionDuration', type: 'number', label: 'Transition (ms)',     default: 500,  min: 100, max: 2000 },
    ]
  },
  promo: {
    label: 'Promo Banner',
    fields: [
      { key: 'autoPlay',       type: 'toggle', label: 'Auto Play',      default: true },
      { key: 'interval',       type: 'number', label: 'Interval (ms)',   default: 6000, min: 1000, max: 30000 },
      { key: 'showIndicators', type: 'toggle', label: 'Show Dots',       default: true },
      { key: 'accentColor',    type: 'color',  label: 'Accent Color',    default: '#00ff88' },
      { key: 'overlayOpacity', type: 'range',  label: 'Overlay Opacity', default: 0.55, min: 0, max: 1, step: 0.05 },
    ]
  },
  multi_panel: {
    label: 'Multi-Panel Banner',
    fields: [
      { key: 'maxPanels',    type: 'select', label: 'Max Panels',        default: 3, options: [2, 3] },
      { key: 'gap',          type: 'number', label: 'Gap (px)',           default: 16, min: 0, max: 40 },
      { key: 'borderRadius', type: 'number', label: 'Border Radius (px)',default: 18, min: 0, max: 32 },
      { key: 'showOverlay',  type: 'toggle', label: 'Show Overlay',      default: true },
    ]
  },
  split_hero: {
    label: 'Split Hero Banner',
    fields: [
      { key: 'autoPlay',       type: 'toggle', label: 'Auto Play',              default: true },
      { key: 'interval',       type: 'number', label: 'Interval (ms)',           default: 6500, min: 1000, max: 30000 },
      { key: 'showIndicators', type: 'toggle', label: 'Show Dots',               default: true },
      { key: 'showArrows',     type: 'toggle', label: 'Show Arrows',             default: true },
      { key: 'accentColor',    type: 'color',  label: 'Accent Color',            default: '#00e5ff' },
      { key: 'leftBg',         type: 'color',  label: 'Left Panel BG',           default: '#06101e' },
      { key: 'splitRatio',     type: 'number', label: 'Left Panel Width (%)',    default: 44, min: 30, max: 60 },
      { key: 'overlayOpacity', type: 'range',  label: 'Right Overlay Opacity',  default: 0.42, min: 0, max: 1, step: 0.05 },
    ]
  },
  countdown: {
    label: 'Countdown Banner',
    description: "Set targetDate in each slide's per-slide config JSON: {\"targetDate\":\"2026-06-01T00:00:00Z\"}",
    fields: [
      { key: 'accentColor',    type: 'color',  label: 'Accent Color',    default: '#ff6b35' },
      { key: 'timerLabel',     type: 'text',   label: 'Timer Label',     default: 'Offer ends in' },
      { key: 'expiredText',    type: 'text',   label: 'Expired Text',    default: 'This offer has ended' },
      { key: 'showDays',       type: 'toggle', label: 'Show Days Unit',  default: true },
      { key: 'overlayOpacity', type: 'range',  label: 'Overlay Opacity', default: 0.62, min: 0, max: 1, step: 0.05 },
    ]
  },
  promo_grid: {
    label: 'Promo Banner Grid',
    fields: [
      { key: 'columns',      type: 'select', label: 'Columns',          default: 3, options: [2, 3, 4] },
      { key: 'rows',         type: 'select', label: 'Rows',             default: 2, options: [1, 2] },
      { key: 'gap',          type: 'number', label: 'Gap (px)',          default: 14, min: 0, max: 40 },
      { key: 'borderRadius', type: 'number', label: 'Border Radius',    default: 16, min: 0, max: 32 },
      { key: 'cardHeight',   type: 'number', label: 'Card Height (px)', default: 180, min: 120, max: 400 },
    ]
  },
  wide_strip: {
    label: 'Wide Strip Banner',
    fields: [
      { key: 'scrollSpeed', type: 'select', label: 'Scroll Speed',   default: 'medium', options: ['slow', 'medium', 'fast'] },
      { key: 'showMarquee', type: 'toggle', label: 'Show Marquee',   default: true },
      { key: 'showIcon',    type: 'toggle', label: 'Show Icon',      default: true },
      { key: 'accentColor', type: 'color',  label: 'Accent Color',   default: '#ffd700' },
      { key: 'stripBg',     type: 'color',  label: 'Strip BG Color', default: '#0a0f1a' },
    ]
  },
  carousel_cards: {
    label: 'Carousel Cards Banner',
    fields: [
      { key: 'visibleCards',  type: 'select', label: 'Visible Cards',       default: 3, options: [2, 3, 4] },
      { key: 'cardHeight',    type: 'number', label: 'Card Height (px)',     default: 220, min: 120, max: 400 },
      { key: 'gap',           type: 'number', label: 'Gap (px)',             default: 16, min: 0, max: 40 },
      { key: 'borderRadius',  type: 'number', label: 'Border Radius (px)',  default: 18, min: 0, max: 32 },
      { key: 'accentColor',   type: 'color',  label: 'Accent Color',        default: '#00ff88' },
      { key: 'showArrows',    type: 'toggle', label: 'Show Arrows',         default: true },
    ]
  },
  video_hero: {
    label: 'Video Hero Banner',
    description: "Set videoUrl in each slide's per-slide config JSON: {\"videoUrl\":\"https://...\",\"videoType\":\"video/mp4\"}",
    fields: [
      { key: 'autoPlay',       type: 'toggle', label: 'Auto Play Slides',  default: true },
      { key: 'interval',       type: 'number', label: 'Interval (ms)',      default: 8000, min: 2000, max: 60000 },
      { key: 'showIndicators', type: 'toggle', label: 'Show Dots',          default: true },
      { key: 'showArrows',     type: 'toggle', label: 'Show Arrows',        default: true },
      { key: 'accentColor',    type: 'color',  label: 'Accent Color',       default: '#00ff88' },
      { key: 'overlayOpacity', type: 'range',  label: 'Overlay Opacity',   default: 0.45, min: 0, max: 1, step: 0.05 },
      { key: 'muted',          type: 'toggle', label: 'Muted Video',        default: true },
      { key: 'height',         type: 'number', label: 'Banner Height (px)', default: 380, min: 200, max: 700 },
    ]
  },
  floating_announcement: {
    label: 'Floating Announcement',
    fields: [
      { key: 'position',        type: 'select', label: 'Position',                  default: 'bottom-right', options: ['bottom-right', 'bottom-left'] },
      { key: 'accentColor',     type: 'color',  label: 'Accent Color',              default: '#ff6b35' },
      { key: 'pillLabel',       type: 'text',   label: 'Pill Label',                default: 'New Offer' },
      { key: 'collapseAfterMs', type: 'number', label: 'Auto-collapse (ms, 0=never)', default: 0, min: 0, max: 30000 },
    ]
  },
  announcement_bar: {
    label: 'Announcement Bar',
    fields: [
      { key: 'accentColor', type: 'color',  label: 'Accent Color',  default: '#ffd700' },
      { key: 'barBg',       type: 'color',  label: 'Bar BG Color',  default: '#0a0f1a' },
      { key: 'scrollSpeed', type: 'text',   label: 'Scroll Speed',  default: '20s' },
      { key: 'showDismiss', type: 'toggle', label: 'Show Dismiss',  default: true },
    ]
  },
  redeem: {
    label: 'Redeem Banner',
    description: "Set promoCode in each slide's per-slide config JSON: {\"promoCode\":\"BONUS100\"}",
    fields: [
      { key: 'accentColor',    type: 'color', label: 'Accent Color',    default: '#00ff88' },
      { key: 'overlayOpacity', type: 'range', label: 'Overlay Opacity', default: 0.6, min: 0, max: 1, step: 0.05 },
    ]
  },
  popup: {
    label: 'Popup Banner',
    fields: [
      { key: 'accentColor', type: 'color',  label: 'Accent Color',         default: '#ff6b35' },
      { key: 'showAfterMs', type: 'number', label: 'Show After (ms)',       default: 2000, min: 0, max: 30000 },
      { key: 'showOnce',    type: 'toggle', label: 'Show Once Per Session', default: true },
    ]
  },
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function getDefaults(templateType) {
  const def = TEMPLATE_CONFIGS[templateType];
  if (!def) return {};
  return def.fields.reduce((acc, f) => { acc[f.key] = f.default; return acc; }, {});
}

function mergeConfig(templateType, savedConfig) {
  // saved config always wins over defaults — never reset user values
  return { ...getDefaults(templateType), ...(savedConfig || {}) };
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function StepConfiguration({ formData, onChange, templateType }) {
  const configDef = TEMPLATE_CONFIGS[templateType];

  // ── KEY BUG FIX ───────────────────────────────────────────────────────────
  // OLD: useEffect(() => { resetFromFormData() }, [templateType])
  //   → When templateType changed, formData.config was a STALE CLOSURE value
  //     (from the render before the template was switched), so accentColor and
  //     other user changes were overwritten with defaults.
  //
  // FIX: Use a ref to always have the latest formData.config available inside
  //   the useEffect without capturing a stale closure.  The ref is updated on
  //   every render (free, synchronous), so the effect always sees fresh data.
  // ─────────────────────────────────────────────────────────────────────────

  const formDataConfigRef = useRef(formData.config);
  // Keep the ref current on every render
  formDataConfigRef.current = formData.config;

  const [localConfig, setLocalConfig] = useState(() =>
    mergeConfig(templateType, formData.config)
  );

  // Only re-init when templateType actually changes — NOT when the user edits
  // a field (which calls onChange and triggers a parent re-render).
  const prevTemplateTypeRef = useRef(templateType);
  useEffect(() => {
    if (prevTemplateTypeRef.current === templateType) return; // no change → skip
    prevTemplateTypeRef.current = templateType;

    // Use the ref so we always get the LATEST formData.config, not a stale copy
    setLocalConfig(mergeConfig(templateType, formDataConfigRef.current));
  }, [templateType]);

  // ── Update handler ────────────────────────────────────────────────────────

  const update = (key, value) => {
    const next = { ...localConfig, [key]: value };
    setLocalConfig(next);
    onChange({ config: next });
  };

  // ── No config for this template ───────────────────────────────────────────

  if (!configDef) {
    return (
      <div className="step-container">
        <div className="step-header">
          <h2 className="step-title">Configuration</h2>
          <p className="step-subtitle">No configuration available for this template type.</p>
        </div>
      </div>
    );
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="step-container">
      <div className="step-header">
        <h2 className="step-title">Configuration</h2>
        <p className="step-subtitle">
          Customize <strong style={{ color: '#00d9ff' }}>{configDef.label}</strong> settings
        </p>
      </div>

      {configDef.description && (
        <div style={{
          background: 'rgba(0,217,255,0.06)',
          border: '1px solid rgba(0,217,255,0.2)',
          borderRadius: 10,
          padding: '12px 16px',
          marginBottom: 24,
          fontSize: 13,
          color: 'rgba(255,255,255,0.7)',
          lineHeight: 1.6,
        }}>
          💡 {configDef.description}
        </div>
      )}

      {/* Config grid — .config-grid is in Steps.css */}
      <div className="config-grid">
        {configDef.fields.map(field => (
          <ConfigField
            key={field.key}
            field={field}
            value={localConfig[field.key] ?? field.default}
            onChange={(v) => update(field.key, v)}
          />
        ))}
      </div>

      {/* Live JSON preview */}
      <div style={{ marginTop: 28 }}>
        <div style={{
          fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.3)',
          textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8,
        }}>
          Config JSON Preview
        </div>
        <pre style={{
          background: 'rgba(0,0,0,0.3)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 8, padding: '12px 16px',
          fontSize: 11.5, color: 'rgba(255,255,255,0.45)',
          fontFamily: 'Courier New, monospace',
          overflowX: 'auto', maxHeight: 150, overflowY: 'auto',
          margin: 0,
        }}>
          {JSON.stringify(localConfig, null, 2)}
        </pre>
      </div>
    </div>
  );
}

// ── ConfigField ───────────────────────────────────────────────────────────────

function ConfigField({ field, value, onChange }) {
  const inputSt = {
    width: '100%',
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: 8, padding: '9px 12px',
    color: '#fff', fontSize: 14, outline: 'none', boxSizing: 'border-box',
  };
  const labelSt = {
    display: 'block', fontSize: 12, fontWeight: 600,
    color: 'rgba(255,255,255,0.6)', marginBottom: 10,
    textTransform: 'uppercase', letterSpacing: 0.6,
  };

  switch (field.type) {

    case 'toggle':
      return (
        <div className="config-field">
          <label style={labelSt}>{field.label}</label>
          <button
            type="button"
            onClick={() => onChange(!value)}
            style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            <div style={{
              width: 44, height: 24, borderRadius: 12,
              background: value ? '#00d9ff' : 'rgba(255,255,255,0.12)',
              position: 'relative', transition: 'background 0.22s', flexShrink: 0,
            }}>
              <div style={{
                position: 'absolute', top: 3,
                left: value ? 23 : 3,
                width: 18, height: 18, borderRadius: '50%',
                background: '#fff', transition: 'left 0.22s',
                boxShadow: '0 1px 4px rgba(0,0,0,0.35)',
              }} />
            </div>
            <span style={{ fontSize: 13, color: value ? '#00d9ff' : 'rgba(255,255,255,0.38)' }}>
              {value ? 'On' : 'Off'}
            </span>
          </button>
        </div>
      );

    case 'color':
      return (
        <div className="config-field">
          <label style={labelSt}>{field.label}</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <input
              type="color"
              value={value || field.default}
              onChange={(e) => onChange(e.target.value)}
              style={{
                width: 40, height: 36,
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: 6, cursor: 'pointer',
                padding: 2, background: 'rgba(255,255,255,0.06)',
              }}
            />
            <input
              type="text"
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              style={{ ...inputSt, flex: 1, fontFamily: 'monospace', letterSpacing: 1 }}
              placeholder={field.default}
            />
          </div>
          {/* Live swatch */}
          <div style={{
            marginTop: 8, height: 4, borderRadius: 2,
            background: value || field.default,
            transition: 'background 0.15s',
            border: '1px solid rgba(255,255,255,0.1)',
          }} />
        </div>
      );

    case 'range':
      return (
        <div className="config-field">
          <label style={labelSt}>
            {field.label}&nbsp;
            <strong style={{ color: '#00d9ff', fontWeight: 700 }}>{value}</strong>
          </label>
          <input
            type="range"
            min={field.min ?? 0}
            max={field.max ?? 1}
            step={field.step ?? 0.1}
            value={value ?? field.default}
            onChange={(e) => onChange(parseFloat(e.target.value))}
            style={{ width: '100%', accentColor: '#00d9ff' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'rgba(255,255,255,0.25)', marginTop: 4 }}>
            <span>{field.min ?? 0}</span>
            <span>{field.max ?? 1}</span>
          </div>
        </div>
      );

    case 'number':
      return (
        <div className="config-field">
          <label style={labelSt}>{field.label}</label>
          <input
            type="number"
            min={field.min}
            max={field.max}
            value={value ?? field.default}
            onChange={(e) => onChange(Number(e.target.value))}
            style={inputSt}
          />
        </div>
      );

    case 'select':
      return (
        <div className="config-field">
          <label style={labelSt}>{field.label}</label>
          <select
            value={value ?? field.default}
            onChange={(e) => {
              const v = e.target.value;
              onChange(isNaN(v) ? v : Number(v));
            }}
            style={{ ...inputSt, cursor: 'pointer' }}
          >
            {field.options.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
      );

    case 'text':
    default:
      return (
        <div className="config-field">
          <label style={labelSt}>{field.label}</label>
          <input
            type="text"
            value={value ?? ''}
            onChange={(e) => onChange(e.target.value)}
            style={inputSt}
            placeholder={field.default}
          />
        </div>
      );
  }
}