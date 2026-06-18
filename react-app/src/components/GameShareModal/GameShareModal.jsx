// react-app/src/components/GameShareModal/GameShareModal.jsx
import { useState } from "react";
import { shareAPI } from "../../api/share.api";
import "./GameShareModal.css";
import toast from "react-hot-toast";
import { useLanguage } from "../../context/LanguageContext";
import { translate } from "../../data/translations";

export default function GameShareModal({ open, onClose, title, url, gameId }) {
  if (!open) return null;
  const { lang } = useLanguage();
  const [shareLinks, setShareLinks] = useState({});

  // Copy + award (clean UX)
  const generateTrackedLink = async (platform) => {
    if (shareLinks[platform]) return shareLinks[platform];

    const result = await shareAPI.generatedShareLink(gameId, platform);

    setShareLinks((prev) => ({
      ...prev,
      [platform]: result.shareUrl
    }));

    if (result.awarded) {
      window.dispatchEvent(
        new CustomEvent("wallet-update", {
          detail: {
            totalPoints: result.totalPoints,
            level: result.level,
            tier: result.tier
          }
        })
      );
    }

    return result.shareUrl;
  };

  const handleWhatsAppShare = async () => {
    const trackedLink = await generateTrackedLink("whatsapp");
    if (!trackedLink) return;

    const shareText = encodeURIComponent(`${title} ${trackedLink}`);

    window.open(
      `https://api.whatsapp.com/send?text=${shareText}`,
      "_blank"
    );
  };

  const handleFacebookShare = async () => {
    const trackedLink = await generateTrackedLink("facebook");
    if (!trackedLink) return;

    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(trackedLink)}`,
      "_blank"
    );
  };

  const handleTwitterShare = async () => {

    const trackedLink = await generateTrackedLink("x");
    if (!trackedLink) return;

    const text = encodeURIComponent(`${title} ${trackedLink}`);

    window.open(
      `https://twitter.com/intent/tweet?text=${text}`,
      "_blank"
    );
  };

  const handleTelegramShare = async () => {
    const trackedLink = await generateTrackedLink("telegram");
    if (!trackedLink) return;

    window.open(
      `https://t.me/share/url?url=${encodeURIComponent(trackedLink)}&text=${encodeURIComponent(title)}`,
      "_blank"
    );
  };

  const copyLink = async () => {
    try {

      const trackedLink = await generateTrackedLink("copy");

      await navigator.clipboard.writeText(trackedLink);

      toast.success("Tracked share link copied!");

    } catch (err) {
      console.error("Copy error:", err);
      toast.error("Failed to copy link");
    }
  };

  return (
    <div className="game-share-overlay" onClick={onClose}>
      <div
        className="game-share-modal"
        onClick={(e) => e.stopPropagation()}
      >

        <div className="game-share-header">
          <h3>{translate("share_title", lang)}</h3>
          <button
            className="game-share-close"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {/* ── POINTS INCENTIVE STRIP ── */}
        <div className="game-share-points-strip">
          <div className="game-share-points-strip__icon" aria-hidden="true">
            <img
            className="brand-logo"
            src="/8JJ_games.png"
            alt="8JJ Games logo - Free online games"
            title="8JJ Games Home"
          />
          </div>
          <div className="game-share-points-strip__text">
            <span className="game-share-points-strip__headline">{translate("share_rewards_title", lang)}</span>
            <span className="game-share-points-strip__sub">
              {translate("share_points_message", lang,  { points: 50 })}
            </span>
          </div>
          <div className="game-share-points-strip__badge">{translate("share_pts_badge", lang,  { points: 50 })}</div>
        </div>

        {/* ICONS */}
          
        <div className="game-share-icons">
          {/* Facebook */}
          <div className="game-share-icon-wrap">
            <button
              className="game-share-icon facebook"
              onClick={handleFacebookShare}
            >
              <img src="/images/social-share/fb.png" alt="Facebook" />
              <span className="game-share-icon__pts-tag">+50</span>
            </button>
            <span className="game-share-icon__label">{translate("share_facebook", lang)}</span>
          </div>

          {/* Twitter */}
           <div className="game-share-icon-wrap">
            <button
              className="game-share-icon twitter"
              onClick={handleTwitterShare}
            >
              <img src="/images/social-share/X.png" alt="X / Twitter" />
              <span className="game-share-icon__pts-tag">+50</span>
            </button>
            <span className="game-share-icon__label">{translate("share_x", lang)}</span>
           </div>

          {/* WhatsApp (Tracked Share) */}
          <div className="game-share-icon-wrap">
            <button
              className="game-share-icon whatsapp"
              onClick={handleWhatsAppShare}
            >
              <img src="/images/social-share/whatsapp.png" alt="WhatsApp" />
              <span className="game-share-icon__pts-tag">+50</span>
            </button>
            <span className="game-share-icon__label">{translate("share_whatsapp", lang)}</span>
          </div>

          {/* Telegram (Tracked Share) */}
          <div className="game-share-icon-wrap">
            <button
              className="game-share-icon telegram"
              onClick={handleTelegramShare}
            >
              <img src="/images/social-share/telegram.png" alt="telegram" />
              <span className="game-share-icon__pts-tag">+50</span>
            </button>
            <span className="game-share-icon__label">{translate("share_telegram", lang)}</span>
          </div>
        </div>

        <div className="game-share-link">
          <input value={url} readOnly />
          <button onClick={copyLink} className="game-share-copy-btn">
            {translate("share_copy", lang)}
            <span className="game-share-copy-btn__pts">+10</span>
          </button>
        </div>

      </div>
    </div>
  );
}