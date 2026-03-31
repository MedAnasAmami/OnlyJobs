# OnlyJobs - Fullstack Angular + FastAPI + MySQL

Plateforme de mise en relation clients/freelancers avec:
- authentification client (inscription/connexion)
- consultation des freelancers
- filtres (disponibilite, tarif)
- notation/commentaires
- statistiques globales

## 1. Stack technique

- Frontend: Angular 21
- Backend: FastAPI (Python)
- Base de donnees: MySQL

## 2. Prerequis

Installe ces outils avant de commencer:

- Python 3.10+
- Node.js 20+ (recommande pour Angular 21)
- npm (inclus avec Node.js)
- MySQL Server 8+

Verifications rapides:

```bash
python3 --version
node --version
npm --version
mysql --version
```

## 3. Structure utile du projet

```text
project/
    backend/
        main.py
        database.py
        models.py
        database.sql
        requirements.txt
    frontend/
        package.json
        angular.json
        src/
```

## 4. Installation et lancement

Important: ouvre 2 terminaux (un pour backend, un pour frontend).

### Etape A - Initialiser MySQL

1. Connecte-toi a MySQL:

```bash
mysql -u root -p
```

2. Execute le script SQL (depuis le prompt mysql):

```sql
SOURCE /chemin/absolu/vers/project/backend/database.sql;
```

Exemple:

```sql
SOURCE /home/medanas/Documents/GLSI/Sem2/Mini_Project_Web/project/backend/database.sql;
```

Ce script cree la base `projetweb`, les tables et des donnees de test.

### Etape B - Lancer le backend (FastAPI)

Dans un premier terminal:

```bash
cd /home/medanas/Documents/GLSI/Sem2/Mini_Project_Web/project/backend

# Creer et activer un environnement virtuel
python3 -m venv .venv
source .venv/bin/activate

# Installer les dependances
pip install -r requirements.txt

# Necessaire car backend/database.py utilise mysql.connector
pip install mysql-connector-python

# Lancer l'API
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Backend disponible sur:
- API: http://localhost:8000
- Swagger UI: http://localhost:8000/docs

### Etape C - Lancer le frontend (Angular)

Dans un deuxieme terminal:

```bash
cd /home/medanas/Documents/GLSI/Sem2/Mini_Project_Web/project/frontend
npm install
npm start
```

Frontend disponible sur:
- http://localhost:4200

Le frontend est deja configure pour appeler l'API sur `http://localhost:8000/api`.

## 5. Comptes de test

Tu peux te connecter avec les clients precharges:

- `jean.dupont@email.com` / `password123`
- `marie.martin@email.com` / `password123`
- `pierre.bernard@email.com` / `password123`

## 6. Endpoints principaux

### Clients
- `POST /api/clients`
- `POST /api/clients/login`
- `GET /api/clients`
- `GET /api/clients/{client_id}`

### Freelancers
- `GET /api/freelancers`
- `GET /api/freelancers/{freelancer_id}`
- `POST /api/freelancers`
- `PUT /api/freelancers/{freelancer_id}`
- `DELETE /api/freelancers/{freelancer_id}`

### Ratings
- `GET /api/ratings`
- `GET /api/freelancers/{freelancer_id}/ratings`
- `POST /api/ratings`
- `DELETE /api/ratings/{rating_id}`

### Stats
- `GET /api/stats`

## 7. Probleme frequents et solutions

### Erreur MySQL "Access denied"
- Verifie user/password dans `backend/database.py`.
- Si besoin, mets ton vrai mot de passe MySQL dans `DB_CONFIG["password"]`.

### Erreur "Unknown database projetweb"
- Le script SQL n'a pas ete execute.
- Relance la section "Etape A - Initialiser MySQL".

### Erreur CORS ou frontend sans donnees
- Verifie que le backend tourne sur le port `8000`.
- Verifie que le frontend tourne sur le port `4200`.

### Erreur module `mysql.connector` introuvable
- Execute: `pip install mysql-connector-python`

## 8. Commandes rapides

Backend:

```bash
cd backend
source .venv/bin/activate
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Frontend:

```bash
cd frontend
npm start
```

## 9. Notes

- Le point d'entree backend utilise `backend/main.py`.
- Le dossier `backend/app/` est present mais n'est pas celui lance par la commande `uvicorn main:app` ci-dessus.
