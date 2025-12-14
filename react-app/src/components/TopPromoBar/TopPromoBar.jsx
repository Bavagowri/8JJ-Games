import "./TopPromoBar.css";
import {
  FaInstagramSquare,
  FaFacebookSquare,
  FaYoutube,
  FaTelegram,
  FaWhatsapp,
} from "react-icons/fa";

export default function TopPromoBar() {
  return (
    <div className="promo-bar">
      <div className="promo-content">
        <span className="promo-text">
          🎮 Play free games instantly — no downloads!
        </span>

        <button
          className="promo-play-btn"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          Play Now
        </button>

        <div className="promo-socials">
          <a className="instagram" href="#" aria-label="Instagram">
            <FaInstagramSquare />
          </a>
          <a className="facebook" href="#" aria-label="Facebook">
            <FaFacebookSquare />
          </a>
          <a className="youtube" href="#" aria-label="YouTube">
            <FaYoutube />
          </a>
          <a className="telegram" href="#" aria-label="Telegram">
            <FaTelegram />
          </a>
          <a className="whatsapp" href="#" aria-label="WhatsApp">
            <FaWhatsapp />
          </a>
        </div>
      </div>
    </div>
  );
}