-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : ven. 01 mai 2026 à 12:14
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `onlyjobs`
--

-- --------------------------------------------------------

--
-- Structure de la table `admin`
--

CREATE TABLE `admin` (
  `id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `admin`
--

INSERT INTO `admin` (`id`) VALUES
(3);

-- --------------------------------------------------------

--
-- Structure de la table `annonce`
--

CREATE TABLE `annonce` (
  `idAnnonce` int(11) NOT NULL,
  `titre` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `categorie` varchar(100) NOT NULL DEFAULT 'General',
  `delai` int(11) NOT NULL DEFAULT 7,
  `image` varchar(500) DEFAULT NULL,
  `dateCreation` date DEFAULT NULL,
  `statut` varchar(50) NOT NULL DEFAULT 'en_attente',
  `freelancer_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `annonce`
--

INSERT INTO `annonce` (`idAnnonce`, `titre`, `description`, `categorie`, `delai`, `image`, `dateCreation`, `statut`, `freelancer_id`) VALUES
(1, 'Creation site web', 'Je propose la creation de sites modernes', 'Web', 7, NULL, '2026-03-30', 'accepte', 1),
(2, 'Logo professionnel', 'Conception de logos uniques', 'Design', 3, NULL, '2026-03-30', 'accepte', 2),
(3, 'Application mobile', 'Developpement Android/iOS', 'Web', 30, NULL, '2026-03-30', 'accepte', 1);

-- --------------------------------------------------------

--
-- Structure de la table `client`
--

CREATE TABLE `client` (
  `id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `client`
--

INSERT INTO `client` (`id`) VALUES
(4);

-- --------------------------------------------------------

--
-- Structure de la table `freelancer`
--

CREATE TABLE `freelancer` (
  `id` int(11) NOT NULL,
  `status` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `freelancer`
--

INSERT INTO `freelancer` (`id`, `status`) VALUES
(1, 'Disponible'),
(2, 'Occupe');

-- --------------------------------------------------------

--
-- Structure de la table `profil`
--

CREATE TABLE `profil` (
  `idProfil` int(11) NOT NULL,
  `photo` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `competences` text DEFAULT NULL,
  `experience` text DEFAULT NULL,
  `statut` varchar(50) NOT NULL DEFAULT 'en_attente',
  `freelancer_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `profil`
--

INSERT INTO `profil` (`idProfil`, `photo`, `description`, `competences`, `experience`, `statut`, `freelancer_id`) VALUES
(1, 'photo1.jpg', 'Developpeur web', 'HTML, CSS, JS', '2 ans', 'accepte', 1),
(2, 'photo2.jpg', 'Designer graphique', 'Photoshop, Illustrator', '3 ans', 'accepte', 2);

-- --------------------------------------------------------

--
-- Structure de la table `rating`
--

CREATE TABLE `rating` (
  `id` int(11) NOT NULL,
  `note` int(11) NOT NULL CHECK (`note` >= 1 and `note` <= 5),
  `commentaire` varchar(500) DEFAULT NULL,
  `date_creation` datetime DEFAULT NULL,
  `freelancer_id` int(11) NOT NULL,
  `client_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `report`
--

CREATE TABLE `report` (
  `id` int(11) NOT NULL,
  `raison` varchar(100) NOT NULL,
  `description` varchar(500) DEFAULT NULL,
  `date_creation` datetime DEFAULT NULL,
  `statut` varchar(50) DEFAULT 'en_attente',
  `freelancer_id` int(11) DEFAULT NULL,
  `client_id` int(11) DEFAULT NULL,
  `reporter_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `service`
--

CREATE TABLE `service` (
  `idService` int(11) NOT NULL,
  `titre` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `delai` int(11) NOT NULL COMMENT 'Delai de livraison en jours',
  `categorie` varchar(100) NOT NULL,
  `statut` varchar(50) NOT NULL DEFAULT 'actif',
  `freelancer_id` int(11) NOT NULL,
  `annonce_id` int(11) DEFAULT NULL,
  `client_id` int(11) DEFAULT NULL,
  `date_choix` datetime DEFAULT NULL
) ;

--
-- Déchargement des données de la table `service`
--

INSERT INTO `service` (`idService`, `titre`, `description`, `delai`, `categorie`, `statut`, `freelancer_id`, `annonce_id`, `client_id`, `date_choix`) VALUES
(1, 'Site Web Vitrine', 'Site responsive HTML/CSS/JS', 7, 'Web', 'actif', 1, 1, NULL, NULL),
(2, 'Logo Professionnel', 'Conception de logo unique', 3, 'Design', 'actif', 2, 2, NULL, NULL),
(3, 'Application Mobile Android', 'Dev Android natif', 30, 'Web', 'actif', 1, 3, NULL, NULL);

-- --------------------------------------------------------

--
-- Structure de la table `utilisateur`
--

CREATE TABLE `utilisateur` (
  `id` int(11) NOT NULL,
  `nom` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `motDePasse` varchar(255) NOT NULL,
  `telephone` varchar(25) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `utilisateur`
--

INSERT INTO `utilisateur` (`id`, `nom`, `email`, `motDePasse`, `telephone`) VALUES
(1, 'Ali Ben Salah', 'ali@gmail.com', '123456', '20123456'),
(2, 'Sami Trabelsi', 'sami@gmail.com', '123456', '22123456'),
(3, 'Admin User', 'admin@gmail.com', 'admin123', '99123456'),
(4, 'Client User', 'client@gmail.com', 'client123', '55123456');

-- --------------------------------------------------------

--
-- Structure de la table `verification`
--

CREATE TABLE `verification` (
  `idVerification` int(11) NOT NULL,
  `dateSoumission` datetime NOT NULL DEFAULT current_timestamp(),
  `statut` varchar(50) NOT NULL DEFAULT 'en_attente',
  `commentaireAdmin` text DEFAULT NULL,
  `freelancer_id` int(11) NOT NULL,
  `admin_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `verification`
--

INSERT INTO `verification` (`idVerification`, `dateSoumission`, `statut`, `commentaireAdmin`, `freelancer_id`, `admin_id`) VALUES
(1, '2026-04-12 10:30:00', 'verifie', 'Documents conformes', 1, 3),
(2, '2026-04-13 09:15:00', 'en_attente', NULL, 2, NULL);

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `annonce`
--
ALTER TABLE `annonce`
  ADD PRIMARY KEY (`idAnnonce`),
  ADD KEY `freelancer_id` (`freelancer_id`);

--
-- Index pour la table `client`
--
ALTER TABLE `client`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `freelancer`
--
ALTER TABLE `freelancer`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `profil`
--
ALTER TABLE `profil`
  ADD PRIMARY KEY (`idProfil`),
  ADD UNIQUE KEY `freelancer_id` (`freelancer_id`);

--
-- Index pour la table `rating`
--
ALTER TABLE `rating`
  ADD PRIMARY KEY (`id`),
  ADD KEY `freelancer_id` (`freelancer_id`),
  ADD KEY `client_id` (`client_id`);

--
-- Index pour la table `report`
--
ALTER TABLE `report`
  ADD PRIMARY KEY (`id`),
  ADD KEY `freelancer_id` (`freelancer_id`),
  ADD KEY `reporter_id` (`reporter_id`);

--
-- Index pour la table `service`
--
ALTER TABLE `service`
  ADD PRIMARY KEY (`idService`),
  ADD KEY `service_freelancer_idx` (`freelancer_id`),
  ADD KEY `service_annonce_idx` (`annonce_id`),
  ADD KEY `service_categorie_idx` (`categorie`),
  ADD KEY `service_client_idx` (`client_id`);

--
-- Index pour la table `utilisateur`
--
ALTER TABLE `utilisateur`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `verification`
--
ALTER TABLE `verification`
  ADD PRIMARY KEY (`idVerification`),
  ADD KEY `verif_freelancer_idx` (`freelancer_id`),
  ADD KEY `verif_admin_idx` (`admin_id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `annonce`
--
ALTER TABLE `annonce`
  MODIFY `idAnnonce` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pour la table `profil`
--
ALTER TABLE `profil`
  MODIFY `idProfil` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `rating`
--
ALTER TABLE `rating`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `report`
--
ALTER TABLE `report`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `service`
--
ALTER TABLE `service`
  MODIFY `idService` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `utilisateur`
--
ALTER TABLE `utilisateur`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT pour la table `verification`
--
ALTER TABLE `verification`
  MODIFY `idVerification` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `admin`
--
ALTER TABLE `admin`
  ADD CONSTRAINT `admin_ibfk_1` FOREIGN KEY (`id`) REFERENCES `utilisateur` (`id`);

--
-- Contraintes pour la table `annonce`
--
ALTER TABLE `annonce`
  ADD CONSTRAINT `annonce_ibfk_1` FOREIGN KEY (`freelancer_id`) REFERENCES `freelancer` (`id`);

--
-- Contraintes pour la table `client`
--
ALTER TABLE `client`
  ADD CONSTRAINT `client_ibfk_1` FOREIGN KEY (`id`) REFERENCES `utilisateur` (`id`);

--
-- Contraintes pour la table `freelancer`
--
ALTER TABLE `freelancer`
  ADD CONSTRAINT `freelancer_ibfk_1` FOREIGN KEY (`id`) REFERENCES `utilisateur` (`id`);

--
-- Contraintes pour la table `profil`
--
ALTER TABLE `profil`
  ADD CONSTRAINT `profil_ibfk_1` FOREIGN KEY (`freelancer_id`) REFERENCES `freelancer` (`id`);

--
-- Contraintes pour la table `rating`
--
ALTER TABLE `rating`
  ADD CONSTRAINT `rating_ibfk_1` FOREIGN KEY (`freelancer_id`) REFERENCES `freelancer` (`id`),
  ADD CONSTRAINT `rating_ibfk_2` FOREIGN KEY (`client_id`) REFERENCES `client` (`id`);

--
-- Contraintes pour la table `report`
--
ALTER TABLE `report`
  ADD CONSTRAINT `report_ibfk_1` FOREIGN KEY (`freelancer_id`) REFERENCES `freelancer` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `report_ibfk_2` FOREIGN KEY (`reporter_id`) REFERENCES `utilisateur` (`id`),
  ADD CONSTRAINT `report_ibfk_3` FOREIGN KEY (`client_id`) REFERENCES `client` (`id`) ON DELETE SET NULL;

--
-- Contraintes pour la table `service`
--
ALTER TABLE `service`
  ADD CONSTRAINT `service_ibfk_1` FOREIGN KEY (`freelancer_id`) REFERENCES `freelancer` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `service_ibfk_2` FOREIGN KEY (`annonce_id`) REFERENCES `annonce` (`idAnnonce`) ON DELETE SET NULL,
  ADD CONSTRAINT `service_ibfk_3` FOREIGN KEY (`client_id`) REFERENCES `client` (`id`) ON DELETE SET NULL;

--
-- Contraintes pour la table `verification`
--
ALTER TABLE `verification`
  ADD CONSTRAINT `verification_ibfk_1` FOREIGN KEY (`freelancer_id`) REFERENCES `freelancer` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `verification_ibfk_2` FOREIGN KEY (`admin_id`) REFERENCES `admin` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
