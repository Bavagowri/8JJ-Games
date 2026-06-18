-- You're already in the database, so just run these commands:

-- 1. First, let's add the new notification types
ALTER TABLE notifications 
MODIFY COLUMN type ENUM(
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
) NOT NULL;

-- 2. Add new columns to notifications table
ALTER TABLE notifications
ADD COLUMN image_url VARCHAR(500) AFTER metadata,
ADD COLUMN scheduled_for TIMESTAMP NULL AFTER expires_at,
ADD COLUMN status ENUM('draft', 'scheduled', 'sent', 'failed') DEFAULT 'sent' AFTER scheduled_for,
ADD COLUMN click_count INT DEFAULT 0 AFTER status,
ADD COLUMN delivery_attempts INT DEFAULT 0 AFTER click_count,
ADD COLUMN last_delivery_attempt TIMESTAMP NULL AFTER delivery_attempts;

-- 3. Enhance notification templates
ALTER TABLE notification_templates
ADD COLUMN image_url VARCHAR(500) AFTER message,
ADD COLUMN category ENUM('info', 'warning', 'success', 'error', 'promotional') DEFAULT 'info' AFTER type,
ADD COLUMN is_featured BOOLEAN DEFAULT FALSE AFTER is_active,
ADD COLUMN usage_count INT DEFAULT 0 AFTER is_featured;

-- 4. Update template types enum
ALTER TABLE notification_templates
MODIFY COLUMN type ENUM(
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
) NOT NULL;

