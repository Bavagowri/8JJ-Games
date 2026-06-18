// react-app/src/components/Chat/ChatInput.jsx

import { useState, useRef, useEffect } from 'react';
import MentionPicker from './MentionPicker';
import ReplyPreview from './ReplyPreview';
import './ChatInput.css';

export default function ChatInput({ 
  onSend, 
  onTyping, 
  replyingTo, 
  onCancelReply,
  onlineUsers 
}) {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showMentions, setShowMentions] = useState(false);
  const [mentionSearch, setMentionSearch] = useState('');
  const [cursorPosition, setCursorPosition] = useState(0);
  
  const typingTimeoutRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (message && !isTyping) {
      setIsTyping(true);
      onTyping(true);
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    if (message) {
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
        onTyping(false);
      }, 1000);
    } else if (isTyping) {
      setIsTyping(false);
      onTyping(false);
    }

    // Check for @ mentions
    const lastAtIndex = message.lastIndexOf('@', cursorPosition);
    if (lastAtIndex !== -1 && lastAtIndex === cursorPosition - 1) {
      setShowMentions(true);
      setMentionSearch('');
    } else if (lastAtIndex !== -1) {
      const afterAt = message.substring(lastAtIndex + 1, cursorPosition);
      if (!afterAt.includes(' ')) {
        setShowMentions(true);
        setMentionSearch(afterAt);
      } else {
        setShowMentions(false);
      }
    } else {
      setShowMentions(false);
    }

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [message, cursorPosition]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!message.trim()) return;

    onSend(message);
    setMessage('');
    setShowMentions(false);
    
    if (isTyping) {
      setIsTyping(false);
      onTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleMentionSelect = (username) => {
    const lastAtIndex = message.lastIndexOf('@', cursorPosition);
    const beforeMention = message.substring(0, lastAtIndex);
    const afterCursor = message.substring(cursorPosition);
    
    const newMessage = `${beforeMention}@${username} ${afterCursor}`;
    setMessage(newMessage);
    setShowMentions(false);
    
    // Focus back to input
    setTimeout(() => {
      inputRef.current?.focus();
      const newPosition = beforeMention.length + username.length + 2;
      inputRef.current?.setSelectionRange(newPosition, newPosition);
    }, 0);
  };

  const handleInputChange = (e) => {
    setMessage(e.target.value);
    setCursorPosition(e.target.selectionStart);
  };

  return (
    <div className="chat-input-wrapper">
      {replyingTo && (
        <ReplyPreview
          message={replyingTo}
          onCancel={onCancelReply}
        />
      )}

      {showMentions && (
        <MentionPicker
          users={onlineUsers}
          searchQuery={mentionSearch}
          onSelect={handleMentionSelect}
          onClose={() => setShowMentions(false)}
        />
      )}

      <form className="chat-input" onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          type="text"
          value={message}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          onClick={(e) => setCursorPosition(e.target.selectionStart)}
          onKeyUp={(e) => setCursorPosition(e.target.selectionStart)}
          placeholder={replyingTo ? `Reply to @${replyingTo.username}...` : "Type @ to mention someone..."}
          maxLength={2000}
        />
        <button 
          type="submit" 
          disabled={!message.trim()}
        >
          Send
        </button>
      </form>
    </div>
  );
}