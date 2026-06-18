-- ============================================================
-- 8JJ GAMES - BANNER MANAGEMENT SYSTEM - DATABASE SCHEMA
-- ============================================================
-- Created: 2026-02-13
-- Purpose: Complete banner management with templates, placements, and analytics
-- Version: 1.0
-- ============================================================

-- ============================================================
-- 1. BANNER TEMPLATES TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS banner_templates (
  id INT PRIMARY KEY AUTO_INCREMENT,

  -- Template Info
  name VARCHAR(100) NOT NULL UNIQUE COMMENT 'Template name (e.g., "Hero Banner Carousel")',
  template_type ENUM(
    'hero',
    'hot_section',
    'top_picks',
    'featured_carousel',
    'side',
    'strip',
    'popup',
    'floating'
  ) NOT NULL COMMENT 'Type of banner component',
  component_name VARCHAR(100) NOT NULL COMMENT 'React component name (e.g., "HeroBannerV2")',
  description TEXT COMMENT 'Template description',

  -- Preview
  preview_image_url VARCHAR(500) COMMENT 'Preview image for admin panel',

  -- Configuration
  default_config JSON COMMENT 'Default settings (autoPlay, interval, etc)',

  -- Status
  is_active BOOLEAN DEFAULT TRUE COMMENT 'Is template available for use',

  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_template_type (template_type),
  INDEX idx_active (is_active)
);


