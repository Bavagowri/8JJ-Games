// react-app/src/components/Chat/ReplyPreview.jsx

import './ReplyPreview.css';

export default function ReplyPreview({ message, onCancel }) {
  return (
    <div className="reply-preview-bar">
      <div className="reply-indicator"></div>
      <div className="reply-content">
        <span className="reply-label">Replying to @{message.username}</span>
        <span className="reply-message">{message.content}</span>
      </div>
      <button
        className="reply-cancel"
        onClick={onCancel}
        type="button"
      >
        ✕
      </button>
    </div>
  );
}