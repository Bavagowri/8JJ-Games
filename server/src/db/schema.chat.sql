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