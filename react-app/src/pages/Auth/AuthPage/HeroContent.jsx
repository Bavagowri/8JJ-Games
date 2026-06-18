// // react-app/src/pages/Auth/AuthPage/HeroContent.jsx
// import { useEffect, useState } from "react";
// import { translate } from "../../../data/translations";
// import { useLanguage } from "../../../context/LanguageContext";

// /* ================= ICON MAP ================= */
// const AUTH_ICONS = {
//   games: "/images/icons/8jj-game.png",
//   trophy: "/images/icons/trophy.png",
//   save: "/images/icons/save-1.png",
//   star: "/images/icons/points.png",

//   rocket: "/images/home-icons-2/rocket.png",
//   gift: "/images/icons/8jj-redeem.png",
//   users: "/images/icons/social.png",
//   fire: "/images/home-icons-2/fire.png",

//   lock: "/images/icons/lock.png",
//   thunder: "/images/icons/thunder.png",
//   email: "/images/icons/email-1.png",
//   check: "/images/icons/check.png",

//   target: "/images/home-icons-2/target.png",
//   circus: "/images/icons/circus.png",
//   art: "/images/icons/art.png",
//   mask: "/images/icons/mask.png",

//   lightning: "/images/icons/thunder.png",
//   rainbow: "/images/icons/rainbow.png",
//   sparkles: "/images/icons/sparks.png",

//   key: "/images/icons/password.png",
//   shield: "/images/icons/sheild.png",
//   mailHeart: "/images/icons/email.png",
//   unlock: "/images/icons/unlock.png",
// };

// export default function HeroContent({ mode }) {
//   const { lang } = useLanguage();
//   const [isTransitioning, setIsTransitioning] = useState(false);

//   useEffect(() => {
//     setIsTransitioning(true);
//     const timer = setTimeout(() => setIsTransitioning(false), 600);
//     return () => clearTimeout(timer);
//   }, [mode]);

//   /* ================= CONTENT ================= */

//   const loginContent = {
//     title: translate("welcomeBackEpicGaming", lang),
//     subtitle: translate("gamingAdventureContinues", lang),
//     description: translate("loginDescription", lang),
//     features: [
//       { icon: AUTH_ICONS.games, text: translate("tenThousandFreeGames", lang) },
//       { icon: AUTH_ICONS.trophy, text: translate("trackAchievements", lang) },
//       { icon: AUTH_ICONS.save, text: translate("saveProgress", lang) },
//       { icon: AUTH_ICONS.star, text: translate("premiumExperience", lang) },
//     ],
//     floatingIcons: [
//       { icon: AUTH_ICONS.target, position: { top: "15%", left: "10%" }, delay: 0 },
//       { icon: AUTH_ICONS.circus, position: { top: "25%", right: "15%" }, delay: 0.1 },
//       { icon: AUTH_ICONS.art, position: { bottom: "20%", left: "5%" }, delay: 0.2 },
//       { icon: AUTH_ICONS.mask, position: { bottom: "30%", right: "10%" }, delay: 0.3 },
//     ],
//   };

//   const registerContent = {
//     title: translate("startGamingAdventureToday", lang),
//     subtitle: translate("joinThousandsGamers", lang),
//     description: translate("registerDescription", lang),
//     features: [
//       { icon: AUTH_ICONS.rocket, text: translate("quickSetup", lang) },
//       { icon: AUTH_ICONS.gift, text: translate("freeForever", lang) },
//       { icon: AUTH_ICONS.users, text: translate("joinCommunity", lang) },
//       { icon: AUTH_ICONS.fire, text: translate("instantAccess", lang) },
//     ],
//     floatingIcons: [
//       { icon: AUTH_ICONS.games, position: { top: "20%", left: "8%" }, delay: 0 },
//       { icon: AUTH_ICONS.lightning, position: { top: "30%", right: "12%" }, delay: 0.1 },
//       { icon: AUTH_ICONS.rainbow, position: { bottom: "25%", left: "10%" }, delay: 0.2 },
//       { icon: AUTH_ICONS.sparkles, position: { bottom: "35%", right: "8%" }, delay: 0.3 },
//     ],
//   };

