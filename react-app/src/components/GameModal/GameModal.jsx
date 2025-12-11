import "./GameModal.css";

export default function GameModal({ game, onClose }) {
  if (!game) return null;

  return (
    <>
      <div className="modal-overlay" onClick={onClose} />

      <div className="modal-container">
        <div className="modal-header">
          <h3>{game.title}</h3>
          <button className="close-btn" onClick={onClose}>✖</button>
        </div>

        <iframe
          className="game-iframe"
          src={game.embed}
          title={game.title}
          frameBorder="0"
          allowFullScreen
        ></iframe>
      </div>
    </>
  );
}
