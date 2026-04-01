# OnlyJobs - Guide d'Installation pour Windows

Ce guide explique comment installer et lancer le projet OnlyJobs sur Windows.

## Prerequis

### 1. Python 3.10+
Telechargez et installez Python depuis [python.org](https://www.python.org/downloads/windows/)

**Important:** Cochez "Add Python to PATH" lors de l'installation.

Verifiez l'installation:
```cmd
python --version
pip --version
```

### 2. Node.js 18+
Telechargez et installez Node.js depuis [nodejs.org](https://nodejs.org/)

Verifiez l'installation:
```cmd
node --version
npm --version
```

### 3. MySQL 8.0+
Telechargez et installez MySQL depuis [mysql.com](https://dev.mysql.com/downloads/mysql/)

Vous pouvez aussi utiliser XAMPP ou WampServer qui incluent MySQL.

### 4. Git (optionnel)
Telechargez et installez Git depuis [git-scm.com](https://git-scm.com/download/win)

---

## Installation

### Etape 1: Cloner ou Telecharger le Projet

**Option A - Avec Git:**
```cmd
git clone <url-du-projet>
cd project
```

**Option B - Sans Git:**
Telechargez le ZIP et extrayez-le.

---

### Etape 2: Configurer la Base de Donnees

1. Ouvrez MySQL Workbench ou le terminal MySQL:
```cmd
mysql -u root -p
```

2. Executez le script SQL:
```sql
source C:\chemin\vers\project\backend\onlyjobs.sql
```

Ou importez le fichier via MySQL Workbench.

---

### Etape 3: Configurer le Backend

1. Ouvrez un terminal (CMD ou PowerShell) et naviguez vers le dossier backend:
```cmd
cd backend
```

2. Creez un environnement virtuel:
```cmd
python -m venv venv
```

3. Activez l'environnement virtuel:

**CMD:**
```cmd
venv\Scripts\activate
```

**PowerShell:**
```powershell
.\venv\Scripts\Activate.ps1
```

> Note: Si PowerShell bloque les scripts, executez d'abord:
> ```powershell
> Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
> ```

4. Installez les dependances:
```cmd
pip install -r requirements.txt
```

5. Configurez la connexion a la base de donnees (si necessaire):

Editez `backend/database.py` si votre MySQL a un mot de passe:
```python
DATABASE_URL = "mysql+pymysql://root:votre_mot_de_passe@localhost/onlyjobs"
```

---

### Etape 4: Configurer le Frontend

1. Ouvrez un **nouveau** terminal et naviguez vers le dossier frontend:
```cmd
cd frontend
```

2. Installez les dependances:
```cmd
npm install
```

---

## Lancement

### Terminal 1 - Backend (FastAPI)
```cmd
cd backend
venv\Scripts\activate
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Le backend sera accessible sur: http://localhost:8000
Documentation API: http://localhost:8000/docs

### Terminal 2 - Frontend (Angular)
```cmd
cd frontend
ng serve
```

Le frontend sera accessible sur: http://localhost:4200

---

## Comptes de Test

| Role       | Email              | Mot de passe |
|------------|-------------------|--------------|
| Freelancer | ali@gmail.com     | 123456       |
| Freelancer | sami@gmail.com    | 123456       |
| Admin      | admin@gmail.com   | admin123     |
| Client     | client@gmail.com  | client123    |

---

## Problemes Courants sur Windows

### 1. "python" n'est pas reconnu
- Reinstallez Python en cochant "Add Python to PATH"
- Ou ajoutez manuellement Python au PATH systeme

### 2. "ng" n'est pas reconnu
Installez Angular CLI globalement:
```cmd
npm install -g @angular/cli
```

### 3. Erreur de connexion MySQL
- Verifiez que MySQL est en cours d'execution
- Verifiez les identifiants dans `database.py`
- Par defaut: utilisateur `root` sans mot de passe

### 4. Port deja utilise
- Port 8000 occupe: `netstat -ano | findstr :8000`
- Port 4200 occupe: `netstat -ano | findstr :4200`
- Tuez le processus: `taskkill /PID <pid> /F`

### 5. Erreur PowerShell "Scripts disabled"
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### 6. Erreur "Module not found"
Assurez-vous d'avoir active l'environnement virtuel:
```cmd
venv\Scripts\activate
```

---

## Structure du Projet

```
project/
├── backend/                 # API FastAPI
│   ├── main.py             # Point d'entree API
│   ├── models.py           # Modeles SQLModel
│   ├── database.py         # Configuration DB
│   ├── requirements.txt    # Dependances Python
│   └── onlyjobs.sql        # Schema de base de donnees
│
├── frontend/               # Application Angular
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/ # Composants UI
│   │   │   ├── services/   # Services HTTP
│   │   │   └── models/     # Interfaces TypeScript
│   │   └── environments/   # Configuration
│   └── package.json        # Dependances Node
│
└── README.md               # Documentation principale
```

---

## Fonctionnalites

- **Authentification**: Inscription/Connexion (Client, Freelancer, Admin)
- **Profils Freelancers**: Consultation, competences, experience
- **Annonces**: Creation et gestion d'annonces
- **Notations**: Les clients peuvent noter les freelancers (1-5 etoiles)
- **Signalements**: Systeme de signalement des freelancers
- **Statistiques**: Tableau de bord avec metriques

---

## Support

En cas de probleme, verifiez:
1. La console du navigateur (F12 > Console)
2. Le terminal du backend pour les erreurs Python
3. Le terminal du frontend pour les erreurs Angular
