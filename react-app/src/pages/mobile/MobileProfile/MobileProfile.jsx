// src/pages/mobile/MobileProfile/MobileProfile.jsx
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import MobileHeader from "../../../components/mobile/MobileHeader/MobileHeader";
import MobileBottomNav from "../../../components/mobile/MobileBottomNav/MobileBottomNav";
import { useProfile } from "../../../context/ProfileContext";
import { useAuth } from "../../../context/AuthContext";
import { useLanguage } from "../../../context/LanguageContext";
import { translate } from "../../../data/translations";
import { LEVELS } from "../../../config/levels";
import SEO from "../../../components/SEO/SEO";

// Lucide React Icons
import {
  LayoutDashboard,
  Activity,
  Swords,
  Settings,
  Shield,
  Bell,
  Gift,
  LogOut,
  Copy,
  Check,
  Share2,
  Link as LinkIcon,
  Users,
  Award
} from "lucide-react";

// Import section components
import MobileOverview from "./sections/MobileOverview";
import MobileActivity from "./sections/MobileActivity";
import MobileStats from "./sections/MobileStats";
import MobileSettings from "./sections/MobileSettings";
import MobileSecurity from "./sections/MobileSecurity";
import MobileNotifications from "./sections/MobileNotifications";
import MobileRedeemCode from "./sections/MobileRedeemCode";

import "./MobileProfile.css";

const API_BASE = import.meta.env.VITE_API_URL;

const R2_BASE =
  import.meta.env.VITE_ASSETS_BASE_URL ||
  "https://assets.8jjgames.com";
  
const LEVEL_ICONS = {
  1: `${R2_BASE}/8jj_icons/8jj-games-level-icon/rookie.webp`,
  2: `${R2_BASE}/8jj_icons/8jj-games-level-icon/explorer.webp`,
  3: `${R2_BASE}/8jj_icons/8jj-games-level-icon/challenger.webp`,
  4: `${R2_BASE}/8jj_icons/8jj-games-level-icon/pathfinder.webp`,
  5: `${R2_BASE}/8jj_icons/8jj-games-level-icon/strategist.webp`,
  6: `${R2_BASE}/8jj_icons/8jj-games-level-icon/elite-player.webp`,
  7: `${R2_BASE}/8jj_icons/8jj-games-level-icon/master-gamer.webp`,
  8: `${R2_BASE}/8jj_icons/8jj-games-level-icon/legend.webp`,
  9: `${R2_BASE}/8jj_icons/8jj-games-level-icon/mythic.webp`,
  10: `${R2_BASE}/8jj_icons/8jj-games-level-icon/immortal.webp`
};

const TIER_ICONS = {
  Bronze: `${R2_BASE}/8jj_icons/8jjgames-tiers/bronze.webp`,
  Silver: `${R2_BASE}/8jj_icons/8jjgames-tiers/silver.webp`,
  Gold: `${R2_BASE}/8jj_icons/8jjgames-tiers/gold.webp`,
  Platinum: `${R2_BASE}/8jj_icons/8jjgames-tiers/platinum.webp`,
  Diamond: `${R2_BASE}/8jj_icons/8jjgames-tiers/diamond.webp`,
  Ascended: `${R2_BASE}/8jj_icons/8jjgames-tiers/ascended.webp`
};

// Menu configuration with Lucide icons
const MENU_ITEMS = [
  { 
    key: "overview", 
    labelKey: "profileTab_overview", 
    icon: LayoutDashboard 
  },
  { 
    key: "activity", 
    labelKey: "profileTab_activity", 
    icon: Activity 
  },
  { 
    key: "stats", 
    labelKey: "profileTab_stats", 
    icon: Swords 
  },
  { 
    key: "settings", 
    labelKey: "profileTab_editProfile", 
    icon: Settings 
  },
  { 
    key: "security", 
    labelKey: "profileTab_security", 
    icon: Shield 
  },
  { 
    key: "notifications", 
    labelKey: "profileTab_notifications", 
    icon: Bell 
  },
  { 
    key: "redeem-code", 
    labelKey: "profileTab_redeemCode", 
    icon: Gift 
  }
];

