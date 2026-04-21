-- OnlyJobs Database Schema
-- This file can be run multiple times safely

CREATE DATABASE IF NOT EXISTS onlyjobs;
USE onlyjobs;

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT;
SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS;
SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION;
SET NAMES utf8mb4;
START TRANSACTION;
SET time_zone = "+00:00";

-- Drop tables in reverse order (respect foreign key constraints)
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `report`;
DROP TABLE IF EXISTS `rating`;
DROP TABLE IF EXISTS `profil`;
DROP TABLE IF EXISTS `annonce`;
DROP TABLE IF EXISTS `freelancer`;
DROP TABLE IF EXISTS `client`;
DROP TABLE IF EXISTS `admin`;
DROP TABLE IF EXISTS `utilisateur`;
SET FOREIGN_KEY_CHECKS = 1;

-- --------------------------------------------------------
-- Table `utilisateur`
-- --------------------------------------------------------
CREATE TABLE `utilisateur` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nom` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `motDePasse` varchar(255) NOT NULL,
  `telephone` varchar(25) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `utilisateur` (`id`, `nom`, `email`, `motDePasse`, `telephone`) VALUES
(1, 'Ali Ben Salah', 'ali@gmail.com', '123456', '20123456'),
(2, 'Sami Trabelsi', 'sami@gmail.com', '123456', '22123456'),
(3, 'Admin User', 'admin@gmail.com', 'admin123', '99123456'),
(4, 'Client User', 'client@gmail.com', 'client123', '55123456');

-- --------------------------------------------------------
-- Table `admin`
-- --------------------------------------------------------
CREATE TABLE `admin` (
  `id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `admin_ibfk_1` FOREIGN KEY (`id`) REFERENCES `utilisateur` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `admin` (`id`) VALUES (3);

-- --------------------------------------------------------
-- Table `client`
-- --------------------------------------------------------
CREATE TABLE `client` (
  `id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `client_ibfk_1` FOREIGN KEY (`id`) REFERENCES `utilisateur` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `client` (`id`) VALUES (4);

-- --------------------------------------------------------
-- Table `freelancer`
-- --------------------------------------------------------
CREATE TABLE `freelancer` (
  `id` int(11) NOT NULL,
  `status` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `freelancer_ibfk_1` FOREIGN KEY (`id`) REFERENCES `utilisateur` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `freelancer` (`id`, `status`) VALUES
(1, 'Disponible'),
(2, 'Occupe');

-- --------------------------------------------------------
-- Table `profil`
-- --------------------------------------------------------
CREATE TABLE `profil` (
  `idProfil` int(11) NOT NULL AUTO_INCREMENT,
  `photo` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `competences` text DEFAULT NULL,
  `experience` text DEFAULT NULL,
  `statut` varchar(50) NOT NULL DEFAULT 'en_attente',
  `freelancer_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`idProfil`),
  UNIQUE KEY `freelancer_id` (`freelancer_id`),
  CONSTRAINT `profil_ibfk_1` FOREIGN KEY (`freelancer_id`) REFERENCES `freelancer` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `profil` (`idProfil`, `photo`, `description`, `competences`, `experience`, `statut`, `freelancer_id`) VALUES
(1, 'photo1.jpg', 'Developpeur web', 'HTML, CSS, JS', '2 ans', 'accepte', 1),
(2, 'photo2.jpg', 'Designer graphique', 'Photoshop, Illustrator', '3 ans', 'accepte', 2);

-- --------------------------------------------------------
-- Table `annonce`
-- --------------------------------------------------------
CREATE TABLE `annonce` (
  `idAnnonce` int(11) NOT NULL AUTO_INCREMENT,
  `titre` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `image` varchar(500) DEFAULT NULL,
  `dateCreation` date DEFAULT NULL,
  `statut` varchar(50) NOT NULL DEFAULT 'en_attente',
  `freelancer_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`idAnnonce`),
  KEY `freelancer_id` (`freelancer_id`),
  CONSTRAINT `annonce_ibfk_1` FOREIGN KEY (`freelancer_id`) REFERENCES `freelancer` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `annonce` (`idAnnonce`, `titre`, `description`, `dateCreation`, `statut`, `freelancer_id`) VALUES
(1, 'Creation site web', 'Je propose la creation de sites modernes', '2026-03-30', 'accepte', 1),
(2, 'Logo professionnel', 'Conception de logos uniques', '2026-03-30', 'accepte', 2),
(3, 'Application mobile', 'Developpement Android/iOS', '2026-03-30', 'accepte', 1);

-- --------------------------------------------------------
-- Table `rating`
-- --------------------------------------------------------
CREATE TABLE `rating` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `note` int(11) NOT NULL CHECK (`note` >= 1 AND `note` <= 5),
  `commentaire` varchar(500) DEFAULT NULL,
  `date_creation` datetime DEFAULT NULL,
  `freelancer_id` int(11) NOT NULL,
  `client_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `freelancer_id` (`freelancer_id`),
  KEY `client_id` (`client_id`),
  CONSTRAINT `rating_ibfk_1` FOREIGN KEY (`freelancer_id`) REFERENCES `freelancer` (`id`),
  CONSTRAINT `rating_ibfk_2` FOREIGN KEY (`client_id`) REFERENCES `client` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Table `report`
-- --------------------------------------------------------
CREATE TABLE `report` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `raison` varchar(100) NOT NULL,
  `description` varchar(500) DEFAULT NULL,
  `date_creation` datetime DEFAULT NULL,
  `statut` varchar(50) DEFAULT 'en_attente',
  `freelancer_id` int(11) NOT NULL,
  `reporter_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `freelancer_id` (`freelancer_id`),
  KEY `reporter_id` (`reporter_id`),
  CONSTRAINT `report_ibfk_1` FOREIGN KEY (`freelancer_id`) REFERENCES `freelancer` (`id`),
  CONSTRAINT `report_ibfk_2` FOREIGN KEY (`reporter_id`) REFERENCES `utilisateur` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

COMMIT;

SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT;
SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS;
SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION;
