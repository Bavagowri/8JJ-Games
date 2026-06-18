// src/pages/mobile/MobileLeaderboard/MobileLeaderboard.jsx
import { useEffect } from "react";
import MobileHeader from "../../../components/mobile/MobileHeader/MobileHeader";
import MobileBottomNav from "../../../components/mobile/MobileBottomNav/MobileBottomNav";
import MobileLeaderboardHeader from "./components/MobileLeaderboardHeader";
import MobileTopThree from "./components/MobileTopThree";
import MobileRankCard from "./components/MobileRankCard";
import MobileUserPosition from "./components/MobileUserPosition";
import MobileHowItWorks from "./components/MobileHowItWorks";
import { useLeaderboard, LeaderboardProvider } from "../../../context/LeaderboardContext";
import SEO from "../../../components/SEO/SEO";
import "./MobileLeaderboard.css";

const MobileLeaderboardContent = () => {
  const { leaderboard, loading, currentUser } = useLeaderboard();

  const topThree = leaderboard.slice(0, 3);
  const remainingPlayers = leaderboard.slice(3);

  if (loading) {
    return (
      <div className="mobile-leaderboard-wrapper">
        <MobileHeader />
        <div className="mobile-content">
          <div className="mobile-loading">
            <div className="mobile-spinner"></div>
            <p>Loading leaderboard...</p>
          </div>
        </div>
        <MobileBottomNav />
      </div>
    );
  }

  return (
    <>
      <SEO
        title="Leaderboard - Mobile Rankings"
        description="View gaming leaderboard on mobile"
        url="/leaderboard"
      />
      <MobileHeader />
      <div className="mobile-leaderboard-wrapper">


        <div className="mobile-content">
          <MobileLeaderboardHeader />

          {currentUser && (
            <MobileUserPosition
              user={currentUser}
              totalPlayers={leaderboard.length}
            />
          )}

          {topThree.length >= 3 && <MobileTopThree players={topThree} />}

          <div className="mobile-leaderboard-list">
            {remainingPlayers.map((player, index) => (
              <MobileRankCard
                key={player.userId}
                player={player}
                index={index}
                isCurrentUser={player.userId === currentUser?.userId}
              />
            ))}
          </div>

          <MobileHowItWorks />

          <div className="mobile-footer-space" />
        </div>

        <MobileBottomNav />
      </div>
    </>
  );
};

export default function MobileLeaderboard() {
  return (
    <LeaderboardProvider>
      <MobileLeaderboardContent />
    </LeaderboardProvider>
  );
}