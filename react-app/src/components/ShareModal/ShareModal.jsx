// react-app/src/components/ShareModal/ShareModal.jsx
import "./ShareModal.css";
import { translate } from "../../data/translations";
import { useLanguage } from "../../context/LanguageContext";
import { shareAPI } from "../../api/share.api";
import toast from "react-hot-toast";

export default function ShareModal({ open, onClose }) {
  const { lang } = useLanguage();

  const handlePlatformShare = async (platform) => {
    try {
      const result = await shareAPI.share({
        share_type: "platform",
        platform // pass platform name
      });

      if (result.awarded) {
        toast.success(`+${result.points} points earned 🎉`);
      }
    } catch (err) {
      console.error("Platform share error:", err);
    }
  };
  
  if (!open) return null;

  const url = window.location.href;
  const text = encodeURIComponent(translate("playFreeGames", lang));

  return (
    <>
      {/* OVERLAY */}
      <div className="share-overlay HeaderShare" onClick={onClose} />

      {/* MODAL */}
      <div className="share-modal">
        <button className="share-close" onClick={onClose}>×</button>

        <img
          src="/images/8JJ_games.png"
          alt="8JJ Games"
          className="share-logo"
        />

        <div className="share-grid">
          <a
            href={`https://www.facebook.com/games8jj/`}
            target="_blank"
            rel="noreferrer"
            className="share-btn fb"
            onClick={() => handlePlatformShare("facebook")}
          >
            <img src="/images/social-share/fb.png" alt="fb" className="share-icon fb" />
            {translate("facebook", lang)}
          </a>

          <a
            href={`https://chat.whatsapp.com/Jj2GX9riQWxLEErESqbiNQ`}
            target="_blank"
            rel="noreferrer"
            className="share-btn wa"
            onClick={() => handlePlatformShare("whatsapp")}
          >
            <img src="/images/social-share/whatsapp.png" alt="whatsapp" className="share-icon whatsapp" />
            {translate("whatsapp", lang)}
          </a>

          <a
            href={`https://www.instagram.com/8jjgames/`}
            target="_blank"
            rel="noreferrer"
            className="share-btn ig"
            onClick={() => handlePlatformShare("instagram")}
          >
            <img src="/images/social-share/insta.png" alt="insta" className="share-icon insta" />
            {translate("instagram", lang)}
          </a>

          <a
            href={`https://t.me/+EqU2725tjvthYWRl`}
            target="_blank"
            rel="noreferrer"
            className="share-btn tg"
            onClick={() => handlePlatformShare("telegram")}
          >
            <img src="/images/social-share/telegram.png" alt="telegram" className="share-icon telegram" />
            {translate("telegram", lang)}
          </a>
        </div>
      </div>
    </>
  );
}