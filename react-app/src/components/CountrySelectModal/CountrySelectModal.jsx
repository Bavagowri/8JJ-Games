import { useState } from "react";
import { useProfile } from "../../context/ProfileContext";
import "./CountrySelectModal.css";
import { updateProfile } from "../../api/profile.api";
import { useLanguage } from "../../context/LanguageContext";
import { translate } from "../../data/translations";


const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5050";

const COUNTRIES = [
  { code: "LK", name: "Sri Lanka 🇱🇰" },
  { code: "IN", name: "India 🇮🇳" },
  { code: "US", name: "United States 🇺🇸" },
  { code: "UK", name: "United Kingdom 🇬🇧" },
  { code: "CA", name: "Canada 🇨🇦" },
  { code: "AU", name: "Australia 🇦🇺" },
  { code: "BN", name: "Bangladesh 🇧🇩" },
  { code: "PK", name: "Pakistan 🇵🇰" },

];

export default function CountrySelectModal({ onSaved, onClose }) {
  const { refreshProfile } = useProfile();
  const { lang } = useLanguage();
  const [country, setCountry] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    if (!country) {
      setError("Please select a country");
      return;
    }

    try {
      setSaving(true);
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const res = await fetch(`${API_BASE}/api/profile`, {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ country })
        });


      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to save country");
      }

      await refreshProfile(); // 🔁 refresh profile context
      await updateProfile({ country });
      // console.log("✅ Country saved:", country);
      onSaved();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
      setLoading(false);
    }
  };

  return (
    <div className="country-modal-backdrop">
      <div className="country-modal">
        <h2>{translate("select_country_title", lang)}</h2>
        <p>{translate("elect_country_subtitle", lang)} 🌍</p>

        <select
          value={country}
          onChange={(e) => setCountry(e.target.value)}
        >
          <option value="">-- {translate("select_country_placeholder", lang)} --</option>
          {COUNTRIES.map((c) => (
            <option key={c.code} value={c.code}>
              {c.name}
            </option>
          ))}
        </select>

        {error && <p className="error-text">{error}</p>}

        {/* <button onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Continue"}
        </button> */}

        <div className="modal-actions">
          <button type="button" onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </button>
        </div>

      </div>
    </div>
  );
}
