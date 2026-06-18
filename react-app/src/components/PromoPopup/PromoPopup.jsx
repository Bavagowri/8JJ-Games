// react-app/src/components/PromoPopup/PromoPopup.jsx
import { useState, useEffect, useRef } from "react";
import "./PromoPopup.css";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import { translate } from "../../data/translations";

export default function PromoPopup({
  image,
  title,
  description,
  buttonText,
  onButtonClick,
  buttonLink,
  storageKey
}) {
  const { lang } = useLanguage();
  const [open, setOpen] = useState(false);
  const [dontShow, setDontShow] = useState(false);
  const [closing, setClosing] = useState(false);
  const [particles, setParticles] = useState([]);
  const navigate = useNavigate();
  const canvasRef = useRef(null);

  useEffect(() => {
    const hidden = localStorage.getItem(storageKey);
    if (!hidden) {
      const timer = setTimeout(() => setOpen(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [storageKey]);

  // Generate sparkle particles on open
  useEffect(() => {
    if (open) {
      const pts = Array.from({ length: 18 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 2,
        delay: Math.random() * 1.5,
        duration: Math.random() * 2 + 1.5,
      }));
      setParticles(pts);
    }
  }, [open]);

  const triggerClose = () => {
    setClosing(true);
    setTimeout(() => {
      if (dontShow) localStorage.setItem(storageKey, "true");
      setOpen(false);
      setClosing(false);
    }, 380);
  };

  if (!open) return null;

  return (
    <div className={`promo-overlay ${closing ? "promo-overlay--out" : ""}`}>
      {/* Ambient glow blobs */}
      <div className="promo-blob promo-blob--a" />
      <div className="promo-blob promo-blob--b" />

      <div className={`promo-popup ${closing ? "promo-popup--out" : ""}`}>

        {/* Particles */}
        <div className="promo-particles" aria-hidden="true">
          {particles.map((p) => (
            <span
              key={p.id}
              className="promo-particle"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: p.size,
                height: p.size,
                animationDelay: `${p.delay}s`,
                animationDuration: `${p.duration}s`,
              }}
            />
          ))}
        </div>

        {/* Top gradient bar */}
        <div className="promo-topbar" />



        {/* Image section with overlay vignette */}
        <div className="promo-image-wrap">
          <img src={image} className="promo-image" alt={title} />
          <div className="promo-image-vignette" />
          <div className="promo-image-shine" />
        </div>

        {/* Content card */}
        <div className="promo-content">

          {/* Decorative corner accents */}
          <div className="promo-corner promo-corner--tl" />
          <div className="promo-corner promo-corner--tr" />

          {/* Badge */}
          <div className="promo-badge">
            <span className="promo-badge-dot" />
            {translate("promo_popup_exclusive_offer", lang)}
          </div>

          <h3 className="promo-title">{title}</h3>
          <p className="promo-desc">{description}</p>

          {/* CTA */}
          <button
            className="promo-btn"
            onClick={() => {
              if (onButtonClick) onButtonClick();
              if (buttonLink) navigate(buttonLink);
              triggerClose();
            }}
          >
            <span className="promo-btn-text">{buttonText}</span>

            <span className="promo-btn-shine" />
          </button>

          {/* Close button */}
          <button className="promo-btn--close" onClick={triggerClose} aria-label="Close">
            <span className="promo-close-icon">{translate("promo_popup_cancel", lang)}</span>
          </button>

          {/* Dismiss */}
          <label className="promo-checkbox">
            <span className="promo-checkbox-box">
              <input
                type="checkbox"
                checked={dontShow}
                onChange={(e) => setDontShow(e.target.checked)}
              />
              <span className="promo-checkbox-tick">{dontShow ? "✓" : ""}</span>
            </span>
            {translate("promo_popup_dont_show_again", lang)}
          </label>

        </div>
      </div>
    </div>
  );
}