export default function MobileProfile() {
  const { profile, loading: profileLoading } = useProfile();
  const { logout } = useAuth();
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeSection, setActiveSection] = useState(null);
  const [copied, setCopied] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  // Check if there's a tab parameter in URL
  useEffect(() => {
    const tab = searchParams.get("tab");
    setActiveSection(tab); // tab can be null — that's GOOD
  }, [searchParams]);

  const getAvatarUrl = (avatar) => {
    if (!avatar || avatar.length <= 2) return "/images/default-avatar.png";
    if (avatar.startsWith("/uploads/")) return `${API_BASE}${avatar}`;
    if (avatar.startsWith("http")) return avatar;
    return "/images/default-avatar.png";
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleNavigateToSection = (section) => {
    setActiveSection(section);
    navigate(`/profile?tab=${section}`, { replace: true });
  };

  // Copy to clipboard functionality
  const handleCopyReferral = async () => {
    const referralLink = `${window.location.origin}/register?ref=${profile.referral_code}`;
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (error) {
      console.error('Failed to copy:', error);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = referralLink;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      } catch (err) {
        console.error('Fallback copy failed:', err);
      }
      document.body.removeChild(textArea);
    }
  };

  // Share button click - open modal
  const handleShareClick = () => {
    setShowShareModal(true);
  };

  // Social share handlers
  const shareToFacebook = () => {
    const referralLink = `${window.location.origin}/register?ref=${profile.referral_code}`;
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`;
    window.open(url, '_blank', 'width=600,height=400');
    setShowShareModal(false);
  };

  const shareToTwitter = () => {
    const referralLink = `${window.location.origin}/register?ref=${profile.referral_code}`;
    const shareText = `Join me on 8JJ Games! Use my referral code: ${profile.referral_code}`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(referralLink)}`;
    window.open(url, '_blank', 'width=600,height=400');
    setShowShareModal(false);
  };

  const shareToWhatsApp = () => {
    const referralLink = `${window.location.origin}/register?ref=${profile.referral_code}`;
    const shareText = `Join me on 8JJ Games! Use my referral code: ${profile.referral_code}`;
    const url = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + referralLink)}`;
    window.open(url, '_blank');
    setShowShareModal(false);
  };

  // Render specific section if activeSection is set
  if (activeSection) {
    switch (activeSection) {
      case "overview":
        return <MobileOverview />;
      case "activity":
        return <MobileActivity />;
      case "stats":
        return <MobileStats />;
      case "settings":
        return <MobileSettings />;
      case "security":
        return <MobileSecurity />;
      case "notifications":
        return <MobileNotifications />;
      case "redeem-code":
        return <MobileRedeemCode />;
      default:
        setActiveSection(null);
    }
  }

  if (profileLoading || !profile) {
    return (
      <div className="mobile-profile-wrapper">
        <MobileHeader />
        <div className="mobile-content">
          <div className="mobile-loading">
            <div className="mobile-spinner"></div>
            <p>{translate("loading", lang)}</p>
          </div>
        </div>
        <MobileBottomNav />
      </div>
    );
  }

  const currentLevel = LEVELS.find(l => l.level === profile.level)?.name || "Rookie";
  const levelIcon = LEVEL_ICONS[profile.level] || LEVEL_ICONS[1];
  const tierIcon = TIER_ICONS[profile.tier] || TIER_ICONS.Bronze;

  const nextLevel = LEVELS[profile.level];
  const levelProgress = nextLevel
    ? Math.min(100, (profile.points / nextLevel.minPoints) * 100)
    : 100;

  return (
    <>
      <SEO
        title="My Profile - Mobile"
        description="View your gaming profile on 8JJ Games"
        keywords="profile, gaming stats, achievements"
        url="/profile"
      />

      <div className="mobile-profile-wrapper">
        <MobileHeader />

        <div className="mobile-content">
          {/* Profile Header */}
          <div className="mobile-profile-header">
            <div className="mobile-avatar-section">
              <div className="mobile-avatar-ring">
                <img
                  src={getAvatarUrl(profile.avatar)}
                  alt="Avatar"
                  className="mobile-avatar-img"
                />
              </div>
              <div className="mobile-level-badge">
                <img src={levelIcon} alt={`Level ${profile.level}`} />
              </div>
            </div>

            <div className="mobile-profile-info">
              <div className="mobile-username-row">
                <h1 className="mobile-username">{profile.username}</h1>
                <img
                  src={tierIcon}
                  alt={profile.tier}
                  className="mobile-tier-icon"
                />
              </div>

              <div className="mobile-level-row">
                <span className="mobile-level-text">
                  Level {profile.level} · {currentLevel}
                </span>
              </div>

              {nextLevel && (
                <div className="mobile-progress-container">
                  <div
                    className="mobile-progress-fill"
                    style={{ width: `${levelProgress}%` }}
                  />
                </div>
              )}

              <p className="mobile-bio">
                {profile.about_me || translate("profileHeader_aboutYourself", lang)}
              </p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="mobile-stats-grid">
            <div className="mobile-stat-card">
              <Activity size={24} className="mobile-stat-icon-svg" strokeWidth={2.5} />
              <span className="mobile-stat-value">{profile.stats?.gamesPlayed ?? 0}</span>
              <span className="mobile-stat-label">{translate("profileStats_games", lang)}</span>
            </div>
            <div className="mobile-stat-card">
              <Award size={24} className="mobile-stat-icon-svg" strokeWidth={2.5} />
              <span className="mobile-stat-value">{profile.points}</span>
              <span className="mobile-stat-label">{translate("profileStats_points", lang)}</span>
            </div>
            <div className="mobile-stat-card">
              <Swords size={24} className="mobile-stat-icon-svg" strokeWidth={2.5} />
              <span className="mobile-stat-value">{profile.stats?.playtime ?? 0}</span>
              <span className="mobile-stat-label">{translate("profileStats_hours", lang)}</span>
            </div>
          </div>

          {/* Referral Section */}
          {profile.referral_code && (
            <div className="mobile-referral-section">
              <div className="mobile-referral-header">
                <LinkIcon size={20} className="mobile-referral-icon-svg" strokeWidth={2.5} />
                <strong>{translate("profileHeader_yourReferralLink", lang)}</strong>
              </div>

              <div className="mobile-referral-input-wrapper">
                <input
                  className="mobile-referral-input"
                  readOnly
                  value={`${window.location.origin}/register?ref=${profile.referral_code}`}
                  onClick={(e) => e.target.select()}
                />
              </div>

              <div className="mobile-referral-buttons">
                <button
                  className={`mobile-copy-btn ${copied ? "copied" : ""}`}
                  onClick={handleCopyReferral}
                >
                  {copied ? (
                    <Check size={16} strokeWidth={2.5} />
                  ) : (
                    <Copy size={16} strokeWidth={2.5} />
                  )}
                  <span>{translate(copied ? "copied" : "copyCode", lang)}</span>
                </button>
                <button
                  className="mobile-share-btn"
                  onClick={handleShareClick}
                >
                  <Share2 size={16} strokeWidth={2.5} />
                  <span>{translate("share", lang)}</span>
                </button>
              </div>

              {profile.referral_stats && (
                <div className="mobile-referral-stats">
                  <div className="mobile-referral-stat-item">
                    <Users size={28} className="mobile-stat-icon-svg" strokeWidth={2.5} />
                    <div className="mobile-stat-info">
                      <span className="mobile-stat-number">{profile.referral_stats.total || 0}</span>
                      <span className="mobile-stat-text">Referrals</span>
                    </div>
                  </div>
                  <div className="mobile-referral-stat-item">
                    <Gift size={28} className="mobile-stat-icon-svg" strokeWidth={2.5} />
                    <div className="mobile-stat-info">
                      <span className="mobile-stat-number">{profile.referral_stats.earned || 0}</span>
                      <span className="mobile-stat-text">Pts Earned</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Menu */}
          <div className="mobile-profile-menu">
            {MENU_ITEMS.map((item) => {
              const IconComponent = item.icon;
              return (
                <button
                  key={item.key}
                  className="mobile-profile-menu-item"
                  onClick={() => handleNavigateToSection(item.key)}
                >
                  <IconComponent size={24} strokeWidth={2.5} className="menu-icon-svg" />
                  <span>{translate(item.labelKey, lang)}</span>
                  <span className="mobile-menu-arrow">→</span>
                </button>
              );
            })}

            <div className="border-class"></div>
            
            <button
              className="mobile-profile-menu-item danger"
              onClick={handleLogout}
            >
              <LogOut size={24} strokeWidth={2.5} className="menu-icon-svg" />
              <span>{translate("logout", lang) || "Logout"}</span>
            </button>
          </div>

          <div className="mobile-footer-space" />
        </div>

        <MobileBottomNav />
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="mobile-share-modal-overlay" onClick={() => setShowShareModal(false)}>
          <div className="mobile-share-modal" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-share-header">
              <h3>Share Referral Link</h3>
              <button 
                className="mobile-share-close" 
                onClick={() => setShowShareModal(false)}
                aria-label="Close share modal"
              >
                ✕
              </button>
            </div>

            <div className="mobile-share-options">
              <button className="mobile-share-option facebook" onClick={shareToFacebook}>
                <div className="mobile-share-icon-circle">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </div>
                <span>Facebook</span>
              </button>

              <button className="mobile-share-option twitter" onClick={shareToTwitter}>
                <div className="mobile-share-icon-circle">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </div>
                <span>X (Twitter)</span>
              </button>

              <button className="mobile-share-option whatsapp" onClick={shareToWhatsApp}>
                <div className="mobile-share-icon-circle">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </div>
                <span>WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}