/* react-app/src/pages/Profile/sections/Settings.jsx */

import { useState, useEffect } from "react";
import { useProfile } from "../../../context/ProfileContext";
import { useAuth } from "../../../context/AuthContext";

const API_BASE = import.meta.env.VITE_API_URL;

const R2_BASE =
  import.meta.env.VITE_ASSETS_BASE_URL ||
  "https://assets.8jjgames.com";


const ICONS = {
  save: `${R2_BASE}/8jj_icons/icons/save.webp`,
};

export default function Settings() {
  const { profile, loading: profileLoading, refreshProfile } = useProfile();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    username: "",
    about_me: "",
    interests: []
  });

  const [interestInput, setInterestInput] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);

  // Helper function to get the correct avatar URL
  const getAvatarUrl = (avatar) => {
    if (!avatar) return null;
    
    // If it's a blob URL (from file upload preview), use as-is
    if (avatar.startsWith('blob:')) return avatar;
    
    // If it's a data URL (from FileReader), use as-is
    if (avatar.startsWith('data:')) return avatar;
    
    // If avatar starts with /uploads, prepend API base
    if (avatar.startsWith('/uploads')) {
      return `${API_BASE}${avatar}`;
    }
    
    // If it's already a full URL, use as-is
    return avatar;
  };

  // Load profile data when available
  useEffect(() => {
    if (profile) {
      setFormData({
        username: profile.username || "",
        about_me: profile.about_me || "",
        interests: Array.isArray(profile.interests) 
          ? profile.interests 
          : (profile.interests ? JSON.parse(profile.interests) : [])
      });
      // Set avatar preview with proper URL
      setAvatarPreview(profile.avatar || null);
    }
  }, [profile]);

  const handleChange = (e) => {
    setError("");
    setSuccess("");
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAddInterest = () => {
    const trimmed = interestInput.trim();
    if (trimmed && !formData.interests.includes(trimmed) && formData.interests.length < 10) {
      setFormData({
        ...formData,
        interests: [...formData.interests, trimmed]
      });
      setInterestInput("");
    }
  };

  const handleRemoveInterest = (index) => {
    setFormData({
      ...formData,
      interests: formData.interests.filter((_, i) => i !== index)
    });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file
      if (!file.type.startsWith('image/')) {
        setError("Please select an image file");
        return;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB
        setError("Image must be less than 5MB");
        return;
      }

      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Not authenticated");
      }

      // Validate
      if (formData.username.trim().length < 3) {
        throw new Error("Username must be at least 3 characters");
      }

      if (formData.about_me.length > 500) {
        throw new Error("Bio must be less than 500 characters");
      }

      // Prepare form data for multipart upload
      const submitData = new FormData();
      submitData.append('username', formData.username.trim());
      submitData.append('about_me', formData.about_me.trim());
      submitData.append('interests', JSON.stringify(formData.interests));
      
      if (avatarFile) {
        submitData.append('avatar', avatarFile);
      }

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
      
      setSuccess("Profile updated successfully! ✓");
      setAvatarFile(null);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);

    } catch (err) {
      console.error("Update profile error:", err);
      setError(err.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  if (profileLoading) {
    return (
      <div className="profile-settings">
        <h3 className="Profile-title">Account Settings</h3>
        <div style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>
          Loading profile...
        </div>
      </div>
    );
  }

  return (
    <div className="profile-settings">
      <h3 className="Profile-title">Account Settings</h3>

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

      <form onSubmit={handleSubmit} className="settings-form">
        {/* Avatar Upload */}
        <div className="form-group">
          <label>Profile Picture</label>
          <div className="ThemeBox" style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
            padding: "20px",
            background: "var(--card-bg)",
            borderRadius: "12px",
            border: "1px solid var(--card-border)"
          }}>
            <div style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              background: avatarPreview ? "transparent" : "var(--primary-gradient)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "40px",
              overflow: "hidden"
            }}>
              {avatarPreview ? (
                <img 
                  src={getAvatarUrl(avatarPreview)}
                  alt="Avatar preview"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover"
                  }}
                />
              ) : (
                "👤"
              )}
            </div>
            <div style={{ flex: 1 }}>
              <input 
                type="file" 
                accept="image/*"
                onChange={handleAvatarChange}
                style={{
                  padding: "10px",
                  background: "rgba(79, 172, 254, 0.1)",
                  border: "2px dashed rgba(79, 172, 254, 0.3)",
                  borderRadius: "8px",
                  cursor: "pointer",
                  width: "100%"
                }}
              />
              <p style={{
                fontSize: "12px",
                color: "var(--text-muted)",
                marginTop: "8px"
              }}>
                Recommended: Square image, at least 400x400px, max 5MB
              </p>
            </div>
          </div>
        </div>

        {/* Username */}
        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Enter your username"
            minLength={3}
            maxLength={50}
            required
          />
          <p style={{
            fontSize: "12px",
            color: "var(--text-muted)",
            marginTop: "4px"
          }}>
            3-50 characters
          </p>
        </div>

        {/* Bio */}
        <div className="form-group">
          <label>Bio</label>
          <textarea
            name="about_me"
            rows="4"
            value={formData.about_me}
            onChange={handleChange}
            placeholder="Tell us about yourself..."
            maxLength={500}
          />
          <div style={{
            fontSize: "12px",
            color: formData.about_me.length > 450 ? "#ff416c" : "var(--text-muted)",
            marginTop: "4px",
            textAlign: "right"
          }}>
            {formData.about_me.length} / 500 characters
          </div>
        </div>

        {/* Interests/Tags */}
        {/* <div className="form-group">
          <label>Interests</label>
          <div style={{
            padding: "16px",
            background: "var(--card-bg)",
            borderRadius: "12px",
            border: "1px solid var(--card-border)"
          }}>
            <div style={{
              display: "flex",
              gap: "8px",
              marginBottom: "12px"
            }}>
              <input
                type="text"
                value={interestInput}
                onChange={(e) => setInterestInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddInterest();
                  }
                }}
                placeholder="Add an interest (e.g., Action, RPG, Racing)"
                maxLength={30}
                style={{
                  flex: 1,
                  padding: "8px 12px",
                  background: "rgba(79, 172, 254, 0.1)",
                  border: "1px solid rgba(79, 172, 254, 0.3)",
                  borderRadius: "8px"
                }}
              />
              <button
                type="button"
                onClick={handleAddInterest}
                disabled={!interestInput.trim() || formData.interests.length >= 10}
                style={{
                  padding: "8px 16px",
                  background: "var(--primary-gradient)",
                  border: "none",
                  borderRadius: "8px",
                  color: "white",
                  fontWeight: "600",
                  cursor: interestInput.trim() && formData.interests.length < 10 ? "pointer" : "not-allowed",
                  opacity: interestInput.trim() && formData.interests.length < 10 ? 1 : 0.5
                }}
              >
                Add
              </button>
            </div>

            <div style={{
              display: "flex",
              gap: "8px",
              flexWrap: "wrap",
              minHeight: "40px"
            }}>
              {formData.interests.map((interest, index) => (
                <span
                  key={index}
                  style={{
                    padding: "6px 12px",
                    background: "rgba(79, 172, 254, 0.15)",
                    border: "1px solid rgba(79, 172, 254, 0.3)",
                    borderRadius: "20px",
                    fontSize: "14px",
                    fontWeight: "600",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px"
                  }}
                >
                  #{interest}
                  <button
                    type="button"
                    onClick={() => handleRemoveInterest(index)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#ff416c",
                      cursor: "pointer",
                      fontSize: "16px",
                      padding: "0",
                      lineHeight: "1"
                    }}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            
            <p style={{
              fontSize: "12px",
              color: "var(--text-muted)",
              marginTop: "8px"
            }}>
              {formData.interests.length}/10 interests • Press Enter or click Add
            </p>
          </div>
        </div> */}

        {/* Email (read-only) */}
        <div className="form-group">
          <label>Email Address</label>
          <input
            type="email"
            value={user?.email || profile?.email || ""}
            disabled
            style={{
              background: "rgba(128, 128, 128, 0.1)",
              cursor: "not-allowed"
            }}
          />
          <p style={{
            fontSize: "12px",
            color: "var(--text-muted)",
            marginTop: "4px"
          }}>
            {user?.provider === 'google' 
              ? "Email cannot be changed for Google accounts"
              : "Contact support to change your email address"
            }
          </p>
        </div>

        {/* <button 
          type="submit" 
          className="save-btn"
          disabled={isSaving}
          style={{
            opacity: isSaving ? 0.7 : 1,
            cursor: isSaving ? "not-allowed" : "pointer"
          }}
        >
          {isSaving ? "💾 Saving..." : "💾 Save Changes"}
        </button> */}

        <button
          type="submit"
          className="save-btn"
          disabled={isSaving}
          style={{
            opacity: isSaving ? 0.7 : 1,
            cursor: isSaving ? "not-allowed" : "pointer",
          }}
        >
          <img
            src={ICONS.save}
            alt=""
            aria-hidden="true"
            className="profile-save-icon"
          />
          {isSaving ? "Saving..." : "Save Changes"}
        </button>

      </form>
    </div>
  );
}