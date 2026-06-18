-- server/src/db/schema.matches.sql
CREATE TABLE matches (
    id INT NOT NULL AUTO_INCREMENT,
    sportmonks_id INT UNIQUE,
    league_id INT,
    season_id INT,
    round VARCHAR(100),
    starting_at DATETIME,
    status VARCHAR(50),
    localteam_id INT,
    visitorteam_id INT,
    localteam_name VARCHAR(100),
    visitorteam_name VARCHAR(100),
    winner_team_id INT,
    is_resolved TINYINT(1) DEFAULT 0,
    prediction_open TINYINT(1) DEFAULT 1,
    participation_cost INT DEFAULT 0,
    allow_zero_cost TINYINT(1) DEFAULT 0,
    odds_min DECIMAL(5,2) DEFAULT 1.10,
    odds_max DECIMAL(5,2) DEFAULT 5.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    prediction_close_time DATETIME,
    match_state VARCHAR(20) DEFAULT 'upcoming',
    winner VARCHAR(255),
    is_featured TINYINT(1) DEFAULT 0,
    PRIMARY KEY (id)
);

CREATE TABLE match_prediction_options (
    id INT NOT NULL AUTO_INCREMENT,
    match_id INT NOT NULL,
    option_type VARCHAR(50) NOT NULL,
    option_value VARCHAR(100) NOT NULL,
    odds DECIMAL(5,2) NOT NULL,
    is_active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX idx_match_id (match_id)
);

CREATE TABLE user_predictions (
    id INT NOT NULL AUTO_INCREMENT,
    user_id INT,
    match_id INT,
    option_id INT,
    stake_points INT,
    potential_reward INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_correct TINYINT(1),
    points_awarded INT DEFAULT 0,
    PRIMARY KEY (id),
    INDEX idx_user_id (user_id)
);



CREATE INDEX idx_match_id ON user_predictions(match_id);
CREATE INDEX idx_option_id ON user_predictions(option_id);


ALTER TABLE match_prediction_options
ADD UNIQUE KEY uniq_match_option (match_id, option_value);



ALTER TABLE user_predictions
  ADD COLUMN is_correct TINYINT(1) NULL DEFAULT NULL,
  ADD COLUMN points_awarded INT NULL DEFAULT 0;



ALTER TABLE match_prediction_options
ADD CONSTRAINT fk_match_prediction_match
FOREIGN KEY (match_id) REFERENCES matches(id)
ON DELETE CASCADE;

CREATE TABLE teams (
    sportmonks_id INT NOT NULL,
    name VARCHAR(100) DEFAULT NULL,
    logo_url VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (sportmonks_id)
);

ALTER TABLE user_predictions
ADD UNIQUE KEY uniq_user_match (user_id, match_id);