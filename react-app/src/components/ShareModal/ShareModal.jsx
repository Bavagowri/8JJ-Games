import "./ShareModal.css";

export default function ShareModal({ open, onClose }) {
  if (!open) return null;

  const url = window.location.href;
  const text = "Play free games on 8JJ Games 🎮";

  return (
    <>
      {/* OVERLAY */}
      <div className="share-overlay" onClick={onClose} />

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
            href={`https://www.facebook.com/sharer/sharer.php?u=file%3A%2F%2F%2FUsers%2Fbavagowripanchadcharasivam%2FDownloads%2F8JJ%2520gaming_11%2Findex.html%23catHalloween`}
            target="_blank"
            rel="noreferrer"
            className="share-btn fb"
          >
            <img src="/images/social-share/fb.png" alt="fb" className="share-icon fb" />
            Facebook
          </a>

          <a
            href={`https://api.whatsapp.com/send/?text=8JJ+-+Free+Online+Games+file%3A%2F%2F%2FUsers%2Fbavagowripanchadcharasivam%2FDownloads%2F8JJ%2520gaming_11%2Findex.html%23catHalloween&type=custom_url&app_absent=0`}
            target="_blank"
            rel="noreferrer"
            className="share-btn wa"
          >
            <img src="/images/social-share/whatsapp.png" alt="whatsapp" className="share-icon whatsapp" />
            WhatsApp
          </a>

          <a
            href={`https://www.instagram.com/?url=file%3A%2F%2F%2FUsers%2Fbavagowripanchadcharasivam%2FDownloads%2F8JJ%2520gaming_11%2Findex.html%23catHalloween`}
            target="_blank"
            rel="noreferrer"
            className="share-btn ig"
          >
            <img src="/images/social-share/insta.png" alt="insta" className="share-icon insta" />
            Instagram
          </a>

          <a
            href={`https://t.me/share/url?url=file%3A%2F%2F%2FUsers%2Fbavagowripanchadcharasivam%2FDownloads%2F8JJ%2520gaming_11%2Findex.html%23catHalloween&text=8JJ%20-%20Free%20Online%20Games`}
            target="_blank"
            rel="noreferrer"
            className="share-btn tg"
          >
            <img src="/images/social-share/telegram.png" alt="telegram" className="share-icon telegram" />
            Telegram
          </a>
        </div>
      </div>
    </>
  );
}
