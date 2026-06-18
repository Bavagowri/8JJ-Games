// react-app/src/components/predictions/PredictionFilterBar/PredictionFilterBar.jsx
import { useId } from "react";
import "./PredictionFilterBar.css";

/**
 * PredictionFilterBar
 *
 * Renders secondary filters (search, tournament dropdown,
 * "Not Predicted Yet" toggle, "My Picks" dropdown) below the main tab row.
 *
 * Shown only when the active tab is live | done/finished | all.
 *
 * Props
 * ─────
 * searchQuery        string
 * onSearchChange     (value: string) => void
 * tournamentFilter   string  ("all" | specific tournament name)
 * onTournamentChange (value: string) => void
 * notPredictedOnly   boolean
 * onNotPredictedToggle () => void
 * myPicksFilter      string  ("all" | "won" | "lost" | "skipped")
 * onMyPicksChange    (value: string) => void
 * tournaments        string[]   list of unique tournament names
 * isLoggedIn         boolean
 * onRequireAuth      () => void   called when guest taps locked control
 * isMobile           boolean     drives minor layout tweaks
 */
export default function PredictionFilterBar({
  searchQuery = "",
  onSearchChange,
  tournamentFilter = "all",
  onTournamentChange,
  notPredictedOnly = false,
  onNotPredictedToggle,
  myPicksFilter = "all",
  onMyPicksChange,
  tournaments = [],
  isLoggedIn = false,
  onRequireAuth,
  isMobile = false,
  activeTab = "all", // "live" | "done" | "finished" | "all"
}) {
  const searchId = useId();
  const selectId = useId();
  const myPicksId = useId();

  // "Not Predicted Yet" only makes sense in live + all tabs
  const showNotPredicted = activeTab === "live" || activeTab === "all";

  // "My Picks" dropdown only makes sense on the completed tab
  const showMyPicks = activeTab === "done" || activeTab === "finished";

  const handleNotPredictedClick = () => {
    if (!isLoggedIn) {
      onRequireAuth?.();
      return;
    }
    onNotPredictedToggle?.();
  };

  const handleMyPicksChange = (e) => {
    if (!isLoggedIn) {
      onRequireAuth?.();
      return;
    }
    onMyPicksChange?.(e.target.value);
  };

  const hasTournaments = tournaments.length > 1;

  // My Picks icon reflects active filter state
  const myPicksIcon = myPicksFilter === "won" ? "✅" : myPicksFilter === "lost" ? "❌" : myPicksFilter === "skipped" ? "⬜" : "🏏";

  return (
    <div className={`pfb-root${isMobile ? " pfb-mobile" : " pfb-desktop"}`}>
      {/* ── Search ─────────────────────────────────────────────── */}
      <div className="pfb-search-wrap">
        <span className="pfb-search-icon" aria-hidden="true">🔍</span>
        <input
          id={searchId}
          type="search"
          className="pfb-search"
          placeholder="Search teams or tournaments…"
          value={searchQuery}
          onChange={(e) => onSearchChange?.(e.target.value)}
          aria-label="Search prediction matches by team or tournament name"
          autoComplete="off"
          spellCheck={false}
        />
        {searchQuery && (
          <button
            className="pfb-search-clear"
            onClick={() => onSearchChange?.("")}
            aria-label="Clear search"
            type="button"
          >
            ×
          </button>
        )}
      </div>

      {/* ── Tournament dropdown ─────────────────────────────────── */}
      {hasTournaments && (
        <div className="pfb-select-wrap">
          <span className="pfb-select-icon" aria-hidden="true">🏆</span>
          <select
            id={selectId}
            className="pfb-select"
            value={tournamentFilter}
            onChange={(e) => onTournamentChange?.(e.target.value)}
            aria-label="Filter by tournament"
          >
            <option value="all">All Tournaments</option>
            {tournaments.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          <span className="pfb-select-chevron" aria-hidden="true">▾</span>
        </div>
      )}

      {/* ── My Picks dropdown (completed tab only) ──────────────── */}
      {showMyPicks && (
        <div className={`pfb-select-wrap${!isLoggedIn ? " pfb-mypicks-locked" : ""}${myPicksFilter !== "all" ? " pfb-mypicks-active" : ""}`}>
          <span className="pfb-select-icon" aria-hidden="true">{myPicksIcon}</span>
          <select
            id={myPicksId}
            className={`pfb-select pfb-mypicks-select${myPicksFilter !== "all" ? " pfb-mypicks-select-active" : ""}`}
            value={isLoggedIn ? myPicksFilter : "all"}
            onChange={handleMyPicksChange}
            aria-label="Filter completed matches by your prediction result"
            disabled={!isLoggedIn}
            title={!isLoggedIn ? "Login to filter by your picks" : undefined}
          >
            <option value="all">{isLoggedIn ? "My Picks" : "🔒 My Picks"}</option>
            <option value="won">My Wins</option>
            <option value="lost">My Losses</option>
            <option value="skipped">I Didn't Predict</option>
          </select>
          <span className="pfb-select-chevron" aria-hidden="true">▾</span>
          {myPicksFilter !== "all" && isLoggedIn && (
            <span className="pfb-mypicks-badge" aria-hidden="true">ON</span>
          )}
        </div>
      )}

      {/* ── Not Predicted Yet toggle ─────────────────────────────── */}
      {showNotPredicted && (
        <button
          className={`pfb-toggle${notPredictedOnly ? " pfb-toggle-active" : ""}${!isLoggedIn ? " pfb-toggle-locked" : ""}`}
          onClick={handleNotPredictedClick}
          aria-pressed={notPredictedOnly}
          aria-label={isLoggedIn ? "Show only matches I haven't predicted yet" : "Login to filter unpredicted matches"}
          type="button"
        >
          {!isLoggedIn ? (
            <span className="pfb-toggle-lock">🔒</span>
          ) : (
            <span className={`pfb-toggle-dot${notPredictedOnly ? " pfb-toggle-dot-on" : ""}`} aria-hidden="true" />
          )}
          <span className="pfb-toggle-label">
            {isLoggedIn ? "Not Predicted Yet" : "Login to filter"}
          </span>
          {notPredictedOnly && isLoggedIn && (
            <span className="pfb-toggle-badge" aria-hidden="true">ON</span>
          )}
        </button>
      )}
    </div>
  );
}