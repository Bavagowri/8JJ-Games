// react-app/src/pages/mobile/predictions/MobilePredictionShared.jsx

import { useState } from "react";

export const API_URL = import.meta.env.VITE_API_URL || "";

export function fmt(str) {
  if (!str) return "TBA";
  const d = new Date(String(str).replace(" ", "T"));
  if (isNaN(d)) return "TBA";
  return d.toLocaleString("en-US", { month:"short", day:"numeric", hour:"2-digit", minute:"2-digit" });
}

export function fmtLong(str) {
  if (!str) return "TBA";
  const d = new Date(String(str).replace(" ", "T"));
  if (isNaN(d)) return "TBA";
  return d.toLocaleString("en-US", { weekday:"short", month:"short", day:"numeric", hour:"2-digit", minute:"2-digit" });
}

export function initials(n="") { return n.slice(0,2).toUpperCase(); }

export function TeamLogo({ name, logo, size = 40 }) {
  const [err, setErr] = useState(false);
  return (
    <div className="pa-logo" style={{ width: size, height: size, fontSize: size * 0.36 }}>
      {logo && !err
        ? <img src={logo} alt={name} onError={() => setErr(true)} />
        : <span>{initials(name)}</span>}
    </div>
  );
}

export function Avatar({ src, fallback, style = {} }) {
  const [err, setErr] = useState(false);
  if (!err && src)
    return <img src={`${API_URL}${src}`} alt={fallback} onError={() => setErr(true)}
             style={{ width:"100%", height:"100%", objectFit:"cover", borderRadius:"50%", ...style }} />;
  return <span>{(fallback||"?")[0].toUpperCase()}</span>;
}