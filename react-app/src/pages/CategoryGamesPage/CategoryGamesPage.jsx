import { useParams } from "react-router-dom";
import { useLayoutEffect, useEffect, useState, useRef, useCallback  } from "react";
import MosaicGameCard from "../../components/MosaicGameCard/MosaicGameCard";
import { translate } from "../../data/translations";
import { useLanguage } from "../../context/LanguageContext";
import "./CategoryGamesPage.css";

export default function CategoryGamesPage() {
  const { categoryId } = useParams();
  const { lang } = useLanguage();
  const [games, setGames] = useState([]);
  const [displayedGames, setDisplayedGames] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();
  
  const GAMES_PER_PAGE = 24;

  // ✅ FORCE scroll to top AFTER render
  useLayoutEffect(() => {
    requestAnimationFrame(() => {
      window.scrollTo(0, 0);
    });
  }, [categoryId]);

  useEffect(() => {
    const cached = localStorage.getItem("games");
    if (!cached) return;

    const allGames = JSON.parse(cached);

    const filtered = allGames.filter(g =>
      g.category === categoryId ||
      g.tagList?.includes(categoryId)
    );

    setGames(filtered);
    setDisplayedGames(filtered.slice(0, GAMES_PER_PAGE));
    setPage(1);
    setHasMore(filtered.length > GAMES_PER_PAGE);
    
    // Ensure scroll to top after state updates
    setTimeout(() => window.scrollTo({ top: 0, left: 0, behavior: 'instant' }), 0);
  }, [categoryId]);

  const loadMoreGames = useCallback(() => {
    const nextPage = page + 1;
    const startIndex = page * GAMES_PER_PAGE;
    const endIndex = startIndex + GAMES_PER_PAGE;
    const newGames = games.slice(startIndex, endIndex);
    
    if (newGames.length > 0) {
      setDisplayedGames(prev => [...prev, ...newGames]);
      setPage(nextPage);
      setHasMore(endIndex < games.length);
    } else {
      setHasMore(false);
    }
  }, [page, games]);

  const lastGameRef = useCallback(node => {
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMoreGames();
      }
    });
    
    if (node) observer.current.observe(node);
  }, [hasMore, loadMoreGames]);

  return (
    <div className="ScrollSnap">
      <div className="category-page">
        <h1 className="category-title">
         🎮 {translate(categoryId, lang)}
        </h1>
      <div className="mosaic-grid">
        {displayedGames.map((game, index) => {
          if (displayedGames.length === index + 1) {
            return (
              <div ref={lastGameRef} key={game.id}>
                <MosaicGameCard game={game} />
              </div>
            );
          } else {
            return <MosaicGameCard key={game.id} game={game} />;
          }
        })}
      </div>

      {hasMore && (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <div className="loader-spinner"></div>
        </div>
      )}
    </div>
    </div>
    
  );
}