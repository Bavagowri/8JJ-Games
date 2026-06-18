-- MySQL dump 10.13  Distrib 9.0.1, for macos15.1 (arm64)
--
-- Host: localhost    Database: 8jj_games
-- ------------------------------------------------------
-- Server version	8.0.39

--
-- Table structure for table `banner_analytics`
--

DROP TABLE IF EXISTS `banner_analytics`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `banner_analytics` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `banner_id` int NOT NULL,
  `slide_id` int DEFAULT NULL,
  `game_id` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `event_type` enum('impression','click','cta_click','game_click') COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` int DEFAULT NULL,
  `session_id` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `page_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `referrer_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `device_type` enum('mobile','tablet','desktop') COLLATE utf8mb4_unicode_ci DEFAULT 'desktop',
  `browser` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `timestamp` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_banner` (`banner_id`),
  KEY `idx_slide` (`slide_id`),
  KEY `idx_event` (`event_type`),
  KEY `idx_timestamp` (`timestamp`),
  KEY `idx_session` (`session_id`),
  KEY `idx_user` (`user_id`),
  KEY `idx_banner_event` (`banner_id`,`event_type`),
  KEY `idx_banner_timestamp` (`banner_id`,`timestamp`),
  KEY `idx_banner_event_timestamp` (`banner_id`,`event_type`,`timestamp`),
  CONSTRAINT `fk_analytics_banner` FOREIGN KEY (`banner_id`) REFERENCES `banners` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_analytics_slide` FOREIGN KEY (`slide_id`) REFERENCES `banner_slides` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_banner_analytics_user_ref` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `banner_games`
--

