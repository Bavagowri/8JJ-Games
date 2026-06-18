// react-app/src/pages/Profile/sections/Security.jsx
import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../../context/LanguageContext";
import { translate } from "../../../data/translations";

const API_BASE = import.meta.env.VITE_API_URL;
if (!API_BASE) {
  throw new Error("❌ VITE_API_URL is not defined");
}

const ICONS = {
  key: "/images/icons/password.png",
  wrong: "/images/icons/wrong.png",
  warning: "/images/icons/warning.png"
};


export default function Security() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { lang } = useLanguage();
  
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showDeactivateConfirm, setShowDeactivateConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  // Check if user is using Google OAuth
  const isGoogleUser = user?.provider === 'google';

  // Calculate password strength
  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (password.length >= 12) strength += 25;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 20;
    if (/\d/.test(password)) strength += 15;
    if (/[^a-zA-Z0-9]/.test(password)) strength += 15;
    return Math.min(strength, 100);
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'newPassword') {
      setPasswordStrength(calculatePasswordStrength(value));
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validation
    if (passwordData.newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (passwordData.currentPassword === passwordData.newPassword) {
      setError("New password must be different from current password");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE}/api/profile/change-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to change password");
      }

      setSuccess("Password changed successfully! ✓");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
      setShowPasswordForm(false);
      setPasswordStrength(0);
      setShowPasswords({
        current: false,
        new: false,
        confirm: false
      });

    } catch (err) {
      console.error("Change password error:", err);
      setError(err.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivateAccount = async () => {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE}/api/profile/deactivate`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to deactivate account");
      }

      // Logout and redirect
      logout();
      navigate("/login");

    } catch (err) {
      console.error("Deactivate account error:", err);
      setError(err.message || "Failed to deactivate account");
    } finally {
      setLoading(false);
      setShowDeactivateConfirm(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== "DELETE") {
      setError(translate("security_error_confirm_delete", lang));
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE}/api/profile`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete account");
      }

      // Logout and redirect
      logout();
      navigate("/");

    } catch (err) {
      console.error("Delete account error:", err);
      setError(err.message || "Failed to delete account");
    } finally {
      setLoading(false);
      setShowDeleteConfirm(false);
      setDeleteConfirmText("");
    }
  };

  const getStrengthLabel = () => {
    if (passwordStrength < 40) return { 
      text: translate("security_strength_weak", lang), 
      color: "#ff416c" 
    };
    if (passwordStrength < 70) return { 
      text: translate("security_strength_medium", lang), 
      color: "#f5576c" 
    };
    return { 
      text: translate("security_strength_strong", lang), 
      color: "#00ff88" 
    };
  };

  return (
    <div className="profile-security-page">
      <h3 className="Profile-title">{translate("security_title", lang)}</h3>

      {error && (
        <div style={{
          padding: "12px 16px",
          background: "rgba(255, 65, 108, 0.15)",
          border: "1px solid rgba(255, 65, 108, 0.3)",
          borderRadius: "8px",
          color: "#ff416c",
          marginBottom: "20px"
        }}>
          ❌ {error}
        </div>
      )}

      {success && (
        <div style={{
          padding: "12px 16px",
          background: "rgba(0, 255, 136, 0.15)",
          border: "1px solid rgba(0, 255, 136, 0.3)",
          borderRadius: "8px",
          color: "#00ff88",
          marginBottom: "20px"
        }}>
          {success}
        </div>
      )}

      {/* Change Password */}
      <div className="security-card ThemeBox">
        {/* <h4>🔑 {translate("security_change_password", lang)}</h4> */}
        <h4>
          <img
            src={ICONS.key}
            alt=""
            aria-hidden="true"
            className="profile-section-icon"
          />
          {translate("security_change_password", lang)}
        </h4>
        {isGoogleUser ? (
          <div style={{
            padding: "16px",
            background: "rgba(79, 172, 254, 0.1)",
            borderRadius: "8px",
            color: "var(--text-muted)"
          }}>
            <p>{translate("security_google_signin", lang)}</p>
          </div>
        ) : !showPasswordForm ? (
          <div>
            <p>{translate("security_keep_account_secure", lang)}</p>
            <button
              className="secondary change-btn"
              onClick={() => setShowPasswordForm(true)}
            >
              {translate("security_change_password", lang)}
            </button>
          </div>
        ) : (
          <form onSubmit={handlePasswordSubmit} className="password-form">
            {/* Current Password */}
            <div style={{ position: "relative", marginBottom: "12px" }}>
              <input 
                type={showPasswords.current ? "text" : "password"}
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                placeholder={translate("security_current_password", lang)}
                required
                style={{
                  width: "100%",
                  paddingRight: "45px"
                }}
              />
              <button
                type="button"
                onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "18px",
                  padding: "4px",
                  opacity: 0.7,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
                aria-label={showPasswords.current ? translate("security_hide_password", lang) : translate("security_show_password", lang)}
              >
                {showPasswords.current ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"/>
                    <path d="M14.084 14.158a3 3 0 0 1-4.242-4.242"/>
                    <path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"/>
                    <path d="m2 2 20 20"/>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
            </div>

            {/* New Password */}
            <div style={{ position: "relative", marginBottom: "12px" }}>
              <input 
                type={showPasswords.new ? "text" : "password"}
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                placeholder={translate("security_new_password", lang)}
                required
                minLength={8}
                style={{
                  width: "100%",
                  paddingRight: "45px"
                }}
              />
              <button
                type="button"
                onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "18px",
                  padding: "4px",
                  opacity: 0.7,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
                aria-label={showPasswords.new ? translate("security_hide_password", lang) : translate("security_show_password", lang)}
              >
                {showPasswords.new ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"/>
                    <path d="M14.084 14.158a3 3 0 0 1-4.242-4.242"/>
                    <path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"/>
                    <path d="m2 2 20 20"/>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
            </div>

            {/* Confirm Password */}
            <div style={{ position: "relative", marginBottom: "16px" }}>
              <input 
                type={showPasswords.confirm ? "text" : "password"}
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                placeholder={translate("security_confirm_password", lang)}
                required
                style={{
                  width: "100%",
                  paddingRight: "45px"
                }}
              />
              <button
                type="button"
                onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "18px",
                  padding: "4px",
                  opacity: 0.7,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
                aria-label={showPasswords.confirm ? translate("security_hide_password", lang) : translate("security_show_password", lang)}
              >
                {showPasswords.confirm ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"/>
                    <path d="M14.084 14.158a3 3 0 0 1-4.242-4.242"/>
                    <path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"/>
                    <path d="m2 2 20 20"/>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
            </div>

            {/* Password strength indicator */}
            {passwordData.newPassword && (
              <div style={{ marginBottom: "20px" }}>
                <div style={{
                  fontSize: "12px",
                  color: "var(--text-muted)",
                  marginBottom: "8px",
                  display: "flex",
                  justifyContent: "space-between"
                }}>
                  <span>{translate("security_password_strength", lang)}</span>
                  <span style={{ color: getStrengthLabel().color, fontWeight: "600" }}>
                    {getStrengthLabel().text}
                  </span>
                </div>
                <div style={{
                  height: "8px",
                  background: "rgba(79, 172, 254, 0.2)",
                  borderRadius: "8px",
                  overflow: "hidden"
                }}>
                  <div style={{
                    height: "100%",
                    width: `${passwordStrength}%`,
                    background: `linear-gradient(90deg, ${getStrengthLabel().color} 0%, ${getStrengthLabel().color} 100%)`,
                    borderRadius: "8px",
                    transition: "all 0.3s ease"
                  }}></div>
                </div>
                <div style={{
                  fontSize: "11px",
                  color: "var(--text-muted)",
                  marginTop: "4px"
                }}>
                  {passwordStrength < 70 && translate("security_password_tip", lang)}
                </div>
              </div>
            )}

            <div className="security-actions">
              <button 
                type="submit"
                className="primary update-btn"
                disabled={loading}
                style={{
                  opacity: loading ? 0.7 : 1,
                  cursor: loading ? "not-allowed" : "pointer"
                }}
              >
                {loading ? translate("security_updating", lang) : translate("security_update_password", lang)}
              </button>
              <button
                type="button"
                className="cancel-btn"
                onClick={() => {
                  setShowPasswordForm(false);
                  setPasswordData({
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: ""
                  });
                  setPasswordStrength(0);
                  setShowPasswords({
                    current: false,
                    new: false,
                    confirm: false
                  });
                  setError("");
                }}
              >
                {translate("security_cancel", lang)}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Deactivate Account */}
      <div className=" security-card ThemeBox">
        {/* <h4>⚠️ {translate("security_deactivate_account", lang)}</h4> */}
        <h4>
          <img
            src={ICONS.warning}
            alt=""
            aria-hidden="true"
            className="profile-section-icon"
          />
          {translate("security_deactivate_account", lang)}
        </h4>
        <p>{translate("security_deactivate_description", lang)}</p>
        
        {!showDeactivateConfirm ? (
          <button 
            className="Deactivate-btn"
            onClick={() => setShowDeactivateConfirm(true)}
          >
            {translate("security_deactivate_account", lang)}
          </button>
        ) : (
          <div style={{
            padding: "16px",
            background: "rgba(255, 165, 0, 0.1)",
            borderRadius: "8px",
            marginTop: "12px"
          }}>
            <p style={{ marginBottom: "12px", fontWeight: "600" }}>
              {translate("security_deactivate_confirm", lang)}
            </p>
            <div style={{ display: "flex", gap: "12px" }}>
              <button
                onClick={handleDeactivateAccount}
                disabled={loading}
                style={{
                  padding: "10px 20px",
                  background: "#ff9800",
                  border: "none",
                  borderRadius: "8px",
                  color: "white",
                  fontWeight: "600",
                  cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading ? 0.7 : 1
                }}
              >
                {loading ? translate("security_deactivating", lang) : translate("security_yes_deactivate", lang)}
              </button>
              <button
                onClick={() => setShowDeactivateConfirm(false)}
                disabled={loading}
                style={{
                  padding: "10px 20px",
                  background: "rgba(79, 172, 254, 0.2)",
                  border: "1px solid rgba(79, 172, 254, 0.3)",
                  borderRadius: "8px",
                  color: "#4facfe",
                  fontWeight: "600",
                  cursor: "pointer"
                }}
              >
                {translate("security_cancel", lang)}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Account */}
      <div className="security-card danger ThemeBox">
        {/* <h4>❌ {translate("security_delete_account", lang)}</h4> */}
        <h4>
          <img
            src={ICONS.wrong}
            alt=""
            aria-hidden="true"
            className="profile-section-icon"
          />
          {translate("security_delete_account", lang)}
        </h4>
        <p>
          <strong>{translate("security_delete_warning", lang)}</strong>
        </p>

        {!showDeleteConfirm ? (
          <button 
            className="Delete-btn"
            onClick={() => setShowDeleteConfirm(true)}
          >
            {translate("security_delete_permanent", lang)}
          </button>
        ) : (
          <div style={{
            padding: "16px",
            background: "rgba(255, 65, 108, 0.1)",
            borderRadius: "8px",
            marginTop: "12px"
          }}>
            <p style={{ marginBottom: "12px", fontWeight: "600", color: "#ff416c" }}>
              {translate("security_delete_cannot_undo", lang)}
            </p>
            <p style={{ marginBottom: "12px", fontSize: "14px" }}>
              {translate("security_type_delete", lang)}
            </p>
            <input
              type="text"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              placeholder="Type DELETE"
              style={{
                width: "100%",
                marginBottom: "12px",
                padding: "10px",
                borderRadius: "8px",
                border: "2px solid rgba(255, 65, 108, 0.3)",
                background: "rgba(255, 65, 108, 0.05)"
              }}
            />
            <div style={{ display: "flex", gap: "12px" }}>
              <button
                onClick={handleDeleteAccount}
                disabled={loading || deleteConfirmText !== "DELETE"}
                style={{
                  padding: "10px 20px",
                  background: deleteConfirmText === "DELETE" ? "#ff416c" : "rgba(255, 65, 108, 0.3)",
                  border: "none",
                  borderRadius: "8px",
                  color: "white",
                  fontWeight: "600",
                  cursor: deleteConfirmText === "DELETE" && !loading ? "pointer" : "not-allowed",
                  opacity: loading ? 0.7 : 1
                }}
              >
                {loading ? translate("security_deleting", lang) : translate("security_delete_forever", lang)}
              </button>
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setDeleteConfirmText("");
                }}
                disabled={loading}
                style={{
                  padding: "10px 20px",
                  background: "rgba(79, 172, 254, 0.2)",
                  border: "1px solid rgba(79, 172, 254, 0.3)",
                  borderRadius: "8px",
                  color: "#4facfe",
                  fontWeight: "600",
                  cursor: "pointer"
                }}
              >
                {translate("security_cancel", lang)}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}