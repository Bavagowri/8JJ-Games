// react-app/src/pages/Profile/ProfileHeader.jsx
import { useState } from "react";
import { useProfile } from "../../context/ProfileContext";
import { useLanguage } from "../../context/LanguageContext";
import { translate } from "../../data/translations";
import { LEVELS } from "../../config/levels.js";
import "./ProfileHeader.css";

const API_BASE = import.meta.env.VITE_API_URL;

const R2_BASE =
  import.meta.env.VITE_ASSETS_BASE_URL ||
  "https://assets.8jjgames.com";

// Dynamic image configurations based on level
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

// Tier icons with premium feel
const TIER_ICONS = {
  Bronze: `${R2_BASE}/8jj_icons/8jjgames-tiers/bronze.webp`,
  Silver: `${R2_BASE}/8jj_icons/8jjgames-tiers/silver.webp`,
  Gold: `${R2_BASE}/8jj_icons/8jjgames-tiers/gold.webp`,
  Platinum: `${R2_BASE}/8jj_icons/8jjgames-tiers/platinum.webp`,
  Diamond: `${R2_BASE}/8jj_icons/8jjgames-tiers/diamond.webp`,
  Ascended: `${R2_BASE}/8jj_icons/8jjgames-tiers/ascended.webp`
};

// Stats icons
const STATS_ICONS = {
  games: `${R2_BASE}/8jj_icons/icons/8jj-game-3.webp`,
  points: `${R2_BASE}/8jj_icons/icons/8jj-points.webp`,
  playtime: `${R2_BASE}/8jj_icons/icons/8jj-time.webp`
};

// UI icons
const UI_ICONS = {
  edit: `${R2_BASE}/8jj_icons/icons/8jj-profile-edit-2.webp`,
  link: `${R2_BASE}/8jj_icons/icons/8jj-link.webp`,
  copy: `${R2_BASE}/8jj_icons/icons/copy.webp`,
  copied: `${R2_BASE}/8jj_icons/icons/8jj-check.webp`,
  share: `${R2_BASE}/8jj_icons/icons/share.webp`,
  referrals: `${R2_BASE}/8jj_icons/icons/8jj-referrals.webp`,
  gift: `${R2_BASE}/8jj_icons/icons/8jj-gift.webp`
};



