-- Base de donnees pour la plateforme FreelanceHub
-- Creer la base de donnees
CREATE DATABASE IF NOT EXISTS projetweb;
USE projetweb;

-- Table des clients
CREATE TABLE IF NOT EXISTS client (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des freelancers
CREATE TABLE IF NOT EXISTS freelancer (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    description TEXT,
    competences VARCHAR(255),
    tarif_horaire DECIMAL(10, 2) DEFAULT 0.00,
    image_url VARCHAR(255) DEFAULT '',
    disponible BOOLEAN DEFAULT TRUE,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des ratings/avis
CREATE TABLE IF NOT EXISTS rating (
    id INT AUTO_INCREMENT PRIMARY KEY,
    note INT NOT NULL CHECK (note >= 1 AND note <= 5),
    commentaire TEXT,
    freelancer_id INT NOT NULL,
    client_id INT NOT NULL,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (freelancer_id) REFERENCES freelancer(id) ON DELETE CASCADE,
    FOREIGN KEY (client_id) REFERENCES client(id) ON DELETE CASCADE
);

-- Donnees de test - Clients
INSERT INTO client (nom, prenom, email, password) VALUES
('Petit', 'Jean', 'jean.petit@email.com', 'password123'),
('Robert', 'Claire', 'claire.robert@email.com', 'password123'),
('Richard', 'Marc', 'marc.richard@email.com', 'password123'),
('Simon', 'Julie', 'julie.simon@email.com', 'password123');

-- Donnees de test - Freelancers
INSERT INTO freelancer (nom, prenom, email, description, competences, tarif_horaire, image_url, disponible) VALUES
('Dupont', 'Marie', 'marie.dupont@email.com', 'Developpeuse web full-stack avec 5 ans d''experience. Specialisee en React et Node.js.', 'HTML, CSS, JavaScript, React, Node.js', 45.00, 'https://randomuser.me/api/portraits/women/1.jpg', TRUE),
('Martin', 'Pierre', 'pierre.martin@email.com', 'Designer UI/UX passionne. Je cree des interfaces modernes et intuitives.', 'Figma, Adobe XD, Photoshop, UI/UX', 50.00, 'https://randomuser.me/api/portraits/men/1.jpg', TRUE),
('Bernard', 'Sophie', 'sophie.bernard@email.com', 'Experte en marketing digital et SEO. J''aide les entreprises a augmenter leur visibilite.', 'SEO, Google Ads, Social Media, Analytics', 40.00, 'https://randomuser.me/api/portraits/women/2.jpg', TRUE),
('Dubois', 'Lucas', 'lucas.dubois@email.com', 'Developpeur mobile iOS et Android. Applications natives et cross-platform.', 'Swift, Kotlin, Flutter, React Native', 55.00, 'https://randomuser.me/api/portraits/men/2.jpg', TRUE),
('Moreau', 'Emma', 'emma.moreau@email.com', 'Redactrice web et copywriter. Contenu optimise SEO et engageant.', 'Redaction, SEO, Copywriting, WordPress', 35.00, 'https://randomuser.me/api/portraits/women/3.jpg', TRUE),
('Leroy', 'Thomas', 'thomas.leroy@email.com', 'DevOps et administrateur systeme. Infrastructure cloud et CI/CD.', 'AWS, Docker, Kubernetes, Linux, CI/CD', 60.00, 'https://randomuser.me/api/portraits/men/3.jpg', FALSE);

-- Donnees de test - Ratings
INSERT INTO rating (note, commentaire, freelancer_id, client_id) VALUES
(5, 'Excellent travail ! Marie a livre le projet dans les delais avec une qualite exceptionnelle.', 1, 1),
(4, 'Tres professionnelle et reactive. Je recommande.', 1, 2),
(5, 'Pierre a cree un design magnifique pour notre application. Tres satisfait !', 2, 1),
(5, 'Creatif et a l''ecoute. Le resultat depasse nos attentes.', 2, 3),
(4, 'Sophie a ameliore notre SEO de maniere significative. Bon travail.', 3, 2),
(5, 'Lucas a developpe une app mobile parfaite. Tres competent.', 4, 1),
(4, 'Bon developpeur, communication claire.', 4, 4),
(5, 'Emma ecrit des contenus captivants. Notre blog a gagne en trafic.', 5, 3),
(5, 'Thomas a mis en place notre infrastructure cloud rapidement et efficacement.', 6, 1);
