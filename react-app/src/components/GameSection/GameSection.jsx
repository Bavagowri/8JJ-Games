

// react-app/src/components/GameSection/GameSection.jsx
import { useRef, useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import GameCard from "../GameCard/GameCard";
import { useLanguage } from "../../context/LanguageContext";
import { translate } from "../../data/translations";
import "./GameSection.css";

export default function GameSection({
  title,
  titleText,
  games,
  id,
  categoryId,
  allGamesPage = false,
  slider = false,
  description = null,
  isTag = false,
}) {
  const { lang } = useLanguage();
  const trackRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const sectionRef = useRef(null);
  const firstSetWidth = useRef(0);
  const rafIdRef = useRef(null);
  const xRef = useRef(0);
  const pausedRef = useRef(false);
  const visibleRef = useRef(true);

  const [showAll, setShowAll] = useState(false);
  const [deviceType, setDeviceType] = useState("desktop");
  const navigate = useNavigate();

  // ─── FIX: ResizeObserver instead of window resize listener ───────────────
  // window.innerWidth inside a resize handler reads layout synchronously.
  // ResizeObserver gives us a DOMRectReadOnly with no forced reflow.
  useEffect(() => {
    const ro = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width ?? window.innerWidth;
      if (width < 768) setDeviceType("mobile");
      else if (width <= 1024) setDeviceType("tablet");
      else setDeviceType("desktop");
    });

    // Observe the section itself rather than the whole window
    const el = sectionRef.current ?? document.documentElement;
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const horizontalScrollSections = [
    "platformer","halloween_games","card_games","football_games",
    "basketball_games","simulation_games","skill_games","horror_games",
    "endless_runner","puzzles","gamesAll","christmas","makeup","driving",
    "action","featuredSection","recentSection","popularSection","hotGames",
  ];

  const isHorizontalScroll = horizontalScrollSections.includes(id);

  // ─── FIX: Infinite slider — measure ONCE, never re-read inside the loop ──
  // The old code did:  firstSetWidth.current = track.scrollWidth / 2
  // inside requestAnimationFrame, which forces a layout on every frame.
  // Fix: measure after mount with ResizeObserver, store in ref, loop is
  // pure math + one style write — zero layout reads per frame.
  useEffect(() => {
    if (!slider) return;
    const track = trackRef.current;
    if (!track) return;

    // ── Measure width ONCE after paint ──────────────────────────────────
    // Use ResizeObserver so we re-measure if the slider resizes (e.g. font
    // load, orientation change) without triggering a forced reflow.
    const measureRO = new ResizeObserver(() => {
      // scrollWidth is safe here — RO fires after layout is already done
      firstSetWidth.current = track.scrollWidth / 2;
    });
    measureRO.observe(track);

    // ── Pause when off-screen to save CPU ───────────────────────────────
    const visibilityIO = new IntersectionObserver(
      ([entry]) => { visibleRef.current = entry.isIntersecting; },
      { threshold: 0 }
    );
    visibilityIO.observe(track);

    // ── Animation loop — NO layout reads inside ──────────────────────────
    const animate = () => {
      if (!pausedRef.current && visibleRef.current && firstSetWidth.current > 0) {
        xRef.current -= 0.4;
        if (Math.abs(xRef.current) >= firstSetWidth.current) {
          xRef.current = 0;
        }
        // translate3d keeps the element on the GPU compositor layer
        track.style.transform = `translate3d(${xRef.current}px, 0, 0)`;
      }
      rafIdRef.current = requestAnimationFrame(animate);
    };

    const pause = () => { pausedRef.current = true; };
    const play  = () => { pausedRef.current = false; };
    track.addEventListener("mouseenter", pause, { passive: true });
    track.addEventListener("mouseleave", play,  { passive: true });

    rafIdRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafIdRef.current);
      measureRO.disconnect();
      visibilityIO.disconnect();
      track.removeEventListener("mouseenter", pause);
      track.removeEventListener("mouseleave", play);
    };
  }, [slider, games]);

  const handleSeeAllClick = useCallback(() => {
    if (allGamesPage) navigate("/all-mosaic-games");
    if (isTag) {
      navigate(`/categories/${categoryId}`);
    } else {
      navigate(`/categories/${categoryId}`);
    }
  }, [allGamesPage, categoryId, navigate]);

  const handleSeeAll = () => {
    if (!categoryId) return;

    if (isTag) {
      navigate(`/categories/${categoryId}`);
    } else {
      navigate(`/categories/${categoryId}`);
    }
  };

  const gameLimit = deviceType === "desktop" ? 14 : 6;
  const HORIZONTAL_GAME_LIMIT = 21;

  const visibleGames = slider
    ? [...games, ...games]
    : showAll
    ? games
    : isHorizontalScroll
    ? games.slice(0, HORIZONTAL_GAME_LIMIT)
    : games.slice(0, gameLimit);

  const showSeeAllCard = isHorizontalScroll && games.length > HORIZONTAL_GAME_LIMIT;

  const cleanTitle = titleText;
  const sectionDescription =
    description ||
    `Browse ${games.length} ${cleanTitle.toLowerCase()} available on 8JJ Games. Play instantly in your browser - no download required!`;

  const getSectionType = () => {
    if (id.includes("featured") || id.includes("popular") || id.includes("hot"))
      return "featured-collection";
    if (id.includes("recent")) return "recent-collection";
    return "category-collection";
  };

  return (
    <section
      ref={sectionRef}
      className="game-section"
      id={id}
      aria-labelledby={`${id}-heading`}
      data-section-type={getSectionType()}
      data-game-count={games.length}
      itemScope
      itemType="https://schema.org/ItemList"
    >
      <meta itemProp="name" content={cleanTitle} />
      <meta itemProp="description" content={sectionDescription} />
      <meta itemProp="numberOfItems" content={games.length} />

      <div className="content-anim">
        <header className="section-header">
          <div className="Title-container-sections">
            <h2 id={`${id}-heading`} itemProp="name">
              <span className="section-title no-margin-bottom">{title}</span>
            </h2>
          </div>

          {!description && (
            <p className="sr-only" itemProp="description">{sectionDescription}</p>
          )}

          {isHorizontalScroll && (
            <nav className="HoriSlide" aria-label={`${cleanTitle} actions`}>
              <button
                className="HoriSlideBtn"
                onClick={handleSeeAllClick}
                type="button"
              >
                {translate("seeAll", lang)}
              </button>
            </nav>
          )}
        </header>

        {slider ? (
          <div className="slider-wrapper">
            <div className="slider-track" ref={trackRef}>
              {visibleGames.map((g, i) => (
                <GameCard key={`${g.id}-${i}`} game={g} />
              ))}
            </div>
          </div>
        ) : isHorizontalScroll ? (
          <div className="horizontal-scroll-wrapper">
            <div className="horizontal-scroll-container" ref={scrollContainerRef}>
              {visibleGames.map((g) => (
                <GameCard key={g.id} game={g} />
              ))}
              {showSeeAllCard && (
                <div
                  className="see-all-card game-card"
                  onClick={handleSeeAllClick}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && handleSeeAllClick()}
                >
                  <div className="see-all-content">
                    <div className="see-all-icon">→</div>
                    <div className="see-all-text">{translate("seeAll", lang)}</div>
                    <div className="see-all-count">+{games.length - HORIZONTAL_GAME_LIMIT}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="games-grid">
            {visibleGames.map((g) => (
              <GameCard key={g.id} game={g} />
            ))}
          </div>
        )}

        {!slider && !isHorizontalScroll && games.length > gameLimit && (
          <div className="container nohori">
            <button className="btn" onClick={handleSeeAllClick}>
              <span className="btnInner">{translate("viewMore", lang)}</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
