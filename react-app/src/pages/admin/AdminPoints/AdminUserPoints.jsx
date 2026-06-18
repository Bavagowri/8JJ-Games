// react-app/src/pages/admin/AdminPoints/AdminUserPoints.jsx
import { useEffect, useState } from "react";
import { adminAPI } from "../../../api/admin.api";
import AdminLayout from "../components/AdminLayout";
import { Users, Zap, Gift } from "lucide-react";
import "./AdminPoints.css";

// ── Tier helper ───────────────────────────────────────────────────────────
function TierBadge({ tier }) {
  const t = (tier || "Bronze").toLowerCase();
  const cls =
    t === "gold" ? "tier-gold" :
      t === "silver" ? "tier-silver" :
        t === "platinum" ? "tier-platinum" :
          t === "diamond" ? "tier-diamond" :
            "tier-bronze";

  const icon =
    t === "gold" ? "🥇" :
      t === "silver" ? "🥈" :
        t === "platinum" ? "💎" :
          t === "diamond" ? "💠" :
            "🥉";

  return (
    <span className={`tier-badge ${cls}`}>
      {icon} {tier || "Bronze"}
    </span>
  );
}

export default function AdminUserPoints() {
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [points, setPoints] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    loadUsers();
  }, []);

  // ── All original logic preserved exactly ─────────────────────────────────

  const loadUsers = async () => {
    const data = await adminAPI.getUsersWithPoints();
    setUsers(data);
  };

  const toggleUser = (id) => {
    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((u) => u !== id) : [...prev, id]
    );
  };

  const handleAward = async () => {
    if (!points || selectedUsers.length === 0) {
      alert("Select users and enter points");
      return;
    }

    await adminAPI.bulkAdjustPoints({
      user_ids: selectedUsers,
      points: Number(points),
      note,
    });

    alert("Points awarded!");
    setSelectedUsers([]);
    setPoints("");
    setNote("");
    loadUsers();
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <AdminLayout
      title="User Points Management"
      breadcrumbs={["Admin", "User Points"]}
    >
      <div className="admin-card">

        {/* Page Header */}
        <div className="points-page-header">
          <div className="points-page-icon">
            <Users size={22} strokeWidth={2} color="#00d9ff" />
          </div>
          <div className="points-page-text">
            <h2>User Points Management</h2>
            <p>Select users and bulk-award or adjust point balances</p>
          </div>
        </div>

        {/* User List */}
        <div className="user-list-header">
          <h3>
            <Users size={16} strokeWidth={2} />
            Select Users
          </h3>
          {selectedUsers.length > 0 && (
            <span className="user-selected-count">
              {selectedUsers.length} selected
            </span>
          )}
        </div>

        <div className="user-list">
          {users.map((user) => {
            const isSelected = selectedUsers.includes(user.id);
            return (
              <div
                key={user.id}
                className={`user-row ${isSelected ? "selected" : ""}`}
                onClick={() => toggleUser(user.id)}
              >
                {/* Custom checkbox */}
                <div className="user-check-box">
                  <svg
                    className="user-check-mark"
                    viewBox="0 0 10 10"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1.5 5L4 7.5L8.5 2.5"
                      stroke={isSelected ? "#0a0a0f" : "transparent"}
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                {/* Avatar */}
                <div className="user-row-avatar">
                  {user.username?.charAt(0).toUpperCase() || "?"}
                </div>

                {/* Info */}
                <div className="user-row-info">
                  
                  <div className="user-row-name-email">
                    <div className="user-row-name">{user.username}</div><div className="user-row-email"> | {user.email}</div>
                  </div>


                  <div className="user-row-pts">
                    <span style={{ color: "#00d9ff", fontWeight: 700 }}>
                      {(user.total_points ?? 0).toLocaleString()}
                    </span>{" "}
                    pts
                  </div>
                </div>

                {/* Tier */}
                <TierBadge tier={user.current_tier} />
              </div>
            );
          })}

          {users.length === 0 && (
            <div style={{ padding: "32px", textAlign: "center", color: "rgba(255,255,255,0.35)", fontSize: 14 }}>
              No users found
            </div>
          )}
        </div>

        {/* Bulk Award Section */}
        <div className="bulk-award-card">
          <div className="bulk-award-title">
            <Gift size={14} strokeWidth={2} color="rgba(255,255,255,0.5)" />
            Bulk Award Points
          </div>

          <div className="bulk-award-grid">
            <div className="bulk-award-field">
              <label>Points</label>
              <input
                className="admin-input"
                type="number"
                placeholder="e.g. 100"
                value={points}
                onChange={(e) => setPoints(e.target.value)}
              />
            </div>

            <div className="bulk-award-field">
              <label>Reason / Note</label>
              <input
                className="admin-input"
                placeholder="e.g. Promo reward, manual adjustment..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>

            <button
              className="admin-button admin-button-primary"
              onClick={handleAward}
              disabled={!points || selectedUsers.length === 0}
              style={{ alignSelf: "end" }}
            >
              <Zap size={15} strokeWidth={2.5} />
              Award
            </button>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
}