//   const forgotPasswordContent = {
//     title: translate("resetYourPassword", lang),
//     subtitle: translate("weGotYouCovered", lang),
//     description: translate("forgotPasswordDescription", lang),
//     features: [
//       { icon: AUTH_ICONS.lock, text: translate("secureProcess", lang) },
//       { icon: AUTH_ICONS.thunder, text: translate("quickReset", lang) },
//       { icon: AUTH_ICONS.email, text: translate("emailLink", lang) },
//       { icon: AUTH_ICONS.check, text: translate("easySteps", lang) },
//     ],
//     floatingIcons: [
//       { icon: AUTH_ICONS.key, position: { top: "18%", left: "12%" }, delay: 0 },
//       { icon: AUTH_ICONS.shield, position: { top: "28%", right: "10%" }, delay: 0.1 },
//       { icon: AUTH_ICONS.mailHeart, position: { bottom: "22%", left: "8%" }, delay: 0.2 },
//       { icon: AUTH_ICONS.unlock, position: { bottom: "32%", right: "12%" }, delay: 0.3 },
//     ],
//   };

//   const content =
//     mode === "login"
//       ? loginContent
//       : mode === "register"
//       ? registerContent
//       : forgotPasswordContent;

//   return (
//     <div className={`hero-content ${isTransitioning ? "transitioning" : ""}`}>
//       {/* Logo */}
//       <div className={`logo-container ${isTransitioning ? "pulse" : ""}`}>
//         <div className="logo-glow" />
//         <a href="/" aria-label={translate("homeAriaLabel", lang)}>
//           <img
//             className="AUTH-brand-logo"
//             src="/8JJ_games.png"
//             alt={translate("logoAlt", lang)}
//           />
//         </a>
//       </div>

//       {/* Main Content */}
//       <div className={`hero-main-content ${isTransitioning ? "fade-out" : "fade-in"}`}>
//         <h1 className="hero-title">{content.title}</h1>
//         <p className="hero-subtitle">{content.subtitle}</p>
//         <p className="hero-description">{content.description}</p>

//         {/* Feature Badges */}
//         <div className="hero-features">
//           {content.features.map((feature, index) => (
//             <div
//               key={index}
//               className="feature-badge"
//               style={{ animationDelay: `${index * 0.1}s` }}
//             >
//               <img
//                 src={feature.icon}
//                 alt=""
//                 aria-hidden="true"
//                 className="feature-icon"
//               />
//               <span className="feature-text">{feature.text}</span>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Floating Icons */}
//       <div className="floating-icons">
//         {content.floatingIcons.map((item, index) => (
//           <div
//             key={index}
//             className={`floating-icon ${isTransitioning ? "rearrange" : ""}`}
//             style={{ ...item.position, animationDelay: `${item.delay}s` }}
//           >
//             <img
//               src={item.icon}
//               alt=""
//               aria-hidden="true"
//               className="floating-icon-img"
//             />
//           </div>
//         ))}
//       </div>

//       {/* Decorations */}
//       <div className="hero-decoration">
//         <div className="decoration-circle circle-1" />
//         <div className="decoration-circle circle-2" />
//         <div className="decoration-circle circle-3" />
//       </div>
//     </div>
//   );
// }

// react-app/src/pages/Auth/AuthPage/HeroContent.jsx
import { useEffect, useState } from "react";
import { translate } from "../../../data/translations";
import { useLanguage } from "../../../context/LanguageContext";
import "./HeroContent.css";

import {
  Gamepad2,
  Trophy,
  Zap,
  Star,
  Rocket,
  RefreshCw,
  Coins,
  BarChart3,
  CircleDot,
} from "lucide-react";

