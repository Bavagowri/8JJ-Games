
-- =====================================================
-- Database: 8jj_games
-- Schema version: v2.0 (Complete & Production-Ready)
-- Last updated: 2026-01-22
-- Description: Complete schema reflecting actual database structure
-- =====================================================

-- Create database (safe)
CREATE DATABASE IF NOT EXISTS `8jj_games`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `8jj_games`;

-- =====================================================
-- USERS TABLE (Core Authentication & Profile)
-- =====================================================
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  
  -- Authentication
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  provider ENUM('local', 'google') DEFAULT 'local',
  
  -- Account Status
  is_active BOOLEAN DEFAULT TRUE,
  is_verified BOOLEAN DEFAULT FALSE,
  role ENUM('user', 'admin') DEFAULT 'user',
  
  -- Profile Information
  about_me TEXT,
  interests JSON,
  avatar VARCHAR(255),
  
  -- Security
  failed_login_attempts INT DEFAULT 0,
  lock_until DATETIME DEFAULT NULL,
  
  -- Referral System (Integrated into users table)
  referral_code VARCHAR(12) UNIQUE,
  referred_by INT,
  referral_count INT DEFAULT 0,
  
  -- Gamification (Denormalized for performance)
  points INT DEFAULT 0,
  level INT DEFAULT 1,
  tier VARCHAR(20) DEFAULT 'Bronze',
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Foreign Keys
  CONSTRAINT fk_referred_by
    FOREIGN KEY (referred_by)
    REFERENCES users(id)
    ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- EMAIL VERIFICATION TOKENS
