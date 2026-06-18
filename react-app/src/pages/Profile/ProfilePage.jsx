
// react-app/src/pages/Profile/ProfilePage.jsx - SEO OPTIMIZED

import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import "./profile.css";

import ProfileHeader from "./ProfileHeader";
import ProfileNav from "./ProfileNav";
import ProfileContent from "./ProfileContent";

//  SEO: Import SEO component
import SEO from "../../components/SEO/SEO";

import { useProfile } from "../../context/ProfileContext";
import CountrySelectModal from "../../components/CountrySelectModal/CountrySelectModal";

const R2_BASE = import.meta.env.VITE_ASSETS_BASE_URL || "https://assets.8jjgames.com";

export default function ProfilePage() {
  const { profile, loading } = useProfile();

if (!loading && profile && !profile.country) {
  return <CountrySelectModal />;
}

  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("overview");

  // Read tab from URL on mount and when URL changes
  useEffect(() => {
    const tabFromUrl = searchParams.get("tab");
    if (tabFromUrl) {
      setActiveTab(tabFromUrl);
    }
  }, [searchParams]);

  /* =================  SEO: JSON-LD SCHEMA MARKUP ================= */
  useEffect(() => {
    // ProfilePage Schema (for authenticated user profiles)
    const profileSchema = {
      "@context": "https://schema.org",
      "@type": "ProfilePage",
      "name": "User Profile - 8JJ Games",
      "description": "View your gaming profile, stats, achievements, and activity on 8JJ Games",
      "url": "https://8jjgames.com/profile",
      "mainEntity": {
        "@type": "Person",
        "name": "8JJ Games Player",
        "description": "Active player on 8JJ Games platform"
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
          "name": "Profile",
          "item": "https://8jjgames.com/profile"
        }
      ]
    };

    // Add schemas to document head
    const schemaScript = document.createElement('script');
    schemaScript.type = 'application/ld+json';
    schemaScript.text = JSON.stringify([profileSchema, breadcrumbSchema]);
    schemaScript.id = 'profile-schema';
    document.head.appendChild(schemaScript);

    // Cleanup
    return () => {
      const existingScript = document.getElementById('profile-schema');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, []);

  //  SEO: Get tab-specific meta information
  const getTabTitle = () => {
    switch(activeTab) {
      case 'overview':
        return 'Profile Overview';
      case 'achievements':
        return 'Achievements';
      case 'activity':
        return 'Activity History';
      case 'stats':
        return 'Gaming Stats';
      case 'settings':
        return 'Profile Settings';
      default:
        return 'Profile';
    }
  };

  const getTabDescription = () => {
    switch(activeTab) {
      case 'overview':
        return 'View your gaming profile overview on 8JJ Games. Check your stats, recent activity, and achievements.';
      case 'achievements':
        return 'Track your gaming achievements and unlock badges on 8JJ Games. See your progress and milestones.';
      case 'activity':
        return 'View your complete gaming activity history on 8JJ Games. See all games played and when.';
      case 'stats':
        return 'Detailed gaming statistics and analytics for your 8JJ Games profile. Track your progress over time.';
      case 'settings':
        return 'Manage your 8JJ Games profile settings. Update preferences, privacy, and account information.';
      default:
        return 'Your personal gaming profile on 8JJ Games. Track stats, achievements, and activity.';
    }
  };

  return (
    <>
      {/*  Enhanced Meta Tags with NOINDEX for privacy */}
      <SEO
        title={`${getTabTitle()} - My Profile`}
        description={getTabDescription()}
        keywords="gaming profile, player stats, achievements, gaming activity, game history, player profile"
        url={`/profile${activeTab !== 'overview' ? `?tab=${activeTab}` : ''}`}
        type="profile"
      />

      {/* Add noindex meta tag for user privacy */}
      <meta name="robots" content="noindex, follow" />

   
      {/*  SEO: Main content with semantic HTML */}
      <main className="profile-page" role="main">
        {/*  SEO: Breadcrumb Navigation */}
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link to="/" className="breadcrumb-link">Home</Link>
          <span className="breadcrumb-separator" aria-hidden="true">/</span>
          <span className="breadcrumb-current">Profile</span>
        </nav>

        {/*  SEO: Hidden page title for screen readers */}
        <h1 className="sr-only">
          {getTabTitle()} - User Profile on 8JJ Games
        </h1>

        {/* Profile Header */}
        <ProfileHeader setActiveTab={setActiveTab} />

        {/*  SEO: Enhanced Profile Navigation */}
        <ProfileNav 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
          aria-label="Profile navigation"
        />

        {/*  SEO: Profile Content Section */}
        <section 
          className="profile-content-section"
          aria-labelledby="profile-content-heading"
        >
          <h2 id="profile-content-heading" className="sr-only">
            {getTabTitle()} Content
          </h2>
          <ProfileContent activeTab={activeTab} />
        </section>

        {/*  SEO: Hidden content for search engines (general profile info) */}
        <div className="sr-only">
          <article>
            <h2>About Your Gaming Profile</h2>
            <p>
              Your 8JJ Games profile is your personal gaming hub. Track your gaming journey 
              with detailed statistics, unlock achievements, view your complete play history, 
              and manage your account settings all in one place.
            </p>
            
            <h3>Profile Features</h3>
            <ul>
              <li>Gaming Statistics: Track total games played, playtime, and favorite categories</li>
              <li>Achievement System: Unlock badges and milestones as you play</li>
              <li>Activity History: Complete log of all games you've played</li>
              <li>Personal Collection: Quick access to your saved favorite games</li>
              <li>Privacy Controls: Manage what information is visible to others</li>
              <li>Account Settings: Customize your profile and preferences</li>
            </ul>

            <h3>Track Your Progress</h3>
            <p>
              Monitor your gaming journey with comprehensive stats. See which games you play most, 
              how long you've been playing, and discover patterns in your gaming habits. Set goals 
              and work towards achievements to unlock exclusive badges.
            </p>

            <h3>Privacy & Security</h3>
            <p>
              Your profile data is private by default. Choose what information you want to share 
              and control your privacy settings. Your gaming activity and personal information 
              are always kept secure on 8JJ Games.
            </p>
          </article>
        </div>
      </main>
    </>
  );
}