export default function HeroContent({ mode }) {
  const { lang } = useLanguage();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [animKey, setAnimKey] = useState(0);

  useEffect(() => {
    setIsTransitioning(true);
    const t1 = setTimeout(() => {
      setIsTransitioning(false);
      setAnimKey((k) => k + 1);
    }, 320);
    return () => clearTimeout(t1);
  }, [mode]);

  /* ─── LOGIN ─────────────────────────────────────────────── */
  const loginHero = (
    <>
      <div className="hc2-eyebrow">
        <span className="hc2-eyebrow-dot" />
        <span className="hc2-eyebrow-text">
          {translate("hc2_login_eyebrow", lang) || "1,000+ Games — Always Free"}
        </span>
      </div>

      <h1 className="hc2-headline">
        {translate("hc2_login_headline_1", lang) || "Welcome Back."}<br />
        <span className="hc2-headline-accent">
          {translate("hc2_login_headline_2", lang) || "Your Games Miss You."}
        </span>
      </h1>

      <p className="hc2-body">
        {translate("hc2_login_body_pre", lang) || "Pick up right where you left off. Your saved games, points, and achievements are all here — plus new matches to predict "}
        <strong className="hc2-body-strong">
          {translate("hc2_login_body_strong", lang) || "before kick-off."}
        </strong>
      </p>

      {/* Big highlight card */}
      <div className="hc2-big-card">
        <div className="hc2-big-card-topline" />
        <div className="hc2-big-card-inner">
          <div className="hc2-big-icon hc2-big-icon--cyan">
            <Gamepad2 size={22} strokeWidth={1.8} className="hc2-lucide hc2-lucide--cyan" />
          </div>
          <div className="hc2-big-text">
            <div className="hc2-big-title">
              {translate("hc2_login_big_title", lang) || "Your Collection Is Waiting"}
            </div>
            <div className="hc2-big-sub">
              {translate("hc2_login_big_sub_pre", lang) || "Every saved game, every earned point, every win — "}
              <strong className="hc2-big-sub-strong">
                {translate("hc2_login_big_sub_strong", lang) || "right where you left them."}
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* 3 support cards */}
      <div className="hc2-support-grid">
        <div className="hc2-support-card">
          <div className="hc2-support-icon">
            <Trophy size={20} strokeWidth={1.8} className="hc2-lucide hc2-lucide--gold" />
          </div>
          <div className="hc2-support-stat">Top 10</div>
          <div className="hc2-support-lbl">
            {translate("hc2_support_leaderboard", lang) || "Weekly Leaderboard"}
          </div>
        </div>
        <div className="hc2-support-card">
          <div className="hc2-support-icon">
            <Zap size={20} strokeWidth={1.8} className="hc2-lucide hc2-lucide--cyan" />
          </div>
          <div className="hc2-support-stat">
            {translate("hc2_support_instant_stat", lang) || "Instant"}
          </div>
          <div className="hc2-support-lbl">
            {translate("hc2_support_resume", lang) || "Resume Any Game"}
          </div>
        </div>
        <div className="hc2-support-card">
          <div className="hc2-support-icon">
            <Star size={20} strokeWidth={1.8} className="hc2-lucide hc2-lucide--amber" />
          </div>
          <div className="hc2-support-stat">
            {translate("hc2_support_daily_stat", lang) || "Daily"}
          </div>
          <div className="hc2-support-lbl">
            {translate("hc2_support_bonuses", lang) || "Login Bonuses"}
          </div>
        </div>
      </div>

      {/* Prediction callout */}
      <div className="hc2-pred-callout">
        <CircleDot size={16} strokeWidth={2} className="hc2-lucide hc2-lucide--amber hc2-pred-callout-icon" />
        <p className="hc2-pred-callout-text">
          <strong className="hc2-pred-callout-strong">
            {translate("hc2_pred_callout_label", lang) || "New: Cricket Prediction Arena"}
          </strong>
          {translate("hc2_pred_callout_login", lang) || " — pick match winners, earn points, climb the board."}
        </p>
        <span className="hc2-pred-callout-arrow" aria-hidden="true">→</span>
      </div>
    </>
  );

  /* ─── REGISTER ──────────────────────────────────────────── */
  const registerHero = (
    <>
      <div className="hc2-eyebrow hc2-eyebrow--purple">
        <span className="hc2-eyebrow-dot hc2-eyebrow-dot--purple" />
        <span className="hc2-eyebrow-text hc2-eyebrow-text--purple">
          {translate("hc2_register_eyebrow", lang) || "Free Forever — No Catches"}
        </span>
      </div>

      <h1 className="hc2-headline">
        {translate("hc2_register_headline_1", lang) || "One Account."}<br />
        <span className="hc2-headline-accent">
          {translate("hc2_register_headline_2", lang) || "Unlimited Adventure."}
        </span>
      </h1>

      <p className="hc2-body">
        {translate("hc2_register_body_pre", lang) || "Games, achievements, a personal collection — and now "}
        <strong className="hc2-body-strong">
          {translate("hc2_register_body_strong", lang) || "a prediction arena"}
        </strong>
        {translate("hc2_register_body_post", lang) || " where your cricket knowledge actually earns you something."}
      </p>

      {/* Big highlight card */}
      <div className="hc2-big-card hc2-big-card--purple">
        <div className="hc2-big-card-topline hc2-big-card-topline--purple" />
        <div className="hc2-big-card-inner">
          <div className="hc2-big-icon hc2-big-icon--purple">
            <Rocket size={22} strokeWidth={1.8} className="hc2-lucide hc2-lucide--purple" />
          </div>
          <div className="hc2-big-text">
            <div className="hc2-big-title">
              {translate("hc2_register_big_title", lang) || "Up & Running in 60 Seconds"}
            </div>
            <div className="hc2-big-sub">
              {translate("hc2_register_big_sub_pre", lang) || "No downloads, no fees, no nonsense. "}
              <strong className="hc2-big-sub-strong">
                {translate("hc2_register_big_sub_strong", lang) || "Just pick a username and play."}
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* 3 support cards */}
      <div className="hc2-support-grid">
        <div className="hc2-support-card">
          <div className="hc2-support-icon">
            <Gamepad2 size={20} strokeWidth={1.8} className="hc2-lucide hc2-lucide--cyan" />
          </div>
          <div className="hc2-support-stat">1K+</div>
          <div className="hc2-support-lbl">
            {translate("hc2_support_browser_games", lang) || "Browser Games"}
          </div>
        </div>
        <div className="hc2-support-card">
          <div className="hc2-support-icon">
            <RefreshCw size={20} strokeWidth={1.8} className="hc2-lucide hc2-lucide--green" />
          </div>
          <div className="hc2-support-stat">
            {translate("hc2_support_sync_stat", lang) || "Sync"}
          </div>
          <div className="hc2-support-lbl">
            {translate("hc2_support_save_progress", lang) || "Save Your Progress"}
          </div>
        </div>
        <div className="hc2-support-card">
          <div className="hc2-support-icon">
            <Coins size={20} strokeWidth={1.8} className="hc2-lucide hc2-lucide--amber" />
          </div>
          <div className="hc2-support-stat">
            {translate("hc2_support_earn_stat", lang) || "Earn"}
          </div>
          <div className="hc2-support-lbl">
            {translate("hc2_support_points", lang) || "Points Every Day"}
          </div>
        </div>
      </div>

      {/* Prediction callout */}
      <div className="hc2-pred-callout">
        <CircleDot size={16} strokeWidth={2} className="hc2-lucide hc2-lucide--amber hc2-pred-callout-icon" />
        <p className="hc2-pred-callout-text">
          <strong className="hc2-pred-callout-strong">
            {translate("hc2_pred_callout_label_reg", lang) || "Prediction Arena included"}
          </strong>
          {translate("hc2_pred_callout_register", lang) || " — pick cricket match winners & win up to 500 pts weekly."}
        </p>
        <span className="hc2-pred-callout-arrow" aria-hidden="true">→</span>
      </div>
    </>
  );

  /* ─── FORGOT PASSWORD ───────────────────────────────────── */
  const forgotHero = (
    <>
      <div className="hc2-eyebrow hc2-eyebrow--green">
        <span className="hc2-eyebrow-dot hc2-eyebrow-dot--green" />
        <span className="hc2-eyebrow-text hc2-eyebrow-text--green">
          {translate("hc2_forgot_eyebrow", lang) || "Secure · Takes 2 Minutes"}
        </span>
      </div>

      <h1 className="hc2-headline">
        {translate("hc2_forgot_headline_1", lang) || "Happens to"}<br />
        <span className="hc2-headline-accent">
          {translate("hc2_forgot_headline_2", lang) || "Everyone."}
        </span>
      </h1>

      <p className="hc2-body">
        {translate("hc2_forgot_body_pre", lang) || "Drop your email and we'll send a reset link instantly. Your collection, points and prediction history are "}
        <strong className="hc2-body-strong">
          {translate("hc2_forgot_body_strong", lang) || "completely safe."}
        </strong>
      </p>

      {/* Recovery items */}
      <div className="hc2-recovery-list">
        <div className="hc2-recovery-item">
          <div className="hc2-recovery-icon hc2-recovery-icon--cyan">
            <Gamepad2 size={18} strokeWidth={1.8} className="hc2-lucide hc2-lucide--cyan" />
          </div>
          <div className="hc2-recovery-text">
            <div className="hc2-recovery-title">
              {translate("hc2_recovery_games_title", lang) || "Your Game Collection"}
            </div>
            <div className="hc2-recovery-sub">
              {translate("hc2_recovery_games_sub", lang) || "Every saved game is still there"}
            </div>
          </div>
        </div>
        <div className="hc2-recovery-item">
          <div className="hc2-recovery-icon hc2-recovery-icon--green">
            <Coins size={18} strokeWidth={1.8} className="hc2-lucide hc2-lucide--green" />
          </div>
          <div className="hc2-recovery-text">
            <div className="hc2-recovery-title">
              {translate("hc2_recovery_points_title", lang) || "Points & Achievements"}
            </div>
            <div className="hc2-recovery-sub">
              {translate("hc2_recovery_points_sub", lang) || "Not a single point lost"}
            </div>
          </div>
        </div>
        <div className="hc2-recovery-item">
          <div className="hc2-recovery-icon hc2-recovery-icon--purple">
            <BarChart3 size={18} strokeWidth={1.8} className="hc2-lucide hc2-lucide--purple" />
          </div>
          <div className="hc2-recovery-text">
            <div className="hc2-recovery-title">
              {translate("hc2_recovery_rank_title", lang) || "Prediction History & Rank"}
            </div>
            <div className="hc2-recovery-sub">
              {translate("hc2_recovery_rank_sub", lang) || "Your leaderboard spot is safe"}
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="hc2-divider" />

      {/* 3-step strip */}
      <div className="hc2-steps-strip">
        <div className="hc2-step-card">
          <div className="hc2-step-num">1</div>
          <div className="hc2-step-lbl">
            {translate("hc2_step_1", lang) || "Enter your email"}
          </div>
        </div>
        <div className="hc2-step-card">
          <div className="hc2-step-num">2</div>
          <div className="hc2-step-lbl">
            {translate("hc2_step_2", lang) || "Click the link we send"}
          </div>
        </div>
        <div className="hc2-step-card">
          <div className="hc2-step-num">3</div>
          <div className="hc2-step-lbl">
            {translate("hc2_step_3", lang) || "Back to gaming"}
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className="hc2-root">
      <div className="hc2-orb hc2-orb--top" aria-hidden="true" />
      <div className="hc2-orb hc2-orb--bottom" aria-hidden="true" />

      {/* ── Logo ── */}
      <div className="hc2-logo-row">
        <a href="/" className="hc2-logo-link" aria-label={translate("homeAriaLabel", lang) || "Go to 8JJ Games home"}>
          <img
            src="/8JJ_games.png"
            alt={translate("logoAlt", lang) || "8JJ Games"}
            className="hc2-logo-img AUTH-brand-logo"
          />
        </a>
        <div className="hc2-logo-tagline">
          {translate("hc2_logo_tagline", lang) || "Play · Predict · Win"}
        </div>
      </div>

      {/* ── Mode content ── */}
      <div
        key={animKey}
        className={`hc2-content ${isTransitioning ? "hc2-content--out" : "hc2-content--in"}`}
      >
        {mode === "login"           && loginHero}
        {mode === "register"        && registerHero}
        {mode === "forgot-password" && forgotHero}
      </div>

      <div className="floating-icons" aria-hidden="true" />
      <div className="hero-decoration" aria-hidden="true">
        <div className="decoration-circle circle-1" />
        <div className="decoration-circle circle-2" />
        <div className="decoration-circle circle-3" />
      </div>
    </div>
  );
}