-- =====================================================
CREATE TABLE IF NOT EXISTS email_verifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  token VARCHAR(255) NOT NULL UNIQUE,
  expires_at DATETIME NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_user_id (user_id),
  INDEX idx_token (token),
  INDEX idx_expires_at (expires_at),
  
  CONSTRAINT fk_email_verifications_user
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- PASSWORD RESET TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS password_resets (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  token VARCHAR(255) NOT NULL UNIQUE,
  expires_at DATETIME NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_user_id (user_id),
  INDEX idx_token (token),
  INDEX idx_expires_at (expires_at),
  
  CONSTRAINT fk_password_reset_user
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- USER COLLECTIONS (Games saved to "My Collection")
-- =====================================================
CREATE TABLE IF NOT EXISTS user_collections (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  game_id VARCHAR(100) NOT NULL,
  game_title VARCHAR(255),
  game_source VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE KEY unique_user_game (user_id, game_id),
  INDEX idx_game_source (game_source),
  
  CONSTRAINT fk_collection_user
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- USER FAVORITES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS user_favorites (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  game_id VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE KEY uniq_user_game (user_id, game_id),
  INDEX idx_user_id (user_id),
  INDEX idx_game_id (game_id),
  
  CONSTRAINT fk_user_favorites_user
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- REFERRALS TABLE (Tracking referral relationships)
-- =====================================================
CREATE TABLE IF NOT EXISTS referrals (
  id INT AUTO_INCREMENT PRIMARY KEY,
  referrer_id INT NOT NULL,
  referred_user_id INT,
  referral_code VARCHAR(50) NOT NULL,
  reward_given BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_referrer_id (referrer_id),
  INDEX idx_referral_code (referral_code),
  
  CONSTRAINT fk_referrals_referrer
    FOREIGN KEY (referrer_id)
    REFERENCES users(id)
    ON DELETE CASCADE,
    
  CONSTRAINT fk_referrals_referred
    FOREIGN KEY (referred_user_id)
    REFERENCES users(id)
    ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- LEVELS TABLE (Gamification levels)
-- =====================================================
CREATE TABLE IF NOT EXISTS levels (
  id INT AUTO_INCREMENT PRIMARY KEY,
  level_number INT NOT NULL UNIQUE,
  level_name VARCHAR(50) NOT NULL,
  min_points INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_level_number (level_number),
  INDEX idx_min_points (min_points)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TIERS TABLE (Gamification tiers)
-- =====================================================
CREATE TABLE IF NOT EXISTS tiers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tier_name VARCHAR(50) NOT NULL,
  min_level INT NOT NULL,
  badge_icon VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_tier_name (tier_name),
  INDEX idx_min_level (min_level)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- USER POINTS TABLE (Separate tracking table)
-- =====================================================
CREATE TABLE IF NOT EXISTS user_points (
  user_id INT PRIMARY KEY,
  total_points INT DEFAULT 0,
  current_level INT DEFAULT 1,
  current_tier VARCHAR(50),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_total_points (total_points),
  INDEX idx_current_level (current_level),
  
  CONSTRAINT fk_user_points_user
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- USER ACTIVITY LOG TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS user_activity_log (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  activity_type VARCHAR(50) NOT NULL,
  game_id VARCHAR(100),
  metadata JSON,
  points_awarded INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_user_id (user_id),
  INDEX idx_activity_type (activity_type),
  INDEX idx_created_at (created_at),
  
  CONSTRAINT fk_user_activity_log_user
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- REDEMPTION CODES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS redeem_codes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(12) UNIQUE NOT NULL,
  points INT DEFAULT 50,
  is_used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  used_at DATETIME DEFAULT NULL,
  
  INDEX idx_code (code),
  INDEX idx_is_used (is_used)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- USER REDEMPTIONS TABLE (History & Tracking)
-- =====================================================
CREATE TABLE IF NOT EXISTS user_redemptions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  code_id INT NOT NULL,
  points_added INT DEFAULT 50,
  redeemed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE KEY uniq_user_code (user_id, code_id),
  INDEX idx_user_id (user_id),
  INDEX idx_code_id (code_id),
  
  CONSTRAINT fk_user_redemptions_user
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE,
    
  CONSTRAINT fk_user_redemptions_code
    FOREIGN KEY (code_id)
    REFERENCES redeem_codes(id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- NOTIFICATION SYSTEM
-- =====================================================

-- User Notification Preferences
CREATE TABLE IF NOT EXISTS user_notification_preferences ( 
  user_id INT PRIMARY KEY,
  
  -- Notification Categories
  game_updates BOOLEAN DEFAULT TRUE COMMENT 'Game updates and patches',
  new_games BOOLEAN DEFAULT TRUE COMMENT 'New game releases',
  level_up BOOLEAN DEFAULT TRUE COMMENT 'Level up notifications',
  achievements BOOLEAN DEFAULT TRUE COMMENT 'Achievement unlocks',
  community_events BOOLEAN DEFAULT FALSE COMMENT 'Events and tournaments',
  maintenance_alerts BOOLEAN DEFAULT TRUE,
  promotional_offers BOOLEAN DEFAULT FALSE,
  tournament_announcements BOOLEAN DEFAULT TRUE,
  weekly_digest BOOLEAN DEFAULT TRUE,
  friend_activity BOOLEAN DEFAULT TRUE,
  game_recommendations BOOLEAN DEFAULT TRUE,
  
  -- Delivery Preferences
  email_notifications BOOLEAN DEFAULT FALSE COMMENT 'Send email notifications',
  push_notifications BOOLEAN DEFAULT TRUE,
  notification_sound BOOLEAN DEFAULT TRUE,
  
  -- Quiet Hours
  quiet_hours_start TIME DEFAULT '22:00:00',
  quiet_hours_end TIME DEFAULT '08:00:00',
  digest_frequency ENUM('daily', 'weekly', 'never') DEFAULT 'weekly',
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  CONSTRAINT fk_notif_prefs_user
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  
  -- Notification Content
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
  
  title VARCHAR(255) NOT NULL COMMENT 'Notification title',
  message TEXT NOT NULL COMMENT 'Notification message body',
  metadata JSON COMMENT 'Additional data (game_id, achievement_id, etc)',
  image_url VARCHAR(500),
  
  -- Action
  action_url VARCHAR(500) COMMENT 'URL to navigate to when clicked',
  action_text VARCHAR(100) COMMENT 'Button text for action',
  
  -- Status
  is_read BOOLEAN DEFAULT FALSE COMMENT 'Has user read this notification',
  read_at TIMESTAMP NULL COMMENT 'When notification was read',
  priority ENUM('low', 'normal', 'high', 'urgent') DEFAULT 'normal',
  
  -- Scheduling & Delivery
  scheduled_for TIMESTAMP NULL,
  status ENUM('draft', 'scheduled', 'sent', 'failed') DEFAULT 'sent',
  delivery_attempts INT DEFAULT 0,
  last_delivery_attempt TIMESTAMP NULL,
  
  -- Analytics
  click_count INT DEFAULT 0,
  
  -- Expiration
  expires_at TIMESTAMP NULL COMMENT 'When notification expires (optional)',
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_user_id (user_id),
  INDEX idx_is_read (is_read),
  INDEX idx_created_at (created_at),
  INDEX idx_type (type),
  INDEX idx_user_unread (user_id, is_read, created_at),
  INDEX idx_expires_at (expires_at),
  INDEX idx_notifications_user_status (user_id, status),
  INDEX idx_notifications_type_created (type, created_at),
  INDEX idx_notifications_scheduled (scheduled_for),
  
  CONSTRAINT fk_notification_user
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Notification Templates
CREATE TABLE IF NOT EXISTS notification_templates (
  id INT AUTO_INCREMENT PRIMARY KEY,
  
  name VARCHAR(100) NOT NULL UNIQUE COMMENT 'Template identifier',
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
  category ENUM('info', 'warning', 'success', 'error', 'promotional') DEFAULT 'info',
  
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  image_url VARCHAR(500),
  variables JSON COMMENT 'Array of variable names used in template',
  
  is_active BOOLEAN DEFAULT TRUE COMMENT 'Is template currently active',
  is_featured BOOLEAN DEFAULT FALSE,
  usage_count INT DEFAULT 0,
  
  created_by INT COMMENT 'Admin user who created template',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_name (name),
  INDEX idx_is_active (is_active),
  INDEX idx_templates_category (category),
  INDEX idx_templates_featured (is_featured),
  
  CONSTRAINT fk_template_creator
    FOREIGN KEY (created_by)
    REFERENCES users(id)
    ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Notification Categories
CREATE TABLE IF NOT EXISTS notification_categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  icon VARCHAR(10),
  color VARCHAR(20),
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Notification Presets (Quick send templates)
CREATE TABLE IF NOT EXISTS notification_presets (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  priority ENUM('low', 'normal', 'high', 'urgent') DEFAULT 'normal',
  image_url VARCHAR(500),
  usage_count INT DEFAULT 0,
  last_used_at TIMESTAMP NULL,
  created_by INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  CONSTRAINT fk_preset_creator
    FOREIGN KEY (created_by)
    REFERENCES users(id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Notification Campaigns (Mass notifications)
CREATE TABLE IF NOT EXISTS notification_campaigns (
  id INT AUTO_INCREMENT PRIMARY KEY,
  
  name VARCHAR(255) NOT NULL COMMENT 'Campaign name',
  template_id INT COMMENT 'Optional template reference',
  
  -- Targeting
  target_type ENUM('all_users', 'active_users', 'verified_users', 'specific_users', 'role') NOT NULL,
  segment_type ENUM('all', 'active', 'inactive', 'new', 'returning', 'high_engagement', 'custom') DEFAULT 'all',
  target_criteria JSON COMMENT 'Specific user IDs or role',
  
  -- Content
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  action_url VARCHAR(500),
  action_text VARCHAR(100),
  priority ENUM('low', 'normal', 'high', 'urgent') DEFAULT 'normal',
  image_url VARCHAR(500),
  
  -- A/B Testing
  ab_test_enabled BOOLEAN DEFAULT FALSE,
  variant_a_title VARCHAR(255),
  variant_a_message TEXT,
  variant_b_title VARCHAR(255),
  variant_b_message TEXT,
  variant_a_count INT DEFAULT 0,
  variant_b_count INT DEFAULT 0,
  
  -- Scheduling
  status ENUM('draft', 'scheduled', 'sending', 'completed', 'failed') DEFAULT 'draft',
  scheduled_at TIMESTAMP NULL COMMENT 'When to send (NULL = send now)',
  started_at TIMESTAMP NULL COMMENT 'When sending started',
  completed_at TIMESTAMP NULL COMMENT 'When sending completed',
  
  -- Stats
  total_recipients INT DEFAULT 0 COMMENT 'Total users targeted',
  sent_count INT DEFAULT 0 COMMENT 'Successfully sent',
  failed_count INT DEFAULT 0 COMMENT 'Failed to send',
  open_rate DECIMAL(5, 2) DEFAULT 0.00,
  click_rate DECIMAL(5, 2) DEFAULT 0.00,
  
  created_by INT NOT NULL COMMENT 'Admin who created campaign',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_status (status),
  INDEX idx_created_by (created_by),
  INDEX idx_campaigns_status (status),
  
  CONSTRAINT fk_campaign_creator
    FOREIGN KEY (created_by)
    REFERENCES users(id)
    ON DELETE CASCADE,
    
  CONSTRAINT fk_campaign_template
    FOREIGN KEY (template_id)
    REFERENCES notification_templates(id)
    ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Notification Queue (For scheduled/batch processing)
CREATE TABLE IF NOT EXISTS notification_queue (
  id INT AUTO_INCREMENT PRIMARY KEY,
  template_id INT,
  campaign_id INT,
  target_user_ids JSON NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) NOT NULL,
  metadata JSON,
  image_url VARCHAR(500),
  action_url VARCHAR(500),
  action_text VARCHAR(100),
  priority ENUM('low', 'normal', 'high', 'urgent') DEFAULT 'normal',
  scheduled_for TIMESTAMP NOT NULL,
  status ENUM('pending', 'processing', 'completed', 'failed') DEFAULT 'pending',
  processed_at TIMESTAMP NULL,
  processed_count INT DEFAULT 0,
  failed_count INT DEFAULT 0,
  error_message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_scheduled_for (scheduled_for),
  INDEX idx_status (status),
  INDEX idx_campaign_id (campaign_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Notification Analytics
CREATE TABLE IF NOT EXISTS notification_analytics (
  id INT AUTO_INCREMENT PRIMARY KEY,
  notification_id INT NOT NULL,
  campaign_id INT,
  delivered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  opened_at TIMESTAMP NULL,
  clicked_at TIMESTAMP NULL,
  dismissed_at TIMESTAMP NULL,
  user_id INT NOT NULL,
  device_type VARCHAR(50),
  browser VARCHAR(100),
  time_to_open INT COMMENT 'Seconds from delivery to open',
  time_spent INT COMMENT 'Seconds spent viewing',
  
  INDEX idx_notification_id (notification_id),
  INDEX idx_campaign_id (campaign_id),
  INDEX idx_user_id (user_id),
  INDEX idx_delivered_at (delivered_at),
  
  CONSTRAINT fk_analytics_notification
    FOREIGN KEY (notification_id)
    REFERENCES notifications(id)
    ON DELETE CASCADE,
    
  CONSTRAINT fk_analytics_campaign
    FOREIGN KEY (campaign_id)
    REFERENCES notification_campaigns(id)
    ON DELETE SET NULL,
    
  CONSTRAINT fk_analytics_user
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- INITIAL DATA SETUP
-- =====================================================

-- Insert default notification preferences for existing users
INSERT IGNORE INTO user_notification_preferences (user_id)
SELECT id FROM users
WHERE id NOT IN (SELECT user_id FROM user_notification_preferences);

-- Sample Levels Data
INSERT IGNORE INTO levels (level_number, level_name, min_points) VALUES
(1, 'Novice', 0),
(2, 'Beginner', 100),
(3, 'Intermediate', 300),
(4, 'Advanced', 600),
(5, 'Expert', 1000),
(6, 'Master', 1500),
(7, 'Grand Master', 2500),
(8, 'Legend', 4000),
(9, 'Champion', 6000),
(10, 'Ultimate', 10000);

-- Sample Tiers Data
INSERT IGNORE INTO tiers (tier_name, min_level, badge_icon) VALUES
('Bronze', 1, '🥉'),
('Silver', 3, '🥈'),
('Gold', 5, '🥇'),
('Platinum', 7, '💎'),
('Diamond', 9, '💠');

-- Sample Notification Categories
INSERT IGNORE INTO notification_categories (name, icon, color, description, display_order) VALUES
('System', '⚙️', 'blue', 'System notifications and updates', 1),
('Gaming', '🎮', 'purple', 'Game-related notifications', 2),
('Social', '👥', 'green', 'Social and community notifications', 3),
('Achievements', '🏆', 'gold', 'Achievement and milestone notifications', 4),
('Promotional', '🎁', 'orange', 'Promotional offers and deals', 5);

-- =====================================================
-- VIEWS (Optional - for easier querying)
-- =====================================================

-- User Stats View
CREATE OR REPLACE VIEW user_stats AS
SELECT 
  u.id,
  u.username,
  u.email,
  u.level,
  u.tier,
  u.points,
  u.referral_count,
  COUNT(DISTINCT uc.id) as total_collections,
  COUNT(DISTINCT uf.id) as total_favorites,
  COUNT(DISTINCT ua.id) as total_activities
FROM users u
LEFT JOIN user_collections uc ON u.id = uc.user_id
LEFT JOIN user_favorites uf ON u.id = uf.user_id
LEFT JOIN user_activity_log ua ON u.id = ua.user_id
GROUP BY u.id;

-- Notification Stats View
CREATE OR REPLACE VIEW notification_stats AS
SELECT 
  user_id,
  COUNT(*) as total_notifications,
  SUM(CASE WHEN is_read = 1 THEN 1 ELSE 0 END) as read_count,
  SUM(CASE WHEN is_read = 0 THEN 1 ELSE 0 END) as unread_count,
  MAX(created_at) as last_notification_at
FROM notifications
GROUP BY user_id;

-- =====================================================
-- END OF SCHEMA
-- =====================================================


-- =====================================================
-- START OF collections
-- =====================================================


-- First, check your current table structure
DESCRIBE user_collections;

-- Add the new columns (if they don't exist)
ALTER TABLE user_collections 
ADD COLUMN category VARCHAR(100) DEFAULT NULL AFTER game_source,
ADD COLUMN image_url TEXT DEFAULT NULL AFTER category;

-- Verify the changes
DESCRIBE user_collections;

-- =====================================================
-- END OF collections
-- =====================================================


-- =====================================================
-- GAME COMMENTS SYSTEM - START
-- =====================================================

-- Main comments table
CREATE TABLE IF NOT EXISTS game_comments (
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

-- Comment reactions table
CREATE TABLE IF NOT EXISTS comment_reactions (
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

-- Comment reports table
CREATE TABLE IF NOT EXISTS comment_reports (
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

-- User mentions in comments
CREATE TABLE IF NOT EXISTS comment_mentions (
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
-- GAME COMMENTS SYSTEM - END
-- =====================================================


-- =====================================================
-- COMMUNITY CHAT SYSTEM - START
-- =====================================================

-- Chat channels
CREATE TABLE IF NOT EXISTS chat_channels (
  id INT AUTO_INCREMENT PRIMARY KEY,
  
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  icon VARCHAR(50),
  color VARCHAR(20),
  
  -- Permissions
  is_private BOOLEAN DEFAULT FALSE,
  allowed_roles JSON, -- ['admin', 'moderator'] etc
  
  -- Settings
  is_active BOOLEAN DEFAULT TRUE,
  display_order INT DEFAULT 0,
  message_rate_limit INT DEFAULT 5, -- messages per minute
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Chat messages
CREATE TABLE IF NOT EXISTS chat_messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  
  channel_id INT NOT NULL,
  user_id INT NOT NULL,
  
  -- Content
  content TEXT NOT NULL,
  message_type ENUM('text', 'image', 'system', 'game_link') DEFAULT 'text',
  
  -- Media
  image_url VARCHAR(500),
  
  -- References
  reply_to_message_id INT DEFAULT NULL,
  
  -- Metadata
  is_edited BOOLEAN DEFAULT FALSE,
  edited_at TIMESTAMP NULL,
  is_deleted BOOLEAN DEFAULT FALSE,
  is_pinned BOOLEAN DEFAULT FALSE,
  
  -- Engagement
  reaction_count INT DEFAULT 0,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_channel_created (channel_id, created_at),
  INDEX idx_user_id (user_id),
  INDEX idx_reply_to (reply_to_message_id),
  
  CONSTRAINT fk_message_channel
    FOREIGN KEY (channel_id)
    REFERENCES chat_channels(id)
    ON DELETE CASCADE,
    
  CONSTRAINT fk_message_user
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE,
    
  CONSTRAINT fk_reply_message
    FOREIGN KEY (reply_to_message_id)
    REFERENCES chat_messages(id)
    ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Message reactions
CREATE TABLE IF NOT EXISTS message_reactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  
  message_id INT NOT NULL,
  user_id INT NOT NULL,
  emoji VARCHAR(10) NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE KEY unique_user_message_emoji (user_id, message_id, emoji),
  INDEX idx_message_id (message_id),
  
  CONSTRAINT fk_msg_reaction_message
    FOREIGN KEY (message_id)
    REFERENCES chat_messages(id)
    ON DELETE CASCADE,
    
  CONSTRAINT fk_msg_reaction_user
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- User presence (online/offline status)
CREATE TABLE IF NOT EXISTS user_presence (
  user_id INT PRIMARY KEY,
  
  status ENUM('online', 'away', 'busy', 'offline') DEFAULT 'offline',
  last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  current_channel_id INT DEFAULT NULL,
  socket_id VARCHAR(100),
  
  CONSTRAINT fk_presence_user
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE,
    
  CONSTRAINT fk_presence_channel
    FOREIGN KEY (current_channel_id)
    REFERENCES chat_channels(id)
    ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- User blocks/mutes
CREATE TABLE IF NOT EXISTS user_blocks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  
  blocker_id INT NOT NULL,
  blocked_id INT NOT NULL,
  block_type ENUM('block', 'mute') NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE KEY unique_block (blocker_id, blocked_id),
  INDEX idx_blocker (blocker_id),
  
  CONSTRAINT fk_blocker
    FOREIGN KEY (blocker_id)
    REFERENCES users(id)
    ON DELETE CASCADE,
    
  CONSTRAINT fk_blocked
    FOREIGN KEY (blocked_id)
    REFERENCES users(id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Typing indicators (temporary, can be memory-based)
CREATE TABLE IF NOT EXISTS typing_indicators (
  id INT AUTO_INCREMENT PRIMARY KEY,
  
  channel_id INT NOT NULL,
  user_id INT NOT NULL,
  
  expires_at TIMESTAMP NOT NULL,
  
  UNIQUE KEY unique_channel_user (channel_id, user_id),
  INDEX idx_expires (expires_at),
  
  CONSTRAINT fk_typing_channel
    FOREIGN KEY (channel_id)
    REFERENCES chat_channels(id)
    ON DELETE CASCADE,
    
  CONSTRAINT fk_typing_user
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default channels
INSERT INTO chat_channels (name, description, icon, color, display_order) VALUES
('general', 'General discussion about games', '💬', '#5865F2', 1),
('gaming-tips', 'Share tips and strategies', '🎯', '#57F287', 2),
('game-requests', 'Request new games', '🎮', '#FEE75C', 3),
('off-topic', 'Anything goes!', '🌟', '#EB459E', 4);


-- =====================================================
-- COMMUNITY CHAT SYSTEM - END
-- =====================================================




------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------------------



-- =====================================================
-- GAME COMMENTS SYSTEM - SETUP SCRIPT
-- Run this SQL script in your MySQL database
-- =====================================================

USE `8jj_games`;

-- Drop existing tables if they exist (be careful in production!)
DROP TABLE IF EXISTS comment_mentions;
DROP TABLE IF EXISTS comment_reports;
DROP TABLE IF EXISTS comment_reactions;
DROP TABLE IF EXISTS game_comments;

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


------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------------------
-- =====================================================
-- USERS  TABLE UPDATED
-- =====================================================

-- First, check your current table structure
DESCRIBE users;

-- Add the new columns (if they don't exist)
ALTER TABLE users
ADD COLUMN country VARCHAR(2) DEFAULT 'IN';

-- Create sample users
INSERT INTO users (id, username, email, points, level, tier, country, is_active)
VALUES
(101, 'Arjun', 'arjun@test.com', 1200, 5, 'Gold', 'IN', TRUE),
(102, 'Meera', 'meera@test.com', 950, 4, 'Silver', 'IN', TRUE),
(103, 'John', 'john@test.com', 1800, 7, 'Platinum', 'US', TRUE),
(104, 'Sara', 'sara@test.com', 600, 3, 'Silver', 'US', TRUE),
(105, 'Ravi', 'ravi@test.com', 2200, 9, 'Diamond', 'IN', TRUE);

-- Add user_points (used by leaderboard)
INSERT INTO user_points (user_id, total_points, current_level, current_tier)
VALUES
(101, 1200, 5, 'Gold'),
(102, 950, 4, 'Silver'),
(103, 1800, 7, 'Platinum'),
(104, 600, 3, 'Silver'),
(105, 2200, 9, 'Diamond');

-- Add activity logs (optional, but nice)
INSERT INTO user_activity_log (user_id, activity_type, points_awarded, created_at)
VALUES
(101, 'play_game', 200, NOW()),
(102, 'login', 50, NOW()),
(103, 'code_redemption', 300, NOW()),
(104, 'play_game', 100, NOW()),
(105, 'referral_signup', 500, NOW());





-- ===========================================================================================================================================================================================================================================


-- =====================================================
-- COMPLETE CHAT MODULE DATABASE SCHEMA
-- This includes ALL tables needed for the chat system

-- =====================================================
-- 1. CHAT CHANNELS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS chat_channels (
  id INT AUTO_INCREMENT PRIMARY KEY,
  
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  icon VARCHAR(50),
  color VARCHAR(20),
  
  -- Permissions
  is_private BOOLEAN DEFAULT FALSE,
  allowed_roles JSON, -- ['admin', 'moderator'] etc
  
  -- Settings
  is_active BOOLEAN DEFAULT TRUE,
  display_order INT DEFAULT 0,
  message_rate_limit INT DEFAULT 5, -- messages per minute
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_is_active (is_active),
  INDEX idx_display_order (display_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 2. CHAT MESSAGES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS chat_messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  
  channel_id INT NOT NULL,
  user_id INT NOT NULL,
  
  -- Content
  content TEXT NOT NULL,
  message_type ENUM('text', 'image', 'system', 'game_link') DEFAULT 'text',
  
  -- Media
  image_url VARCHAR(500),
  
  -- References
  reply_to_message_id INT DEFAULT NULL,
  
  -- Metadata
  is_edited BOOLEAN DEFAULT FALSE,
  edited_at TIMESTAMP NULL,
  is_deleted BOOLEAN DEFAULT FALSE,
  is_pinned BOOLEAN DEFAULT FALSE,
  
  -- Engagement
  reaction_count INT DEFAULT 0,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_channel_created (channel_id, created_at),
  INDEX idx_user_id (user_id),
  INDEX idx_reply_to (reply_to_message_id),
  INDEX idx_is_deleted (is_deleted),
  
  CONSTRAINT fk_message_channel
    FOREIGN KEY (channel_id)
    REFERENCES chat_channels(id)
    ON DELETE CASCADE,
    
  CONSTRAINT fk_message_user
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE,
    
  CONSTRAINT fk_reply_message
    FOREIGN KEY (reply_to_message_id)
    REFERENCES chat_messages(id)
    ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 3. MESSAGE REACTIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS message_reactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  
  message_id INT NOT NULL,
  user_id INT NOT NULL,
  emoji VARCHAR(10) NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE KEY unique_user_message_emoji (user_id, message_id, emoji),
  INDEX idx_message_id (message_id),
  
  CONSTRAINT fk_msg_reaction_message
    FOREIGN KEY (message_id)
    REFERENCES chat_messages(id)
    ON DELETE CASCADE,
    
  CONSTRAINT fk_msg_reaction_user
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 4. USER PRESENCE TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS user_presence (
  user_id INT PRIMARY KEY,
  
  status ENUM('online', 'away', 'busy', 'offline') DEFAULT 'offline',
  last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  current_channel_id INT DEFAULT NULL,
  socket_id VARCHAR(100),
  
  CONSTRAINT fk_presence_user
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE,
    
  CONSTRAINT fk_presence_channel
    FOREIGN KEY (current_channel_id)
    REFERENCES chat_channels(id)
    ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 5. USER BLOCKS/MUTES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS user_blocks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  
  blocker_id INT NOT NULL,
  blocked_id INT NOT NULL,
  block_type ENUM('block', 'mute') NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE KEY unique_block (blocker_id, blocked_id),
  INDEX idx_blocker (blocker_id),
  
  CONSTRAINT fk_blocker
    FOREIGN KEY (blocker_id)
    REFERENCES users(id)
    ON DELETE CASCADE,
    
  CONSTRAINT fk_blocked
    FOREIGN KEY (blocked_id)
    REFERENCES users(id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 6. TYPING INDICATORS TABLE (Optional - can use memory)
-- =====================================================
CREATE TABLE IF NOT EXISTS typing_indicators (
  id INT AUTO_INCREMENT PRIMARY KEY,
  
  channel_id INT NOT NULL,
  user_id INT NOT NULL,
  
  expires_at TIMESTAMP NOT NULL,
  
  UNIQUE KEY unique_channel_user (channel_id, user_id),
  INDEX idx_expires (expires_at),
  
  CONSTRAINT fk_typing_channel
    FOREIGN KEY (channel_id)
    REFERENCES chat_channels(id)
    ON DELETE CASCADE,
    
  CONSTRAINT fk_typing_user
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 7. INSERT DEFAULT CHANNELS
-- =====================================================

INSERT INTO chat_channels (id, name, description, icon, color, display_order) 
VALUES
  (1, 'general', 'General discussion about games', '💬', '#5865F2', 1),
  (2, 'gaming-tips', 'Share tips and strategies', '🎯', '#57F287', 2),
  (3, 'game-requests', 'Request new games', '🎮', '#FEE75C', 3),
  (4, 'off-topic', 'Anything goes!', '🌟', '#EB459E', 4)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  description = VALUES(description),
  icon = VALUES(icon),
  color = VALUES(color),
  display_order = VALUES(display_order);

-- =====================================================
-- 8. VERIFICATION QUERIES
-- =====================================================

-- Show all tables
SHOW TABLES;

-- Show chat_channels structure
DESC chat_channels;

-- Show chat_messages structure
DESC chat_messages;

-- Show message_reactions structure
DESC message_reactions;

-- Show user_presence structure
DESC user_presence;

-- Show existing channels
SELECT * FROM chat_channels ORDER BY display_order;

-- =====================================================
-- 9. USEFUL VIEWS (OPTIONAL)
-- =====================================================

-- View for active channels with message counts
CREATE OR REPLACE VIEW active_channels_view AS
SELECT 
  cc.id,
  cc.name,
  cc.description,
  cc.icon,
  cc.color,
  COUNT(cm.id) as message_count,
  MAX(cm.created_at) as last_message_at
FROM chat_channels cc
LEFT JOIN chat_messages cm ON cc.id = cm.channel_id AND cm.is_deleted = FALSE
WHERE cc.is_active = TRUE
GROUP BY cc.id
ORDER BY cc.display_order;

-- View for online users count per channel
CREATE OR REPLACE VIEW channel_users_view AS
SELECT 
  cc.id as channel_id,
  cc.name as channel_name,
  COUNT(DISTINCT up.user_id) as online_count
FROM chat_channels cc
LEFT JOIN user_presence up ON cc.id = up.current_channel_id
WHERE up.status IN ('online', 'away', 'busy')
GROUP BY cc.id;

-- =====================================================
-- 10. SAMPLE QUERIES FOR REFERENCE
-- =====================================================

-- Get recent messages for a channel (with user info and replies)
/*
SELECT 
  cm.id,
  cm.content,
  cm.message_type,
  cm.reply_to_message_id,
  cm.is_edited,
  cm.created_at,
  u.id as user_id,
  u.username,
  u.avatar,
  u.role,
  u.level,
  rm.id as replied_message_id,
  rm.content as replied_message_content,
  ru.username as replied_message_username
FROM chat_messages cm
INNER JOIN users u ON cm.user_id = u.id
LEFT JOIN chat_messages rm ON cm.reply_to_message_id = rm.id
LEFT JOIN users ru ON rm.user_id = ru.id
WHERE cm.channel_id = 1
  AND cm.is_deleted = FALSE
ORDER BY cm.created_at DESC
LIMIT 50;
*/

-- Get message reactions
/*
SELECT 
  mr.message_id,
  mr.emoji,
  COUNT(*) as count,
  JSON_ARRAYAGG(u.username) as users
FROM message_reactions mr
INNER JOIN users u ON mr.user_id = u.id
WHERE mr.message_id = ?
GROUP BY mr.message_id, mr.emoji;
*/

-- Get online users
/*
SELECT 
  u.id,
  u.username,
  u.avatar,
  u.role,
  u.level,
  up.status,
  up.current_channel_id,
  up.last_seen
FROM user_presence up
INNER JOIN users u ON up.user_id = u.id
WHERE up.status IN ('online', 'away', 'busy')
ORDER BY u.username ASC;
*/

-- =====================================================
-- COMPLETION MESSAGE
-- =====================================================

SELECT '✅ Complete chat database schema created successfully!' as status;
SELECT 'All tables, indexes, and default data are ready.' as info;
SELECT 'You can now start the chat module!' as next_step;



-- ===========================================================================================================================================================================================================================================




-- ============================================================
-- 8JJ GAMES - BANNER MANAGEMENT SYSTEM - DATABASE SCHEMA
-- ============================================================
-- Created: 2026-02-13
-- Purpose: Complete banner management with templates, placements, and analytics
-- Version: 1.0
-- ============================================================
-- HOW TO RUN:
--     mysql -u root -p 
-- 
-- 
USE `8jj_games`;

-- ============================================================
-- 1. BANNER TEMPLATES TABLE
-- ============================================================
-- Stores different banner component types/styles
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
  INDEX idx_active (is_active),
  INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 2. BANNER PLACEMENTS TABLE
-- ============================================================
-- Defines where banners can appear on the site
CREATE TABLE IF NOT EXISTS banner_placements (
  id INT PRIMARY KEY AUTO_INCREMENT,
  
  -- Placement Info
  name VARCHAR(100) NOT NULL UNIQUE COMMENT 'Display name (e.g., "Home Page Hero")',
  placement_key VARCHAR(100) NOT NULL UNIQUE COMMENT 'Unique code identifier (e.g., "home_hero")',
  page_route VARCHAR(200) NOT NULL COMMENT 'Route where banner appears (e.g., "/", "/game/:id")',
  position ENUM(
    'hero', 
    'sidebar', 
    'header', 
    'footer', 
    'modal', 
    'top', 
    'bottom', 
    'section_1', 
    'section_2', 
    'section_3'
  ) NOT NULL COMMENT 'Position on page',
  description TEXT COMMENT 'Placement description',
  
  -- Settings
  max_active_banners INT DEFAULT 1 COMMENT 'Max concurrent banners',
  allowed_template_types JSON COMMENT 'Array of allowed template types',
  
  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_page_route (page_route),
  INDEX idx_position (position),
  INDEX idx_active (is_active),
  INDEX idx_placement_key (placement_key),
  UNIQUE INDEX idx_page_position (page_route, position)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 3. BANNERS TABLE
-- ============================================================
-- Individual banner instances
CREATE TABLE IF NOT EXISTS banners (
  id INT PRIMARY KEY AUTO_INCREMENT,
  
  -- References
  template_id INT NOT NULL COMMENT 'Reference to banner_templates',
  placement_id INT NOT NULL COMMENT 'Reference to banner_placements',
  
  -- Banner Info
  name VARCHAR(200) NOT NULL COMMENT 'Internal admin name',
  priority INT DEFAULT 0 COMMENT 'Display priority (higher = shown first)',
  
  -- Status & Scheduling
  is_active BOOLEAN DEFAULT TRUE COMMENT 'Enable/disable banner',
  start_date DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT 'When banner becomes active',
  end_date DATETIME NULL COMMENT 'When banner expires (NULL = no expiration)',
  
  -- Configuration
  config JSON COMMENT 'Custom configuration for this banner',
  
  -- Analytics
  click_count INT DEFAULT 0 COMMENT 'Total clicks',
  impression_count INT DEFAULT 0 COMMENT 'Total impressions',
  
  -- Meta
  created_by INT NULL COMMENT 'Admin user ID who created',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (template_id) REFERENCES banner_templates(id) ON DELETE RESTRICT,
  FOREIGN KEY (placement_id) REFERENCES banner_placements(id) ON DELETE CASCADE,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
  
  INDEX idx_template (template_id),
  INDEX idx_placement (placement_id),
  INDEX idx_active (is_active),
  INDEX idx_priority (priority),
  INDEX idx_dates (start_date, end_date),
  INDEX idx_placement_active_priority (placement_id, is_active, priority)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 4. BANNER SLIDES TABLE
-- ============================================================
-- Content for carousel banners (Hero, Featured)
CREATE TABLE IF NOT EXISTS banner_slides (
  id INT PRIMARY KEY AUTO_INCREMENT,
  
  -- Reference
  banner_id INT NOT NULL COMMENT 'Reference to banners table',
  
  -- Order
  order_position INT DEFAULT 0 COMMENT 'Slide position in carousel',
  
  -- Content
  title VARCHAR(200) COMMENT 'Slide title',
  title_highlight VARCHAR(100) COMMENT 'Highlighted/colored text portion',
  subtitle TEXT COMMENT 'Slide subtitle',
  badge_text VARCHAR(50) COMMENT 'Badge text (e.g., "NEW", "HOT")',
  cta_text VARCHAR(50) COMMENT 'Call-to-action button text',
  cta_link VARCHAR(500) COMMENT 'Button navigation URL',
  
  -- Media
  background_image_url VARCHAR(500) COMMENT 'Slide background image',
  logo_url VARCHAR(500) COMMENT 'Optional custom logo for slide',
  
  -- Custom Styling
  config JSON COMMENT 'Slide-specific styling overrides',
  
  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (banner_id) REFERENCES banners(id) ON DELETE CASCADE,
  
  INDEX idx_banner (banner_id),
  INDEX idx_order (order_position),
  INDEX idx_active (is_active),
  INDEX idx_banner_order (banner_id, order_position)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 5. BANNER GAMES TABLE
-- ============================================================
-- Games associated with section-based banners (Hot Section, Top Picks)
CREATE TABLE IF NOT EXISTS banner_games (
  id INT PRIMARY KEY AUTO_INCREMENT,
  
  -- References
  banner_id INT NOT NULL COMMENT 'Reference to banners table',
  game_id VARCHAR(100) NOT NULL COMMENT 'Game identifier from games system',
  
  -- Order & Display
  order_position INT DEFAULT 0 COMMENT 'Game position in list',
  is_featured BOOLEAN DEFAULT FALSE COMMENT 'Is this the featured game (for TopPicks)',
  
  -- Custom Config
  config JSON COMMENT 'Game-specific display options',
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (banner_id) REFERENCES banners(id) ON DELETE CASCADE,
  
  INDEX idx_banner (banner_id),
  INDEX idx_game (game_id),
  INDEX idx_order (order_position),
  INDEX idx_featured (is_featured),
  UNIQUE INDEX idx_banner_game (banner_id, game_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 6. BANNER ANALYTICS TABLE
-- ============================================================
-- Detailed tracking of banner performance
CREATE TABLE IF NOT EXISTS banner_analytics (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  
  -- References
  banner_id INT NOT NULL COMMENT 'Reference to banners table',
  slide_id INT NULL COMMENT 'Reference to banner_slides (NULL for non-carousel)',
  game_id VARCHAR(100) NULL COMMENT 'Game clicked (for game-based banners)',
  
  -- Event Info
  event_type ENUM('impression', 'click', 'cta_click', 'game_click') NOT NULL,
  
  -- User Info
  user_id INT NULL COMMENT 'User who triggered event (NULL if not logged in)',
  session_id VARCHAR(100) COMMENT 'Session identifier',
  
  -- Page Info
  page_url VARCHAR(500) COMMENT 'Page where event occurred',
  referrer_url VARCHAR(500) COMMENT 'Referrer URL',
  
  -- Device Info
  device_type ENUM('mobile', 'tablet', 'desktop') DEFAULT 'desktop',
  browser VARCHAR(50) COMMENT 'Browser name',
  ip_address VARCHAR(45) COMMENT 'IP address (for analytics)',
  
  -- Timestamp
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (banner_id) REFERENCES banners(id) ON DELETE CASCADE,
  FOREIGN KEY (slide_id) REFERENCES banner_slides(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  
  INDEX idx_banner (banner_id),
  INDEX idx_slide (slide_id),
  INDEX idx_event (event_type),
  INDEX idx_timestamp (timestamp),
  INDEX idx_session (session_id),
  INDEX idx_user (user_id),
  INDEX idx_banner_event (banner_id, event_type),
  INDEX idx_banner_timestamp (banner_id, timestamp)
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

-- ============================================================

UPDATE banner_placements
SET page_route = '/all-8jj-games'
WHERE placement_key = 'all_games_hero';

-- ============================================================