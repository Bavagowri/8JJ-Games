// react-app/src/components/Chat/MentionPicker.jsx

import { useEffect, useRef } from 'react';
import { resolveAvatarUrl } from '../../utils/avatarUrl';
import './MentionPicker.css';

export default function MentionPicker({ users, searchQuery, onSelect, onClose }) {
  const pickerRef = useRef(null);

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 5);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  if (filteredUsers.length === 0) {
    return null;
  }

  return (
    <div className="mention-picker" ref={pickerRef}>
      <div className="mention-header">
        <span className="mention-title">Mention</span>
      </div>
      <div className="mention-list">
        {filteredUsers.map(user => (
          <div
            key={user.id}
            className="mention-item"
            onClick={() => onSelect(user.username)}
          >
            <img
              src={resolveAvatarUrl(user.avatar)}
              alt={user.username}
              className="mention-avatar"
            />
            <div className="mention-info">
              <span className="mention-username">{user.username}</span>
              <span className="mention-level">Level {user.level}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}