// react-app/src/components/Chat/MessageItem.jsx

import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { resolveAvatarUrl } from '../../utils/avatarUrl';
import './MessageItem.css';

export default function MessageItem({ message, currentUser, onDelete, onReaction, onReply }) {
  const [showActions, setShowActions] = useState(false);
  const [showReactions, setShowReactions] = useState(false);

  const isOwnMessage = message.user_id === currentUser.id;
  const isAdmin = currentUser.role === 'admin';
  const canDelete = isOwnMessage || isAdmin;

  const quickReactions = ['👍', '❤️', '😂', '😮', '🎮', '🔥'];

  const handleReaction = (emoji) => {
    onReaction(message.id, emoji);
    setShowReactions(false);
  };

  const handleDelete = () => {
    if (window.confirm('Delete this message?')) {
      onDelete(message.id);
    }
  };

  if (message.is_deleted) {
    return (
      <div className="message-item deleted">
        <div className="deleted-message">
          <span className="deleted-icon">🗑️</span>
          <span className="deleted-text">This message was deleted</span>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`message-item ${isOwnMessage ? 'own-message' : ''}`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => {
        setShowActions(false);
        setShowReactions(false);
      }}
    >
      <img 
        src={resolveAvatarUrl(message.avatar)}
        alt={message.username}
        className="message-avatar"
      />

      <div className="message-content">
        {/* Reply Preview */}
        {message.reply_to_message_id && message.replied_message && (
          <div className="reply-preview">
            <div className="reply-line"></div>
            <div className="reply-info">
              <span className="reply-username">@{message.replied_message.username}</span>
              <span className="reply-text">{message.replied_message.content}</span>
            </div>
          </div>
        )}

        <div className="message-header">
          <span className="message-username">
            {message.username}
          </span>
          {message.role === 'admin' && (
            <span className="admin-badge">👑 Admin</span>
          )}
          {/* {message.is_edited && (
            <span className="edited-badge">(edited)</span>
          )} */}
          <span className="message-time">
            {formatDistanceToNow(new Date(message.created_at), { 
              addSuffix: true 
            })}
          </span>
        </div>

        <p className="message-text">{renderMessageContent(message.content)}</p>

        {/* Reactions */}
        {message.reactions && message.reactions.length > 0 && (
          <div className="message-reactions">
            {message.reactions.map((reaction, idx) => (
              <div 
                key={idx}
                className="reaction-bubble"
                onClick={() => handleReaction(reaction.emoji)}
                title={reaction.users?.join(', ')}
              >
                <span className="reaction-emoji">{reaction.emoji}</span>
                <span className="reaction-count">{reaction.count}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Message Actions */}
      {showActions && (
        <div className="message-actions">
          <button
            className="action-btn reaction-btn"
            onClick={() => setShowReactions(!showReactions)}
            title="React"
          >
            😊
          </button>
          <button
            className="action-btn reply-btn"
            onClick={() => onReply(message)}
            title="Reply"
          >
            💬
          </button>
          {canDelete && (
            <button
              className="action-btn delete-btn"
              onClick={handleDelete}
              title="Delete"
            >
              🗑️
            </button>
          )}
        </div>
      )}

      {/* Reaction Picker */}
      {showReactions && (
        <div className="reaction-picker">
          {quickReactions.map(emoji => (
            <button
              key={emoji}
              className="reaction-option"
              onClick={() => handleReaction(emoji)}
            >
              {emoji}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function renderMessageContent(content) {
  const mentionRegex = /@(\w+)/g;
  const parts = content.split(mentionRegex);
  
  return parts.map((part, index) => {
    if (index % 2 === 1) {
      return (
        <span key={index} className="mention">
          @{part}
        </span>
      );
    }
    return part;
  });
}