export default function ProfileHeader({ setActiveTab }) {
  const { profile, loading } = useProfile();
  const { lang } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  // Prevent crash on refresh
  if (loading || !profile) {
    return (
      <div className="profile-header loading">
        Loading profile...
        <div className="profile-header">
          <div className="skeleton skeleton-header" />
        </div>
      </div>
    );
  }

  const getAvatarUrl = (avatar) => {
    // No avatar or emoji → fallback
    if (!avatar || avatar.length <= 2) {
      return "/images/default-avatar.png";
    }

    // Stored backend upload
    if (avatar.startsWith("/uploads/")) {
      return `${API_BASE}${avatar}`;
    }

    // Absolute URL (Google login etc.)
    if (avatar.startsWith("http")) {
      return avatar;
    }

    // Anything else → fallback
    return "/images/default-avatar.png";
  };


  const currentLevel = LEVELS.find(l => l.level === profile.level)?.name || "Rookie";
  const levelIcon = LEVEL_ICONS[profile.level] || LEVEL_ICONS[1];
  const tierIcon = TIER_ICONS[profile.tier] || TIER_ICONS.Bronze;
  const topAchievements = profile.achievements?.slice(0, 2) || [];

  const referralLink = `${window.location.origin}/register?ref=${profile.referral_code}`;
  const shareText = `Join me on 8JJ Games! Use my referral code: ${profile.referral_code}`;

  // Copy to clipboard functionality
  const handleCopyReferral = async () => {
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
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`;
    window.open(url, '_blank', 'width=600,height=400');
    setShowShareModal(false);
  };

  const shareToTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(referralLink)}`;
    window.open(url, '_blank', 'width=600,height=400');
    setShowShareModal(false);
  };

  const shareToWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + referralLink)}`;
    window.open(url, '_blank');
    setShowShareModal(false);
  };

  const copyFromModal = () => {
    handleCopyReferral();
    setShowShareModal(false);
  };

  return (
    <>
      <div className="profile-header">
        <div className="profile-header-content">
          {/* Avatar Section */}
          <div className="profile-avatar">
            <div className="avatar-ring">
              <img className="avatar-img" src={getAvatarUrl(profile.avatar)} alt="User Avatar" />
            </div>
            <button
              className="avatar-edit-btn"
              onClick={() => setActiveTab("settings")}
              title={translate("profileHeader_editProfile", lang)}
            >
              <img src={UI_ICONS.edit} alt="Edit" className="edit-icon-img" />
            </button>
            {/* Level Badge Overlay */}
            <div className="avatar-level-badge">
              <img src={levelIcon} alt={`Level ${profile.level}`} className="level-icon-img" />
              {/* <span className="level-number">{profile.level}</span> */}
            </div>
          </div>

          {/* Info Section */}
          <div className="profile-info">
            {/* Username with Tier Badge */}
            <div className="profile-title-row">
              <span
                className={`tier-badge-premium Tierbadge-Orginal tier-${profile.tier?.toLowerCase()}`}
                title="Tier is calculated from total points"
                onClick={() => setActiveTab("overview")}
              >
                <img src={tierIcon} alt={profile.tier} className="tier-icon-img" />
                {/* <span className="tier-text">{profile.tier}</span> */}
              </span>


              <h2 className="Profile-title">{profile.username}</h2>
              

            </div>


            <div className="MobileBadge-Holder">


                <span
                  className={`tier-badge-premium Tierbadge-Mobile tier-${profile.tier?.toLowerCase()}`}
                  title="Tier is calculated from total points"
                  onClick={() => setActiveTab("overview")}
                >
                  <img src={tierIcon} alt={profile.tier} className="tier-icon-img" />

                </span>
              </div>

            {/* Level Progress Bar */}
            <div className="level-progress-section">
              <div className="level-info-row">
                <div className="MobileBadge-Holder">
                  <span className="level-badge-premium">
                    {/* <img src={levelIcon} alt={`Level ${profile.level}`} className="level-badge-icon" /> */}
                    Level {profile.level} · {currentLevel}
                  </span>

                  {/* <span
                    className={`tier-badge-premium Tierbadge-Mobile tier-${profile.tier?.toLowerCase()}`}
                    title="Tier is calculated from total points"
                    onClick={() => setActiveTab("overview")}
                  >
                    <img src={tierIcon} alt={profile.tier} className="tier-icon-img" />
                    <span className="tier-text">{profile.tier}</span>
                  </span> */}
                </div>

                <span className="next-level-hint">
                  {LEVELS[profile.level] ?
                    `Next: ${LEVELS[profile.level].minPoints - profile.points} pts to ${LEVELS[profile.level].name}`
                    : "Max Level!"}
                </span>
              </div>
              {LEVELS[profile.level] && (
                <div className="progress-bar-container">
                  <div
                    className="progress-bar-fill"
                    style={{
                      width: `${Math.min(100, (profile.points / LEVELS[profile.level].minPoints) * 100)}%`
                    }}
                  />
                </div>
              )}
            </div>

            {/* Bio */}
            <p className="Profile-bio">
              {profile.about_me || translate("profileHeader_aboutYourself", lang)}
            </p>

            {/* Premium Stats Grid */}
            <div className="profile-stats-grid">
              <div className="stat-item">
                <img src={STATS_ICONS.games} alt="Games" className="stat-icon-img" />
                <div className="stat-content">
                  <span className="stat-value">{profile.stats?.gamesPlayed ?? 0}</span>
                  <span className="stat-label">{translate("profileStats_games", lang)}</span>
                </div>
              </div>
              <div className="stat-item">
                <img src={STATS_ICONS.points} alt="Points" className="stat-icon-img" />
                <div className="stat-content">
                  <span className="stat-value">{profile.points}</span>
                  <span className="stat-label">{translate("profileStats_points", lang)}</span>
                </div>
              </div>
              <div className="stat-item">
                <img src={STATS_ICONS.playtime} alt="Playtime" className="stat-icon-img" />
                <div className="stat-content">
                  <span className="stat-value">{profile.stats?.playtime ?? 0}</span>
                  <span className="stat-label">{translate("profileStats_hours", lang)}</span>
                </div>
              </div>
            </div>

            {/* Top Achievements */}
            {topAchievements.length > 0 && (
              <div className="profile-achievements-preview">
                {topAchievements.map((a, i) => (
                  <span key={i} className="achievement-chip-premium">
                    <span className="achievement-icon">{a.icon}</span>
                    <span className="achievement-title">{a.title}</span>
                  </span>
                ))}
              </div>
            )}

            {/* Referral Section */}
            {profile.referral_code && (
              <div className="profile-referral-premium">
                <div className="referral-header">
                  <img src={UI_ICONS.link} alt="Link" className="referral-icon-img" />
                  <strong>{translate("profileHeader_yourReferralLink", lang)}</strong>
                </div>

                <div className="referral-input-wrapper">
                  <input
                    className="referral-input-premium"
                    readOnly
                    value={referralLink}
                    onClick={(e) => e.target.select()}
                  />
                  <button
                    className={`copy-btn-premium ${copied ? "copied" : ""}`}
                    onClick={handleCopyReferral}
                    title="Copy referral link"
                  >
                    <img
                      src={copied ? UI_ICONS.copied : UI_ICONS.copy}
                      alt={copied ? "Copied" : "Copy"}
                      className="copy-icon-img"
                    />
                    <span className="copy-text">{translate(copied ? "copied" : "copyCode", lang)}</span>
                  </button>
                  <button
                    className="share-btn-premium"
                    onClick={handleShareClick}
                    title="Share referral link"
                  >
                    <img src={UI_ICONS.share} alt="Share" className="share-icon-img" />
                    <span className="share-text">{translate("share", lang)}</span>
                  </button>
                </div>

                {profile.referral_stats && (
                  <div className="referral-stats-row">
                    <div className="referral-stat-item">
                      <img src={UI_ICONS.referrals} alt="Referrals" className="referral-stat-icon-img" />
                      <span className="stat-number">{profile.referral_stats.total || 0}</span>
                      <span className="stat-text">Referrals</span>
                    </div>
                    <div className="referral-stat-item">
                      <img src={UI_ICONS.gift} alt="Rewards" className="referral-stat-icon-img" />
                      <span className="stat-number">{profile.referral_stats.earned || 0}</span>
                      <span className="stat-text">Pts Earned</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Simple Share Modal */}
      {showShareModal && (
        <div className="share-modal-overlay" onClick={() => setShowShareModal(false)}>
          <div className="share-modal-simple" onClick={(e) => e.stopPropagation()}>
            <div className="share-modal-header">
              <h3>Share Referral Link</h3>
              <button
                className="share-modal-close"
                onClick={() => setShowShareModal(false)}
                aria-label="Close share modal"
              >
                ✕
              </button>
            </div>

            <div className="share-modal-content">
              <div className="share-options">
                <button className="share-option facebook" onClick={shareToFacebook}>
                  <div className="share-icon-circle">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </div>
                  <span>Facebook</span>
                </button>

                <button className="share-option twitter" onClick={shareToTwitter}>
                  <div className="share-icon-circle">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </div>
                  <span>X (Twitter)</span>
                </button>

                <button className="share-option whatsapp" onClick={shareToWhatsApp}>
                  <div className="share-icon-circle">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                  </div>
                  <span>WhatsApp</span>
                </button>


              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}