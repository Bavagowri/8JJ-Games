// react-app/src/pages/admin/AdminMatchSync/AdminMatchSync.jsx
import { useState } from "react";
import { adminMatchesAPI } from "../../../api/admin.matches.api";
import AdminLayout from "../components/AdminLayout";
import { RefreshCw, Trophy, CheckCircle, XCircle, Zap } from "lucide-react";
import toast from "react-hot-toast";
import "./AdminMatchSync.css";

export default function AdminMatchSync() {
  const [loading, setLoading] = useState(false);
  const [totalSynced, setTotalSynced] = useState(null);
  const [isSuccess, setIsSuccess] = useState(null); // true | false | null

  const handleSyncMatches = async () => {
    try {
      setLoading(true);
      setTotalSynced(null);
      setIsSuccess(null);

      const result = await adminMatchesAPI.syncMatches();

      setTotalSynced(result.total);
      setIsSuccess(true);
      toast.success(`Synced ${result.total} matches`);
    } catch (err) {
      console.error(err);
      setIsSuccess(false);
      toast.error("Failed to sync matches");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout title="Match Sync" breadcrumbs={["Admin", "Match Sync"]}>
      <div className="admin-card">

        {/* Header */}
        <div className="match-sync-header">
          <div className="match-sync-header-icon">
            <Zap size={24} strokeWidth={2} color="#ffa500" />
          </div>
          <div className="match-sync-header-text">
            <h2>Match Sync</h2>
            <p>Pull and sync upcoming cricket matches from the 8JJ Cricket API</p>
          </div>
        </div>

        <div className="match-sync-divider" />

        {/* Sync Card */}
        <div className="match-sync-grid">
          <div className="match-sync-card">
            {/* bg decoration */}
            <div className="match-sync-card-bg-icon">
              <Trophy size={110} strokeWidth={1} color="#ffa500" />
            </div>

            <div className="match-sync-card-top">
              <div className="match-sync-card-icon">
                <Trophy size={20} strokeWidth={2} color="#ffa500" />
              </div>
              <div className="match-sync-card-info">
                <h3>Cricket Matches</h3>
                <p>Fetch upcoming fixtures and metadata from the external cricket data provider</p>
              </div>
            </div>

            <button
              className="match-sync-trigger-btn"
              onClick={handleSyncMatches}
              disabled={loading}
            >
              <RefreshCw
                size={16}
                strokeWidth={2.5}
                className={loading ? "match-sync-spin" : ""}
              />
              {loading ? "Syncing..." : "Sync Matches"}
            </button>
          </div>

          {/* Stats Card — appears after a successful sync */}
          {totalSynced !== null && isSuccess && (
            <div className="match-sync-stat-card">
              <div className="match-sync-stat-card-bg-icon">
                <CheckCircle size={110} strokeWidth={1} color="#00ff88" />
              </div>
              <div className="match-sync-stat-label">Matches Synced</div>
              <div className="match-sync-stat-value">{totalSynced}</div>
              <div className="match-sync-stat-sub">Latest data is now live</div>
            </div>
          )}
        </div>

        {/* Status Message */}
        {isSuccess !== null && (
          <div className={`match-sync-message ${isSuccess ? "match-sync-message-success" : "match-sync-message-error"}`}>
            {isSuccess
              ? <CheckCircle size={18} strokeWidth={2.5} />
              : <XCircle size={18} strokeWidth={2.5} />
            }
            {isSuccess
              ? `${totalSynced} match${totalSynced !== 1 ? "es" : ""} synced successfully!`
              : "Match sync failed. Please try again."
            }
          </div>
        )}

      </div>
    </AdminLayout>
  );
}