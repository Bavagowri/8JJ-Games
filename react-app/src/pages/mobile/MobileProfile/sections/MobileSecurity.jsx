// src/pages/mobile/MobileProfile/sections/MobileSecurity.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../../../../context/AuthContext";

import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../../../context/LanguageContext";
import { translate } from "../../../../data/translations";
import MobileHeader from "../../../../components/mobile/MobileHeader/MobileHeader";
import MobileBottomNav from "../../../../components/mobile/MobileBottomNav/MobileBottomNav";
import "./MobileSecurity.css";

const API_BASE = import.meta.env.VITE_API_URL;

const ICONS = {
  key: "/images/icons/password.png",
  warning: "/images/icons/warning.png",
  wrong: "/images/icons/wrong.png",
};

export default function MobileSecurity() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { lang } = useLanguage();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, []);

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
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

  const isGoogleUser = user?.provider === 'google';

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (passwordData.newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (passwordData.currentPassword === passwordData.newPassword) {
      setError("New password must be different");
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

      setSuccess("Password changed successfully!");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
      setShowPasswordForm(false);
      setShowPasswords({ current: false, new: false, confirm: false });

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

  const handleBackToMain = () => {
    navigate("/profile", { replace: true });
  };

  return (
    <div className="mobile-security-wrapper">
      <MobileHeader title={translate("security_title", lang)} showBack />

      <div className="mobile-content">

        {/* Mobile Top-bar */}
        <div className="mobile-top-bar">
          {/* Back button */}
          <button
            onClick={handleBackToMain}
            className="premium-mobile-back-button"
            aria-label="Go back"
          >
            ←
          </button>

          {/* Page title */}
          <h1 className="mobile-top-title">
            {translate("security_title", lang)}
          </h1>

          {/* Right spacer (future icon / keeps title centered) */}
          <div className="mobile-top-spacer" />
        </div>


        {error && (
          <div className="mobile-alert alert-error">
            ❌ {error}
          </div>
        )}

        {success && (
          <div className="mobile-alert alert-success">
            ✓ {success}
          </div>
        )}

        {/* Change Password */}
        <div className="mobile-security-card">
          <div className="card-header">
            <img src={ICONS.key} alt="" className="header-icon" />
            <h3>{translate("security_change_password", lang)}</h3>
          </div>

          {isGoogleUser ? (
            <div className="info-box">
              <p>{translate("security_google_signin", lang)}</p>
            </div>
          ) : !showPasswordForm ? (
            <div>
              <p className="card-text">{translate("security_keep_account_secure", lang)}</p>
              <button
                className="mobile-action-btn info"
                onClick={() => setShowPasswordForm(true)}
              >
                {translate("security_change_password", lang)}
              </button>
            </div>
          ) : (
            <form onSubmit={handlePasswordSubmit} className="password-form">
              <div className="form-group">
                <input
                  type={showPasswords.current ? "text" : "password"}
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  placeholder={translate("security_current_password", lang)}
                  required
                />
              </div>

              <div className="form-group">
                <input
                  type={showPasswords.new ? "text" : "password"}
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  placeholder={translate("security_new_password", lang)}
                  required
                  minLength={8}
                />
              </div>

              <div className="form-group">
                <input
                  type={showPasswords.confirm ? "text" : "password"}
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  placeholder={translate("security_confirm_password", lang)}
                  required
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="mobile-action-btn primary" disabled={loading}>
                  {loading ? translate("security_updating", lang) : translate("security_update_password", lang)}
                </button>
                <button
                  type="button"
                  className="mobile-action-btn secondary"
                  onClick={() => {
                    setShowPasswordForm(false);
                    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
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
        <div className="mobile-security-card">
          <div className="card-header">
            <img src={ICONS.warning} alt="" className="header-icon" />
            <h3>{translate("security_deactivate_account", lang)}</h3>
          </div>

          <p className="card-text">{translate("security_deactivate_description", lang)}</p>

          {!showDeactivateConfirm ? (
            <button
              className="mobile-action-btn warning"
              onClick={() => setShowDeactivateConfirm(true)}
            >
              {translate("security_deactivate_account", lang)}
            </button>
          ) : (
            <div className="confirm-box warning">
              <p>{translate("security_deactivate_confirm", lang)}</p>
              <div className="confirm-actions">
                <button
                  onClick={handleDeactivateAccount}
                  disabled={loading}
                  className="mobile-action-btn warning"
                >
                  {loading ? translate("security_deactivating", lang) : translate("security_yes_deactivate", lang)}
                </button>
                <button
                  onClick={() => setShowDeactivateConfirm(false)}
                  disabled={loading}
                  className="mobile-action-btn secondary"
                >
                  {translate("security_cancel", lang)}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Delete Account */}
        <div className="mobile-security-card danger">
          <div className="card-header">
            <img src={ICONS.wrong} alt="" className="header-icon" />
            <h3>{translate("security_delete_account", lang)}</h3>
          </div>

          <p className="card-text">
            <strong>{translate("security_delete_warning", lang)}</strong>
          </p>

          {!showDeleteConfirm ? (
            <button
              className="mobile-action-btn danger"
              onClick={() => setShowDeleteConfirm(true)}
            >
              {translate("security_delete_permanent", lang)}
            </button>
          ) : (
            <div className="confirm-box danger">
              <p className="confirm-text">{translate("security_delete_cannot_undo", lang)}</p>
              <p className="confirm-instruction">{translate("security_type_delete", lang)}</p>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="Type DELETE"
                className="confirm-input"
              />
              <div className="confirm-actions">
                <button
                  onClick={handleDeleteAccount}
                  disabled={loading || deleteConfirmText !== "DELETE"}
                  className="mobile-action-btn danger"
                >
                  {loading ? translate("security_deleting", lang) : translate("security_delete_forever", lang)}
                </button>
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setDeleteConfirmText("");
                  }}
                  disabled={loading}
                  className="mobile-action-btn secondary"
                >
                  {translate("security_cancel", lang)}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="mobile-footer-space" />
      </div>

      <MobileBottomNav />
    </div>
  );
}