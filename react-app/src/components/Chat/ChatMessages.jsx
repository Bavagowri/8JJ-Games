// react-app/src/components/Chat/ChatMessages.jsx

import { useEffect, useRef } from 'react';
import MessageItem from './MessageItem';
import './ChatMessages.css';

export default function ChatMessages({ 
  messages, 
  typingUsers, 
  currentUser,
  onDelete,
  onReaction,
  onReply 
}) {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="chat-messages">
      {messages.length === 0 ? (
        <div className="no-messages">
          <div className="no-messages-icon">💬</div>
          <p>No messages yet. Start the conversation!</p>
        </div>
      ) : (
        messages.map((msg) => (
          <MessageItem
            key={msg.id}
            message={msg}
            currentUser={currentUser}
            onDelete={onDelete}
            onReaction={onReaction}
            onReply={onReply}
          />
        ))
      )}

      {typingUsers.length > 0 && (
        <div className="typing-indicator">
          <div className="typing-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <span className="typing-text">
            {typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
          </span>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
}