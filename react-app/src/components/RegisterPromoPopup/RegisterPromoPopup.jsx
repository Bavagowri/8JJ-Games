// react-app/src/components/RegisterPromoPopup/RegisterPromoPopup.jsx

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./RegisterPromoPopup.css";

export default function RegisterPromoPopup({ isLoggedIn }) {
  const [open,     setOpen]     = useState(false);
  const [dontShow, setDontShow] = useState(false);
  const [closing,  setClosing]  = useState(false);
  const [particles,setParticles]= useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const hidden = localStorage.getItem("hideRegisterPopup");
    if (!isLoggedIn && !hidden) {
      const t = setTimeout(() => setOpen(true), 2000);
      return () => clearTimeout(t);
    }
  }, [isLoggedIn]);

  // Generate sparkle particles when popup opens
  useEffect(() => {
    if (open) {
      setParticles(
        Array.from({ length: 18 }, (_, i) => ({
          id:       i,
          x:        Math.random() * 100,
          y:        Math.random() * 100,
          size:     Math.random() * 4 + 2,
          delay:    Math.random() * 1.5,
          duration: Math.random() * 2 + 1.5,
        }))
      );
    }
  }, [open]);

  const triggerClose = () => {
    setClosing(true);
    setTimeout(() => {
      if (dontShow) localStorage.setItem("hideRegisterPopup", "true");
      setOpen(false);
      setClosing(false);
    }, 380);
  };

  if (!open) return null;

  return (
    <div className={`rp-overlay${closing ? " rp-overlay--out" : ""}`}>

      {/* Ambient glow blobs */}
      <div className="rp-blob rp-blob--a" />
      <div className="rp-blob rp-blob--b" />

      <div className={`rp-popup${closing ? " rp-popup--out" : ""}`}>

        {/* Floating sparkle particles */}
        <div className="rp-particles" aria-hidden="true">
          {particles.map((p) => (
            <span
              key={p.id}
              className="rp-particle"
              style={{
                left:              `${p.x}%`,
                top:               `${p.y}%`,
                width:             p.size,
                height:            p.size,
                animationDelay:    `${p.delay}s`,
                animationDuration: `${p.duration}s`,
              }}
            />
          ))}
        </div>

        {/* Top shimmer accent bar */}
        <div className="rp-topbar" />

        {/* Image with vignette + shine sweep */}
        <div className="rp-image-wrap">
          <img
            src="/images/register-refer.png"
            alt="Register and Refer"
            className="rp-image"
          />
          <div className="rp-image-vignette" />
          <div className="rp-image-shine" />
        </div>

        {/* Content card */}
        <div className="rp-content">

          {/* Corner bracket accents */}
          <div className="rp-corner rp-corner--tl" />
          <div className="rp-corner rp-corner--tr" />

          {/* Badge */}
          <div className="rp-badge">
            <span className="rp-badge-dot" />
            EXCLUSIVE OFFER
          </div>

          <h3 className="rp-title">Earn Points &amp; Rewards </h3>

          <p className="rp-desc">
            Register your account and start earning points by playing
            games, sharing with friends and making predictions.
          </p>

          {/* Primary CTA */}
          <button
            className="rp-btn"
            onClick={() => { navigate("/register"); triggerClose(); }}
          >
            <span className="rp-btn-text">Register Now</span>
            <span className="rp-btn-shine" />
          </button>

          {/* Cancel */}
          <button className="rp-btn--cancel" onClick={triggerClose}>
            Cancel
          </button>

          {/* Don't show again */}
          <label className="rp-checkbox">
            <span className="rp-checkbox-box">
              <input
                type="checkbox"
                checked={dontShow}
                onChange={(e) => setDontShow(e.target.checked)}
              />
              <span className="rp-checkbox-tick">{dontShow ? "✓" : ""}</span>
            </span>
            Don't show again
          </label>

        </div>
      </div>
    </div>
  );
}