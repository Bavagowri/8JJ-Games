-- =====================================================
-- LEVELS TABLE (Gamification levels)
-- =====================================================
CREATE TABLE IF NOT EXISTS levels (
  id INT AUTO_INCREMENT PRIMARY KEY,
  level_number INT UNIQUE NOT NULL,
  level_name VARCHAR(50) NOT NULL,
  min_points INT NOT NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS tiers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tier_name VARCHAR(50) NOT NULL,
  min_level INT NOT NULL,
  badge_icon VARCHAR(255)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS user_points (
  user_id INT PRIMARY KEY,
  total_points INT DEFAULT 0,
  current_level INT DEFAULT 1,
  current_tier VARCHAR(50),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE points_rules (
  id INT PRIMARY KEY AUTO_INCREMENT,
  activity_type VARCHAR(100) UNIQUE NOT NULL,

  points INT NULL,
  min_points INT NULL,
  max_points INT NULL,

  is_active BOOLEAN DEFAULT TRUE,

  daily_limit INT DEFAULT NULL,
  cooldown_minutes INT DEFAULT NULL,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE points_transactions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  activity_type VARCHAR(100),
  activity_id INT NULL,

  points INT NOT NULL,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  INDEX(user_id),
  INDEX(activity_type)
);

ALTER TABLE points_transactions
ADD COLUMN activity_date DATE GENERATED ALWAYS AS (DATE(created_at)) STORED;

ALTER TABLE points_transactions
ADD UNIQUE KEY unique_daily_login 
(user_id, activity_type, activity_date);

ALTER TABLE points_transactions
DROP INDEX unique_daily_login;

ALTER TABLE points_transactions
ADD COLUMN daily_login_date DATE 
GENERATED ALWAYS AS (
  CASE 
    WHEN activity_type = 'daily_login' 
    THEN DATE(created_at) 
    ELSE NULL 
  END
) STORED;

CREATE UNIQUE INDEX unique_daily_login
ON points_transactions (user_id, daily_login_date);

ALTER TABLE points_transactions
ADD COLUMN note VARCHAR(255) NULL;

-- 2nd march 2026
  ALTER TABLE points_transactions
  ADD COLUMN metadata JSON NULL,
  ADD COLUMN metadata_hash VARCHAR(64) NULL;


-- Use a daily unique key only for daily_login using a generated column
ALTER TABLE points_transactions
  ADD UNIQUE KEY uniq_share_daily 
  (user_id, activity_type, activity_date, metadata_hash);
  
  ALTER TABLE points_transactions
  DROP INDEX unique_daily_login;

  ALTER TABLE points_transactions
    ADD COLUMN daily_login_key VARCHAR(128)
      GENERATED ALWAYS AS (
        CASE 
          WHEN activity_type = 'daily_login'
          THEN CONCAT(user_id,'-',activity_date)
          ELSE NULL
        END
      ) STORED,
    ADD UNIQUE KEY uniq_daily_login (daily_login_key);

-- Share “same thing once per day” rule
ALTER TABLE points_transactions
  ADD UNIQUE KEY uniq_share_daily (user_id, activity_type, activity_date, metadata_hash);

INSERT INTO points_rules
(activity_type, points, daily_limit, cooldown_minutes, is_active)
VALUES
('game_share', 10, 5, 0, TRUE);

INSERT INTO points_rules
(activity_type, points, daily_limit, cooldown_minutes, is_active)
VALUES
('platform_share', 20, 3, 0, TRUE);


UPDATE points_rules
SET points = NULL,
    min_points = 5,
    max_points = 50
WHERE activity_type = 'play_game';

INSERT INTO points_rules
(activity_type, min_points, max_points, daily_limit, is_active)
VALUES
('random_game_reward', 5, 50, 10, TRUE);

INSERT INTO points_rules
(activity_type, points, daily_limit, is_active)
VALUES
('share_platform', 20, 4, 1);



-- 3/3 
CREATE TABLE share_links (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  game_id VARCHAR(255),
  code VARCHAR(20) UNIQUE,
  clicks INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE share_clicks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  share_id INT,
  ip_address VARCHAR(50),
  clicked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uniq_share_ip (share_id, ip_address)
);

ALTER TABLE share_links
ADD COLUMN platform VARCHAR(20);

INSERT INTO points_rules (activity_type, min_points, max_points, is_active)
VALUES ('whatsapp_share_click', 5, 20, TRUE);

ALTER TABLE points_transactions
ADD UNIQUE KEY uniq_prediction_reward (activity_type, activity_id);



INSERT INTO points_rules 
(id, activity_type, points, min_points, max_points, is_active, daily_limit, cooldown_minutes, created_at, updated_at)
VALUES
(1, 'daily_login', 10, NULL, NULL, 1, NULL, NULL, '2026-02-13 16:46:17', '2026-02-15 11:58:26'),
(3, 'finish_game', 10, NULL, NULL, 1, NULL, NULL, '2026-02-13 16:46:17', '2026-02-13 16:46:17'),
(4, 'win_game', 25, NULL, NULL, 1, NULL, NULL, '2026-02-13 16:46:17', '2026-02-13 16:46:17'),
(5, 'referral_signup', 100, NULL, NULL, 1, NULL, NULL, '2026-02-13 16:46:17', '2026-02-13 16:46:17'),
(6, 'referral_first_play', 50, NULL, NULL, 1, NULL, NULL, '2026-02-13 16:46:17', '2026-02-13 16:46:17'),
(7, 'achievement_unlocked', NULL, 40, 500, 1, NULL, NULL, '2026-02-13 16:46:17', '2026-02-15 11:17:50'),
(8, 'test rule', 100, NULL, NULL, 1, 10, 10, '2026-02-15 11:26:37', '2026-02-15 11:26:50'),
(9, 'random_game_reward', NULL, 5, 50, 1, 10, 0, '2026-03-02 13:56:57', '2026-03-02 13:56:57'),
(10, 'game_share', 10, NULL, NULL, 1, 5, 0, '2026-03-02 14:04:22', '2026-03-02 14:04:22'),
(11, 'platform_share', 20, NULL, NULL, 1, 3, 0, '2026-03-02 14:04:57', '2026-03-02 14:04:57'),
(13, 'share_platform', 20, NULL, NULL, 1, 4, NULL, '2026-03-03 10:49:18', '2026-03-03 10:49:18'),
(14, 'whatsapp_share_click', NULL, 5, 20, 1, NULL, NULL, '2026-03-03 17:51:09', '2026-03-03 17:51:09');

INSERT INTO points_rules (activity_type, points, daily_limit, is_active)
VALUES
('whatsapp_share', 5, 10, 1);


INSERT INTO points_rules (activity_type, points, daily_limit, is_active)
VALUES ('telegram_share', 5, 10, 1);

INSERT INTO points_rules (activity_type, points, daily_limit, is_active)
VALUES ('telegram_share_click', 3, 50, 1);


INSERT INTO points_rules (activity_type, points, daily_limit, is_active)
VALUES ('facebook_share', 5, 10, 1);

INSERT INTO points_rules (activity_type, points, daily_limit, is_active)
VALUES ('facebook_share_click', 3, 50, 1);

INSERT INTO points_rules (activity_type, points, daily_limit, is_active)
VALUES ('x_share', 5, 10, 1);

INSERT INTO points_rules (activity_type, points, daily_limit, is_active)
VALUES ('x_share_click', 3, 50, 1);


CREATE TABLE points_transactions (
    id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    activity_type VARCHAR(100),
    activity_id INT,
    points INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    activity_date DATE GENERATED ALWAYS AS (DATE(created_at)) STORED,
    daily_login_date DATE GENERATED ALWAYS AS (DATE(created_at)) STORED,
    note VARCHAR(255),
    daily_login_key VARCHAR(128) GENERATED ALWAYS AS (
        CONCAT(user_id, '-', DATE(created_at))
    ) STORED,
    metadata JSON,
    metadata_hash VARCHAR(64),
    
    PRIMARY KEY (id),
    INDEX idx_user_id (user_id),
    INDEX idx_activity_type (activity_type),
    INDEX idx_activity_id (activity_id),
    UNIQUE KEY uniq_daily_login_key (daily_login_key)
);

