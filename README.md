# 8JJ Games

8JJ Games is a full-stack online gaming and rewards platform that provides users with access to HTML5 browser games, cricket match predictions, leaderboards, rewards, referrals, and user progression systems.

## Features

### Gaming Platform

* HTML5 browser game integration
* Game categories and discovery
* Featured games and recommendations
* Responsive desktop and mobile experience
* SEO-optimized game pages

### Prediction Arena

* Cricket match predictions
* Live, upcoming, and completed matches
* Prediction scoring and rewards
* Leaderboards and rankings
* Match previews with live scores

### User System

* Registration and authentication
* JWT-based authorization
* User profiles and avatars
* Referral and reward system
* Points and progression management
* Achievement tracking

### Admin Panel

* User management
* Game management
* Prediction management
* Match synchronization
* Reward administration
* Content moderation

### Internationalization

* Multi-language support
* Dynamic translation system
* Localized content rendering

### Performance & SEO

* Server-Side Rendering (SSR)
* Dynamic sitemap generation
* Structured data (Schema.org)
* Optimized metadata and Open Graph tags
* Mobile-first design

---

## Technology Stack

### Frontend

* React.js
* Vite
* Vike SSR
* React Router
* Context API
* CSS Modules / Custom CSS

### Backend

* Node.js
* Express.js
* MySQL
* JWT Authentication
* Cron Jobs
* REST APIs

### Infrastructure

* Linux VPS
* Nginx
* PM2
* SSL/TLS
* GitHub

---

## Key Integrations

### HTML5 Game Providers

* Third-party browser game integrations
* Dynamic game metadata management
* Game catalog synchronization

### Cricket Data

* Live match feeds
* Upcoming fixtures
* Recent match results
* Prediction settlement engine

---

## Project Structure

```text
8jj-games/
│
├── react-app/          # Frontend (React + SSR)
├── server/             # Backend APIs
├── uploads/            # User uploaded assets
├── scripts/            # Utility scripts
├── nginx/              # Deployment configs
└── docs/               # Documentation
```

## Core Modules

### Prediction System

* Match creation
* Prediction locking
* Winner calculation
* Points allocation
* Settlement engine

### Rewards System

* User points
* Referral rewards
* Weekly leaderboards
* Achievement progression

### Match Synchronization

* Fetch upcoming matches
* Fetch live matches
* Fetch completed matches
* Auto-update scores and winners

---

## Security

* JWT Authentication
* Password hashing
* Rate limiting
* Protected routes
* Input validation
* Secure API access

---

## Deployment

Production deployment is managed using:

* PM2 process manager
* Nginx reverse proxy
* SSL certificates
* Linux server environment

---

## Author

**Malith**
Full Stack Developer

Built and maintained the platform architecture, frontend applications, backend APIs, prediction systems, mobile experiences, admin panel, deployment infrastructure, and third-party integrations.