DROP TABLE IF EXISTS `banner_games`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `banner_games` (
  `id` int NOT NULL AUTO_INCREMENT,
  `banner_id` int NOT NULL,
  `game_id` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `order_position` int DEFAULT '0',
  `is_featured` tinyint(1) DEFAULT '0',
  `config` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_banner_game` (`banner_id`,`game_id`),
  UNIQUE KEY `idx_banner_game_order` (`banner_id`,`order_position`),
  KEY `idx_banner` (`banner_id`),
  KEY `idx_game` (`game_id`),
  KEY `idx_featured` (`is_featured`),
  CONSTRAINT `fk_games_banner` FOREIGN KEY (`banner_id`) REFERENCES `banners` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `banner_placements`
--

DROP TABLE IF EXISTS `banner_placements`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `banner_placements` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `placement_key` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `page_route` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `position` enum('hero','sidebar','header','footer','modal','top','bottom','section_1','section_2','section_3') COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `max_active_banners` int DEFAULT '1',
  `allowed_template_types` json DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  UNIQUE KEY `placement_key` (`placement_key`),
  KEY `idx_page_route` (`page_route`),
  KEY `idx_position` (`position`),
  KEY `idx_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `banner_slides`
--

DROP TABLE IF EXISTS `banner_slides`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `banner_slides` (
  `id` int NOT NULL AUTO_INCREMENT,
  `banner_id` int NOT NULL,
  `order_position` int DEFAULT '0',
  `title` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `title_highlight` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `subtitle` text COLLATE utf8mb4_unicode_ci,
  `badge_text` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cta_text` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cta_link` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `background_image_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `logo_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `config` json DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_banner_order` (`banner_id`,`order_position`),
  KEY `idx_banner` (`banner_id`),
  KEY `idx_active` (`is_active`),
  CONSTRAINT `fk_slides_banner` FOREIGN KEY (`banner_id`) REFERENCES `banners` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `banner_templates`
--

DROP TABLE IF EXISTS `banner_templates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `banner_templates` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL COMMENT 'Template name (e.g., "Hero Banner Carousel")',
  `template_type` enum('hero','hot_section','top_picks','featured_carousel','side','strip','popup','floating') NOT NULL COMMENT 'Type of banner component',
  `component_name` varchar(100) NOT NULL COMMENT 'React component name (e.g., "HeroBannerV2")',
  `description` text COMMENT 'Template description',
  `preview_image_url` varchar(500) DEFAULT NULL COMMENT 'Preview image for admin panel',
  `default_config` json DEFAULT NULL COMMENT 'Default settings (autoPlay, interval, etc)',
  `is_active` tinyint(1) DEFAULT '1' COMMENT 'Is template available for use',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  KEY `idx_template_type` (`template_type`),
  KEY `idx_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `banners`
--

DROP TABLE IF EXISTS `banners`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `banners` (
  `id` int NOT NULL AUTO_INCREMENT,
  `template_id` int NOT NULL,
  `placement_id` int NOT NULL,
  `name` varchar(200) NOT NULL,
  `priority` int DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  `start_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `end_date` timestamp NULL DEFAULT NULL,
  `config` json DEFAULT NULL,
  `click_count` int NOT NULL DEFAULT '0',
  `impression_count` int NOT NULL DEFAULT '0',
  `created_by` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `created_by` (`created_by`),
  KEY `template_id` (`template_id`),
  KEY `placement_id` (`placement_id`),
  KEY `is_active` (`is_active`),
  KEY `priority` (`priority`),
  CONSTRAINT `banners_ibfk_1` FOREIGN KEY (`template_id`) REFERENCES `banner_templates` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `banners_ibfk_2` FOREIGN KEY (`placement_id`) REFERENCES `banner_placements` (`id`) ON DELETE CASCADE,
  CONSTRAINT `banners_ibfk_3` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `comment_mentions`
--

DROP TABLE IF EXISTS `comment_mentions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comment_mentions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `comment_id` int NOT NULL,
  `mentioned_user_id` int NOT NULL,
  `is_read` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_comment_mention` (`comment_id`,`mentioned_user_id`),
  KEY `idx_mentioned_user` (`mentioned_user_id`),
  CONSTRAINT `fk_mention_comment` FOREIGN KEY (`comment_id`) REFERENCES `game_comments` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_mentioned_user` FOREIGN KEY (`mentioned_user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `comment_reactions`
--

DROP TABLE IF EXISTS `comment_reactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comment_reactions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `comment_id` int NOT NULL,
  `user_id` int NOT NULL,
  `reaction_type` enum('like','helpful','funny','love') COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_user_comment_reaction` (`user_id`,`comment_id`,`reaction_type`),
  KEY `idx_comment_id` (`comment_id`),
  KEY `idx_user_id` (`user_id`),
  CONSTRAINT `fk_reaction_comment` FOREIGN KEY (`comment_id`) REFERENCES `game_comments` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_reaction_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `comment_reports`
--

DROP TABLE IF EXISTS `comment_reports`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comment_reports` (
  `id` int NOT NULL AUTO_INCREMENT,
  `comment_id` int NOT NULL,
  `reported_by` int NOT NULL,
  `reason` enum('spam','offensive','harassment','inappropriate','other') COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `status` enum('pending','reviewed','resolved') COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `reviewed_by` int DEFAULT NULL,
  `reviewed_at` timestamp NULL DEFAULT NULL,
  `action_taken` enum('none','warned','comment_removed','user_banned') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_comment_id` (`comment_id`),
  KEY `idx_reported_by` (`reported_by`),
  KEY `idx_status` (`status`),
  KEY `fk_reviewer` (`reviewed_by`),
  CONSTRAINT `fk_report_comment` FOREIGN KEY (`comment_id`) REFERENCES `game_comments` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_report_user` FOREIGN KEY (`reported_by`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_reviewer` FOREIGN KEY (`reviewed_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `email_verifications`
--

DROP TABLE IF EXISTS `email_verifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `email_verifications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `token` varchar(255) NOT NULL,
  `expires_at` datetime NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `email_verifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `game_comments`
--

DROP TABLE IF EXISTS `game_comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `game_comments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `game_id` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` int NOT NULL,
  `parent_comment_id` int DEFAULT NULL,
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_edited` tinyint(1) DEFAULT '0',
  `edited_at` timestamp NULL DEFAULT NULL,
  `is_deleted` tinyint(1) DEFAULT '0',
  `is_flagged` tinyint(1) DEFAULT '0',
  `like_count` int DEFAULT '0',
  `reply_count` int DEFAULT '0',
  `is_approved` tinyint(1) DEFAULT '1',
  `moderation_status` enum('pending','approved','rejected') COLLATE utf8mb4_unicode_ci DEFAULT 'approved',
  `moderator_id` int DEFAULT NULL,
  `moderation_note` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_game_id` (`game_id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_parent_comment_id` (`parent_comment_id`),
  KEY `idx_created_at` (`created_at`),
  KEY `idx_game_user` (`game_id`,`user_id`),
  KEY `fk_moderator` (`moderator_id`),
  CONSTRAINT `fk_comment_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_moderator` FOREIGN KEY (`moderator_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_parent_comment` FOREIGN KEY (`parent_comment_id`) REFERENCES `game_comments` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `game_tags`
--

DROP TABLE IF EXISTS `game_tags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `game_tags` (
  `game_id` int NOT NULL,
  `tag_id` int NOT NULL,
  PRIMARY KEY (`game_id`,`tag_id`),
  KEY `tag_id` (`tag_id`),
  CONSTRAINT `game_tags_ibfk_1` FOREIGN KEY (`game_id`) REFERENCES `games` (`id`) ON DELETE CASCADE,
  CONSTRAINT `game_tags_ibfk_2` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `games`
--

DROP TABLE IF EXISTS `games`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `games` (
  `id` int NOT NULL AUTO_INCREMENT,
  `provider_id` varchar(255) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `image` text,
  `embed` text,
  `description` text,
  `category` varchar(100) DEFAULT NULL,
  `source` varchar(50) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `is_featured` tinyint(1) DEFAULT '0',
  `total_plays` int DEFAULT '0',
  `last_played_at` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `r2_thumb` varchar(255) DEFAULT NULL,
  `is_hot` tinyint(1) DEFAULT '0',
  `hot_order` int DEFAULT '0',
  `featured_order` int DEFAULT '0',
  `is_top_pick` tinyint(1) DEFAULT '0',
  `top_pick_order` int DEFAULT '0',
  `total_time_played` int DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `provider_id` (`provider_id`),
  UNIQUE KEY `provider_id_2` (`provider_id`)
) ENGINE=InnoDB AUTO_INCREMENT=39304 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `levels`
--

DROP TABLE IF EXISTS `levels`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `levels` (
  `level` int NOT NULL,
  `name` varchar(50) NOT NULL,
  `min_points` int NOT NULL,
  PRIMARY KEY (`level`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `levels_config`
--

DROP TABLE IF EXISTS `levels_config`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `levels_config` (
  `level` int NOT NULL,
  `name` varchar(50) DEFAULT NULL,
  `min_points` int DEFAULT NULL,
  PRIMARY KEY (`level`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `match_prediction_options`
--

DROP TABLE IF EXISTS `match_prediction_options`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `match_prediction_options` (
  `id` int NOT NULL AUTO_INCREMENT,
  `match_id` int NOT NULL,
  `option_type` varchar(50) NOT NULL,
  `option_value` varchar(100) NOT NULL,
  `odds` decimal(5,2) NOT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_match_option` (`match_id`,`option_value`),
  CONSTRAINT `match_prediction_options_ibfk_1` FOREIGN KEY (`match_id`) REFERENCES `matches` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=355 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `matches`
--

DROP TABLE IF EXISTS `matches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `matches` (
  `id` int NOT NULL AUTO_INCREMENT,
  `sportmonks_id` int DEFAULT NULL,
  `league_id` int DEFAULT NULL,
  `season_id` int DEFAULT NULL,
  `round` varchar(100) DEFAULT NULL,
  `starting_at` datetime DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `localteam_id` int DEFAULT NULL,
  `visitorteam_id` int DEFAULT NULL,
  `localteam_name` varchar(100) DEFAULT NULL,
  `visitorteam_name` varchar(100) DEFAULT NULL,
  `winner_team_id` int DEFAULT NULL,
  `is_resolved` tinyint(1) DEFAULT '0',
  `prediction_open` tinyint(1) DEFAULT '1',
  `participation_cost` int DEFAULT '0',
  `allow_zero_cost` tinyint(1) DEFAULT '0',
  `odds_min` decimal(5,2) DEFAULT '1.10',
  `odds_max` decimal(5,2) DEFAULT '5.00',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `prediction_close_time` datetime DEFAULT NULL,
  `match_state` varchar(20) DEFAULT 'upcoming',
  `winner` varchar(255) DEFAULT NULL,
  `is_featured` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `sportmonks_id` (`sportmonks_id`)
) ENGINE=InnoDB AUTO_INCREMENT=24351 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `notification_analytics`
--

DROP TABLE IF EXISTS `notification_analytics`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notification_analytics` (
  `id` int NOT NULL AUTO_INCREMENT,
  `notification_id` int NOT NULL,
  `campaign_id` int DEFAULT NULL,
  `user_id` int NOT NULL,
  `delivered_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `opened_at` timestamp NULL DEFAULT NULL,
  `clicked_at` timestamp NULL DEFAULT NULL,
  `dismissed_at` timestamp NULL DEFAULT NULL,
  `device_type` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `browser` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `time_to_open` int DEFAULT NULL COMMENT 'Seconds from delivery to open',
  `time_spent` int DEFAULT NULL COMMENT 'Seconds spent viewing',
  PRIMARY KEY (`id`),
  KEY `idx_analytics_notification` (`notification_id`),
  KEY `idx_analytics_campaign` (`campaign_id`),
  KEY `idx_analytics_user` (`user_id`),
  KEY `idx_analytics_delivered` (`delivered_at`),
  CONSTRAINT `fk_analytics_campaign` FOREIGN KEY (`campaign_id`) REFERENCES `notification_campaigns` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_analytics_notification` FOREIGN KEY (`notification_id`) REFERENCES `notifications` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_analytics_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `notification_campaigns`
--

DROP TABLE IF EXISTS `notification_campaigns`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notification_campaigns` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Campaign name',
  `template_id` int DEFAULT NULL COMMENT 'Optional template reference',
  `target_type` enum('all_users','active_users','verified_users','specific_users','role') COLLATE utf8mb4_unicode_ci NOT NULL,
  `target_criteria` json DEFAULT NULL COMMENT 'Specific user IDs or role',
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `message` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `action_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `action_text` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `priority` enum('low','normal','high','urgent') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'normal',
  `status` enum('draft','scheduled','sending','completed','failed') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'draft',
  `scheduled_at` timestamp NULL DEFAULT NULL COMMENT 'When to send (NULL = send now)',
  `started_at` timestamp NULL DEFAULT NULL COMMENT 'When sending started',
  `completed_at` timestamp NULL DEFAULT NULL COMMENT 'When sending completed',
  `total_recipients` int NOT NULL DEFAULT '0',
  `sent_count` int NOT NULL DEFAULT '0',
  `failed_count` int NOT NULL DEFAULT '0',
  `created_by` int NOT NULL COMMENT 'Admin who created campaign',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_campaign_creator` (`created_by`),
  KEY `fk_campaign_template` (`template_id`),
  KEY `idx_campaigns_status` (`status`),
  CONSTRAINT `fk_campaign_creator` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_campaign_template` FOREIGN KEY (`template_id`) REFERENCES `notification_templates` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `notification_templates`
--

DROP TABLE IF EXISTS `notification_templates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notification_templates` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` enum('system','achievement','game_update','new_game','level_up','community_event','admin_announcement','maintenance_alert','promotional_offer','tournament_announcement','weekly_digest','game_recommendation') COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` enum('info','warning','success','error','promotional') COLLATE utf8mb4_unicode_ci DEFAULT 'info',
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `message` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `image_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `variables` json DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `is_featured` tinyint(1) DEFAULT '0',
  `usage_count` int DEFAULT '0',
  `created_by` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  KEY `fk_template_creator` (`created_by`),
  KEY `idx_templates_category` (`category`),
  KEY `idx_templates_featured` (`is_featured`),
  CONSTRAINT `fk_template_creator` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `type` enum('system','achievement','game_update','new_game','level_up','community_event','friend_request','admin_announcement','maintenance_alert','promotional_offer','tournament_announcement','weekly_digest','friend_activity','game_recommendation') COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `message` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `metadata` json DEFAULT NULL,
  `image_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `action_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `action_text` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_read` tinyint(1) DEFAULT '0',
  `read_at` timestamp NULL DEFAULT NULL,
  `priority` enum('low','normal','high','urgent') COLLATE utf8mb4_unicode_ci DEFAULT 'normal',
  `expires_at` timestamp NULL DEFAULT NULL,
  `scheduled_for` timestamp NULL DEFAULT NULL,
  `status` enum('draft','scheduled','sent','failed') COLLATE utf8mb4_unicode_ci DEFAULT 'sent',
  `click_count` int DEFAULT '0',
  `delivery_attempts` int DEFAULT '0',
  `last_delivery_attempt` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_is_read` (`is_read`),
  KEY `idx_created_at` (`created_at`),
  KEY `idx_type` (`type`),
  KEY `idx_user_unread` (`user_id`,`is_read`,`created_at`),
  KEY `idx_expires_at` (`expires_at`),
  KEY `idx_notifications_user_status` (`user_id`,`is_read`,`created_at`),
  CONSTRAINT `fk_notification_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `password_resets`
--

DROP TABLE IF EXISTS `password_resets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `password_resets` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `token` varchar(255) NOT NULL,
  `expires_at` datetime NOT NULL,
  `used` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_token` (`token`),
  KEY `idx_user_id` (`user_id`),
  CONSTRAINT `fk_password_reset_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `points_rules`
--

DROP TABLE IF EXISTS `points_rules`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `points_rules` (
  `id` int NOT NULL AUTO_INCREMENT,
  `activity_type` varchar(100) NOT NULL,
  `points` int DEFAULT NULL,
  `min_points` int DEFAULT NULL,
  `max_points` int DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `daily_limit` int DEFAULT NULL,
  `cooldown_minutes` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `activity_type` (`activity_type`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `points_transactions`
--

DROP TABLE IF EXISTS `points_transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `points_transactions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `activity_type` varchar(100) DEFAULT NULL,
  `activity_id` int DEFAULT NULL,
  `points` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `activity_date` date GENERATED ALWAYS AS (cast(`created_at` as date)) STORED,
  `daily_login_date` date GENERATED ALWAYS AS ((case when (`activity_type` = _utf8mb4'daily_login') then cast(`created_at` as date) else NULL end)) STORED,
  `note` varchar(255) DEFAULT NULL,
  `daily_login_key` varchar(128) GENERATED ALWAYS AS ((case when (`activity_type` = _utf8mb4'daily_login') then concat(`user_id`,_utf8mb4'-',`activity_date`) else NULL end)) STORED,
  `metadata` json DEFAULT NULL,
  `metadata_hash` varchar(64) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_daily_login` (`daily_login_key`),
  UNIQUE KEY `uniq_share_daily` (`user_id`,`activity_type`,`activity_date`,`metadata_hash`),
  UNIQUE KEY `uniq_session_reward` (`activity_id`,`activity_type`),
  UNIQUE KEY `uniq_prediction_reward` (`activity_type`,`activity_id`),
  KEY `user_id` (`user_id`),
  KEY `activity_type` (`activity_type`)
) ENGINE=InnoDB AUTO_INCREMENT=1949 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `redeem_codes`
--

DROP TABLE IF EXISTS `redeem_codes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `redeem_codes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `code` varchar(12) NOT NULL,
  `points` int DEFAULT '50',
  `is_used` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `used_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`),
  KEY `idx_code` (`code`),
  KEY `idx_is_used` (`is_used`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `referrals`
--

DROP TABLE IF EXISTS `referrals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `referrals` (
  `id` int NOT NULL AUTO_INCREMENT,
  `referrer_id` int NOT NULL,
  `referred_user_id` int DEFAULT NULL,
  `status` enum('pending','completed') DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `referrer_id` (`referrer_id`),
  KEY `referred_user_id` (`referred_user_id`),
  CONSTRAINT `referrals_ibfk_1` FOREIGN KEY (`referrer_id`) REFERENCES `users` (`id`),
  CONSTRAINT `referrals_ibfk_2` FOREIGN KEY (`referred_user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `share_clicks`
--

DROP TABLE IF EXISTS `share_clicks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `share_clicks` (
  `id` int NOT NULL AUTO_INCREMENT,
  `share_id` int DEFAULT NULL,
  `ip_address` varchar(50) DEFAULT NULL,
  `clicked_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_share_ip` (`share_id`,`ip_address`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `share_links`
--

DROP TABLE IF EXISTS `share_links`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `share_links` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `game_id` varchar(255) DEFAULT NULL,
  `code` varchar(20) DEFAULT NULL,
  `clicks` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `platform` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tags`
--

DROP TABLE IF EXISTS `tags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tags` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=185161 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `teams`
--

DROP TABLE IF EXISTS `teams`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `teams` (
  `sportmonks_id` int NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `logo_url` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`sportmonks_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tiers`
--

DROP TABLE IF EXISTS `tiers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tiers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `min_level` int NOT NULL,
  `perks` json DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user_activity_log`
--

DROP TABLE IF EXISTS `user_activity_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_activity_log` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `activity_type` varchar(50) NOT NULL,
  `game_id` varchar(100) DEFAULT NULL,
  `metadata` json DEFAULT NULL,
  `points_awarded` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `duration_seconds` int DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `activity_type` (`activity_type`),
  CONSTRAINT `user_activity_log_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1152 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user_collections`
--

DROP TABLE IF EXISTS `user_collections`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_collections` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `game_id` varchar(100) NOT NULL,
  `game_source` varchar(50) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_user_game` (`user_id`,`game_id`),
  UNIQUE KEY `unique_user_game` (`user_id`,`game_id`),
  KEY `idx_user` (`user_id`),
  CONSTRAINT `fk_user_collections_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=56 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user_notification_preferences`
--

DROP TABLE IF EXISTS `user_notification_preferences`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_notification_preferences` (
  `user_id` int NOT NULL,
  `game_updates` tinyint(1) DEFAULT '1',
  `new_games` tinyint(1) DEFAULT '1',
  `level_up` tinyint(1) DEFAULT '1',
  `achievements` tinyint(1) DEFAULT '1',
  `community_events` tinyint(1) DEFAULT '0',
  `email_notifications` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`),
  CONSTRAINT `fk_notif_prefs_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user_points`
--

DROP TABLE IF EXISTS `user_points`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_points` (
  `user_id` int NOT NULL,
  `total_points` int DEFAULT '0',
  `current_level` int DEFAULT '1',
  `current_tier` varchar(50) DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`),
  CONSTRAINT `user_points_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user_predictions`
--

DROP TABLE IF EXISTS `user_predictions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_predictions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `match_id` int DEFAULT NULL,
  `option_id` int DEFAULT NULL,
  `stake_points` int DEFAULT NULL,
  `potential_reward` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `is_correct` tinyint(1) DEFAULT NULL,
  `points_awarded` int DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_prediction` (`user_id`,`match_id`),
  UNIQUE KEY `uniq_user_match` (`user_id`,`match_id`),
  KEY `idx_match_id` (`match_id`),
  KEY `idx_option_id` (`option_id`)
) ENGINE=InnoDB AUTO_INCREMENT=69 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user_redemptions`
--

DROP TABLE IF EXISTS `user_redemptions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_redemptions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `code_id` int NOT NULL,
  `points_added` int DEFAULT '50',
  `redeemed_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_user_code` (`user_id`,`code_id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_code_id` (`code_id`),
  CONSTRAINT `user_redemptions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `user_redemptions_ibfk_2` FOREIGN KEY (`code_id`) REFERENCES `redeem_codes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password_hash` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `phone` varchar(20) DEFAULT NULL,
  `provider` enum('local','google','facebook') DEFAULT 'local',
  `is_verified` tinyint(1) DEFAULT '0',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `role` enum('user','admin') NOT NULL DEFAULT 'user',
  `failed_login_attempts` int NOT NULL DEFAULT '0',
  `lock_until` datetime DEFAULT NULL,
  `about_me` text,
  `avatar` varchar(255) DEFAULT NULL,
  `interests` json DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `points` int DEFAULT '0',
  `level` int DEFAULT '1',
  `tier` varchar(20) DEFAULT 'Bronze',
  `referral_code` varchar(12) DEFAULT NULL,
  `referred_by` int DEFAULT NULL,
  `referral_count` int DEFAULT '0',
  `country` varchar(2) DEFAULT 'IN',
  `apple_id` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `phone` (`phone`),
  UNIQUE KEY `referral_code` (`referral_code`),
  UNIQUE KEY `apple_id` (`apple_id`),
  KEY `fk_referred_by` (`referred_by`),
  CONSTRAINT `fk_referred_by` FOREIGN KEY (`referred_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=108 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-03-11 10:22:11


INSERT INTO points_rules
(id, activity_type, points, min_points, max_points, is_active, daily_limit, cooldown_minutes, created_at, updated_at)
VALUES
(1,'daily_login',10,NULL,NULL,1,NULL,NULL,'2026-02-13 16:46:17','2026-02-15 11:58:26'),
(3,'finish_game',10,NULL,NULL,1,NULL,NULL,'2026-02-13 16:46:17','2026-02-13 16:46:17'),
(4,'win_game',25,NULL,NULL,1,NULL,NULL,'2026-02-13 16:46:17','2026-02-13 16:46:17'),
(5,'referral_signup',100,NULL,NULL,1,NULL,NULL,'2026-02-13 16:46:17','2026-02-13 16:46:17'),
(6,'referral_first_play',50,NULL,NULL,1,NULL,NULL,'2026-02-13 16:46:17','2026-02-13 16:46:17'),
(7,'achievement_unlocked',NULL,40,500,1,NULL,NULL,'2026-02-13 16:46:17','2026-02-15 11:17:50'),
(8,'test rule',100,NULL,NULL,1,10,10,'2026-02-15 11:26:37','2026-02-15 11:26:50'),
(9,'random_game_reward',NULL,5,50,1,10,0,'2026-03-02 13:56:57','2026-03-02 13:56:57'),
(10,'game_share',10,NULL,NULL,1,5,0,'2026-03-02 14:04:22','2026-03-02 14:04:22'),
(11,'platform_share',20,NULL,NULL,1,3,0,'2026-03-02 14:04:57','2026-03-02 14:04:57'),
(13,'share_platform',20,NULL,NULL,1,4,NULL,'2026-03-03 10:49:18','2026-03-03 10:49:18'),
(14,'whatsapp_share_click',NULL,5,20,1,NULL,NULL,'2026-03-03 17:51:09','2026-03-03 17:51:09'),
(15,'match_prediction_win',0,NULL,NULL,1,NULL,NULL,'2026-03-06 10:57:02','2026-03-06 10:57:02'),
(21,'whatsapp_share',5,NULL,NULL,1,10,NULL,'2026-03-07 09:34:22','2026-03-07 09:34:22'),
(22,'telegram_share',5,NULL,NULL,1,10,NULL,'2026-03-07 09:40:07','2026-03-07 09:40:07'),
(24,'telegram_share_click',3,NULL,NULL,1,50,NULL,'2026-03-07 09:42:14','2026-03-07 09:42:14'),
(25,'facebook_share',5,NULL,NULL,1,10,NULL,'2026-03-07 09:42:20','2026-03-07 09:42:20'),
(26,'facebook_share_click',3,NULL,NULL,1,50,NULL,'2026-03-07 09:42:20','2026-03-07 09:42:20'),
(27,'x_share',5,NULL,NULL,1,10,NULL,'2026-03-07 09:42:20','2026-03-07 09:42:20'),
(28,'x_share_click',3,NULL,NULL,1,50,NULL,'2026-03-07 09:42:20','2026-03-07 09:42:20')

ON DUPLICATE KEY UPDATE
points = VALUES(points),
min_points = VALUES(min_points),
max_points = VALUES(max_points),
is_active = VALUES(is_active),
daily_limit = VALUES(daily_limit),
cooldown_minutes = VALUES(cooldown_minutes),
updated_at = VALUES(updated_at);

ALTER TABLE share_links
ADD UNIQUE KEY uniq_user_game_platform (user_id, game_id, platform);


INSERT INTO points_rules
(activity_type, points, is_active)
VALUES
('user_registration', 100, 1);

ALTER TABLE matches 
ADD stake_multiplier DECIMAL(3,2) DEFAULT 1.00;


ALTER TABLE matches 
ADD allow_live_predictions TINYINT(1) DEFAULT 0;