-- 5. Create notification analytics table
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
  time_to_open INT,
  time_spent INT,
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
    ON DELETE CASCADE,
  INDEX idx_notification_id (notification_id),
  INDEX idx_campaign_id (campaign_id),
  INDEX idx_user_id (user_id),
  INDEX idx_delivered_at (delivered_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Create notification queue table
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

-- 7. Enhance user notification preferences
ALTER TABLE user_notification_preferences
ADD COLUMN maintenance_alerts BOOLEAN DEFAULT TRUE AFTER community_events,
ADD COLUMN promotional_offers BOOLEAN DEFAULT FALSE AFTER maintenance_alerts,
ADD COLUMN tournament_announcements BOOLEAN DEFAULT TRUE AFTER promotional_offers,
ADD COLUMN weekly_digest BOOLEAN DEFAULT TRUE AFTER tournament_announcements,
ADD COLUMN friend_activity BOOLEAN DEFAULT TRUE AFTER weekly_digest,
ADD COLUMN game_recommendations BOOLEAN DEFAULT TRUE AFTER friend_activity,
ADD COLUMN push_notifications BOOLEAN DEFAULT TRUE AFTER email_notifications,
ADD COLUMN notification_sound BOOLEAN DEFAULT TRUE AFTER push_notifications,
ADD COLUMN quiet_hours_start TIME DEFAULT '22:00:00' AFTER notification_sound,
ADD COLUMN quiet_hours_end TIME DEFAULT '08:00:00' AFTER quiet_hours_start,
ADD COLUMN digest_frequency ENUM('daily', 'weekly', 'never') DEFAULT 'weekly' AFTER quiet_hours_end;

-- 8. Enhance campaigns table
ALTER TABLE notification_campaigns
ADD COLUMN segment_type ENUM('all', 'active', 'inactive', 'new', 'returning', 'high_engagement', 'custom') DEFAULT 'all' AFTER target_type,
ADD COLUMN ab_test_enabled BOOLEAN DEFAULT FALSE AFTER priority,
ADD COLUMN variant_a_title VARCHAR(255) AFTER ab_test_enabled,
ADD COLUMN variant_a_message TEXT AFTER variant_a_title,
ADD COLUMN variant_b_title VARCHAR(255) AFTER variant_a_message,
ADD COLUMN variant_b_message TEXT AFTER variant_b_title,
ADD COLUMN variant_a_count INT DEFAULT 0 AFTER variant_b_message,
ADD COLUMN variant_b_count INT DEFAULT 0 AFTER variant_a_count,
ADD COLUMN image_url VARCHAR(500) AFTER variant_b_count,
ADD COLUMN open_rate DECIMAL(5,2) DEFAULT 0.00 AFTER failed_count,
ADD COLUMN click_rate DECIMAL(5,2) DEFAULT 0.00 AFTER open_rate;

-- 9. Create notification categories table
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

-- 10. Create notification presets table
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

-- 11. Add performance indexes
CREATE INDEX idx_notifications_user_status ON notifications(user_id, status);
CREATE INDEX idx_notifications_type_created ON notifications(type, created_at);
CREATE INDEX idx_notifications_scheduled ON notifications(scheduled_for);
CREATE INDEX idx_campaigns_status ON notification_campaigns(status);
CREATE INDEX idx_templates_category ON notification_templates(category);
CREATE INDEX idx_templates_featured ON notification_templates(is_featured);

-- 12. Insert default categories (using user 2 as creator)
INSERT INTO notification_categories (name, icon, color, description, display_order) VALUES
('Gaming', '🎮', '#00d9ff', 'Game updates, releases, and achievements', 1),
('Social', '👥', '#ff416c', 'Friend requests and social activities', 2),
('System', '⚙️', '#4facfe', 'System updates and maintenance', 3),
('Promotional', '🎁', '#f5576c', 'Special offers and promotions', 4),
('Events', '🎉', '#00ff88', 'Tournaments and community events', 5);

-- 13. Insert sample presets (using user 2 as creator)
INSERT INTO notification_presets (name, description, type, title, message, priority, created_by) VALUES
('New Game Launch', 'Notify users about a new game release', 'new_game', 'New Game Available! 🎮', 'Check out our latest addition: {{game_title}}. Start playing now!', 'high', 2),
('Maintenance Alert', 'Server maintenance notification', 'maintenance_alert', 'Scheduled Maintenance 🔧', 'Our servers will be under maintenance on {{date}} from {{start_time}} to {{end_time}}. Thank you for your patience!', 'urgent', 2),
('Tournament Starting', 'Tournament announcement', 'tournament_announcement', 'Tournament Starts Soon! 🏆', 'The {{tournament_name}} tournament begins in {{time}}. Register now to compete!', 'high', 2),
('Special Offer', 'Promotional offer notification', 'promotional_offer', 'Special Offer Just For You! 🎁', 'Enjoy {{discount}}% off on {{offer_item}}. Limited time only!', 'normal', 2),
('Achievement Unlocked', 'Achievement notification', 'achievement', 'Achievement Unlocked! 🏆', 'Congratulations! You\'ve unlocked: {{achievement_name}}', 'normal', 2);

-- 14. Insert enhanced templates (using user 2 as creator)
INSERT INTO notification_templates (name, type, title, message, category, variables, is_featured, created_by) VALUES
('maintenance_scheduled', 'maintenance_alert', 'Scheduled Maintenance 🔧', 
 'Our servers will undergo maintenance on {{date}} from {{start_time}} to {{end_time}}. During this time, games may be temporarily unavailable. We appreciate your patience!',
 'warning', '["date", "start_time", "end_time"]', TRUE, 2),
('flash_sale', 'promotional_offer', 'Flash Sale Alert! 💰',
 'Limited time offer! Get {{discount}}% off on {{item_name}}. Hurry, offer ends in {{hours}} hours!',
 'promotional', '["discount", "item_name", "hours"]', TRUE, 2),
('tournament_reminder', 'tournament_announcement', 'Tournament Reminder 🎮',
 'The {{tournament_name}} starts in {{time_remaining}}! {{participant_count}} players have already registered. Don\'t miss out!',
 'info', '["tournament_name", "time_remaining", "participant_count"]', TRUE, 2),
('weekly_summary', 'weekly_digest', 'Your Weekly Gaming Summary 📊',
 'This week you played {{games_count}} games, earned {{points}} points, and unlocked {{achievements}} achievements! Keep up the great work!',
 'info', '["games_count", "points", "achievements"]', FALSE, 2),
('game_suggestion', 'game_recommendation', 'Game Recommendation 🎯',
 'Based on your interests, we think you\'ll love {{game_name}}! {{reason}}',
 'info', '["game_name", "reason"]', FALSE, 2);

-- 15. Verify everything was created
SELECT 'Tables created:' as status;
SHOW TABLES LIKE '%notification%';

SELECT 'New categories:' as status;
SELECT id, name, icon FROM notification_categories;

SELECT 'New presets:' as status;
SELECT id, name, type FROM notification_presets;

SELECT 'Enhanced templates:' as status;
SELECT id, name, type, category, is_featured FROM notification_templates;

-- Done!
SELECT '✅ Schema upgrade complete!' as status;

