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
