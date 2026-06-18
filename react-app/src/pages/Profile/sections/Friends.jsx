// react-app/src/pages/Profile/sections/Friends.jsx

import { useState } from "react";

export default function Friends() {
  const [friends, setFriends] = useState([
    { id: 1, name: "Alex", status: "online", level: 12, avatar: "👨" },
    { id: 2, name: "Nina", status: "offline", level: 8, avatar: "👩" },
    { id: 3, name: "Jordan", status: "online", level: 15, avatar: "🧑" },
  ]);

  const [requests, setRequests] = useState([
    { id: 4, name: "Chris", level: 6, avatar: "👤" },
    { id: 5, name: "Sam", level: 9, avatar: "👤" },
  ]);

  const acceptRequest = (id) => {
    const accepted = requests.find(r => r.id === id);
    setFriends([...friends, { ...accepted, status: "offline" }]);
    setRequests(requests.filter(r => r.id !== id));
  };

  const rejectRequest = (id) => {
    setRequests(requests.filter(r => r.id !== id));
  };

  return (
    <div className="profile-friends">
      <h3 className="Profile-title">Friends</h3>

      {/* Friend Requests */}
      {requests.length > 0 && (
        <div className="friends-section">
          <h4 className="friends-title">
            Friend Requests ({requests.length})
          </h4>

          {requests.map((req, index) => (
            <div 
              key={req.id} 
              className="friend-row"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  background: "var(--primary-gradient)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "24px"
                }}>
                  {req.avatar}
                </div>
                <div>
                  <div style={{ fontWeight: "700", marginBottom: "4px" }}>
                    {req.name}
                  </div>
                  <div style={{ 
                    fontSize: "13px", 
                    color: "var(--text-muted)" 
                  }}>
                    Level {req.level}
                  </div>
                </div>
              </div>
              <div className="friend-actions">
                <button 
                  onClick={() => acceptRequest(req.id)}
                  style={{
                    background: "rgba(0, 255, 136, 0.2)",
                    color: "#00ff88"
                  }}
                >
                  ✓ Accept
                </button>
                <button 
                  className="danger" 
                  onClick={() => rejectRequest(req.id)}
                >
                  ✕ Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Friends List */}
      <div className="friends-section">
        <h4 className="friends-title">
          Your Friends ({friends.length})
        </h4>

        {friends.map((friend, index) => (
          <div 
            key={friend.id} 
            className="friend-row"
            style={{ animationDelay: `${(index + requests.length) * 0.1}s` }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                background: friend.status === "online" 
                  ? "var(--success-gradient)" 
                  : "rgba(160, 174, 192, 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "24px",
                position: "relative"
              }}>
                {friend.avatar}
                {friend.status === "online" && (
                  <span style={{
                    position: "absolute",
                    bottom: "0",
                    right: "0",
                    width: "12px",
                    height: "12px",
                    background: "#00ff88",
                    borderRadius: "50%",
                    border: "2px solid var(--card-bg)"
                  }}></span>
                )}
              </div>
              <div>
                <div style={{ fontWeight: "700", marginBottom: "4px" }}>
                  {friend.name}
                </div>
                <div style={{ 
                  fontSize: "13px", 
                  color: "var(--text-muted)" 
                }}>
                  Level {friend.level}
                </div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span className={`status ${friend.status}`}>
                {friend.status === "online" ? "🟢 Online" : "⚫ Offline"}
              </span>
              <button style={{
                padding: "8px 16px",
                background: "rgba(79, 172, 254, 0.15)",
                border: "none",
                borderRadius: "8px",
                color: "#4facfe",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.3s ease"
              }}>
                Message
              </button>
            </div>
          </div>
        ))}
      </div>

      <button className="invite-btn">
        ➕ Invite Friends
      </button>
    </div>
  );
}