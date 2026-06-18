import MatchPreviewCard from "./MatchPreviewCard";
import "./MatchPreviewSection.css";

export default function MatchPreviewSection({
  live = [],
  upcoming = [],
  upcomingPagination = {},
  upcomingPage = 1,
  onUpcomingPageChange,
  recent = [],
  recentPagination = {},
  recentPage = 1,
  onRecentPageChange,
}) {
  return (
    <div className="mps-root">

      {/* 🔴 LIVE */}
      {live.length > 0 && (
        <section className="mps-section">
          <h3 className="mps-title">🔴 Live Matches</h3>
          <div className="mps-grid">
            {live.map((m) => (
              <MatchPreviewCard key={m.id} match={m} />
            ))}
          </div>
        </section>
      )}

      {/* 🟡 UPCOMING */}
      {upcoming.length > 0 && (
        <section className="mps-section">
          <h3 className="mps-title">📅 Upcoming Matches</h3>
          <div className="mps-grid">
            {upcoming.map((m) => (
              <MatchPreviewCard key={m.id} match={m} />
            ))}
          </div>

          {upcomingPagination.totalPages > 1 && (
            <div className="mps-pagination">
              <button
                disabled={upcomingPage === 1}
                onClick={() => onUpcomingPageChange(upcomingPage - 1)}
              >
                ⬅ Prev
              </button>
              <span>Page {upcomingPage} / {upcomingPagination.totalPages}</span>
              <button
                disabled={upcomingPage === upcomingPagination.totalPages}
                onClick={() => onUpcomingPageChange(upcomingPage + 1)}
              >
                Next ➡
              </button>
            </div>
          )}
        </section>
      )}

      {/* 🔵 RECENT */}
      {recent.length > 0 && (
        <section className="mps-section">
          <h3 className="mps-title">📊 Recent Matches</h3>
          <div className="mps-grid">
            {recent.map((m) => (
              <MatchPreviewCard key={m.id} match={m} />
            ))}
          </div>

          {recentPagination.totalPages > 1 && (
            <div className="mps-pagination">
              <button
                disabled={recentPage === 1}
                onClick={() => onRecentPageChange(recentPage - 1)}
              >
                ⬅ Prev
              </button>
              <span>Page {recentPage} / {recentPagination.totalPages}</span>
              <button
                disabled={recentPage === recentPagination.totalPages}
                onClick={() => onRecentPageChange(recentPage + 1)}
              >
                Next ➡
              </button>
            </div>
          )}
        </section>
      )}

    </div>
  );
}