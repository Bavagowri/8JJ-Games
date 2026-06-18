

// react-app/src/pages/admin/BannerManagement/steps/StepTemplateSelection.jsx
import { useState, useEffect } from 'react';
import { Info, CheckCircle2 } from 'lucide-react';
import './Steps.css';

// Map template_type to display info
const TEMPLATE_INFO = {
  hero:                  { icon: '🎠', label: 'Hero Carousel',       desc: 'Full-width image carousel with swipe & dots. Best for homepage hero.' },
  promo:                 { icon: '🎯', label: 'Promo Banner',         desc: 'Wide card — headline left, character right, CTA. Carousel if multiple slides.' },
  multi_panel:           { icon: '🪟', label: 'Multi-Panel',          desc: '2–3 promo panels side by side simultaneously. Each slide = one panel.' },
  split_hero:            { icon: '⬛', label: 'Split Hero',            desc: '45/55 split — dark text left, full-bleed image right. Carousel.' },
  countdown:             { icon: '⏱',  label: 'Countdown Banner',     desc: 'Live countdown timer + promo text. Set targetDate per-slide.' },
  promo_grid:            { icon: '🔲', label: 'Promo Grid',           desc: '2×2 or 2×3 grid of image cards — each slide is one cell.' },
  wide_strip:            { icon: '📣', label: 'Wide Strip',           desc: 'Thin full-width strip with scrolling marquee text + CTA.' },
  carousel_cards:        { icon: '🃏', label: 'Carousel Cards',       desc: 'Horizontal scrollable row of promo cards with arrow navigation.' },
  video_hero:            { icon: '🎬', label: 'Video Hero',            desc: 'Full-width video background hero. Falls back to image if no video.' },
  floating_announcement: { icon: '💬', label: 'Floating Announcement', desc: 'Fixed pill at corner — expands to promo card on click.' },
  announcement_bar:      { icon: '📢', label: 'Announcement Bar',     desc: 'Thin dismissible bar with ticker text. Site-wide announcements.' },
  redeem:                { icon: '🎟', label: 'Redeem Banner',        desc: 'Promo card with code display + clipboard copy button.' },
  popup:                 { icon: '🪄', label: 'Popup Banner',         desc: 'Modal popup overlay — appears after delay, dismiss via X.' },
};

export default function StepTemplateSelection({
  formData,
  onChange,
  onPlacementChange,
  errors = {},
  templates = [],
  placements = [],
}) {
  const [selectedTemplate, setSelectedTemplate] = useState(formData.template_id || null);
  const [selectedPlacement, setSelectedPlacement] = useState(formData.placement_id || null);

  // Active templates only
  const activeTemplates = templates.filter(t => t.is_active);

  // Filter placements by the selected template
  const filteredPlacements = selectedTemplate
    ? placements.filter(p => {
        if (!p.is_active) return false;
        // allowed_templates is an array of integer IDs
        const allowed = Array.isArray(p.allowed_templates)
          ? p.allowed_templates
          : (typeof p.allowed_templates === 'string'
            ? JSON.parse(p.allowed_templates || '[]')
            : []);
        return allowed.length === 0 || allowed.includes(Number(selectedTemplate));
      })
    : placements.filter(p => p.is_active);

  // Reset placement when template changes
  useEffect(() => {
    if (selectedTemplate && selectedPlacement) {
      const stillValid = filteredPlacements.some(p => p.id === selectedPlacement);
      if (!stillValid) {
        setSelectedPlacement(null);
        onPlacementChange?.(null);
      }
    }
  }, [selectedTemplate]); // eslint-disable-line

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template.id);
    onChange({
      template_id:   template.id,
      template_type: template.template_type,
      component:     template.component_name,
    });
  };

  const handlePlacementSelect = (placement) => {
    setSelectedPlacement(placement.id);
    onPlacementChange?.(placement.id);
  };

  return (
    <div className="step-container">
      <div className="step-header">
        <h2 className="step-title">Template & Placement</h2>
        <p className="step-subtitle">
          Choose the banner type and where it will appear on the site.
        </p>
      </div>

      {/* ── TEMPLATE SELECTION ── */}
      <section style={{ marginBottom: 36 }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 }}>
          Banner Template
        </h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: 12,
        }}>
          {activeTemplates.map(template => {
            const info = TEMPLATE_INFO[template.template_type] || { icon: '🖼', label: template.name, desc: template.description };
            const isSelected = selectedTemplate === template.id;

            return (
              <button
                key={template.id}
                type="button"
                onClick={() => handleTemplateSelect(template)}
                style={{
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  gap: 6,
                  padding: '14px 16px',
                  borderRadius: 12,
                  border: isSelected
                    ? '2px solid var(--premium-primary, #00d9ff)'
                    : '1px solid rgba(255,255,255,0.1)',
                  background: isSelected
                    ? 'rgba(0,217,255,0.1)'
                    : 'rgba(255,255,255,0.04)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s',
                }}
              >
                {isSelected && (
                  <CheckCircle2 size={16} style={{ position: 'absolute', top: 10, right: 10, color: '#00d9ff' }} />
                )}
                <span style={{ fontSize: 22 }}>{info.icon}</span>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: isSelected ? '#00d9ff' : '#fff', marginBottom: 3 }}>
                    {info.label}
                  </div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', lineHeight: 1.4 }}>
                    {info.desc}
                  </div>
                </div>
                <div style={{ marginTop: 4 }}>
                  <code style={{
                    fontSize: 10,
                    background: 'rgba(255,255,255,0.08)',
                    padding: '2px 6px',
                    borderRadius: 4,
                    color: 'rgba(255,255,255,0.4)',
                    fontFamily: 'monospace',
                  }}>
                    {template.template_type}
                  </code>
                </div>
              </button>
            );
          })}
        </div>

        {errors.template_id && (
          <p style={{ color: '#ff4757', fontSize: 13, marginTop: 10, display: 'flex', alignItems: 'center', gap: 5 }}>
            <Info size={14} /> {errors.template_id}
          </p>
        )}
      </section>

      {/* ── PLACEMENT SELECTION ── */}
      <section>
        <h3 style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 }}>
          Placement
          {selectedTemplate && filteredPlacements.length === 0 && (
            <span style={{ marginLeft: 10, fontSize: 11, color: '#ff4757', textTransform: 'none', fontWeight: 400 }}>
              No placements allow this template
            </span>
          )}
        </h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: 10,
        }}>
          {(selectedTemplate ? filteredPlacements : placements.filter(p => p.is_active)).map(placement => {
            const isSelected = selectedPlacement === placement.id;
            return (
              <button
                key={placement.id}
                type="button"
                onClick={() => handlePlacementSelect(placement)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 4,
                  padding: '12px 14px',
                  borderRadius: 10,
                  border: isSelected
                    ? '2px solid #00ff88'
                    : '1px solid rgba(255,255,255,0.1)',
                  background: isSelected
                    ? 'rgba(0,255,136,0.08)'
                    : 'rgba(255,255,255,0.03)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s',
                }}
              >
                <div style={{ fontSize: 13, fontWeight: 600, color: isSelected ? '#00ff88' : '#fff' }}>
                  {placement.name}
                </div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace' }}>
                  {placement.placement_key}
                </div>
                {placement.page_route && (
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>
                    {placement.page_route}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {errors.placement_id && (
          <p style={{ color: '#ff4757', fontSize: 13, marginTop: 10, display: 'flex', alignItems: 'center', gap: 5 }}>
            <Info size={14} /> {errors.placement_id}
          </p>
        )}
      </section>
    </div>
  );
}