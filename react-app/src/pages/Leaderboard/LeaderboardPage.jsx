// react-app/src/pages/Leaderboard/LeaderboardPage.jsx - SEO OPTIMIZED

import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import LeaderboardHeader from './components/LeaderboardHeader';
import LeaderboardTabs from './components/LeaderboardTabs';
import LeaderboardTopThree from './components/LeaderboardTopThree';
import LeaderboardRankCard from './components/LeaderboardRankCard';
import LeaderboardUserPosition from './components/LeaderboardUserPosition';
import LeaderboardFilters from './components/LeaderboardFilters';
import RankTierInfo from './components/RankTierInfo';
import LeaderboardSkeleton from './components/LeaderboardSkeleton';
import './styles/leaderboard.css';
import './styles/leaderboard-animations.css';
import { useLeaderboard, LeaderboardProvider } from "../../context/LeaderboardContext";
import LeaderboardHowItWorks from "./components/LeaderboardHowItWork";
import ScrollToTop from "../../components/ScrollToTop";


// SEO: Import SEO component
import SEO from "../../components/SEO/SEO";

const LeaderboardContent = () => {
  const {
    leaderboard,
    loading,
    timePeriod,
    setTimePeriod,
    activeTab,
    setActiveTab,
    currentUser,
    expandedInfo,
    setExpandedInfo
  } = useLeaderboard();

  /* ================= SEO: JSON-LD SCHEMA MARKUP ================= */
  useEffect(() => {
    // CollectionPage Schema for Leaderboard
    const leaderboardSchema = {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": `${getTimePeriodLabel()} Leaderboard - 8JJ Games`,
      "description": `View the top gaming leaderboard for ${getTimePeriodLabel().toLowerCase()} rankings. See who's leading the competition on 8JJ Games.`,
      "url": `https://8jjgames.com/leaderboard${timePeriod !== 'weekly' ? `?period=${timePeriod}` : ''}`,
      "mainEntity": {
        "@type": "ItemList",
        "name": `${getTimePeriodLabel()} Top Players`,
        "description": `Ranked list of top players for ${getTimePeriodLabel().toLowerCase()} period`,
        "numberOfItems": leaderboard.length,
        "itemListElement": leaderboard.slice(0, 10).map((player, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "name": player.username || `Player ${player.userId}`,
          "item": {
            "@type": "Person",
            "name": player.username || `Player ${player.userId}`,
            "description": `Rank #${player.rank} with ${player.score} points`
          }
        }))
      },
      "isPartOf": {
        "@type": "WebSite",
        "name": "8JJ Games",
        "url": "https://8jjgames.com"
      }
    };

    // BreadcrumbList Schema
    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://8jjgames.com"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Leaderboard",
          "item": "https://8jjgames.com/leaderboard"
        }
      ]
    };

    // Add schemas to document head
    const schemaScript = document.createElement('script');
    schemaScript.type = 'application/ld+json';
    schemaScript.text = JSON.stringify([leaderboardSchema, breadcrumbSchema]);
    schemaScript.id = 'leaderboard-schema';
    document.head.appendChild(schemaScript);

    // Cleanup
    return () => {
      const existingScript = document.getElementById('leaderboard-schema');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, [timePeriod, leaderboard, activeTab]);

  // SEO: Get time period label
  function getTimePeriodLabel() {
    const periods = {
      daily: 'Daily',
      weekly: 'Weekly',
      monthly: 'Monthly',
      alltime: 'All Time'
    };
    return periods[timePeriod] || 'Weekly';
  }

  // SEO: Get tab-specific meta information
  const getTabTitle = () => {
    switch(activeTab) {
      case 'global':
        return 'Global Rankings';
      case 'country':
        return 'Country Rankings';
      case 'friends':
        return 'Friends Rankings';
      default:
        return 'Leaderboard';
    }
  };

  const getTabDescription = () => {
    const period = getTimePeriodLabel().toLowerCase();
    switch(activeTab) {
      case 'global':
        return `View the global ${period} gaming leaderboard on 8JJ Games. See the top players worldwide and track your ranking among ${leaderboard.length.toLocaleString()}+ players.`;
      case 'country':
        return `Check your country's ${period} gaming leaderboard on 8JJ Games. See how you rank against players in your region.`;
      case 'friends':
        return `Compare your ${period} gaming performance with friends on 8JJ Games. See who's leading your friend group.`;
      default:
        return `View gaming leaderboards and rankings on 8JJ Games. Track ${period} performance and compete with players worldwide.`;
    }
  };

  const getPageKeywords = () => {
    const period = getTimePeriodLabel().toLowerCase();
    return `gaming leaderboard, ${period} rankings, player rankings, top players, competitive gaming, game scores, leaderboard ${timePeriod}, gaming competition, high scores, player stats, gaming leaderboard 2026`;
  };

  const handleClose = () => {
    window.history.back();
  };

  const topThree = leaderboard.slice(0, 3);
  const remainingPlayers = leaderboard.slice(3);

  return (
    <>
      {/* SEO: Enhanced Meta Tags */}
      <SEO
        title={`${getTimePeriodLabel()} ${getTabTitle()} - Gaming Leaderboard`}
        description={getTabDescription()}
        keywords={getPageKeywords()}
        url={`/leaderboard${timePeriod !== 'weekly' ? `?period=${timePeriod}` : ''}`}
        type="website"
        image="https://8jjgames.com/images/leaderboard-og.jpg"
      />

      {/* SEO: Background with proper accessibility */}
      <div 
        className="leaderboard-background-image" 
        role="presentation"
        aria-hidden="true"
      />

      {/* SEO: Main content with semantic HTML */}
      <main className="leaderboard-page" role="main">
        <ScrollToTop />
        {/* SEO: Breadcrumb Navigation */}
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link to="/" className="breadcrumb-link">Home</Link>
          <span className="breadcrumb-separator" aria-hidden="true">/</span>
          <span className="breadcrumb-current">Leaderboard</span>
        </nav>

        {/* SEO: Hidden page title for screen readers */}
        <h1 className="sr-only">
          {getTimePeriodLabel()} Gaming Leaderboard - {getTabTitle()} - 8JJ Games
        </h1>

        {/* SEO: Leaderboard Container */}
        <div className="leaderboard-container">
          {/* Leaderboard Header with visible H1 */}
          <header role="banner">
            <LeaderboardHeader
              timePeriod={timePeriod}
              onTimePeriodChange={setTimePeriod}
              onClose={handleClose}
            />
          </header>

          {/* User Position (Top for mobile/desktop visibility) */}
          {currentUser && (
            <aside 
              className="user-position-top"
              aria-label="Your current ranking"
            >
              <LeaderboardUserPosition
                user={currentUser}
                totalPlayers={leaderboard.length}
                activeTab={activeTab}
              />
            </aside>
          )}

          {/* SEO: Navigation for leaderboard tabs */}
          <nav aria-label="Leaderboard view selection">
            <LeaderboardTabs
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          </nav>

          {/* Uncomment if you want game filters */}
          {/* <LeaderboardFilters
            selectedGame={selectedGame}
            onGameChange={setSelectedGame}
          /> */}

          {/* SEO: Main leaderboard content section */}
          <section 
            className="leaderboard-content"
            aria-labelledby="leaderboard-content-heading"
            aria-live="polite"
            aria-busy={loading}
          >
            <h2 id="leaderboard-content-heading" className="sr-only">
              {getTabTitle()} - {getTimePeriodLabel()} Period Rankings
            </h2>
            
            {loading ? (
              <LeaderboardSkeleton />
            ) : leaderboard.length === 0 ? (
              <div className="empty-leaderboard" role="status" aria-live="polite">
                <div className="empty-state-large">
                  <p className="empty-rank" aria-label="No players ranked">#0</p>
                  <p className="empty-text">
                    {activeTab === 'friends'
                      ? 'Add friends to see rankings'
                      : activeTab === 'country'
                        ? 'No players in your country yet'
                        : 'No players ranked yet - be the first!'}
                  </p>
                </div>
              </div>
            ) : (
              <>
                {/* Top 3 Players Podium */}
                <section 
                  className="top-three-section"
                  aria-labelledby="top-three-heading"
                >
                  <h3 id="top-three-heading" className="sr-only">
                    Top 3 Players
                  </h3>
                  <LeaderboardTopThree players={topThree} />
                </section>

                {/* Remaining Players List */}
                <section 
                  className="leaderboard-list"
                  aria-labelledby="remaining-players-heading"
                >
                  <h3 id="remaining-players-heading" className="sr-only">
                    Players Ranked 4 and Below
                  </h3>
                  {remainingPlayers.map((player, index) => (
                    <LeaderboardRankCard
                      key={player.userId}
                      player={player}
                      index={index}
                      isCurrentUser={player.userId === currentUser?.userId}
                    />
                  ))}
                </section>
              </>
            )}
          </section>

          {/* Rank Tier Information */}
          {/* <aside 
            className="rank-tier-aside"
            aria-label="Ranking tier information"
          >
            <RankTierInfo
              expanded={expandedInfo}
              onToggle={() => setExpandedInfo(!expandedInfo)}
            />
          </aside> */}
          <LeaderboardHowItWorks />
        </div>

        {/* SEO: Hidden content for search engines */}
        <div className="sr-only">
          <article>
            <h2>About the 8JJ Games Leaderboard</h2>
            <p>
              The 8JJ Games leaderboard showcases the top players across our gaming platform. 
              Compete with players worldwide, track your progress, and climb the rankings in 
              daily, weekly, monthly, and all-time leaderboards. Join thousands of competitive 
              gamers and see where you rank!
            </p>
            
            <h3>Leaderboard Features</h3>
            <ul>
              <li>Real-time Rankings: See live updates of player positions and scores</li>
              <li>Multiple Time Periods: Choose from daily, weekly, monthly, or all-time rankings</li>
              <li>Global Leaderboard: Compete with {leaderboard.length.toLocaleString()}+ players from around the world</li>
              <li>Country Rankings: See how you rank against players in your country</li>
              <li>Friends Comparison: Compare your performance with your gaming friends</li>
              <li>Personal Stats: Track your position and score across all leaderboards</li>
              <li>Top 3 Podium: Special recognition for the top 3 players in each category</li>
            </ul>

            <h3>How Rankings Work</h3>
            <p>
              Rankings are calculated based on total points earned across all games played 
              during the selected time period. Daily leaderboards reset every 24 hours at midnight UTC, 
              weekly leaderboards reset every Monday at midnight UTC, monthly leaderboards reset on 
              the 1st of each month, and all-time rankings track your total lifetime score on 8JJ Games.
            </p>

            <h3>Climb the Rankings</h3>
            <p>
              Earn points by playing games, achieving high scores, and completing challenges. 
              The more you play and the better you perform, the higher you'll climb in the 
              rankings. Each game contributes to your overall score, and consistent performance 
              across multiple games will help you maintain your position. Check back regularly 
              to see how you stack up against the competition!
            </p>

            <h3>Competitive Gaming Community</h3>
            <p>
              Join {leaderboard.length.toLocaleString()}+ players competing for the top spots on our leaderboards. 
              Whether you're aiming for global dominance, representing your country, or engaging in 
              friendly competition with friends, the 8JJ Games leaderboard system provides engaging 
              competitive gameplay for players of all skill levels. Track your progress, set goals, 
              and work your way to the top!
            </p>

            <h3>Leaderboard Tiers and Badges</h3>
            <p>
              Players are recognized with special tiers and badges based on their ranking. 
              Reach the top positions to unlock exclusive badges, gain recognition in the 
              community, and showcase your gaming prowess. Premium ranks include special 
              visual indicators and profile enhancements.
            </p>

            <h3>Fair Play and Competition</h3>
            <p>
              We maintain fair play standards across all leaderboards. Scores are verified 
              to ensure legitimate gameplay, and we actively monitor for any suspicious activity. 
              Our ranking system is designed to reward skill, consistency, and dedication while 
              maintaining a level playing field for all competitors.
            </p>
          </article>
        </div>
      </main>
    </>
  );
};

const LeaderboardPage = () => {
  return (
    <LeaderboardProvider>
      <LeaderboardContent />
    </LeaderboardProvider>
  );
};

export default LeaderboardPage;