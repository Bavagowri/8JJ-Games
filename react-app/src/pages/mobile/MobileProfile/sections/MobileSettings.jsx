// src/pages/mobile/MobileProfile/sections/MobileSettings.jsx
import { useState, useEffect } from "react";
import { useProfile } from "../../../../context/ProfileContext";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../../../context/LanguageContext";
import { translate } from "../../../../data/translations";
import MobileHeader from "../../../../components/mobile/MobileHeader/MobileHeader";
import MobileBottomNav from "../../../../components/mobile/MobileBottomNav/MobileBottomNav";
import "./MobileSettings.css";

const API_BASE = import.meta.env.VITE_API_URL;

export default function MobileSettings() {
  const { profile, refreshProfile } = useProfile();
  const { lang } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, []);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    about_me: "",
    country: "",
    interests: []
  });

  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("/images/default-avatar.png");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ show: false, text: "", type: "" });

  // Helper function to get the correct avatar URL (matching desktop version)
  const getAvatarUrl = (avatar) => {
    if (!avatar) return "/images/default-avatar.png";
    
    // If it's a blob URL (from file upload preview), use as-is
    if (avatar.startsWith('blob:')) return avatar;
    
    // If it's a data URL (from FileReader), use as-is
    if (avatar.startsWith('data:')) return avatar;
    
    // If avatar starts with /uploads, prepend API base
    if (avatar.startsWith('/uploads')) {
      return `${API_BASE}${avatar}`;
    }
    
    // If it's already a full URL, use as-is
    if (/^(https?:)/.test(avatar)) {
      return avatar;
    }
    
    // Fallback
    return "/images/default-avatar.png";
  };

  useEffect(() => {
    if (profile) {
      setFormData({
        username: profile.username || "",
        email: profile.email || "",
        about_me: profile.about_me || "",
        country: profile.country || "",
        interests: Array.isArray(profile.interests) 
          ? profile.interests 
          : (profile.interests ? JSON.parse(profile.interests) : [])
      });
      
      const avatarUrl = getAvatarUrl(profile.avatar);
      setAvatarPreview(avatarUrl);
    }
  }, [profile]);

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file
      if (!file.type.startsWith('image/')) {
        showMessage("Please select an image file", "error");
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) { // 5MB
        showMessage("File size must be less than 5MB", "error");
        return;
      }
      
      setAvatar(file);
      
      // Create preview using FileReader
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Not authenticated");
      }

      // Validate username
      if (formData.username.trim().length < 3) {
        throw new Error("Username must be at least 3 characters");
      }

      // Validate bio length
      if (formData.about_me.length > 500) {
        throw new Error("Bio must be less than 500 characters");
      }

      // Prepare form data for multipart upload (matching desktop version)
      const submitData = new FormData();
      submitData.append('username', formData.username.trim());
      submitData.append('about_me', formData.about_me.trim());
      
      // Add interests
      submitData.append('interests', JSON.stringify(formData.interests));
      
      // Add country if provided
      if (formData.country && formData.country.trim()) {
        submitData.append('country', formData.country.trim());
      }
      
      // Add avatar if a new one was selected
      if (avatar) {
        submitData.append('avatar', avatar);
      }

      // Use PUT method (matching desktop version)
      const response = await fetch(`${API_BASE}/api/profile`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`
          // Don't set Content-Type - browser will set it with boundary for FormData
        },
        body: submitData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update profile");
      }

      // Update profile context
      await refreshProfile();
      
      showMessage(translate("profileSettings_success", lang) || "Profile updated successfully!", "success");
      
      // Clear the selected avatar file after successful upload
      setAvatar(null);
      
    } catch (error) {
      console.error("Update error:", error);
      showMessage(error.message || translate("profileSettings_error", lang) || "Update failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (text, type) => {
    setMessage({ show: true, text, type });
    setTimeout(() => setMessage({ show: false, text: "", type: "" }), 3000);
  };

  const handleBackToMain = () => {
    navigate("/profile", { replace: true });
  };

  if (!profile) {
    return (
      <div className="mobile-settings-wrapper">
        <MobileHeader title={translate("profileTab_editProfile", lang)} showBack />
        <div className="mobile-content">
          <div className="mobile-loading">
            <div className="mobile-spinner"></div>
          </div>
        </div>
        <MobileBottomNav />
      </div>
    );
  }

  return (
    <div className="mobile-settings-wrapper">
      <MobileHeader title={translate("profileTab_editProfile", lang)} showBack />

      {message.show && (
        <div className={`mobile-message message-${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="mobile-content">
        {/* Mobile Top-bar */}
        <div className="mobile-top-bar">
          <button
            onClick={handleBackToMain}
            className="premium-mobile-back-button"
            aria-label="Go back"
          >
            ←
          </button>

          <h1 className="mobile-top-title">
            {translate("profileSettings_title", lang)}
          </h1>

          <div className="mobile-top-spacer" />
        </div>

        <form onSubmit={handleSubmit} className="mobile-settings-form">
          {/* Avatar Upload */}
          <div className="mobile-avatar-upload">
            <div className="avatar-preview-wrapper">
              <img 
                src={avatarPreview || "/images/default-avatar.png"} 
                alt="Avatar" 
                className="avatar-preview"
                onError={(e) => {
                  e.currentTarget.src = "/images/default-avatar.png";
                }}
              />
              <label htmlFor="avatar-input" className="avatar-upload-btn">
                📷
              </label>
              <input
                id="avatar-input"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                style={{ display: "none" }}
              />
            </div>
            <p className="avatar-hint">
              {translate("profileSettings_avatarHint", lang) || "Tap to change avatar"}
            </p>
          </div>

          {/* Form Fields */}
          <div className="mobile-form-group">
            <label>{translate("profileSettings_username", lang)}</label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              placeholder="Username"
              minLength={3}
              maxLength={50}
              required
            />
          </div>

          <div className="mobile-form-group">
            <label>{translate("profileSettings_email", lang)}</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Email"
              disabled
            />
            <small>{translate("profileSettings_emailNote", lang) || "Email cannot be changed"}</small>
          </div>

          <div className="mobile-form-group">
            <label>{translate("profileSettings_aboutMe", lang)}</label>
            <textarea
              value={formData.about_me}
              onChange={(e) => setFormData({ ...formData, about_me: e.target.value })}
              placeholder={translate("profileSettings_aboutMePlaceholder", lang)}
              rows={4}
              maxLength={500}
            />
            <small>{formData.about_me.length} / 500 characters</small>
          </div>

          <div className="mobile-form-group">
            <label>{translate("profileSettings_country", lang)}</label>
            <input
              type="text"
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              placeholder="Country"
            />
          </div>

          <button
            type="submit"
            className="mobile-submit-btn"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="btn-spinner"></div>
                {translate("profileSettings_saving", lang) || "Saving..."}
              </>
            ) : (
              translate("profileSettings_save", lang) || "Save Changes"
            )}
          </button>
        </form>

        <div className="mobile-footer-space" />
      </div>

      <MobileBottomNav />
    </div>
  );
}