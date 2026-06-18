

// react-app/src/components/RecentSection/RecentSection.jsx
import { useEffect, useState, useRef, useCallback } from "react";
import GameCard from "../GameCard/GameCard";
import "./RecentSection.css";
import { getRecentGames } from "../../api/games.api";

export default function RecentSection({ id, lang, translate }) {
  const [recentGames, setRecentGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const carouselRef = useRef(null);

  useEffect(() => {
    let mounted = true;

    async function fetchRecent() {
      try {
        setLoading(true);
        const games = await getRecentGames(12);

        if (mounted) {
          setRecentGames((games || []).slice(0, 12));
        }
      } catch (err) {
        console.error("Failed to load recent games:", err);
        if (mounted) setRecentGames([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchRecent();

    return () => {
      mounted = false;
    };
  }, []);

  // ─── FIX: checkScroll reads scrollLeft/scrollWidth/clientWidth ───────────
  // Reading these on a scroll event is fine — the browser has already done
  // layout by the time scroll fires. The problem was the RESIZE listener
  // which could fire mid-layout. Replaced with ResizeObserver.
  const checkScroll = useCallback(() => {
    const el = carouselRef.current;
    if (!el) return;
    // Batch all reads together — no writes between them = no forced reflow
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
  }, []);

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    checkScroll();

    // Scroll events are fine — layout is already settled when they fire
    carousel.addEventListener("scroll", checkScroll, { passive: true });

    // ─── FIX: ResizeObserver instead of window resize listener ───────────
    // window resize reads layout synchronously. ResizeObserver delivers
    // dimensions as part of the browser's layout pass — no forced reflow.
    const ro = new ResizeObserver(checkScroll);
    ro.observe(carousel);

    return () => {
      carousel.removeEventListener("scroll", checkScroll);
      ro.disconnect();
    };
  }, [recentGames, checkScroll]);

  const scroll = useCallback((direction) => {
    const el = carouselRef.current;
    if (!el) return;
    // Read clientWidth once, then write — no interleaving
    const amount = el.clientWidth * 0.8;
    el.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  }, []);

  if (!loading && (!recentGames || recentGames.length === 0)) {
    return null;
  }

  if (loading) {
    return (
      <section className="recent-section" id={id}>
        <div className="content-anim">
          <div className="recent-carousel-wrapper">
            <div className="recent-carousel-container">
              <ul className="recent-carousel">
                <li className="recent-carousel-item recent-label-item">
                  <div className="recent-label skeleton-label">
                    <div className="skeleton-text"></div>
                    <div className="skeleton-arrow"></div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="recent-section" id={id}>
      <div className="content-anim">
        <div className="recent-carousel-wrapper">
          <div className="recent-carousel-container">
            {canScrollLeft && (
              <button
                className="carousel-arrow carousel-arrow-left"
                onClick={() => scroll("left")}
                aria-label="Scroll left"
              />
            )}

            <ul className="recent-carousel" ref={carouselRef}>
              <li className="recent-carousel-item recent-label-item">
                <div className="recent-label">
                  <span>{translate("recentlyPlayed", lang)}</span>
                  <svg viewBox="0 0 24 24" className="recent-label-arrow">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      fill="white"
                      d="M7.25759 2.33006C7.62758 1.92004 8.25992 1.88759 8.66994 2.25758L16.9814 9.75758C18.3395 10.9831 18.3395 13.0169 16.9814 14.2424L8.66994 21.7424C8.25992 22.1124 7.62758 22.08 7.25759 21.6699C6.88759 21.2599 6.92005 20.6276 7.33007 20.2576L15.6415 12.7576C16.1195 12.3263 16.1195 11.6737 15.6415 11.2424L7.33007 3.74242C6.92005 3.37242 6.88759 2.74009 7.25759 2.33006Z"
                    />
                  </svg>
                </div>
              </li>
              {recentGames.map((game) => (
                <li key={game.id} className="recent-carousel-item">
                  <GameCard game={game} index={0} />
                </li>
              ))}
            </ul>

            {canScrollRight && (
              <button
                className="carousel-arrow carousel-arrow-right"
                onClick={() => scroll("right")}
                aria-label="Scroll right"
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}