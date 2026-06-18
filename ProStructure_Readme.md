## 8JJ Games – Project Structure Overview

This document describes the overall project structure and how the main parts relate to each other. It is intended for both developers and AI tools to quickly understand the layout and responsibilities of each module.

---

## 🏗️ Top-Level Layout

- `react-app/` – Frontend React application (Vite, SEO, translations, maintenance mode)
- `server/` – Backend API server (Express + MySQL + auth)
- `proxy-server/` – Lightweight standalone proxy for external game content
- `ProStructure_Readme.md` – This detailed project structure overview
- `README.md` – High-level repository overview and quick start guide
- `folder-alias.json`, `private-folder-alias.json` – Editor / tooling configuration

---

## 🎨 Frontend – `react-app/`

**Purpose:** User-facing web application for browsing, searching, and playing games, plus user auth, profile, collections, and SEO-optimised pages in multiple languages.

### Key Files and Directories
- [index.html](file:///Users/akilaranasinghe/Documents/GitHub/8jj-games/react-app/index.html) – Vite entry HTML
- [src/main.jsx](file:///Users/akilaranasinghe/Documents/GitHub/8jj-games/react-app/src/main.jsx) – React entry point (Context Providers: Auth, Profile, Search, Language)
- [src/App.jsx](file:///Users/akilaranasinghe/Documents/GitHub/8jj-games/react-app/src/App.jsx) – Main routing and layout logic (Desktop vs Mobile detection)
- `.env.local`, `.env.staging`, `.env.production` – Frontend environment configuration
  - `VITE_API_BASE_URL` – Points to backend API
  - `VITE_PROXY_BASE_URL` – Optional standalone proxy
  - `VITE_MAINTENANCE_MODE` – Toggles maintenance banner/behaviour
  - `VITE_GOOGLE_CLIENT_ID` – Google OAuth client
- `public/` – Static assets, branding, and game thumbnails

### Frontend Domains

- Routing and pages (React Router)
- Game listings and details (classic grid, mosaic, V2 layout)
- User authentication and registration (email/password + Google)
- User profile, activity, and collections
- Search and categories
- SEO meta tags and structured keywords
- Internationalisation (translations for core UI and auth flows)

### Important frontend directories

- `src/components/`
  - Shared UI components (header, footer, sidebar, search overlay, sliders, etc.)
  - `SEO/SEO.jsx` – Centralised SEO component for title/meta
  - `WhatWeOffer/`, `GameCard/`, `MosaicGameCard/`, `CategoryGrid/` – Game browsing UI

- `src/pages/`
  - `Home/` – Landing page and main game catalog
  - `AllGames/` – Full list of games, pagination and infinite scroll style behaviour
  - `GamePage/`, `GamePageV2/` – Game detail layouts (legacy + modern)
  - `MosaicGamePage/` – High-density game discovery layout
  - `CategoryGamesPage/`, `AllCategoriesPage/` – Category browsing
  - `MyCollection/` – User’s saved games, powered by collection APIs and local utils
  - `Auth/` – Authentication flows
    - `Login/` – New login page implementation with SEO and enhanced UX
    - `Register/` – New registration page implementation
    - `AuthPage/` – Combined auth experience (login/register/forgot), SEO-optimised
      - `HeroContent.jsx` – Animated hero copy, driven by translations
      - `LoginForm.jsx`, `RegisterForm.jsx`, `ForgotPasswordForm.jsx`
      - `ResetPassword.jsx` – Standalone reset UI using translations and strength meter
  - `Profile/` – User profile and activity pages, tabbed layout
  - `admin/` – Admin area (protected by `AdminRoute`, uses JWT role `admin`)
    - `AdminDashboard.jsx` – High-level stats (total users, active users, collections, verification), and recent users table.
    - `UserManagement/` – Full user management tooling:
      - List/search/sort/filter users.
      - Toggle active status and roles.
      - View and edit individual users via `UserModal`.
      - Dedicated styles in `UserManagement.css` and `styles/UserManagement.css`.
    - `Notifications/NotificationManagement.jsx` – Admin notification centre:
      - Manage templates, presets, and campaigns.
      - Quick-send notifications to a user or filtered groups.
      - Uses `notificationAPI` and shared admin modal styles.
    - `AdminPoints/` – Points and rewards management:
      - `AdminPoints.jsx` – Global point rules / earning logic UI.
      - `AdminUserPoints.jsx` – Per-user point adjustments and history.
    - `BannerManagement/` – Homepage/placement banner configuration:
      - Manage templates, placements, slides, and game assignments.
      - Uses `bannerAPI` and `banner.routes.js` on the backend.
    - `SyncManagement/` – Admin tools for syncing games/data from external sources (e.g. H5 games), monitoring sync status, and resolving conflicts.

  - `mobile/` – Mobile-optimised pages and flows (auto-selected via `isMobile` in `App.jsx`)
    - `MobileHome/` – Mobile home experience with welcome section, hero and mobile-friendly carousels.
    - `MobileAllGames/` – Mobile grid view of all games with filters, search, and infinite scrolling.
    - `MobileCategoryGamesPage/` – Category-specific listing, mobile layout.
    - `MobileAllCategories/` – Mobile-first category grid with hero and “about” section.
    - `MobileMyCollection/` – Mobile version of the collection page, including breadcrumb and loading states.
    - `MobileGamePageV2/` – Mobile game detail/play page:
      - Uses `MobileHeader` and `MobileBottomNav`.
      - Integrates comments, related games, and mobile-friendly controls.
    - `MobileProfile/` – Mobile profile hub:
      - Sections under `MobileProfile/sections/`:
        - `MobileOverview`, `MobileActivity`, `MobileStats` – Stats, activity timeline, and progress.
        - `MobileSettings` – Edit profile details, language, and basic preferences.
        - `MobileSecurity` – Password/security settings.
        - `MobileNotifications` – Notification preferences.
        - `MobileRedeemCode` – Referral / redeem code flow.
      - Uses translations, `LEVELS`, and tier icons to present progression.
    - `MobileLeaderboard/`, `MobileAbout/`, `MobileContact/`, `MobileFAQPage/`, `MobilePrivacyPolicy/` – Mobile variants of key informational and leaderboard pages.

- `src/context/`
  - `SearchContext` – Provides global search state to components
  - `LanguageContext` – Manages active language and persistence
  - Any other global context providers

- `src/api/`
  - `fetchGames.js`, `fetchH5Games.js`, `h5games.js`
    - Functions for fetching game lists, either direct or proxied
  - `proxy.js`
    - Frontend-side handler for `/api/proxy` (Node/Vercel function style)
  - `collection.api.js`
    - `addToCollectionDB`, `removeFromCollectionDB` – HTTP calls to backend collection endpoints
  - `profile.api.js`, `auth.api.js` (or equivalent modules)
    - Auth, profile, and activity helpers around backend endpoints

- `src/config/`
  - `seoKeywords.js` – Central place to generate SEO keyword sets per page/route

- `src/data/`
  - `translations.js` – Large translation map for UI text in multiple languages
    - Includes auth copy, password strength messages, and CTAs
  - `selfHostedGames` data – Definitions for games hosted directly

- `src/utils/`
  - `collectionUtils.js`
    - Manages client-side collection via `localStorage` (get/add/remove/isInCollection)
  - Other helpers for thumbnails, tracking, etc.

### Frontend–Backend Integration

- Auth:
  - Uses `@react-oauth/google` (`GoogleOAuthProvider`, `useGoogleLogin`, `GoogleLogin`)
  - Sends tokens or credentials to backend `/api/auth/google` endpoint
- Email/password auth:
  - Uses `/api/auth/register`, `/api/auth/login`, `/api/auth/forgot-password`, `/api/auth/reset-password`, `/api/auth/verify-email`
- Collections:
  - Uses `/api/collection/add` and `/api/collection/remove`
- Profile:
  - Uses `/api/profile` for getting/updating user data
- Admin:
  - Uses `/api/admin/users` and `/api/admin/users/:id/toggle`
- Proxy:
  - Uses `/api/proxy?url=...` (backend or standalone proxy, depending on deployment)

### 📱 Mobile Module (`src/pages/mobile/`)
Dedicated mobile-first experience auto-selected via `isMobile` detection in `App.jsx`.
- **Auth:** [MobileAuth.jsx](file:///Users/akilaranasinghe/Documents/GitHub/8jj-games/react-app/src/pages/mobile/MobileAuth/MobileAuth.jsx) (Login, Register, Forgot Password, Apple Auth)
- **Home:** [MobileHome.jsx](file:///Users/akilaranasinghe/Documents/GitHub/8jj-games/react-app/src/pages/mobile/MobileHome/MobileHome.jsx) (Optimised carousels and performance-tuned background)
- **Profile:** [MobileProfile.jsx](file:///Users/akilaranasinghe/Documents/GitHub/8jj-games/react-app/src/pages/mobile/MobileProfile/MobileProfile.jsx) (Tabbed interface for Overview, Activity, Stats, Settings, Security, Notifications, and Redeem Code)
- **Game Discovery:** [MobileAllGames.jsx](file:///Users/akilaranasinghe/Documents/GitHub/8jj-games/react-app/src/pages/mobile/MobileAllGames/MobileAllGames.jsx), [MobileAllCategories.jsx](file:///Users/akilaranasinghe/Documents/GitHub/8jj-games/react-app/src/pages/mobile/MobileAllCategories/MobileAllCategories.jsx)
- **Gameplay:** [MobileGamePageV2.jsx](file:///Users/akilaranasinghe/Documents/GitHub/8jj-games/react-app/src/pages/mobile/MobileGamePageV2/MobileGamePageV2.jsx)
- **Community:** [MobileLeaderboard.jsx](file:///Users/akilaranasinghe/Documents/GitHub/8jj-games/react-app/src/pages/mobile/MobileLeaderboard/MobileLeaderboard.jsx) (Podium view and rank cards)

### 🛠️ Admin Module (`src/pages/admin/`)
Restricted area for site management (protected by `AdminRoute`, requires `admin` role).
- **Dashboard:** [AdminDashboard.jsx](file:///Users/akilaranasinghe/Documents/GitHub/8jj-games/react-app/src/pages/admin/AdminDashboard.jsx) (Real-time stats, growth charts, recent activity)
- **User Management:** [UserManagement.jsx](file:///Users/akilaranasinghe/Documents/GitHub/8jj-games/react-app/src/pages/admin/UserManagement/UserManagement.jsx) (Bulk actions, status toggling, detailed user modals)
- **Content Management:** [BannerManagement.jsx](file:///Users/akilaranasinghe/Documents/GitHub/8jj-games/react-app/src/pages/admin/BannerManagement/BannerManagement.jsx) (Carousel slides, placements, templates), [GameManager.jsx](file:///Users/akilaranasinghe/Documents/GitHub/8jj-games/react-app/src/pages/admin/GameManager/GameManager.jsx)
- **Marketing & Engagement:** [NotificationManagement.jsx](file:///Users/akilaranasinghe/Documents/GitHub/8jj-games/react-app/src/pages/admin/Notifications/NotificationManagement.jsx) (Push/In-app campaigns, templates), [AdminPoints.jsx](file:///Users/akilaranasinghe/Documents/GitHub/8jj-games/react-app/src/pages/admin/AdminPoints/AdminPoints.jsx) (Reward rules)
- **System:** [SyncManagement.jsx](file:///Users/akilaranasinghe/Documents/GitHub/8jj-games/react-app/src/pages/admin/SyncManagement/SyncManagement.jsx) (External game provider syncing)
- **Analytics:** [Analytics.jsx](file:///Users/akilaranasinghe/Documents/GitHub/8jj-games/react-app/src/pages/admin/Analytics/Analytics.jsx) (Heatmaps, game performance, user growth)

---

## ⚙️ Backend – `server/`
**Purpose:** REST API for authentication, user management, collections, profile, admin dashboards, activity tracking, and proxying game content when needed.

Key files:

- `package.json`
  - Scripts:
    - `npm run start` – Run the server
    - `npm run dev` – Run with `node --watch src/server.js`
  - Dependencies:
    - `express`, `cors`, `mysql2`, `jsonwebtoken`, `bcrypt`
    - `express-rate-limit` (rate limiting for auth)
    - `google-auth-library` (Google token verification)
    - `nodemailer` (email)

- `src/server.js`
  - Loads env via `./config/env.js`
  - Configures CORS (allowed origin from `FRONTEND_URL` or `http://localhost:5173`)
  - Registers core routes:
    - `/api/auth` – Authentication routes
    - `/api/admin` – Admin-only routes
    - `/api` – Proxy routes
    - `/api/profile` – Profile routes
    - `/api/activity` – Activity routes
    - `/api/collection` – User collection routes
  - Sets error handler and starts the server on `PORT` (default `5050`)
  - Provides `/health` endpoint for health checks

### Backend directories

- `src/config/`
  - `env.js` – Loads `.env` variables and prepares configuration

- `src/db/`
  - `index.js` – Database connection (MySQL) using `mysql2`

- `src/routes/`
  - `auth.js` – Public authentication routes
    - `POST /register`
    - `POST /login` (rate limited)
    - `GET /verify-email`
    - `POST /forgot-password`
    - `POST /reset-password`
    - `POST /google` – Google OAuth / Google Identity integration
  - `admin.js` – Admin-only endpoints
    - Protected by `adminAuth` middleware
    - `GET /users` – List users
    - `PATCH /users/:id/toggle` – Toggle user activity
  - `profile.js` – User profile endpoints
    - `GET /` – Get profile
    - `PUT /` – Update profile
  - `activity.routes.js` – User activity tracking endpoints
  - `collection.routes.js` – Collection API
    - `POST /add` – Add game to collection
    - `DELETE /remove` – Remove game from collection
  - `proxy.routes.js` – API-level proxy endpoints using backend proxy controller

- `src/controllers/`
  - `authController.js`
    - Email/password registration, login
    - Email verification, password reset
    - `googleLogin` – Handles Google OAuth flow (access token or ID token)
  - `profileController.js`
    - `getProfile`, `updateProfile`
  - `collection.controller.js`
    - `addToCollection` – Inserts into `user_collections`
    - `removeFromCollection` – Deletes from `user_collections`
  - `proxy.controller.js`
    - `proxyRequest` – Fetches external content and returns it with correct headers

- `src/middleware/`
  - `auth.js` – Validates JWT, attaches `req.user`
  - `adminAuth.js` – Checks JWT and `role === "admin"`
  - `rateLimit.js` – `loginLimiter` instance using `express-rate-limit`

- `src/utils/`
  - `token.js` – JWT generation and email token helpers
  - `email.js` – Nodemailer setup and helpers for verification / reset emails

### Backend–Database Relationship

- Uses a relational database (MySQL) via `mysql2`.
- Example tables:
  - `users` – Contains username, email, hashed password, provider, verification status, role, etc.
  - `user_collections` – Many-to-one (user to games):
    - Columns: `user_id`, `game_id`, `title`, `image`, `source`
  - Additional tables for activity logs, email verification, etc. (defined in your SQL migrations or manual setup).

---

## Proxy Server – `proxy-server/`

**Purpose:** Standalone proxy for external game content, used when the main backend is not handling proxy duties or when a separate service is preferred.

Key files:

- `package.json`
  - Scripts:
    - `npm run dev` – Start proxy server
  - Dependencies:
    - `express`
    - `cors`

- `src/server.js`
  - Basic Express app
  - CORS enabled
  - Uses `proxy.routes.js` under `/api`
  - Listens on port `5175`

- `src/routes/proxy.routes.js`
  - Routes for external proxying (e.g. `/api/proxy` or similar)

- `src/controllers/proxy.controller.js`
  - `proxyRequest` – Validates query params and delegates to fetch service

- `src/services/fetch.service.js`
  - `fetchExternal` – Performs the actual fetch to external URLs, returns buffer and content type

- `src/utils/allowedDomains.js`
  - Logic to restrict which domains can be proxied (security filter)

### Relationship Between Backend and Proxy Server

- In some setups, the main backend (`server/`) uses its own `proxy.controller` and `proxy.routes`.
- The `proxy-server/` provides an alternative deployment model where proxying is fully separated from the main API.
- Frontend can be configured (via environment or specific API modules) to hit either:
  - Backend API proxy on `http://localhost:5050/api/...`
  - Standalone proxy on `http://localhost:5175/api/...`
**Purpose:** Node.js Express REST API managing the core business logic, database interactions (MySQL), and secure authentication.

### 🔑 User Functionalities Processes
- **Authentication ([authController.js](file:///Users/akilaranasinghe/Documents/GitHub/8jj-games/server/src/controllers/authController.js)):**
    - **Registration:** Validates input -> Hashes password (Bcrypt) -> Generates unique referral code -> Creates user record -> Issues email verification token via [email.js](file:///Users/akilaranasinghe/Documents/GitHub/8jj-games/server/src/utils/email.js) -> Awards initial points.
    - **Login:** Verifies credentials/Google Token/Apple ID -> Checks if account is active/verified -> Generates JWT ([token.js](file:///Users/akilaranasinghe/Documents/GitHub/8jj-games/server/src/utils/token.js)) -> Logs login activity -> Awards daily login points.
- **Profile & Social ([profileController.js](file:///Users/akilaranasinghe/Documents/GitHub/8jj-games/server/src/controllers/profileController.js)):**
    - Retrieves user stats (level, points, rank) from [leaderboard.controller.js](file:///Users/akilaranasinghe/Documents/GitHub/8jj-games/server/src/controllers/leaderboard.controller.js).
    - Manages avatar uploads and account settings.
- **Activity & Progression ([activity.controller.js](file:///Users/akilaranasinghe/Documents/GitHub/8jj-games/server/src/controllers/activity.controller.js)):**
    - Logs every game play/interaction -> Validates against [points.service.js](file:///Users/akilaranasinghe/Documents/GitHub/8jj-games/server/src/services/points.service.js) rules -> Updates user total points, level, and tier based on predefined thresholds.

### 🛡️ Admin Functionalities Processes
- **Access Control ([adminAuth.js](file:///Users/akilaranasinghe/Documents/GitHub/8jj-games/server/src/middleware/adminAuth.js)):**
    - Middleware that verifies the JWT and ensures the `role` claim is `admin` before allowing access to any `/api/admin/*` or `/api/notifications/admin/*` routes.
- **User Oversight ([admin.js](file:///Users/akilaranasinghe/Documents/GitHub/8jj-games/server/src/routes/admin.js)):**
    - Fetching complex dashboard stats using aggregate SQL queries.
    - Toggling `is_active` status to ban/unban users.
- **System Management:**
    - **Banners ([bannerController.js](file:///Users/akilaranasinghe/Documents/GitHub/8jj-games/server/src/controllers/bannerController.js)):** CRUD operations for homepage placements and slide configurations.
    - **Notifications ([adminNotificationController.js](file:///Users/akilaranasinghe/Documents/GitHub/8jj-games/server/src/controllers/adminNotificationController.js)):** Processes bulk notifications by querying target user segments and inserting records into the `notifications` table.
    - **Points ([admin.points.controller.js](file:///Users/akilaranasinghe/Documents/GitHub/8jj-games/server/src/controllers/admin.points.controller.js)):** Modifying the `points_rules` table which dynamically changes how much users earn across the entire platform.

---

## 🌐 Proxy Server – `proxy-server/`

**Purpose:** Standalone Express server for proxying external game content to bypass CORS restrictions.
- **Fetch Service:** [fetch.service.js](file:///Users/akilaranasinghe/Documents/GitHub/8jj-games/proxy-server/src/services/fetch.service.js) fetches external assets and returns them with correct content-type headers.
- **Security:** [allowedDomains.js](file:///Users/akilaranasinghe/Documents/GitHub/8jj-games/proxy-server/src/utils/allowedDomains.js) restricts proxying to trusted game providers.

---

## 🔄 Typical Data Flow Scenarios

### User Authentication
1. Frontend ([LoginForm.jsx](file:///Users/akilaranasinghe/Documents/GitHub/8jj-games/react-app/src/pages/Auth/AuthPage/LoginForm.jsx)) sends credentials to `POST /api/auth/login`.
2. Backend ([authController.js](file:///Users/akilaranasinghe/Documents/GitHub/8jj-games/server/src/controllers/authController.js)) validates against DB, generates JWT, and returns it.
3. Frontend stores JWT and uses it in the `Authorization` header for subsequent requests.

### Admin Content Update
1. Admin ([BannerManagement.jsx](file:///Users/akilaranasinghe/Documents/GitHub/8jj-games/react-app/src/pages/admin/BannerManagement/BannerManagement.jsx)) updates a placement configuration.
2. Backend ([bannerController.js](file:///Users/akilaranasinghe/Documents/GitHub/8jj-games/server/src/controllers/bannerController.js)) updates the `banner_placements` table.
3. Next time any user loads the home page, the frontend fetches the updated placement via `GET /api/banner/placement/:key`.

---

## 📂 Current File & Folder Structure

```text
8jj-games/
├── react-app/                  # Frontend React + Vite
│   ├── public/                 # Static assets (images, fonts, games)
│   ├── src/
│   │   ├── api/                # API client modules (admin, auth, banner, etc.)
│   │   ├── components/         # Shared UI components (Header, Footer, SEO)
│   │   ├── context/            # React Contexts (Auth, Language, Profile)
│   │   ├── config/             # App configuration (SEO keywords, levels)
│   │   ├── data/               # Static data & translations
│   │   ├── hooks/              # Custom React hooks
│   │   ├── pages/
│   │   │   ├── admin/          # Admin Dashboard & Management Pages
│   │   │   ├── mobile/         # Mobile-specific Page Variants
│   │   │   ├── Auth/           # Login, Register, Forgot Password
│   │   │   ├── Home/           # Desktop Landing Page
│   │   │   └── ... (GamePage, Profile, Leaderboard, etc.)
│   │   ├── styles/             # Global & Shared CSS
│   │   ├── utils/              # Client-side utility functions
│   │   ├── App.jsx             # Main App component & Router
│   │   └── main.jsx            # React Entry Point
│   ├── package.json
│   └── vite.config.js
├── server/                     # Backend Express API
│   ├── src/
│   │   ├── config/             # Server environment & config
│   │   ├── controllers/        # Business logic handlers
│   │   ├── db/                 # Database connection & migrations
│   │   ├── middleware/         # Auth & Admin security middleware
│   │   ├── routes/             # API route definitions
│   │   ├── services/           # External services (Points, Email)
│   │   ├── utils/              # Server-side utility functions
│   │   ├── app.js              # Express app setup
│   │   └── server.js           # Server entry point
│   ├── uploads/                # User uploaded assets (avatars)
│   ├── package.json
│   └── enhanced_schema.sql     # Database schema definition
└── proxy-server/               # External Content Proxy
    ├── src/
    │   ├── controllers/        # Proxy request handlers
    │   ├── routes/             # Proxy routes
    │   ├── services/           # External fetch logic
    │   └── server.js           # Proxy entry point
    └── package.json
```

---

## 📖 How to Use This Document
- **Developers:** Use this to locate specific features (e.g., if working on mobile points, look into `src/pages/mobile/MobileProfile/sections/MobileStats.jsx` and `server/src/services/points.service.js`).
- **AI Tools:** Reference the file paths and backend process descriptions to understand how modules interact when proposing code changes or debugging flows.
