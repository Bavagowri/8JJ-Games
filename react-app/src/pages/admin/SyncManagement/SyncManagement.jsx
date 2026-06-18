// react-app/src/pages/admin/SyncManagement/SyncManagement.jsx
import { useState } from "react";
import AdminLayout from "../components/AdminLayout";
import { RefreshCw, Globe, Server, CheckCircle, XCircle, DatabaseZap } from "lucide-react";
import "./SyncManagement.css";

export default function SyncManagement() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(null); // true | false | null

  const token = localStorage.getItem("token");

  // ── Original API handlers preserved exactly ──────────────────────────────

  const handleH5Sync = async () => {
    try {
      setLoading(true);
      setMessage("");
      setIsSuccess(null);

      const res = await fetch("/api/admin/sync-h5", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Sync failed");

      setIsSuccess(true);
      setMessage("H5 Games synced successfully!");
    } catch (err) {
      console.error(err);
      setIsSuccess(false);
      setMessage("H5 Sync failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelfSync = async () => {
    try {
      setLoading(true);
      setMessage("");
      setIsSuccess(null);

      const res = await fetch("/api/admin/sync-self", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Sync failed");

      setIsSuccess(true);
      setMessage("Self Hosted Games synced successfully!");
    } catch (err) {
      console.error(err);
      setIsSuccess(false);
      setMessage("Self Hosted Sync failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <AdminLayout
      title="Sync Management"
      breadcrumbs={["Admin", "Sync Management"]}
    >
      <div className="admin-card">

        {/* Header */}
        <div className="sync-header">
          <div className="sync-header-icon">
            <DatabaseZap size={24} strokeWidth={2} color="#00d9ff" />
          </div>
          <div className="sync-header-text">
            <h2>Sync Management</h2>
            <p>Manually trigger sync for external and self-hosted game sources</p>
          </div>
        </div>

        <div className="sync-divider" />

        {/* Sync Cards */}
        <div className="sync-grid">

          {/* H5 Sync Card */}
          <div className="sync-card">
            {/* bg decoration */}
            <div className="sync-card-bg-icon">
              <Globe size={100} strokeWidth={1} color="#00d9ff" />
            </div>

            <div className="sync-card-top">
              <div className="sync-card-icon">
                <Globe size={20} strokeWidth={2} color="#00d9ff" />
              </div>
              <div className="sync-card-info">
                <h3>H5 Games</h3>
                <p>Pull latest game data from the external H5 game provider API</p>
              </div>
            </div>

            <button
              className="sync-trigger-btn sync-btn-primary"
              onClick={handleH5Sync}
              disabled={loading}
            >
              <RefreshCw
                size={16}
                strokeWidth={2.5}
                className={loading ? "sync-spin" : ""}
              />
              {loading ? "Syncing..." : "Sync H5 Games"}
            </button>
          </div>

          {/* Self Hosted Sync Card */}
          <div className="sync-card sync-card-secondary">
            <div className="sync-card-bg-icon">
              <Server size={100} strokeWidth={1} color="#ffa500" />
            </div>

            <div className="sync-card-top">
              <div className="sync-card-icon">
                <Server size={20} strokeWidth={2} color="#ffa500" />
              </div>
              <div className="sync-card-info">
                <h3>Self Hosted Games</h3>
                <p>Sync locally hosted game files and update metadata from server</p>
              </div>
            </div>

            <button
              className="sync-trigger-btn sync-btn-secondary"
              onClick={handleSelfSync}
              disabled={loading}
            >
              <RefreshCw
                size={16}
                strokeWidth={2.5}
                className={loading ? "sync-spin" : ""}
              />
              {loading ? "Syncing..." : "Sync Self Hosted Games"}
            </button>
          </div>

        </div>

        {/* Status Message */}
        {message && (
          <div className={`sync-message ${isSuccess ? "sync-message-success" : "sync-message-error"}`}>
            {isSuccess
              ? <CheckCircle size={18} strokeWidth={2.5} />
              : <XCircle size={18} strokeWidth={2.5} />
            }
            {message}
          </div>
        )}

      </div>
    </AdminLayout>
  );
}