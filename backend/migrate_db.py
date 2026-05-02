import sys
import os

# Add backend to path so we can import database
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from database import engine
from sqlalchemy import text

def run_migrations():
    with engine.begin() as conn:
        # Ensure `service` table exists (some local DBs were created without it)
        try:
            conn.execute(text("""
                CREATE TABLE IF NOT EXISTS service (
                    idService INT(11) NOT NULL AUTO_INCREMENT,
                    titre VARCHAR(255) NOT NULL,
                    description TEXT DEFAULT NULL,
                    delai INT(11) NOT NULL,
                    categorie VARCHAR(100) NOT NULL,
                    statut VARCHAR(50) NOT NULL DEFAULT 'actif',
                    freelancer_id INT(11) NOT NULL,
                    annonce_id INT(11) DEFAULT NULL,
                    client_id INT(11) DEFAULT NULL,
                    date_choix DATETIME DEFAULT NULL,
                    PRIMARY KEY (idService)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
            """))
            print("Ensured table 'service' exists.")
        except Exception as e:
            print(f"Error ensuring table 'service' exists: {e}")

        try:
            conn.execute(text("ALTER TABLE utilisateur ADD COLUMN img VARCHAR(255) NULL;"))
            print("Successfully added 'img' to utilisateur.")
        except Exception as e:
            print(f"Column 'img' might already exist or error: {e}")

        try:
            conn.execute(text("ALTER TABLE profil ADD COLUMN statut VARCHAR(50) DEFAULT 'en_attente';"))
            print("Successfully added 'statut' to profil.")
        except Exception as e:
            print(f"Column 'statut' might already exist in profil or error: {e}")

        try:
            conn.execute(text("ALTER TABLE annonce ADD COLUMN statut VARCHAR(50) DEFAULT 'en_attente';"))
            print("Successfully added 'statut' to annonce.")
        except Exception as e:
            print(f"Column 'statut' might already exist in annonce or error: {e}")

        try:
            conn.execute(text("ALTER TABLE annonce ADD COLUMN categorie VARCHAR(100) NOT NULL DEFAULT 'General';"))
            print("Successfully added 'categorie' to annonce.")
        except Exception as e:
            print(f"Column 'categorie' might already exist in annonce or error: {e}")

        try:
            conn.execute(text("ALTER TABLE annonce ADD COLUMN delai INT NOT NULL DEFAULT 7;"))
            print("Successfully added 'delai' to annonce.")
        except Exception as e:
            print(f"Column 'delai' might already exist in annonce or error: {e}")

        try:
            conn.execute(text("ALTER TABLE report ADD COLUMN statut VARCHAR(50) DEFAULT 'en_attente';"))
            print("Successfully added 'statut' to report.")
        except Exception as e:
            print(f"Column 'statut' might already exist in report or error: {e}")

        # Support reporting clients as well as freelancers
        # 1) Allow freelancer_id to be NULL (so a report can target a client)
        try:
            conn.execute(text("ALTER TABLE report MODIFY COLUMN freelancer_id INT(11) NULL;"))
            print("Updated 'freelancer_id' to be NULLable in report.")
        except Exception as e:
            print(f"Could not modify 'freelancer_id' nullability in report (maybe already NULLable): {e}")

        # 2) Ensure FK on freelancer_id does not block deletions (SET NULL)
        try:
            conn.execute(text("ALTER TABLE report DROP FOREIGN KEY report_ibfk_1;"))
            print("Dropped old FK report_ibfk_1.")
        except Exception as e:
            print(f"Could not drop FK report_ibfk_1 (maybe missing): {e}")

        try:
            conn.execute(text("ALTER TABLE report ADD CONSTRAINT report_ibfk_1 FOREIGN KEY (freelancer_id) REFERENCES freelancer(id) ON DELETE SET NULL;"))
            print("Added FK report_ibfk_1 with ON DELETE SET NULL.")
        except Exception as e:
            print(f"Could not add FK report_ibfk_1 with ON DELETE SET NULL (maybe already set): {e}")

        # 3) Add client_id target column + FK that won't block deletions
        try:
            conn.execute(text("ALTER TABLE report ADD COLUMN client_id INT(11) NULL;"))
            print("Successfully added 'client_id' to report.")
        except Exception as e:
            print(f"Column 'client_id' might already exist in report or error: {e}")

        try:
            conn.execute(text("ALTER TABLE report ADD INDEX idx_report_client_id (client_id);"))
            print("Added index idx_report_client_id.")
        except Exception as e:
            print(f"Index idx_report_client_id might already exist in report or error: {e}")

        try:
            conn.execute(text("ALTER TABLE report ADD CONSTRAINT report_ibfk_3 FOREIGN KEY (client_id) REFERENCES client(id) ON DELETE SET NULL;"))
            print("Added FK report_ibfk_3 with ON DELETE SET NULL.")
        except Exception as e:
            print(f"Could not add FK report_ibfk_3 (maybe already exists): {e}")

        # If an older DB has `prix`, drop it (orders don't have price)
        try:
            conn.execute(text("ALTER TABLE service DROP COLUMN prix;"))
            print("Successfully dropped 'prix' from service.")
        except Exception as e:
            print(f"Column 'prix' might not exist in service or error: {e}")

if __name__ == "__main__":
    run_migrations()