-- =====================================================
-- Database: 8jj_games
-- Base Schema (Idempotent)
-- Purpose: Fresh installs (prod / staging)
-- =====================================================

CREATE DATABASE IF NOT EXISTS `8jj_games`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `8jj_games`;

-- =====================================================
-- USERS
-- =====================================================
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,

  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  provider ENUM('local', 'google') DEFAULT 'local',

  is_active BOOLEAN DEFAULT TRUE,
  is_verified BOOLEAN DEFAULT FALSE,
  role ENUM('user', 'admin') DEFAULT 'user',

  about_me TEXT,
  interests JSON,
  avatar VARCHAR(255),
  country VARCHAR(2) DEFAULT 'IN',

  failed_login_attempts INT DEFAULT 0,
  lock_until DATETIME DEFAULT NULL,

  referral_code VARCHAR(12) UNIQUE,
  referred_by INT,
  referral_count INT DEFAULT 0,

  points INT DEFAULT 0,
  level INT DEFAULT 1,
  tier VARCHAR(20) DEFAULT 'Bronze',

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  CONSTRAINT fk_referred_by
    FOREIGN KEY (referred_by)
    REFERENCES users(id)
    ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- AUTH & SECURITY
-- =====================================================
CREATE TABLE IF NOT EXISTS email_verifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  token VARCHAR(255) UNIQUE NOT NULL,
  expires_at DATETIME NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS password_resets (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  token VARCHAR(255) UNIQUE NOT NULL,
  expires_at DATETIME NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- =====================================================
-- USER COLLECTIONS & FAVORITES
-- =====================================================
CREATE TABLE IF NOT EXISTS user_collections (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  game_id VARCHAR(100) NOT NULL,
  game_title VARCHAR(255),
  game_source VARCHAR(50),
  category VARCHAR(100),
  image_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  UNIQUE KEY uniq_user_game (user_id, game_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS user_favorites (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  game_id VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  UNIQUE KEY uniq_fav (user_id, game_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- =====================================================
-- GAMIFICATION
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

CREATE TABLE IF NOT EXISTS user_activity_log (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  activity_type VARCHAR(50) NOT NULL,
  game_id VARCHAR(100),
  metadata JSON,
  points_awarded INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

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

-- =====================================================
-- REDEMPTIONS
-- =====================================================
CREATE TABLE IF NOT EXISTS redeem_codes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(12) UNIQUE NOT NULL,
  points INT DEFAULT 50,
  is_used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  used_at DATETIME
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS user_redemptions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  code_id INT NOT NULL,
  points_added INT DEFAULT 50,
  redeemed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  UNIQUE KEY uniq_user_code (user_id, code_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (code_id) REFERENCES redeem_codes(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- =====================================================
-- Main comments table
-- =====================================================
CREATE TABLE game_comments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  
  -- Content
  game_id VARCHAR(100) NOT NULL,
  user_id INT NOT NULL,
  parent_comment_id INT DEFAULT NULL,
  content TEXT NOT NULL,
  
  -- Metadata
  is_edited BOOLEAN DEFAULT FALSE,
  edited_at TIMESTAMP NULL,
  is_deleted BOOLEAN DEFAULT FALSE,
  is_flagged BOOLEAN DEFAULT FALSE,
  
  -- Engagement
  like_count INT DEFAULT 0,
  reply_count INT DEFAULT 0,
  
  -- Moderation
  is_approved BOOLEAN DEFAULT TRUE,
  moderation_status ENUM('pending', 'approved', 'rejected') DEFAULT 'approved',
  moderator_id INT DEFAULT NULL,
  moderation_note TEXT,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_game_id (game_id),
  INDEX idx_user_id (user_id),
  INDEX idx_parent_comment_id (parent_comment_id),
  INDEX idx_created_at (created_at),
  INDEX idx_game_user (game_id, user_id),
  
  CONSTRAINT fk_comment_user
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE,
    
  CONSTRAINT fk_parent_comment
    FOREIGN KEY (parent_comment_id)
    REFERENCES game_comments(id)
    ON DELETE CASCADE,
    
  CONSTRAINT fk_moderator
    FOREIGN KEY (moderator_id)
    REFERENCES users(id)
    ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- Comment reactions table
-- =====================================================
CREATE TABLE comment_reactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  
  comment_id INT NOT NULL,
  user_id INT NOT NULL,
  reaction_type ENUM('like', 'helpful', 'funny', 'love') NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE KEY unique_user_comment_reaction (user_id, comment_id, reaction_type),
  INDEX idx_comment_id (comment_id),
  INDEX idx_user_id (user_id),
  
  CONSTRAINT fk_reaction_comment
    FOREIGN KEY (comment_id)
    REFERENCES game_comments(id)
    ON DELETE CASCADE,
    
  CONSTRAINT fk_reaction_user
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- Comment reports table
-- =====================================================
CREATE TABLE comment_reports (
  id INT AUTO_INCREMENT PRIMARY KEY,
  
  comment_id INT NOT NULL,
  reported_by INT NOT NULL,
  reason ENUM('spam', 'offensive', 'harassment', 'inappropriate', 'other') NOT NULL,
  description TEXT,
  
  status ENUM('pending', 'reviewed', 'resolved') DEFAULT 'pending',
  reviewed_by INT DEFAULT NULL,
  reviewed_at TIMESTAMP NULL,
  action_taken ENUM('none', 'warned', 'comment_removed', 'user_banned') DEFAULT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_comment_id (comment_id),
  INDEX idx_reported_by (reported_by),
  INDEX idx_status (status),
  
  CONSTRAINT fk_report_comment
    FOREIGN KEY (comment_id)
    REFERENCES game_comments(id)
    ON DELETE CASCADE,
    
  CONSTRAINT fk_report_user
    FOREIGN KEY (reported_by)
    REFERENCES users(id)
    ON DELETE CASCADE,
    
  CONSTRAINT fk_reviewer
    FOREIGN KEY (reviewed_by)
    REFERENCES users(id)
    ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- User mentions in comments
-- =====================================================
CREATE TABLE comment_mentions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  
  comment_id INT NOT NULL,
  mentioned_user_id INT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE KEY unique_comment_mention (comment_id, mentioned_user_id),
  INDEX idx_mentioned_user (mentioned_user_id),
  
  CONSTRAINT fk_mention_comment
    FOREIGN KEY (comment_id)
    REFERENCES game_comments(id)
    ON DELETE CASCADE,
    
  CONSTRAINT fk_mentioned_user
    FOREIGN KEY (mentioned_user_id)
    REFERENCES users(id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- Insert some test data (optional)
-- =====================================================

-- Insert a test comment (replace user_id with a valid user ID from your users table)
-- Uncomment these lines after replacing the user_id:

-- INSERT INTO game_comments (game_id, user_id, content) VALUES
-- ('assault-zone', 1, 'This is a test comment! Great game!'),
-- ('assault-zone', 1, 'Another test comment with some feedback.');

-- =====================================================
-- Verify tables were created
-- =====================================================

SHOW TABLES LIKE '%comment%';

SELECT 'Comment tables created successfully!' as status;


-- =====================================================
-- CHAT SYSTEM
-- =====================================================
CREATE TABLE IF NOT EXISTS chat_channels (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  icon VARCHAR(50),
  color VARCHAR(20),
  is_private BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  display_order INT DEFAULT 0
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS chat_messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  channel_id INT NOT NULL,
  user_id INT NOT NULL,
  content TEXT NOT NULL,
  message_type ENUM('text','image','system','game_link') DEFAULT 'text',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (channel_id) REFERENCES chat_channels(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS message_reactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  message_id INT NOT NULL,
  user_id INT NOT NULL,
  emoji VARCHAR(10) NOT NULL,

  UNIQUE KEY uniq_msg_reaction (user_id, message_id, emoji),
  FOREIGN KEY (message_id) REFERENCES chat_messages(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS user_presence (
  user_id INT PRIMARY KEY,
  status ENUM('online','away','busy','offline') DEFAULT 'offline',
  last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;


-- =====================================================
-- NOTIFICATION SYSTEM
-- =====================================================

-- User Notification Preferences
CREATE TABLE IF NOT EXISTS user_notification_preferences (
  user_id INT PRIMARY KEY,

  game_updates BOOLEAN DEFAULT TRUE,
  new_games BOOLEAN DEFAULT TRUE,
  level_up BOOLEAN DEFAULT TRUE,
  achievements BOOLEAN DEFAULT TRUE,
  community_events BOOLEAN DEFAULT FALSE,
  maintenance_alerts BOOLEAN DEFAULT TRUE,
  promotional_offers BOOLEAN DEFAULT FALSE,
  tournament_announcements BOOLEAN DEFAULT TRUE,
  weekly_digest BOOLEAN DEFAULT TRUE,
  friend_activity BOOLEAN DEFAULT TRUE,
  game_recommendations BOOLEAN DEFAULT TRUE,

  email_notifications BOOLEAN DEFAULT FALSE,
  push_notifications BOOLEAN DEFAULT TRUE,
  notification_sound BOOLEAN DEFAULT TRUE,

  quiet_hours_start TIME DEFAULT '22:00:00',
  quiet_hours_end TIME DEFAULT '08:00:00',
  digest_frequency ENUM('daily','weekly','never') DEFAULT 'weekly',

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE
) ENGINE=InnoDB;

-- Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,

  type ENUM(
    'system',
    'achievement',
    'game_update',
    'new_game',
    'level_up',
    'community_event',
    'friend_request',
    'admin_announcement',
    'maintenance_alert',
    'promotional_offer',
    'tournament_announcement',
    'weekly_digest',
    'friend_activity',
    'game_recommendation'
  ) NOT NULL,

  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  metadata JSON,
  image_url VARCHAR(500),

  action_url VARCHAR(500),
  action_text VARCHAR(100),

  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP NULL,
  priority ENUM('low','normal','high','urgent') DEFAULT 'normal',

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE
) ENGINE=InnoDB;

-- Notification Templates
CREATE TABLE IF NOT EXISTS notification_templates (
  id INT AUTO_INCREMENT PRIMARY KEY,

  name VARCHAR(100) UNIQUE NOT NULL,
  type ENUM(
    'system',
    'achievement',
    'game_update',
    'new_game',
    'level_up',
    'community_event',
    'admin_announcement',
    'maintenance_alert',
    'promotional_offer',
    'tournament_announcement',
    'weekly_digest',
    'game_recommendation'
  ) NOT NULL,

  category ENUM('info','warning','success','error','promotional') DEFAULT 'info',
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  image_url VARCHAR(500),
  variables JSON,

  is_active BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,
  usage_count INT DEFAULT 0,

  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (created_by)
    REFERENCES users(id)
    ON DELETE SET NULL
) ENGINE=InnoDB;

-- Notification Campaigns
CREATE TABLE IF NOT EXISTS notification_campaigns (
  id INT AUTO_INCREMENT PRIMARY KEY,

  name VARCHAR(255) NOT NULL,
  template_id INT,

  target_type ENUM(
    'all_users',
    'active_users',
    'verified_users',
    'specific_users',
    'role'
  ) NOT NULL,

  target_criteria JSON,

  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  action_url VARCHAR(500),
  action_text VARCHAR(100),

  priority ENUM('low','normal','high','urgent') DEFAULT 'normal',

  status ENUM('draft','scheduled','sending','completed','failed') DEFAULT 'draft',
  scheduled_at TIMESTAMP NULL,
  created_by INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (template_id)
    REFERENCES notification_templates(id)
    ON DELETE SET NULL,

  FOREIGN KEY (created_by)
    REFERENCES users(id)
    ON DELETE CASCADE
) ENGINE=InnoDB;

-- Notification Queue
CREATE TABLE IF NOT EXISTS notification_queue (
  id INT AUTO_INCREMENT PRIMARY KEY,

  campaign_id INT,
  target_user_ids JSON NOT NULL,

  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  priority ENUM('low','normal','high','urgent') DEFAULT 'normal',

  scheduled_for TIMESTAMP NOT NULL,
  status ENUM('pending','processing','completed','failed') DEFAULT 'pending',

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (campaign_id)
    REFERENCES notification_campaigns(id)
    ON DELETE CASCADE
) ENGINE=InnoDB;

-- Notification Analytics
CREATE TABLE IF NOT EXISTS notification_analytics (
  id INT AUTO_INCREMENT PRIMARY KEY,

  notification_id INT NOT NULL,
  campaign_id INT,
  user_id INT NOT NULL,

  delivered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  opened_at TIMESTAMP NULL,
  clicked_at TIMESTAMP NULL,

  FOREIGN KEY (notification_id)
    REFERENCES notifications(id)
    ON DELETE CASCADE,

  FOREIGN KEY (campaign_id)
    REFERENCES notification_campaigns(id)
    ON DELETE SET NULL,

  FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE
) ENGINE=InnoDB;


-- =====================================================
-- END OF BASE SCHEMA
-- =====================================================
