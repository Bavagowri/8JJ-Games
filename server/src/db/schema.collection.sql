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

ALTER TABLE user_collections
DROP COLUMN game_title,
DROP COLUMN image_url,
DROP COLUMN category;

ALTER TABLE user_collections
ADD UNIQUE KEY unique_user_game (user_id, game_id);