-- ============================================================
-- 2. BANNER PLACEMENTS TABLE
-- ============================================================
-- Defines where banners can appear on the site
CREATE TABLE IF NOT EXISTS banner_placements (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL UNIQUE,
  placement_key VARCHAR(100) NOT NULL UNIQUE,
  page_route VARCHAR(200) NOT NULL,
  position ENUM(
    'hero','sidebar','header','footer','modal',
    'top','bottom','section_1','section_2','section_3'
  ) NOT NULL,
  description TEXT,
  max_active_banners INT DEFAULT 1,
  allowed_template_types JSON,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_page_route (page_route),
  INDEX idx_position (position),
  INDEX idx_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



-- ============================================================
-- 3. BANNERS TABLE
-- ============================================================
-- Individual banner instances
CREATE TABLE banners (
  id INT PRIMARY KEY AUTO_INCREMENT,
  template_id INT NOT NULL,
  placement_id INT NOT NULL,
  name VARCHAR(200) NOT NULL,
  priority INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  start_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  end_date TIMESTAMP NULL DEFAULT NULL,
  config JSON,
  click_count INT NOT NULL DEFAULT 0,
  impression_count INT NOT NULL DEFAULT 0,
  created_by INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (template_id) REFERENCES banner_templates(id) ON DELETE RESTRICT,
  FOREIGN KEY (placement_id) REFERENCES banner_placements(id) ON DELETE CASCADE,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX (template_id),
  INDEX (placement_id),
  INDEX (is_active),
  INDEX (priority)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ============================================================
-- 4. BANNER SLIDES TABLE
-- ============================================================
-- Content for carousel banners (Hero, Featured)
CREATE TABLE IF NOT EXISTS banner_slides (
  id INT PRIMARY KEY AUTO_INCREMENT,

  banner_id INT NOT NULL,
  order_position INT DEFAULT 0,

  title VARCHAR(200),
  title_highlight VARCHAR(100),
  subtitle TEXT,
  badge_text VARCHAR(50),
  cta_text VARCHAR(50),
  cta_link VARCHAR(500),

  background_image_url VARCHAR(500),
  logo_url VARCHAR(500),

  config JSON,

  is_active BOOLEAN DEFAULT TRUE,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  CONSTRAINT fk_slides_banner
    FOREIGN KEY (banner_id) REFERENCES banners(id) ON DELETE CASCADE,

  INDEX idx_banner (banner_id),
  INDEX idx_active (is_active),
  UNIQUE INDEX idx_banner_order (banner_id, order_position)

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 5. BANNER GAMES TABLE
-- ============================================================
-- Games associated with section-based banners (Hot Section, Top Picks)
CREATE TABLE IF NOT EXISTS banner_games (
  id INT PRIMARY KEY AUTO_INCREMENT,

  banner_id INT NOT NULL,
  game_id VARCHAR(100) NOT NULL,

  order_position INT DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,

  config JSON,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  CONSTRAINT fk_games_banner
    FOREIGN KEY (banner_id) REFERENCES banners(id) ON DELETE CASCADE,

  INDEX idx_banner (banner_id),
  INDEX idx_game (game_id),
  INDEX idx_featured (is_featured),
  UNIQUE INDEX idx_banner_game (banner_id, game_id),
  UNIQUE INDEX idx_banner_game_order (banner_id, order_position)

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================
-- 6. BANNER ANALYTICS TABLE
-- ============================================================
-- Detailed tracking of banner performance
CREATE TABLE IF NOT EXISTS banner_analytics (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,

  banner_id INT NOT NULL,
  slide_id INT NULL,
  game_id VARCHAR(100) NULL,

  event_type ENUM('impression', 'click', 'cta_click', 'game_click') NOT NULL,

  user_id INT NULL,
  session_id VARCHAR(100),

  page_url VARCHAR(500),
  referrer_url VARCHAR(500),

  device_type ENUM('mobile', 'tablet', 'desktop') DEFAULT 'desktop',
  browser VARCHAR(50),
  ip_address VARCHAR(45),

  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_analytics_banner
    FOREIGN KEY (banner_id) REFERENCES banners(id) ON DELETE CASCADE,

  CONSTRAINT fk_analytics_slide
    FOREIGN KEY (slide_id) REFERENCES banner_slides(id) ON DELETE CASCADE,

  CONSTRAINT fk_banner_analytics_user_ref
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,

  INDEX idx_banner (banner_id),
  INDEX idx_slide (slide_id),
  INDEX idx_event (event_type),
  INDEX idx_timestamp (timestamp),
  INDEX idx_session (session_id),
  INDEX idx_user (user_id),
  INDEX idx_banner_event (banner_id, event_type),
  INDEX idx_banner_timestamp (banner_id, timestamp),
  INDEX idx_banner_event_timestamp (banner_id, event_type, timestamp)

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================
-- SEED DATA - DEFAULT TEMPLATES
-- ============================================================

INSERT INTO banner_templates (name, template_type, component_name, description, default_config) VALUES
('Hero Banner Carousel', 'hero', 'HeroBannerV2', 'Main hero banner with multiple slides and auto-play carousel', 
  '{"autoPlay": true, "interval": 5000, "showArrows": true, "showIndicators": true}'),

('Hot Games Section', 'hot_section', 'HotSectionV2', 'Trending games section with fire icon and responsive grid layout', 
  '{"maxGames": 12, "showFeatured": true, "responsive": true}'),

('Top Picks Carousel', 'top_picks', 'TopPicksSectionV2', 'Featured game + grid of related games in horizontal slides', 
  '{"gamesPerSlide": 11, "showNavigation": true, "featuredLeft": true}'),

('Featured Carousel Strip', 'featured_carousel', 'FeaturedCarouselV2', 'Auto-scrolling horizontal strip of game cards', 
  '{"speed": 0.35, "loop": true, "pauseOnHover": false}')

ON DUPLICATE KEY UPDATE
  description = VALUES(description),
  default_config = VALUES(default_config);

-- ============================================================
-- SEED DATA - DEFAULT PLACEMENTS
-- ============================================================

INSERT INTO banner_placements (name, placement_key, page_route, position, description, max_active_banners, allowed_template_types) VALUES
('Home Hero', 'home_hero', '/', 'hero', 'Main hero banner on homepage', 1, '["hero"]'),
('Home Hot Games', 'home_hot', '/', 'section_1', 'Hot games section on homepage', 1, '["hot_section"]'),
('Home Top Picks', 'home_top_picks', '/', 'section_2', 'Top picks carousel on homepage', 1, '["top_picks"]'),
('Home Featured Strip', 'home_featured', '/', 'section_3', 'Featured games carousel strip', 1, '["featured_carousel"]'),
('All Games Hero', 'all_games_hero', '/all-games', 'hero', 'Hero banner on all games page', 1, '["hero"]'),
('Category Hero', 'category_hero', '/categories/:id', 'hero', 'Hero banner on category pages', 1, '["hero"]'),
('Game Detail Top', 'game_detail_top', '/game/:id', 'top', 'Banner at top of game detail page', 1, '["strip", "side"]')

ON DUPLICATE KEY UPDATE
  description = VALUES(description),
  max_active_banners = VALUES(max_active_banners),
  allowed_template_types = VALUES(allowed_template_types);

-- ============================================================
-- SAMPLE DATA - Home Hero Banner
-- ============================================================

-- Insert sample banner
INSERT INTO banners (template_id, placement_id, name, priority, is_active, config)
SELECT 
  t.id,
  p.id,
  'Homepage Main Banner - Feb 2026',
  100,
  TRUE,
  '{"autoPlay": true, "interval": 5000}'
FROM banner_templates t
CROSS JOIN banner_placements p
WHERE t.template_type = 'hero' 
  AND p.placement_key = 'home_hero'
ON DUPLICATE KEY UPDATE priority = priority;

-- Get the banner ID for slides
SET @banner_id = (
  SELECT b.id 
  FROM banners b
  INNER JOIN banner_templates t ON b.template_id = t.id
  INNER JOIN banner_placements p ON b.placement_id = p.id
  WHERE t.template_type = 'hero' 
    AND p.placement_key = 'home_hero'
  LIMIT 1
);

-- Insert sample slides (only if banner exists)
INSERT INTO banner_slides (banner_id, order_position, title, title_highlight, subtitle, badge_text, cta_text, cta_link, background_image_url)
SELECT @banner_id, 0, 'Free Online Games', 'PLAY FREE NOW', 'Thousands of games to play instantly', 'INCREDIBLE', 'Play Now', '/categories/adventure', '/images/8JJ-GAMES1.jpg'
WHERE @banner_id IS NOT NULL
ON DUPLICATE KEY UPDATE order_position = order_position;

INSERT INTO banner_slides (banner_id, order_position, title, title_highlight, subtitle, badge_text, cta_text, cta_link, background_image_url)
SELECT @banner_id, 1, 'Unlimited Free Halloween Games', 'HALLOWEEN', 'Spooky games for everyone', 'SPOOKY', 'Play Now', '/categories/halloween', '/images/8JJ-GAMES2-1.jpg'
WHERE @banner_id IS NOT NULL
ON DUPLICATE KEY UPDATE order_position = order_position;

-- ============================================================
-- VERIFICATION QUERIES
-- ============================================================

-- Show all tables
SHOW TABLES LIKE 'banner%';

-- Show banner templates
SELECT * FROM banner_templates;

-- Show banner placements
SELECT * FROM banner_placements;

-- Show sample banner
SELECT b.*, t.name as template_name, p.name as placement_name
FROM banners b
INNER JOIN banner_templates t ON b.template_id = t.id
INNER JOIN banner_placements p ON b.placement_id = p.id;

-- Show sample slides
SELECT s.*, b.name as banner_name
FROM banner_slides s
INNER JOIN banners b ON s.banner_id = b.id;

-- ============================================================
-- USEFUL VIEWS (OPTIONAL)
-- ============================================================

-- Active banners with template and placement info
CREATE OR REPLACE VIEW active_banners_view AS
SELECT 
  b.id,
  b.name,
  b.priority,
  b.is_active,
  b.start_date,
  b.end_date,
  b.click_count,
  b.impression_count,
  t.name as template_name,
  t.template_type,
  p.name as placement_name,
  p.placement_key,
  p.page_route,
  COUNT(DISTINCT s.id) as slide_count,
  COUNT(DISTINCT g.id) as game_count
FROM banners b
INNER JOIN banner_templates t ON b.template_id = t.id
INNER JOIN banner_placements p ON b.placement_id = p.id
LEFT JOIN banner_slides s ON b.id = s.banner_id
LEFT JOIN banner_games g ON b.id = g.banner_id
WHERE b.is_active = TRUE
  AND (b.end_date IS NULL OR b.end_date > NOW())
  AND b.start_date <= NOW()
GROUP BY b.id
ORDER BY p.page_route, b.priority DESC;

-- Banner performance summary
CREATE OR REPLACE VIEW banner_performance_view AS
SELECT 
  b.id as banner_id,
  b.name as banner_name,
  COUNT(CASE WHEN a.event_type = 'impression' THEN 1 END) as impressions,
  COUNT(CASE WHEN a.event_type IN ('click', 'cta_click', 'game_click') THEN 1 END) as clicks,
  ROUND(
    COUNT(CASE WHEN a.event_type IN ('click', 'cta_click', 'game_click') THEN 1 END) * 100.0 / 
    NULLIF(COUNT(CASE WHEN a.event_type = 'impression' THEN 1 END), 0), 
    2
  ) as ctr_percentage
FROM banners b
LEFT JOIN banner_analytics a ON b.id = a.banner_id
GROUP BY b.id
ORDER BY impressions DESC;

-- ============================================================
-- COMPLETION MESSAGE
-- ============================================================

SELECT '✅ Banner Management System schema created successfully!' as status;
SELECT 'Tables: banner_templates, banner_placements, banners, banner_slides, banner_games, banner_analytics' as info;
SELECT 'Sample data inserted for testing' as sample_data;
SELECT 'Views created: active_banners_view, banner_performance_view' as views;

-- ============================================================
-- Add these as well

ALTER TABLE banner_placements ADD COLUMN max_banners INT DEFAULT 1 NOT NULL AFTER position;

-- ============================================================

ALTER TABLE banner_placements 
MODIFY COLUMN position ENUM(
  'hero', 
  'sidebar', 
  'header', 
  'footer', 
  'modal', 
  'top', 
  'bottom',
  'section_1', 
  'section_2', 
  'section_3',
  'hot_section',
  'top_picks',
  'featured_carousel',
  'inline'
) NOT NULL COMMENT 'Position on page';

-- ============================================================

-- Add the column
ALTER TABLE banner_placements 
ADD COLUMN allowed_templates JSON 
AFTER allowed_template_types;

-- Populate it
UPDATE banner_placements SET allowed_templates = '[1]' WHERE placement_key = 'home_hero';
UPDATE banner_placements SET allowed_templates = '[2]' WHERE placement_key = 'home_hot';
UPDATE banner_placements SET allowed_templates = '[3]' WHERE placement_key = 'home_top_picks';
UPDATE banner_placements SET allowed_templates = '[4]' WHERE placement_key = 'home_featured';
UPDATE banner_placements SET allowed_templates = '[1]' WHERE placement_key = 'all_games_hero';
UPDATE banner_placements SET allowed_templates = '[1]' WHERE placement_key = 'category_hero';
UPDATE banner_placements SET allowed_templates = '[]' WHERE placement_key = 'game_detail_top';
-- ============================================================

ALTER TABLE banners 
ADD COLUMN subtitle TEXT NULL 
AFTER name;

-- ===========================================================
-- ====Banner Type Templates/New Image-Media Type Banners=====
-- ===========================================================

-- Run these ONE AT A TIME in mysql terminal
-- Copy each block separately


-- ── BLOCK 0 ──────────────────────────────────────────────────

-- 1. Change old template rows to a type that will survive the ENUM change
UPDATE banner_templates SET template_type = 'side' WHERE template_type IN ('hot_section', 'top_picks', 'featured_carousel');

-- Then deactivate them
UPDATE banner_templates SET is_active = FALSE WHERE component_name IN ('HotSectionV2', 'TopPicksSectionV2', 'FeaturedCarouselV2');

-- 2. NOW safe to alter the ENUM
ALTER TABLE banner_templates
MODIFY COLUMN template_type ENUM(
  'hero', 'promo', 'multi_panel', 'split_hero', 'promo_grid',
  'wide_strip', 'carousel_cards', 'countdown', 'video_hero',
  'floating_announcement', 'side', 'popup'
) NOT NULL COMMENT 'Type of banner component';

-- ── BLOCK 1 ──────────────────────────────────────────────────
INSERT INTO banner_templates (name, template_type, component_name, description, default_config)
VALUES ('Promo Banner', 'promo', 'PromoBannerV2', 'Wide promo card - bold text left, character image right, CTA.', '{"autoPlay":true,"interval":6000,"showIndicators":true,"accentColor":"#00ff88","overlayOpacity":0.55}');

-- ── BLOCK 2 ──────────────────────────────────────────────────
INSERT INTO banner_templates (name, template_type, component_name, description, default_config)
VALUES ('Multi-Panel Banner', 'multi_panel', 'MultiPanelBannerV2', '2-3 promo panels side by side. Each slide is one panel.', '{"maxPanels":3,"gap":16,"borderRadius":18,"showOverlay":true}');

-- ── BLOCK 3 ──────────────────────────────────────────────────
UPDATE banner_placements SET allowed_template_types = '["hero","promo","multi_panel"]' WHERE placement_key = 'home_hero';

-- ── BLOCK 4 ──────────────────────────────────────────────────
UPDATE banner_placements SET allowed_template_types = '["hero","promo"]' WHERE placement_key IN ('all_games_hero', 'category_hero');

-- ── BLOCK 5 ──────────────────────────────────────────────────
UPDATE banner_placements SET is_active = FALSE WHERE placement_key IN ('home_hot', 'home_top_picks', 'home_featured');

-- ── BLOCK 6 - CHECK IDs ──────────────────────────────────────
SELECT id, name, template_type, is_active FROM banner_templates ORDER BY id;

-- EXAMPLE:
-- +----+-------------------------+---------------+-----------+
-- | id | name                    | template_type | is_active |
-- +----+-------------------------+---------------+-----------+
-- |  1 | Hero Banner Carousel    | hero          |         1 |
-- |  2 | Hot Games Section       | side          |         0 |
-- |  3 | Top Picks Carousel      | side          |         0 |
-- |  4 | Featured Carousel Strip | side          |         0 |
-- |  5 | Promo Banner            | promo         |         1 |
-- |  6 | Multi-Panel Banner      | multi_panel   |         1 |
-- +----+-------------------------+---------------+-----------+

-- ── BLOCK 7 - UPDATE ALLOW TEMPLATES DEPENDING ON THE ABOVE RESULT ON YOUR DB ────────────

UPDATE banner_placements SET allowed_templates = '[1, 5, 6]' WHERE placement_key = 'home_hero';

-- ──

UPDATE banner_placements SET allowed_templates = '[1, 5]' WHERE placement_key IN ('all_games_hero', 'category_hero');

UPDATE banner_placements SET allowed_templates = '[1, 2, 3, 4]' WHERE placement_key = 'game_detail_top';


-- ── VERIFY

SELECT placement_key, allowed_templates, is_active FROM banner_placements ORDER BY is_active DESC;

-- EXAMPLE:
-- +-----------------+-------------------+-----------+
-- | placement_key   | allowed_templates | is_active |
-- +-----------------+-------------------+-----------+
-- | home_hero       | [1, 5, 6]         |         1 |
-- | all_games_hero  | [1, 5]            |         1 |
-- | category_hero   | [1, 5]            |         1 |
-- | game_detail_top | [1, 2, 3, 4]      |         1 |
-- | home_hot        | [2]               |         0 |
-- | home_top_picks  | [3]               |         0 |
-- | home_featured   | [4]               |         0 |
-- +-----------------+-------------------+-----------+



-- ============================================================
-- BANNER SYSTEM MIGRATION — Phase 2
-- Run on: 8jj_games database
-- Run each block one at a time in mysql terminal
-- ============================================================

-- BLOCK 1: Insert split_hero template
INSERT INTO banner_templates (name, template_type, component_name, description, default_config)
VALUES (
  'Split Hero Banner',
  'split_hero',
  'SplitHeroBannerV2',
  '45/55 split layout - dark left panel with headline and CTA, right side full-bleed image. Carousel supported.',
  '{"autoPlay":true,"interval":6500,"showIndicators":true,"showArrows":true,"accentColor":"#00e5ff","leftBg":"#06101e","splitRatio":44,"overlayOpacity":0.42}'
);

-- BLOCK 2: Insert countdown template
INSERT INTO banner_templates (name, template_type, component_name, description, default_config)
VALUES (
  'Countdown Banner',
  'countdown',
  'CountdownBannerV2',
  'Full-width hero with live countdown timer. Set targetDate in slide config JSON. Uses first slide only.',
  '{"accentColor":"#ff6b35","timerLabel":"Offer ends in","expiredText":"This offer has ended","showDays":true,"overlayOpacity":0.62}'
);

-- BLOCK 3: Insert promo_grid template
INSERT INTO banner_templates (name, template_type, component_name, description, default_config)
VALUES (
  'Promo Banner Grid',
  'promo_grid',
  'PromoBannerGridV2',
  '2x2 or 2x3 grid of square promo image cards. Each slide is one card shown simultaneously.',
  '{"columns":3,"rows":2,"gap":14,"borderRadius":16,"cardHeight":180}'
);

-- BLOCK 4: Insert wide_strip template
INSERT INTO banner_templates (name, template_type, component_name, description, default_config)
VALUES (
  'Wide Strip Banner',
  'wide_strip',
  'WideStripBannerV2',
  'Full-width thin strip with scrolling marquee text from all slides plus a CTA button.',
  '{"scrollSpeed":"medium","showMarquee":true,"accentColor":"#ffd700","stripBg":"#0a0f1a","showIcon":true}'
);

-- BLOCK 5: Check all templates
SELECT id, name, template_type, is_active FROM banner_templates ORDER BY id;

SELECT id, name, allowed_templates, is_active FROM banner_templates ORDER BY id;


-- +----+-------------------------+---------------+-----------+
-- | id | name                    | template_type | is_active |
-- +----+-------------------------+---------------+-----------+
-- |  1 | Hero Banner Carousel    | hero          |         1 |
-- |  2 | Hot Games Section       | side          |         0 |
-- |  3 | Top Picks Carousel      | side          |         0 |
-- |  4 | Featured Carousel Strip | side          |         0 |
-- |  5 | Promo Banner            | promo         |         1 |
-- |  6 | Multi-Panel Banner      | multi_panel   |         1 |
-- |  7 | Split Hero Banner       | split_hero    |         1 |
-- |  8 | Countdown Banner        | countdown     |         1 |
-- |  9 | Promo Banner Grid       | promo_grid    |         1 |
-- | 10 | Wide Strip Banner       | wide_strip    |         1 |
-- +----+-------------------------+---------------+-----------+


-- BLOCK 6: Update home_hero to allow new types (adjust IDs from BLOCK 5 output)
-- Replace 1,5,6,7,8,9,10 with actual IDs of: hero, promo, multi_panel, split_hero, countdown, promo_grid, wide_strip
-- UPDATE banner_placements SET allowed_templates = '[1, 5, 6, 7, 8, 9, 10]' WHERE placement_key = 'home_hero';

  UPDATE banner_placements SET allowed_templates = '[1, 5, 6, 7, 8, 9, 10]' WHERE placement_key = 'home_hero';


-- BLOCK 7: Update other placements
-- UPDATE banner_placements SET allowed_templates = '[1, 5, 7, 8]' WHERE placement_key IN ('all_games_hero', 'category_hero');

  UPDATE banner_placements SET allowed_templates = '[1, 5, 7, 8]' WHERE placement_key IN ('all_games_hero', 'category_hero');

SELECT placement_key, allowed_templates, is_active FROM banner_placements ORDER BY is_active DESC;

-- +-----------------+------------------------+-----------+
-- | placement_key   | allowed_templates      | is_active |
-- +-----------------+------------------------+-----------+
-- | home_hero       | [1, 5, 6, 7, 8, 9, 10] |         1 |
-- | all_games_hero  | [1, 5, 7, 8]           |         1 |
-- | category_hero   | [1, 5, 7, 8]           |         1 |
-- | game_detail_top | [1, 2, 3, 4]           |         1 |
-- | home_hot        | [2]                    |         0 |
-- | home_top_picks  | [3]                    |         0 |
-- | home_featured   | [4]                    |         0 |
-- +-----------------+------------------------+-----------+  



-- ============================================================
-- BANNER SYSTEM MIGRATION — Phase 3
-- Run each BLOCK one at a time in mysql terminal
-- ============================================================

-- BLOCK 1: carousel_cards template
INSERT INTO banner_templates (name, template_type, component_name, description, default_config)
VALUES (
  'Carousel Cards Banner',
  'carousel_cards',
  'CarouselCardsBannerV2',
  'Horizontal scrollable row of promo cards with prev/next arrows. Shows N cards at once.',
  '{"visibleCards":3,"cardHeight":220,"gap":16,"borderRadius":18,"accentColor":"#00ff88","showArrows":true}'
);

-- BLOCK 2: video_hero template
INSERT INTO banner_templates (name, template_type, component_name, description, default_config)
VALUES (
  'Video Hero Banner',
  'video_hero',
  'VideoHeroBannerV2',
  'Full-width hero with autoplay looping video. Set videoUrl in slide config. Falls back to image.',
  '{"autoPlay":true,"interval":8000,"showIndicators":true,"showArrows":true,"accentColor":"#00ff88","overlayOpacity":0.45,"height":380}'
);

-- BLOCK 3: floating_announcement template
INSERT INTO banner_templates (name, template_type, component_name, description, default_config)
VALUES (
  'Floating Announcement',
  'floating_announcement',
  'FloatingAnnouncementV2',
  'Fixed floating pill at screen edge. Click to expand into promo card. Dismisses per session.',
  '{"position":"bottom-right","accentColor":"#ff6b35","pillLabel":"New Offer","collapseAfterMs":0}'
);




-- BLOCK 3.5: Extend the ENUM (Required)

ALTER TABLE banner_templates
MODIFY COLUMN template_type ENUM(
  'hero',
  'promo',
  'multi_panel',
  'split_hero',
  'promo_grid',
  'wide_strip',
  'carousel_cards',
  'countdown',
  'video_hero',
  'floating_announcement',
  'announcement_bar',
  'redeem',
  'side',
  'popup'
) NOT NULL COMMENT 'Type of banner component';








-- BLOCK 4: announcement_bar template (mobile-first)
INSERT INTO banner_templates (name, template_type, component_name, description, default_config)
VALUES (
  'Announcement Bar',
  'announcement_bar',
  'MobileAnnouncementBarV2',
  'Thin dismissible bar with scrolling ticker text. Best for site-wide announcements.',
  '{"accentColor":"#ffd700","barBg":"#0a0f1a","scrollSpeed":"20s","showDismiss":true}'
);

-- BLOCK 5: redeem template (mobile-first)
INSERT INTO banner_templates (name, template_type, component_name, description, default_config)
VALUES (
  'Redeem Code Banner',
  'redeem',
  'MobileRedeemBannerV2',
  'Promo card with a copyable promo code. Set promoCode in slide config JSON.',
  '{"accentColor":"#00ff88","overlayOpacity":0.6}'
);

-- BLOCK 6: popup template (mobile-first)
INSERT INTO banner_templates (name, template_type, component_name, description, default_config)
VALUES (
  'Popup Banner',
  'popup',
  'MobilePopupBannerV2',
  'Modal overlay popup that appears after a delay. Dismissed once per session.',
  '{"accentColor":"#ff6b35","showAfterMs":2000,"showOnce":true}'
);

-- BLOCK 7: check all templates
SELECT id, name, template_type, is_active FROM banner_templates ORDER BY id;


-- +----+-------------------------+-----------------------+-----------+
-- | id | name                    | template_type         | is_active |
-- +----+-------------------------+-----------------------+-----------+
-- |  1 | Hero Banner Carousel    | hero                  |         1 |
-- |  2 | Hot Games Section       | side                  |         0 |
-- |  3 | Top Picks Carousel      | side                  |         0 |
-- |  4 | Featured Carousel Strip | side                  |         0 |
-- |  5 | Promo Banner            | promo                 |         1 |
-- |  6 | Multi-Panel Banner      | multi_panel           |         1 |
-- |  7 | Split Hero Banner       | split_hero            |         1 |
-- |  8 | Countdown Banner        | countdown             |         1 |
-- |  9 | Promo Banner Grid       | promo_grid            |         1 |
-- | 10 | Wide Strip Banner       | wide_strip            |         1 |
-- | 11 | Carousel Cards Banner   | carousel_cards        |         1 |
-- | 12 | Video Hero Banner       | video_hero            |         1 |
-- | 13 | Floating Announcement   | floating_announcement |         1 |
-- | 14 | Announcement Bar        | announcement_bar      |         1 |
-- | 15 | Redeem Code Banner      | redeem                |         1 |
-- | 16 | Popup Banner            | popup                 |         1 |
-- +----+-------------------------+-----------------------+-----------+

ALTER TABLE banner_placements
MODIFY COLUMN position ENUM(
  'hero', 
  'sidebar', 
  'header', 
  'footer', 
  'modal', 
  'top', 
  'bottom',
  'section_1', 
  'section_2', 
  'section_3',
  'hot_section',
  'top_picks',
  'featured_carousel',
  'inline',
  'floating',
  'bar'
) NOT NULL COMMENT 'Position on page';


-- Floating Announcement
INSERT INTO banner_placements (name, placement_key, page_route, position, description, max_active_banners, allowed_template_types, allowed_templates)
VALUES ('Floating Announcement', 'global_floating', '/*', 'floating', 'Floating pill that appears at screen edge', 1, '["floating_announcement"]', '[13]')
ON DUPLICATE KEY UPDATE is_active = TRUE, allowed_templates = '[13]';

-- Announcement Bar
INSERT INTO banner_placements (name, placement_key, page_route, position, description, max_active_banners, allowed_template_types, allowed_templates)
VALUES ('Announcement Bar', 'global_bar', '/*', 'bar', 'Thin dismissible bar for announcements', 1, '["announcement_bar"]', '[14]')
ON DUPLICATE KEY UPDATE is_active = TRUE, allowed_templates = '[14]';

-- Popup Banner (can use existing 'modal' position)
INSERT INTO banner_placements (name, placement_key, page_route, position, description, max_active_banners, allowed_template_types, allowed_templates)
VALUES ('Popup Banner', 'global_popup', '/*', 'modal', 'Modal popup that appears after a delay', 1, '["popup"]', '[16]')
ON DUPLICATE KEY UPDATE is_active = TRUE, allowed_templates = '[16]';



-- BLOCK 8: update home_hero to allow all active templates
-- Replace IDs below with what you see in BLOCK 7 output
-- UPDATE banner_placements SET allowed_templates = '[1, 5, 6, 7, 8, 9, 10, 11, 12, 13]' WHERE placement_key = 'home_hero';

UPDATE banner_placements 
SET allowed_templates = '[1,5,6,7,8,9,10,11,12]' 
WHERE placement_key = 'home_hero';



-- BLOCK 9: update other placements
-- UPDATE banner_placements SET allowed_templates = '[1, 5, 7, 8, 11]' WHERE placement_key IN ('all_games_hero', 'category_hero');

UPDATE banner_placements 
SET allowed_templates = '[1,5,7,8,11]' 
WHERE placement_key IN ('all_games_hero', 'category_hero');



-- Verify updates

SELECT id, name, template_type, is_active FROM banner_templates ORDER BY id;

-- +----+-------------------------+-----------------------+-----------+
-- | id | name                    | template_type         | is_active |
-- +----+-------------------------+-----------------------+-----------+
-- |  1 | Hero Banner Carousel    | hero                  |         1 |
-- |  2 | Hot Games Section       | side                  |         0 |
-- |  3 | Top Picks Carousel      | side                  |         0 |
-- |  4 | Featured Carousel Strip | side                  |         0 |
-- |  5 | Promo Banner            | promo                 |         1 |
-- |  6 | Multi-Panel Banner      | multi_panel           |         1 |
-- |  7 | Split Hero Banner       | split_hero            |         1 |
-- |  8 | Countdown Banner        | countdown             |         1 |
-- |  9 | Promo Banner Grid       | promo_grid            |         1 |
-- | 10 | Wide Strip Banner       | wide_strip            |         1 |
-- | 11 | Carousel Cards Banner   | carousel_cards        |         1 |
-- | 12 | Video Hero Banner       | video_hero            |         1 |
-- | 13 | Floating Announcement   | floating_announcement |         1 |
-- | 14 | Announcement Bar        | announcement_bar      |         1 |
-- | 15 | Redeem Code Banner      | redeem                |         1 |
-- | 16 | Popup Banner            | popup                 |         1 |
-- +----+-------------------------+-----------------------+-----------+