-- server/src/db/schema.games.sql

CREATE TABLE games (
  id INT AUTO_INCREMENT PRIMARY KEY,
  provider_id VARCHAR(255) UNIQUE,
  title VARCHAR(255) NOT NULL,
  image TEXT,
  embed TEXT,
  description TEXT,
  category VARCHAR(100),
  source VARCHAR(50),
  is_active BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,
  total_plays INT DEFAULT 0,
  last_played_at DATETIME NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE tags (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) UNIQUE
);

CREATE TABLE game_tags (
  game_id INT,
  tag_id INT,
  PRIMARY KEY (game_id, tag_id),
  FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);

ALTER TABLE games ADD r2_thumb VARCHAR(255);

ALTER TABLE games
ADD COLUMN is_hot TINYINT(1) DEFAULT 0,
ADD COLUMN hot_order INT DEFAULT 0,
ADD COLUMN featured_order INT DEFAULT 0;


ALTER TABLE games ADD UNIQUE (provider_id);

ALTER TABLE games
ADD COLUMN is_top_pick TINYINT(1) DEFAULT 0,
ADD COLUMN top_pick_order INT DEFAULT 0;


ALTER TABLE games
ADD total_time_played INT DEFAULT 0;