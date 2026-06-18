import { useState } from "react";
import "./HeaderDropdowns.css";

export default function FriendsDropdown({ isOpen, onClose }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [friends, setFriends] = useState([
    // Example friends - replace with real data
    // { id: 1, name: "Alex", avatar: "👨", status: "online" },
    // { id: 2, name: "Nina", avatar: "👩", status: "offline" },
  ]);

  const filteredFriends = friends.filter(friend =>
    friend.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <>
      <div className="dropdown-overlay" onClick={onClose}></div>
      <div className="header-dropdown friends-dropdown">
        <div className="dropdown-header">
          <div className="dropdown-title">
            <span className="dropdown-icon">👥</span>
            <h3>Friends</h3>
          </div>
        </div>

        <div className="dropdown-content">
          {friends.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
                  <circle cx="60" cy="60" r="55" fill="rgba(79, 172, 254, 0.1)"/>
                  <text x="60" y="75" fontSize="48" textAnchor="middle" fill="#4facfe">👥</text>
                </svg>
              </div>
              <h4>Invite your friends</h4>
              <p>Find friends by searching for their usernames, or share your invite link</p>
              
              <div className="invite-actions">
                <button className="btn-primary">
                  <span>🎮</span>
                  Play with friends
                </button>
                <button className="btn-secondary">
                  <span>🔗</span>
                  Share profile
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="friends-search">
                <input
                  type="text"
                  placeholder="Search new or existing friends"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
                <span className="search-icon">🔍</span>
              </div>

              <div className="friends-actions">
                <button className="btn-primary full-width">
                  <span>🎮</span>
                  Play with friends
                </button>
                <button className="btn-secondary full-width">
                  <span>🔗</span>
                  Share profile
                </button>
              </div>

              <div className="friends-list">
                {filteredFriends.length === 0 ? (
                  <div className="no-results">
                    <p>No friends found</p>
                  </div>
                ) : (
                  filteredFriends.map((friend) => (
                    <div key={friend.id} className="friend-item">
                      <div className="friend-avatar-wrapper">
                        <div className="friend-avatar">
                          {friend.avatar}
                        </div>
                        <span className={`status-indicator ${friend.status}`}></span>
                      </div>
                      <div className="friend-info">
                        <p className="friend-name">{friend.name}</p>
                        <span className={`friend-status ${friend.status}`}>
                          {friend.status === 'online' ? '🟢 Online' : '⚫ Offline'}
                        </span>
                      </div>
                      <button className="friend-action-btn" title="Message">
                        💬
                      </button>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}