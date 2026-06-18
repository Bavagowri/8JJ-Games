

// react-app/src/pages/admin/BannerManagement/steps/StepSlides.jsx
import { useState, useRef } from 'react';
import './Steps.css';

function createEmptySlide() {
  return {
    id: `new_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    title: '',
    title_highlight: '',
    subtitle: '',
    badge_text: '',
    cta_text: '',
    cta_link: '',
    background_image_url: '',
    logo_url: '',
    config: '',
    order_position: 0,
  };
}

// ─── KEY FIX ──────────────────────────────────────────────────────────────────
// We NO LONGER use a useEffect to sync from formData.slides into local state.
// That caused a loop: user edits → onChange(parent) → parent re-renders →
// useEffect fires → local state reset → user edits lost.
//
// Instead:
//  • We initialise local state ONCE from formData.slides (via useState initialiser).
//  • Every mutation calls BOTH setSlides (local) AND onChange (parent) directly.
//  • The parent's formData.slides stays in sync without ever needing to push back down.
// ─────────────────────────────────────────────────────────────────────────────

export default function StepSlides({ formData, onChange, errors = {} }) {
  const [slides, setSlides] = useState(() => {
    if (formData.slides?.length > 0) return formData.slides;
    return [createEmptySlide()];
  });

  const [activeSlide, setActiveSlide] = useState(0);

  // Track whether we've already initialised from a non-empty formData.slides
  // (handles edit-mode where slides arrive after initial render via async load).
  const initialisedRef = useRef(formData.slides?.length > 0);
  if (!initialisedRef.current && formData.slides?.length > 0) {
    initialisedRef.current = true;
    setSlides(formData.slides);
  }

  const templateType = formData.template_type || '';
  const isVideoHero  = templateType === 'video_hero';
  const isRedeem     = templateType === 'redeem';
  const isCountdown  = templateType === 'countdown';

  // ── helpers ────────────────────────────────────────────────────────────────

  const commit = (next) => {
    const withPositions = next.map((s, i) => ({ ...s, order_position: i }));
    setSlides(withPositions);
    onChange({ slides: withPositions });
  };

  const addSlide = () => {
    const next = [...slides, createEmptySlide()];
    commit(next);
    setActiveSlide(next.length - 1);
  };

  const removeSlide = (idx) => {
    if (slides.length <= 1) return;
    const next = slides.filter((_, i) => i !== idx);
    commit(next);
    setActiveSlide(Math.min(activeSlide, next.length - 1));
  };

  const updateSlide = (idx, field, value) => {
    const next = slides.map((s, i) => i === idx ? { ...s, [field]: value } : s);
    commit(next);
  };

  const moveSlide = (idx, dir) => {
    const next = [...slides];
    const target = idx + dir;
    if (target < 0 || target >= next.length) return;
    [next[idx], next[target]] = [next[target], next[idx]];
    commit(next);
    setActiveSlide(target);
  };

  // Per-slide config JSON helpers
  const getSlideConfigValue = (slide, key) => {
    try {
      const cfg = slide.config
        ? (typeof slide.config === 'string' ? JSON.parse(slide.config) : slide.config)
        : {};
      return cfg[key] ?? '';
    } catch { return ''; }
  };

  const setSlideConfigValue = (idx, key, value) => {
    const slide = slides[idx];
    let cfg = {};
    try {
      cfg = slide.config
        ? (typeof slide.config === 'string' ? JSON.parse(slide.config) : slide.config)
        : {};
    } catch {}
    cfg[key] = value;
    updateSlide(idx, 'config', JSON.stringify(cfg));
  };

  // ── styles ─────────────────────────────────────────────────────────────────

  const inputStyle = {
    width: '100%',
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: 8,
    padding: '9px 12px',
    color: '#fff',
    fontSize: 14,
    outline: 'none',
    boxSizing: 'border-box',
  };

  const labelStyle = {
    display: 'block',
    fontSize: 12,
    fontWeight: 500,
    color: 'rgba(255,255,255,0.55)',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  };

  const currentSlide = slides[activeSlide] || {};

  // ── render ─────────────────────────────────────────────────────────────────

  return (
    <div className="step-container">
      <div className="step-header">
        <h2 className="step-title">Slides</h2>
        <p className="step-subtitle">
          Add and configure slides for this banner. Each slide can have its own image, text, and CTA.
        </p>
      </div>

      {/* ── Slide Tabs ── */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24, alignItems: 'center' }}>
        {slides.map((slide, i) => (
          <button
            key={slide.id || i}
            type="button"
            onClick={() => setActiveSlide(i)}
            style={{
              padding: '7px 14px',
              borderRadius: 8,
              border: i === activeSlide
                ? '1px solid var(--premium-primary, #00d9ff)'
                : '1px solid rgba(255,255,255,0.12)',
              background: i === activeSlide
                ? 'rgba(0,217,255,0.12)'
                : 'rgba(255,255,255,0.04)',
              color: i === activeSlide ? '#00d9ff' : 'rgba(255,255,255,0.6)',
              fontSize: 13,
              fontWeight: i === activeSlide ? 600 : 400,
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            Slide {i + 1}
            {slide.title && (
              <span style={{ opacity: 0.6, marginLeft: 4, fontSize: 11 }}>
                — {slide.title.slice(0, 16)}{slide.title.length > 16 ? '…' : ''}
              </span>
            )}
          </button>
        ))}
        <button
          type="button"
          onClick={addSlide}
          style={{
            padding: '7px 14px',
            borderRadius: 8,
            border: '1px dashed rgba(0,217,255,0.4)',
            background: 'transparent',
            color: '#00d9ff',
            fontSize: 13,
            cursor: 'pointer',
          }}
        >
          + Add Slide
        </button>
      </div>

      {/* ── Active Slide Editor ── */}
      <div style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 12,
        padding: 24,
      }}>
        {/* Slide actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.8)' }}>
            Editing Slide {activeSlide + 1} of {slides.length}
          </span>
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="button" onClick={() => moveSlide(activeSlide, -1)} disabled={activeSlide === 0}
              style={{ padding: '5px 10px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, color: '#fff', cursor: 'pointer', fontSize: 12, opacity: activeSlide === 0 ? 0.4 : 1 }}
            >↑ Move Up</button>
            <button type="button" onClick={() => moveSlide(activeSlide, 1)} disabled={activeSlide === slides.length - 1}
              style={{ padding: '5px 10px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, color: '#fff', cursor: 'pointer', fontSize: 12, opacity: activeSlide === slides.length - 1 ? 0.4 : 1 }}
            >↓ Move Down</button>
            {slides.length > 1 && (
              <button type="button" onClick={() => removeSlide(activeSlide)}
                style={{ padding: '5px 10px', background: 'rgba(255,71,87,0.15)', border: '1px solid rgba(255,71,87,0.3)', borderRadius: 6, color: '#ff4757', cursor: 'pointer', fontSize: 12 }}
              >🗑 Remove</button>
            )}
          </div>
        </div>

        {/* Image fields */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          <div>
            <label style={labelStyle}>Background Image URL</label>
            <input
              type="url"
              value={currentSlide.background_image_url || ''}
              onChange={(e) => updateSlide(activeSlide, 'background_image_url', e.target.value)}
              placeholder="https://assets.8jjgames.com/..."
              style={inputStyle}
            />
            {currentSlide.background_image_url && (
              <img
                src={currentSlide.background_image_url}
                alt="bg preview"
                style={{ width: '100%', height: 80, objectFit: 'cover', borderRadius: 6, marginTop: 6, border: '1px solid rgba(255,255,255,0.1)' }}
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            )}
          </div>
          <div>
            <label style={labelStyle}>Character / Logo Image URL</label>
            <input
              type="url"
              value={currentSlide.logo_url || ''}
              onChange={(e) => updateSlide(activeSlide, 'logo_url', e.target.value)}
              placeholder="https://assets.8jjgames.com/..."
              style={inputStyle}
            />
            {currentSlide.logo_url && (
              <img
                src={currentSlide.logo_url}
                alt="char preview"
                style={{ width: '100%', height: 80, objectFit: 'contain', borderRadius: 6, marginTop: 6, border: '1px solid rgba(255,255,255,0.1)' }}
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            )}
          </div>
        </div>

        {/* Video URL — only for video_hero */}
        {isVideoHero && (
          <div style={{ marginBottom: 16, padding: '12px 16px', background: 'rgba(0,217,255,0.06)', border: '1px solid rgba(0,217,255,0.2)', borderRadius: 8 }}>
            <label style={{ ...labelStyle, color: '#00d9ff' }}>🎬 Video URL (per-slide)</label>
            <input
              type="url"
              value={getSlideConfigValue(currentSlide, 'videoUrl')}
              onChange={(e) => setSlideConfigValue(activeSlide, 'videoUrl', e.target.value)}
              placeholder="https://cdn.example.com/promo.mp4"
              style={inputStyle}
            />
            <div style={{ marginTop: 10 }}>
              <label style={labelStyle}>Video MIME Type</label>
              <select
                value={getSlideConfigValue(currentSlide, 'videoType') || 'video/mp4'}
                onChange={(e) => setSlideConfigValue(activeSlide, 'videoType', e.target.value)}
                style={{ ...inputStyle, cursor: 'pointer' }}
              >
                <option value="video/mp4">video/mp4</option>
                <option value="video/webm">video/webm</option>
                <option value="video/ogg">video/ogg</option>
              </select>
            </div>
          </div>
        )}

        {/* Promo Code — only for redeem */}
        {isRedeem && (
          <div style={{ marginBottom: 16, padding: '12px 16px', background: 'rgba(0,255,136,0.06)', border: '1px solid rgba(0,255,136,0.2)', borderRadius: 8 }}>
            <label style={{ ...labelStyle, color: '#00ff88' }}>🎟 Promo Code (per-slide)</label>
            <input
              type="text"
              value={getSlideConfigValue(currentSlide, 'promoCode')}
              onChange={(e) => setSlideConfigValue(activeSlide, 'promoCode', e.target.value)}
              placeholder="BONUS100"
              style={{ ...inputStyle, fontFamily: 'monospace', letterSpacing: 2 }}
            />
          </div>
        )}

        {/* Countdown targetDate — only for countdown */}
        {isCountdown && (
          <div style={{ marginBottom: 16, padding: '12px 16px', background: 'rgba(255,107,53,0.06)', border: '1px solid rgba(255,107,53,0.2)', borderRadius: 8 }}>
            <label style={{ ...labelStyle, color: '#ff6b35' }}>⏱ Target Date (per-slide)</label>
            <input
              type="datetime-local"
              value={getSlideConfigValue(currentSlide, 'targetDate')
                ? new Date(getSlideConfigValue(currentSlide, 'targetDate')).toISOString().slice(0, 16)
                : ''}
              onChange={(e) => setSlideConfigValue(activeSlide, 'targetDate', new Date(e.target.value).toISOString())}
              style={{ ...inputStyle, colorScheme: 'dark' }}
            />
          </div>
        )}

        {/* Text fields */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          <div>
            <label style={labelStyle}>Badge Text</label>
            <input
              type="text"
              value={currentSlide.badge_text || ''}
              onChange={(e) => updateSlide(activeSlide, 'badge_text', e.target.value)}
              placeholder="NEW OFFER"
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>Eyebrow / Highlight Text</label>
            <input
              type="text"
              value={currentSlide.title_highlight || ''}
              onChange={(e) => updateSlide(activeSlide, 'title_highlight', e.target.value)}
              placeholder="Limited Time Only"
              style={inputStyle}
            />
          </div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Title *</label>
          <input
            type="text"
            value={currentSlide.title || ''}
            onChange={(e) => updateSlide(activeSlide, 'title', e.target.value)}
            placeholder="Get 100% Bonus on First Deposit"
            style={{ ...inputStyle, fontSize: 15 }}
          />
          {errors[`slide_${activeSlide}_title`] && (
            <p style={{ color: '#ff4757', fontSize: 12, marginTop: 4 }}>
              {errors[`slide_${activeSlide}_title`]}
            </p>
          )}
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Subtitle</label>
          <textarea
            value={currentSlide.subtitle || ''}
            onChange={(e) => updateSlide(activeSlide, 'subtitle', e.target.value)}
            placeholder="Play your favourite games with extra funds."
            rows={2}
            style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.5 }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          <div>
            <label style={labelStyle}>CTA Button Text</label>
            <input
              type="text"
              value={currentSlide.cta_text || ''}
              onChange={(e) => updateSlide(activeSlide, 'cta_text', e.target.value)}
              placeholder="Claim Now"
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>CTA Link / URL</label>
            <input
              type="text"
              value={currentSlide.cta_link || ''}
              onChange={(e) => updateSlide(activeSlide, 'cta_link', e.target.value)}
              placeholder="/promotions or https://..."
              style={inputStyle}
            />
          </div>
        </div>

        {/* Per-slide accent color */}
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Per-slide Accent Color (optional)</label>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <input
              type="color"
              value={getSlideConfigValue(currentSlide, 'accentColor') || '#00ff88'}
              onChange={(e) => setSlideConfigValue(activeSlide, 'accentColor', e.target.value)}
              style={{ width: 40, height: 36, border: '1px solid rgba(255,255,255,0.15)', borderRadius: 6, cursor: 'pointer', padding: 2, background: 'rgba(255,255,255,0.06)' }}
            />
            <input
              type="text"
              value={getSlideConfigValue(currentSlide, 'accentColor') || ''}
              onChange={(e) => setSlideConfigValue(activeSlide, 'accentColor', e.target.value)}
              placeholder="Leave blank to use banner accent"
              style={{ ...inputStyle, flex: 1 }}
            />
          </div>
        </div>
      </div>

      {/* Slides summary */}
      {slides.length > 1 && (
        <div style={{ marginTop: 16, fontSize: 12, color: 'rgba(255,255,255,0.4)', textAlign: 'center' }}>
          {slides.length} slides configured • Click a tab above to switch between slides
        </div>
      )}
    </div>
  );
}