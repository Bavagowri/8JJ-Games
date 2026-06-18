// react-app/src/pages/admin/GameManager/GameManager.jsx
import { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import { Gamepad2, Search, ChevronLeft, ChevronRight, Flame, Star, Trophy } from "lucide-react";
import "./GameManager.css";

// ── Styled toggle switch that wraps a native checkbox ──────────────────────
function Toggle({ type, checked, onChange }) {
  // type: "hot" | "featured" | "toppick"
  const labels = {
    hot: { on: "🔥 Hot", off: "Off" },
    featured: { on: "⭐ On", off: "Off" },
    toppick: { on: "✓ On", off: "Off" },
  };

  return (
    <label className={`toggle-switch ${type}`} style={{ cursor: "pointer" }}>
      <input type="checkbox" checked={checked} onChange={onChange} />
      <div className="toggle-track" />
      <div className="toggle-label">
        <span className={`toggle-tag ${checked ? "" : "toggle-tag-off"}`}>
          {checked ? labels[type].on : labels[type].off}
        </span>
      </div>
    </label>
  );
}

export default function GameManager() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchGames();
  }, [page, search]);

  // ── All original API functions preserved exactly ──────────────────────────

  async function fetchGames() {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/admin/games?page=${page}&limit=20&search=${search}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      setGames(data.data || []);
      setPagination(data.pagination || { page: 1, pages: 1 });
    } catch (err) {
      console.error("Failed to fetch games", err);
    } finally {
      setLoading(false);
    }
  }

  async function toggleHot(id, value) {
    await fetch(`/api/admin/games/hot/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ is_hot: value ? 1 : 0 }),
    });
    fetchGames();
  }

  async function toggleFeatured(id, value) {
    await fetch(`/api/admin/games/featured/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ is_featured: value ? 1 : 0 }),
    });
    fetchGames();
  }

  async function toggleTopPick(id, value) {
    await fetch(`/api/admin/games/top-pick/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ is_top_pick: value ? 1 : 0 }),
    });
    fetchGames();
  }

  async function updateTopPickOrder(id, order) {
    await fetch(`/api/admin/games/top-pick/order/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ top_pick_order: order }),
    });
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <AdminLayout title="Game Manager" breadcrumbs={["Admin", "Game Manager"]}>
      <div className="admin-card game-manager-card">

        {/* Header */}
        <div className="game-manager-header">
          <div className="game-manager-header-icon">
            <Gamepad2 size={22} strokeWidth={2} color="#00d9ff" />
          </div>
          <div className="game-manager-header-text">
            <h2>Game Manager</h2>
            <p>Control homepage visibility — hot picks, featured & top selections</p>
          </div>
        </div>

        {/* Toolbar */}
        <div className="game-manager-toolbar">
          <div className="game-manager-search-wrap">
            <Search size={15} className="game-manager-search-icon" />
            <input
              className="game-manager-search"
              type="text"
              placeholder="Search games..."
              value={search}
              onChange={(e) => { setPage(1); setSearch(e.target.value); }}
            />
          </div>
          {!loading && (
            <p className="game-manager-count">
              Showing <span>{games.length}</span> games
            </p>
          )}
        </div>

        {/* Content */}
        {loading ? (
          <div className="game-manager-loading">
            <div className="game-manager-loading-spinner" />
            Loading games...
          </div>
        ) : games.length === 0 ? (
          <div className="game-manager-empty">
            <div className="game-manager-empty-icon">🎮</div>
            <h3>No games found</h3>
            <p>Try adjusting your search query.</p>
          </div>
        ) : (
          <>
            <div className="game-manager-table-wrap">
              <table className="game-manager-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th className="center">
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                        <Flame size={13} /> Hot
                      </span>
                    </th>
                    <th className="center">
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                        <Star size={13} /> Featured
                      </span>
                    </th>
                    <th className="center">
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                        <Trophy size={13} /> Top Pick
                      </span>
                    </th>
                    <th className="center">Order</th>
                  </tr>
                </thead>
                <tbody>
                  {games.map((game) => (
                    <tr key={game.id}>
                      {/* Title */}
                      <td>
                        <div className="game-title-cell">
                          <div className="game-title-avatar">
                            <Gamepad2 size={16} strokeWidth={1.8} />
                          </div>
                          <span className="game-title-name">{game.title}</span>
                        </div>
                      </td>

                      {/* Hot */}
                      <td className="center">
                        <Toggle
                          type="hot"
                          checked={game.is_hot === 1}
                          onChange={(e) => toggleHot(game.id, e.target.checked)}
                        />
                      </td>

                      {/* Featured */}
                      <td className="center">
                        <Toggle
                          type="featured"
                          checked={game.is_featured === 1}
                          onChange={(e) => toggleFeatured(game.id, e.target.checked)}
                        />
                      </td>

                      {/* Top Pick */}
                      <td className="center">
                        <Toggle
                          type="toppick"
                          checked={game.is_top_pick === 1}
                          onChange={(e) => toggleTopPick(game.id, e.target.checked)}
                        />
                      </td>

                      {/* Order */}
                      <td className="center">
                        <div className="order-input-wrap">
                          <input
                            className="order-input"
                            type="number"
                            defaultValue={game.top_pick_order || 0}
                            onBlur={(e) => updateTopPickOrder(game.id, e.target.value)}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="game-manager-pagination">
              <button
                className="gm-page-btn"
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
              >
                <ChevronLeft size={16} /> Prev
              </button>

              <span className="gm-page-info">
                Page <strong>{pagination.page}</strong> of <strong>{pagination.pages}</strong>
              </span>

              <button
                className="gm-page-btn"
                disabled={page >= pagination.pages}
                onClick={() => setPage(page + 1)}
              >
                Next <ChevronRight size={16} />
              </button>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}