# OnlyJobs - Fullstack Angular + FastAPI + MySQL

Plateforme de mise en relation clients/freelancers avec:
- authentification client (inscription/connexion)
- consultation des freelancers
- systeme de notation (1-5 etoiles)
- signalement des profils
- statistiques globales

**Guide Windows:** Consultez [readmeWindows.md](./readmeWindows.md)

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

Important: ouvre 2 terminaux (un pour backend, un pour frontend).

### Etape A - Initialiser MySQL

1. Connecte-toi a MySQL:

```bash
mysql -u root onlyjobs
```
Exemple:

```sql
SOURCE /home/medanas/Documents/GLSI/Sem2/Mini_Project_Web/OnlyJobs/backend/onlyjobs.sql;
```

Ce script cree la base `onlyjobs`, les tables et des donnees de test.

### Etape B - Lancer le backend (FastAPI)

Dans un premier terminal:

```bash
cd /home/medanas/Documents/GLSI/Sem2/Mini_Project_Web/OnlyJobs/backend

# Creer et activer un environnement virtuel
python3 -m venv .venv
source .venv/bin/activate

# Installer les dependances
pip install -r requirements.txt

# Necessaire car backend/database.py utilise mysql.connector
python -m pip install fastapi uvicorn sqlmodel mysql-connector-python
python -m pip install pymysql
# Lancer l'API
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Backend disponible sur:
- API: http://localhost:8000
- Swagger UI: http://localhost:8000/docs

### Etape C - Lancer le frontend (Angular)

Dans un deuxieme terminal:

```bash
cd /home/medanas/Documents/GLSI/Sem2/Mini_Project_Web/OnlyJobs/frontend
npm install
npm start
```

Frontend disponible sur:
- http://localhost:4200

Le frontend est deja configure pour appeler l'API sur `http://localhost:8000/api`.

## 5. Comptes de test

| Role       | Email              | Mot de passe |
|------------|-------------------|--------------|
| Freelancer | ali@gmail.com     | 123456       |
| Freelancer | sami@gmail.com    | 123456       |
| Admin      | admin@gmail.com   | admin123     |
| Client     | client@gmail.com  | client123    |

## 6. Endpoints principaux

### Authentification
- `POST /login` - Connexion
- `POST /register` - Inscription

### Freelancers
- `GET /freelancers` - Liste des freelancers
- `GET /freelancers/{id}` - Detail d'un freelancer
- `GET /freelancers/{id}/detail` - Detail complet avec profil
- `GET /freelancers/{id}/ratings` - Notations d'un freelancer
- `GET /freelancers/{id}/average-rating` - Note moyenne

### Ratings (Notations)
- `GET /ratings` - Liste des notations
- `POST /ratings` - Creer une notation
- `DELETE /ratings/{id}` - Supprimer une notation

### Reports (Signalements)
- `GET /reports` - Liste des signalements
- `POST /reports` - Creer un signalement
- `PUT /reports/{id}/status` - Mettre a jour le statut

### Stats
- `GET /stats` - Statistiques de la plateforme

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
