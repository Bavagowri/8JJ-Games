
// react-app/src/pages/admin/BannerManagement/BannerCreate.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Save, Eye } from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import { bannerAPI } from '../../../api/banner.api';

import StepBasicInfo         from './steps/StepBasicInfo';
import StepTemplateSelection from './steps/StepTemplateSelection';
import StepSlides            from './steps/StepSlides';
import StepConfiguration     from './steps/StepConfiguration';
import BannerPreview         from './components/BannerPreview';

import './BannerCreate.css';

const STEPS = [
  { id: 1, label: 'Basic Info',    short: 'Info'     },
  { id: 2, label: 'Template',      short: 'Template'  },
  { id: 3, label: 'Slides',        short: 'Slides'    },
  { id: 4, label: 'Configuration', short: 'Config'    },
];

const INITIAL_FORM = {
  name:          '',
  subtitle:      '',
  priority:      10,
  is_active:     true,
  start_date:    '',
  end_date:      '',
  template_id:   null,
  template_type: '',
  placement_id:  null,
  slides:        [],   // ← starts empty; StepSlides seeds one empty slide locally
  config:        {},
};

export default function BannerCreate() {
  const navigate       = useNavigate();
  const { id }         = useParams();
  const [searchParams] = useSearchParams();
  const isEditMode     = Boolean(id);

  const [currentStep, setCurrentStep] = useState(1);
  const [formData,    setFormData]    = useState(INITIAL_FORM);
  const [errors,      setErrors]      = useState({});
  const [saving,      setSaving]      = useState(false);
  const [loading,     setLoading]     = useState(isEditMode);
  const [showPreview, setShowPreview] = useState(false);
  const [templates,   setTemplates]   = useState([]);
  const [placements,  setPlacements]  = useState([]);

  // ── Load templates & placements ─────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const [tmpl, plac] = await Promise.all([
          bannerAPI.getTemplates(),
          bannerAPI.getPlacements(),
        ]);
        setTemplates(tmpl || []);
        setPlacements(plac || []);
      } catch (err) {
        console.error('Failed to load templates/placements:', err);
      }
    })();
  }, []);

  // ── Load existing banner in edit mode ───────────────────────
  useEffect(() => {
    if (!isEditMode) {
      const presetPlacement = searchParams.get('placement');
      if (presetPlacement) {
        setFormData(f => ({ ...f, placement_id: Number(presetPlacement) }));
      }
      return;
    }

    (async () => {
      try {
        const banner = await bannerAPI.getBanner(id);

        let config = banner.config || {};
        if (typeof config === 'string') {
          try { config = JSON.parse(config); } catch (_) { config = {}; }
        }

        const slides = (banner.slides || []).map(s => {
          let sc = s.config || {};
          if (typeof sc === 'string') {
            try { sc = JSON.parse(sc); } catch (_) { sc = {}; }
          }
          return {
            ...s,
            // Keep config as a plain object internally; StepSlides handles serialisation
            config: typeof sc === 'object' ? JSON.stringify(sc) : sc,
          };
        });

        console.log(`📋 Loaded banner ${id} — ${slides.length} slide(s)`);

        setFormData({
          name:          banner.name          || '',
          subtitle:      banner.subtitle      || '',
          priority:      banner.priority      ?? 10,
          is_active:     banner.is_active     !== false,
          start_date:    banner.start_date    ? banner.start_date.split('T')[0] : '',
          end_date:      banner.end_date      ? banner.end_date.split('T')[0]   : '',
          template_id:   banner.template_id   || null,
          template_type: banner.template_type || '',
          placement_id:  banner.placement_id  || null,
          slides,
          config,
        });
      } catch (err) {
        console.error('Failed to load banner:', err);
        alert('Failed to load banner data');
      } finally {
        setLoading(false);
      }
    })();
  }, [id, isEditMode]); // eslint-disable-line

 
  const handleStepChange = (updates) => {
    setFormData(prev => {
      const next = { ...prev, ...updates };

      // Guard: never overwrite a non-empty slides array with an empty one
      // (can happen if StepBasicInfo / StepTemplateSelection accidentally
      //  sends { slides: [] } through a stale closure).
      if (prev.slides?.length > 0 && updates.slides?.length === 0) {
        next.slides = prev.slides;
      }

      return next;
    });

    // Clear related errors
    setErrors(prev => {
      const next = { ...prev };
      Object.keys(updates).forEach(k => delete next[k]);
      return next;
    });
  };

  const handlePlacementChange = (placementId) => {
    setFormData(prev => ({ ...prev, placement_id: placementId }));
    setErrors(prev => { const n = { ...prev }; delete n.placement_id; return n; });
  };

  // ── Validation ───────────────────────────────────────────────
  const validate = (step) => {
    const errs = {};
    if (step === 1) {
      if (!formData.name?.trim()) errs.name = 'Banner name is required';
    }
    if (step === 2) {
      if (!formData.template_id)  errs.template_id  = 'Please select a template';
      if (!formData.placement_id) errs.placement_id = 'Please select a placement';
    }
    if (step === 3) {
      if (!formData.slides || formData.slides.length === 0) {
        errs.slides = 'At least one slide is required';
      } else {
        formData.slides.forEach((s, i) => {
          if (!s.title?.trim()) errs[`slide_${i}_title`] = 'Slide title is required';
        });
      }
    }
    return errs;
  };

  const goNext = () => {
    const errs = validate(currentStep);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setCurrentStep(s => Math.min(s + 1, STEPS.length));
  };

  const goPrev = () => setCurrentStep(s => Math.max(s - 1, 1));

  // ── Save ─────────────────────────────────────────────────────
  const handleSave = async () => {
    // Validate all steps
    let allErrs = {};
    for (let i = 1; i <= STEPS.length; i++) {
      Object.assign(allErrs, validate(i));
    }
    if (Object.keys(allErrs).length) {
      setErrors(allErrs);
      if (allErrs.name) setCurrentStep(1);
      else if (allErrs.template_id || allErrs.placement_id) setCurrentStep(2);
      else if (allErrs.slides || Object.keys(allErrs).some(k => k.startsWith('slide_'))) setCurrentStep(3);
      return;
    }

    setSaving(true);
    try {
      const slides = (formData.slides || []).map((s, i) => {
        let configVal = s.config || {};
        if (typeof configVal === 'string') {
          try { configVal = JSON.parse(configVal); } catch (_) { configVal = {}; }
        }
        return {
          // Only include `id` for real DB rows (not temp_ ids from new slides)
          ...(s.id && !String(s.id).startsWith('new_') ? { id: s.id } : {}),
          title:                s.title || '',
          title_highlight:      s.title_highlight || '',
          subtitle:             s.subtitle || '',
          badge_text:           s.badge_text || '',
          cta_text:             s.cta_text || '',
          cta_link:             s.cta_link || '',
          background_image_url: s.background_image_url || '',
          logo_url:             s.logo_url || '',
          config:               configVal,
          order_position:       i,
        };
      });

      const payload = {
        name:         formData.name.trim(),
        subtitle:     formData.subtitle?.trim() || null,
        priority:     formData.priority,
        is_active:    formData.is_active,
        start_date:   formData.start_date || null,
        end_date:     formData.end_date   || null,
        template_id:  formData.template_id,
        placement_id: formData.placement_id,
        config:       formData.config || {},
        slides,
      };

      console.log(`💾 Saving banner — ${slides.length} slide(s)`, payload);

      if (isEditMode) {
        await bannerAPI.updateBanner(id, payload);
      } else {
        await bannerAPI.createBanner(payload);
      }

      navigate('/admin/banners');
    } catch (err) {
      console.error('Save failed:', err);
      alert(`Failed to save banner: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  // ── Render ───────────────────────────────────────────────────
  if (loading) {
    return (
      <AdminLayout>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 300 }}>
          <div className="loading-spinner" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="banner-create">
        {/* Header */}
        <div className="banner-create-header">
          <button className="admin-back-btn btn btn-primary" onClick={() => navigate('/admin/banners')}>
            <ArrowLeft size={18} />
            Back to Banners
          </button>
          <div>
            <h1 className="banner-create-title">
              {isEditMode ? 'Edit Banner' : 'Create Banner'}
            </h1>
            <p className="banner-create-subtitle">
              {isEditMode ? `Editing: ${formData.name}` : 'Configure your new banner below'}
            </p>
          </div>
        </div>

        {/* Step progress */}
        <div className="steps-header">
          {STEPS.map((step, i) => (
            <div
              key={step.id}
              className={`step-item ${currentStep === step.id ? 'active' : ''} ${currentStep > step.id ? 'completed' : ''}`}
              onClick={() => currentStep > step.id && setCurrentStep(step.id)}
              style={{ cursor: currentStep > step.id ? 'pointer' : 'default' }}
            >
              <div className="step-number">
                {currentStep > step.id ? '✓' : step.id}
              </div>
              <span className="step-label">{step.label}</span>
              {i < STEPS.length - 1 && <div className="step-connector" />}
            </div>
          ))}
        </div>

        {/* Step content */}
        <div className="banner-create-body">
          {currentStep === 1 && (
            <StepBasicInfo
              formData={formData}
              onChange={handleStepChange}
              errors={errors}
            />
          )}
          {currentStep === 2 && (
            <StepTemplateSelection
              formData={formData}
              onChange={handleStepChange}
              onPlacementChange={handlePlacementChange}
              errors={errors}
              templates={templates}
              placements={placements}
            />
          )}
          {currentStep === 3 && (
            <StepSlides
              formData={formData}
              onChange={handleStepChange}
              errors={errors}
            />
          )}
          {currentStep === 4 && (
            <StepConfiguration
              formData={formData}
              onChange={handleStepChange}
              templateType={formData.template_type}
            />
          )}
        </div>

        {/* Footer navigation */}
        <div className="banner-create-footer">
          <div style={{ display: 'flex', gap: 10 }}>
            {currentStep > 1 && (
              <button className="admin-button admin-button-secondary" onClick={goPrev}>
                ← Previous
              </button>
            )}
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            {currentStep >= 3 && formData.slides?.length > 0 && (
              <button
                className="admin-button admin-button-secondary"
                onClick={() => setShowPreview(true)}
              >
                <Eye size={16} />
                Preview
              </button>
            )}

            {currentStep < STEPS.length ? (
              <button className="admin-button admin-button-primary" onClick={goNext}>
                Next →
              </button>
            ) : (
              <button
                className="admin-button admin-button-primary"
                onClick={handleSave}
                disabled={saving}
              >
                <Save size={16} />
                {saving ? 'Saving…' : isEditMode ? 'Update Banner' : 'Create Banner'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Preview modal */}
      {showPreview && (
        <BannerPreview
          formData={formData}
          templates={templates}
          placements={placements}
          onClose={() => setShowPreview(false)}
          onConfirm={() => { setShowPreview(false); handleSave(); }}
        />
      )}
    </AdminLayout>
  );
}