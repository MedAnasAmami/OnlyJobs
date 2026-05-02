-- Update existing tables for image and status administration

USE onlyjobs;

-- Add photo to utilisateur
ALTER TABLE utilisateur ADD COLUMN img VARCHAR(255) NULL;

-- Add status for profils
ALTER TABLE profil ADD COLUMN statut VARCHAR(50) DEFAULT 'en_attente';

-- Add status for annonces
ALTER TABLE annonce ADD COLUMN statut VARCHAR(50) DEFAULT 'en_attente';

-- Add categorie and delai for annonces (annonce = service)
ALTER TABLE annonce ADD COLUMN categorie VARCHAR(100) NOT NULL DEFAULT 'General';
ALTER TABLE annonce ADD COLUMN delai INT NOT NULL DEFAULT 7;

-- Reports: allow targeting either freelancer or client
ALTER TABLE report MODIFY COLUMN freelancer_id INT(11) NULL;
ALTER TABLE report ADD COLUMN client_id INT(11) NULL;

-- Make sure deleting reported users is not blocked by reports
ALTER TABLE report DROP FOREIGN KEY report_ibfk_1;
ALTER TABLE report ADD CONSTRAINT report_ibfk_1 FOREIGN KEY (freelancer_id) REFERENCES freelancer(id) ON DELETE SET NULL;

ALTER TABLE report ADD CONSTRAINT report_ibfk_3 FOREIGN KEY (client_id) REFERENCES client(id) ON DELETE SET NULL;
