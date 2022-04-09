SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;

SET NAMES utf8mb4;

CREATE TABLE `tcr_danmaku` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `vid` text NOT NULL,
  `author` text NULL,
  `color` text NOT NULL,
  `text` text NOT NULL,
  `time` float NOT NULL,
  `type` text NOT NULL,
  `metadata` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `tcr_user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` char(26) NOT NULL UNIQUE,
  `name` text NOT NULL,
  `email` text NOT NULL,
  `following` text NOT NULL,
  `collection` text NOT NULL,
  `avatar_url` text NOT NULL,
  `metadata` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;