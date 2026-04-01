# main.py - API FastAPI pour OnlyJobs avec SQLModel
from fastapi import FastAPI, Depends, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from database import get_session
from sqlmodel import Session, select, func
from models import Utilisateur, Freelancer, Admin, Client, Profil, Annonce, Authentification, Rating, Report
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
import os
import uuid

app = FastAPI(
    title="OnlyJobs API",
    description="API pour la plateforme de freelancing OnlyJobs",
    version="2.0.0"
)

# Configuration du dossier uploads
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Servir les fichiers statiques (images uploadees)
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

# Configuration CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============= SCHEMAS PYDANTIC =============
class LoginRequest(BaseModel):
    email: str
    motDePasse: str

class RegisterRequest(BaseModel):
    nom: str
    email: str
    motDePasse: str
    telephone: str
    role: str  # 'client', 'freelancer', 'admin'

class ProfilUpdate(BaseModel):
    photo: Optional[str] = None
    description: Optional[str] = None
    competences: Optional[str] = None
    experience: Optional[str] = None

class AnnonceUpdate(BaseModel):
    titre: Optional[str] = None
    description: Optional[str] = None
    image: Optional[str] = None
    dateCreation: Optional[str] = None

class RatingRequest(BaseModel):
    note: int  # 1-5
    commentaire: Optional[str] = None
    freelancer_id: int
    client_id: int

class ReportRequest(BaseModel):
    raison: str  # spam, comportement, autre
    description: Optional[str] = None
    freelancer_id: int
    reporter_id: int

# ==================== AUTHENTIFICATION ====================

@app.post("/login", tags=["Auth"])
def login(credentials: LoginRequest, session: Session = Depends(get_session)):
    """Connexion d'un utilisateur"""
    statement = select(Utilisateur).where(
        Utilisateur.email == credentials.email,
        Utilisateur.motDePasse == credentials.motDePasse
    )
    user = session.exec(statement).first()

    if not user:
        raise HTTPException(status_code=401, detail="Email ou mot de passe incorrect")

    # Determiner le role
    role = "utilisateur"
    if session.get(Client, user.id):
        role = "client"
    elif session.get(Freelancer, user.id):
        role = "freelancer"
    elif session.get(Admin, user.id):
        role = "admin"

    return {
        "id": user.id,
        "nom": user.nom,
        "email": user.email,
        "telephone": user.telephone,
        "role": role
    }

@app.post("/register", tags=["Auth"])
def register(data: RegisterRequest, session: Session = Depends(get_session)):
    """Inscription d'un nouvel utilisateur"""
    # Verifier si l'email existe deja
    existing = session.exec(select(Utilisateur).where(Utilisateur.email == data.email)).first()
    if existing:
        raise HTTPException(status_code=400, detail="Cet email est deja utilise")

    # Creer l'utilisateur
    user = Utilisateur(
        nom=data.nom,
        email=data.email,
        motDePasse=data.motDePasse,
        telephone=data.telephone
    )
    session.add(user)
    session.commit()
    session.refresh(user)

    # Creer le role specifique
    if data.role == "client":
        client = Client(id=user.id)
        session.add(client)
    elif data.role == "freelancer":
        freelancer = Freelancer(id=user.id, status="actif")
        session.add(freelancer)
    elif data.role == "admin":
        admin = Admin(id=user.id)
        session.add(admin)

    session.commit()

    return {
        "id": user.id,
        "nom": user.nom,
        "email": user.email,
        "telephone": user.telephone,
        "role": data.role
    }

# ==================== ROUTES UTILISATEUR ====================

@app.post("/users", tags=["Utilisateurs"])
def create_user(user: Utilisateur, session: Session = Depends(get_session)):
    session.add(user)
    try:
        session.commit()
        session.refresh(user)
        return user
    except Exception as e:
        session.rollback()
        raise HTTPException(status_code=500, detail="Impossible d'ajouter l'utilisateur")

@app.get("/users", tags=["Utilisateurs"])
def read_users(session: Session = Depends(get_session)):
    statement = select(Utilisateur)
    return session.exec(statement).all()

@app.get("/users/{user_id}", tags=["Utilisateurs"])
def read_user(user_id: int, session: Session = Depends(get_session)):
    user = session.get(Utilisateur, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Utilisateur non trouve")
    return user

@app.delete("/users/{user_id}", tags=["Utilisateurs"])
def delete_user(user_id: int, session: Session = Depends(get_session)):
    user = session.get(Utilisateur, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Utilisateur non trouve")
    session.delete(user)
    session.commit()
    return {"message": "Utilisateur supprime"}

# ==================== ROUTES FREELANCER ====================

@app.post("/freelancers", tags=["Freelancers"])
def create_freelancer(freelancer: Freelancer, session: Session = Depends(get_session)):
    session.add(freelancer)
    session.commit()
    session.refresh(freelancer)
    return freelancer

@app.get("/freelancers", tags=["Freelancers"])
def read_freelancers(session: Session = Depends(get_session)):
    statement = select(Freelancer)
    return session.exec(statement).all()

@app.get("/freelancers/{freelancer_id}", tags=["Freelancers"])
def read_freelancer(freelancer_id: int, session: Session = Depends(get_session)):
    freelancer = session.get(Freelancer, freelancer_id)
    if not freelancer:
        raise HTTPException(status_code=404, detail="Freelancer non trouve")
    return freelancer

@app.get("/freelancers/{freelancer_id}/detail", tags=["Freelancers"])
def read_freelancer_detail(freelancer_id: int, session: Session = Depends(get_session)):
    """Obtenir un freelancer avec ses infos utilisateur et profil"""
    freelancer = session.get(Freelancer, freelancer_id)
    if not freelancer:
        raise HTTPException(status_code=404, detail="Freelancer non trouve")

    user = session.get(Utilisateur, freelancer_id)
    profil = session.exec(select(Profil).where(Profil.freelancer_id == freelancer_id)).first()

    return {
        "id": freelancer.id,
        "status": freelancer.status,
        "nom": user.nom if user else "",
        "email": user.email if user else "",
        "telephone": user.telephone if user else "",
        "profil": profil
    }

# ==================== ROUTES ADMIN ====================

@app.post("/admins", tags=["Admins"])
def create_admin(admin: Admin, session: Session = Depends(get_session)):
    session.add(admin)
    session.commit()
    session.refresh(admin)
    return admin

@app.get("/admins", tags=["Admins"])
def read_admins(session: Session = Depends(get_session)):
    statement = select(Admin)
    return session.exec(statement).all()

@app.get("/admins/{admin_id}", tags=["Admins"])
def read_admin(admin_id: int, session: Session = Depends(get_session)):
    admin = session.get(Admin, admin_id)
    if not admin:
        raise HTTPException(status_code=404, detail="Admin non trouve")
    return admin

# ==================== ROUTES CLIENT ====================

@app.post("/clients", tags=["Clients"])
def create_client(client: Client, session: Session = Depends(get_session)):
    session.add(client)
    session.commit()
    session.refresh(client)
    return client

@app.get("/clients", tags=["Clients"])
def read_clients(session: Session = Depends(get_session)):
    statement = select(Client)
    return session.exec(statement).all()

@app.get("/clients/{client_id}", tags=["Clients"])
def read_client(client_id: int, session: Session = Depends(get_session)):
    client = session.get(Client, client_id)
    if not client:
        raise HTTPException(status_code=404, detail="Client non trouve")
    return client

@app.get("/clients/{client_id}/detail", tags=["Clients"])
def read_client_detail(client_id: int, session: Session = Depends(get_session)):
    """Obtenir un client avec ses infos utilisateur"""
    client = session.get(Client, client_id)
    if not client:
        raise HTTPException(status_code=404, detail="Client non trouve")
    user = session.get(Utilisateur, client_id)
    return {
        "id": client.id,
        "nom": user.nom if user else "",
        "email": user.email if user else "",
        "telephone": user.telephone if user else ""
    }
# ==================== ROUTES PROFIL ====================
@app.post("/profils", tags=["Profils"])
def create_profil(profil: Profil, session: Session = Depends(get_session)):
    session.add(profil)
    session.commit()
    session.refresh(profil)
    return profil

@app.get("/profils", tags=["Profils"])
def read_profils(session: Session = Depends(get_session)):
    statement = select(Profil)
    return session.exec(statement).all()

@app.get("/profils/{profil_id}", tags=["Profils"])
def read_profil(profil_id: int, session: Session = Depends(get_session)):
    profil = session.get(Profil, profil_id)
    if not profil:
        raise HTTPException(status_code=404, detail="Profil non trouve")
    return profil

@app.get("/freelancers/{freelancer_id}/profil", tags=["Profils"])
def read_freelancer_profil(freelancer_id: int, session: Session = Depends(get_session)):
    """Obtenir le profil d'un freelancer"""
    profil = session.exec(select(Profil).where(Profil.freelancer_id == freelancer_id)).first()
    if not profil:
        raise HTTPException(status_code=404, detail="Profil non trouve")
    return profil

@app.put("/profils/{profil_id}", tags=["Profils"])
def update_profil(profil_id: int, new_data: ProfilUpdate, session: Session = Depends(get_session)):
    profil = session.get(Profil, profil_id)
    if not profil:
        raise HTTPException(status_code=404, detail="Profil non trouve")

    if new_data.photo is not None:
        profil.photo = new_data.photo
    if new_data.description is not None:
        profil.description = new_data.description
    if new_data.competences is not None:
        profil.competences = new_data.competences
    if new_data.experience is not None:
        profil.experience = new_data.experience

    session.add(profil)
    session.commit()
    session.refresh(profil)
    return profil

# ==================== ROUTES ANNONCE ====================

@app.post("/annonces", tags=["Annonces"])
def create_annonce(annonce: Annonce, session: Session = Depends(get_session)):
    session.add(annonce)
    session.commit()
    session.refresh(annonce)
    return annonce

@app.get("/annonces", tags=["Annonces"])
def read_annonces(session: Session = Depends(get_session)):
    statement = select(Annonce)
    return session.exec(statement).all()

@app.get("/annonces/{annonce_id}", tags=["Annonces"])
def read_annonce(annonce_id: int, session: Session = Depends(get_session)):
    annonce = session.get(Annonce, annonce_id)
    if not annonce:
        raise HTTPException(status_code=404, detail="Annonce non trouvee")
    return annonce

@app.get("/freelancers/{freelancer_id}/annonces", tags=["Annonces"])
def read_freelancer_annonces(freelancer_id: int, session: Session = Depends(get_session)):
    """Obtenir les annonces d'un freelancer"""
    annonces = session.exec(select(Annonce).where(Annonce.freelancer_id == freelancer_id)).all()
    return annonces

@app.put("/annonces/{annonce_id}", tags=["Annonces"])
def update_annonce(annonce_id: int, new_data: AnnonceUpdate, session: Session = Depends(get_session)):
    annonce = session.get(Annonce, annonce_id)
    if not annonce:
        raise HTTPException(status_code=404, detail="Annonce non trouvee")

    if new_data.titre is not None:
        annonce.titre = new_data.titre
    if new_data.description is not None:
        annonce.description = new_data.description
    if new_data.image is not None:
        annonce.image = new_data.image
    if new_data.dateCreation is not None:
        annonce.dateCreation = new_data.dateCreation

    session.add(annonce)
    session.commit()
    session.refresh(annonce)
    return annonce

@app.delete("/annonces/{annonce_id}", tags=["Annonces"])
def delete_annonce(annonce_id: int, session: Session = Depends(get_session)):
    annonce = session.get(Annonce, annonce_id)
    if not annonce:
        raise HTTPException(status_code=404, detail="Annonce non trouvee")
    session.delete(annonce)
    session.commit()
    return {"message": "Annonce supprimee"}

# ==================== UPLOAD ====================

@app.post("/upload", tags=["Upload"])
async def upload_image(file: UploadFile = File(...)):
    """Upload une image et retourne l'URL"""
    # Verifier le type de fichier
    allowed_types = ["image/jpeg", "image/png", "image/gif", "image/webp"]
    if file.content_type not in allowed_types:
        raise HTTPException(status_code=400, detail="Type de fichier non autorise. Utilisez JPG, PNG, GIF ou WEBP.")

    # Generer un nom unique pour le fichier
    file_extension = file.filename.split(".")[-1] if "." in file.filename else "jpg"
    unique_filename = f"{uuid.uuid4()}.{file_extension}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)

    # Sauvegarder le fichier
    try:
        contents = await file.read()
        with open(file_path, "wb") as f:
            f.write(contents)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur lors de l'upload: {str(e)}")

    # Retourner l'URL de l'image
    return {"url": f"/uploads/{unique_filename}", "filename": unique_filename}

# ==================== ROUTES RATING ====================

@app.post("/ratings", tags=["Ratings"])
def create_rating(data: RatingRequest, session: Session = Depends(get_session)):
    """Creer une nouvelle evaluation"""
    # Verifier que le freelancer existe
    freelancer = session.get(Freelancer, data.freelancer_id)
    if not freelancer:
        raise HTTPException(status_code=404, detail="Freelancer non trouve")

    # Verifier que le client existe
    client = session.get(Client, data.client_id)
    if not client:
        raise HTTPException(status_code=404, detail="Client non trouve")

    # Verifier la note (1-5)
    if data.note < 1 or data.note > 5:
        raise HTTPException(status_code=400, detail="La note doit etre entre 1 et 5")

    rating = Rating(
        note=data.note,
        commentaire=data.commentaire,
        date_creation=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        freelancer_id=data.freelancer_id,
        client_id=data.client_id
    )
    session.add(rating)
    session.commit()
    session.refresh(rating)
    return rating

@app.get("/ratings", tags=["Ratings"])
def read_ratings(session: Session = Depends(get_session)):
    """Obtenir toutes les evaluations"""
    statement = select(Rating)
    return session.exec(statement).all()

@app.get("/ratings/{rating_id}", tags=["Ratings"])
def read_rating(rating_id: int, session: Session = Depends(get_session)):
    """Obtenir une evaluation par ID"""
    rating = session.get(Rating, rating_id)
    if not rating:
        raise HTTPException(status_code=404, detail="Evaluation non trouvee")
    return rating

@app.get("/freelancers/{freelancer_id}/ratings", tags=["Ratings"])
def read_freelancer_ratings(freelancer_id: int, session: Session = Depends(get_session)):
    """Obtenir toutes les evaluations d'un freelancer"""
    freelancer = session.get(Freelancer, freelancer_id)
    if not freelancer:
        raise HTTPException(status_code=404, detail="Freelancer non trouve")

    ratings = session.exec(select(Rating).where(Rating.freelancer_id == freelancer_id)).all()

    # Ajouter les infos du client pour chaque rating
    result = []
    for rating in ratings:
        user = session.get(Utilisateur, rating.client_id)
        result.append({
            "id": rating.id,
            "note": rating.note,
            "commentaire": rating.commentaire,
            "date_creation": rating.date_creation,
            "freelancer_id": rating.freelancer_id,
            "client_id": rating.client_id,
            "client_nom": user.nom if user else "Anonyme"
        })
    return result

@app.get("/freelancers/{freelancer_id}/average-rating", tags=["Ratings"])
def get_freelancer_average_rating(freelancer_id: int, session: Session = Depends(get_session)):
    """Obtenir la note moyenne d'un freelancer"""
    freelancer = session.get(Freelancer, freelancer_id)
    if not freelancer:
        raise HTTPException(status_code=404, detail="Freelancer non trouve")

    ratings = session.exec(select(Rating).where(Rating.freelancer_id == freelancer_id)).all()
    if not ratings:
        return {"average": 0, "count": 0}

    total = sum(r.note for r in ratings)
    return {"average": round(total / len(ratings), 1), "count": len(ratings)}

@app.delete("/ratings/{rating_id}", tags=["Ratings"])
def delete_rating(rating_id: int, session: Session = Depends(get_session)):
    """Supprimer une evaluation"""
    rating = session.get(Rating, rating_id)
    if not rating:
        raise HTTPException(status_code=404, detail="Evaluation non trouvee")
    session.delete(rating)
    session.commit()
    return {"message": "Evaluation supprimee"}

# ==================== ROUTES REPORT ====================

@app.post("/reports", tags=["Reports"])
def create_report(data: ReportRequest, session: Session = Depends(get_session)):
    """Creer un nouveau signalement"""
    # Verifier que le freelancer existe
    freelancer = session.get(Freelancer, data.freelancer_id)
    if not freelancer:
        raise HTTPException(status_code=404, detail="Freelancer non trouve")

    # Verifier que le reporter existe
    reporter = session.get(Utilisateur, data.reporter_id)
    if not reporter:
        raise HTTPException(status_code=404, detail="Utilisateur non trouve")

    # Valider la raison
    valid_reasons = ["spam", "comportement", "fraude", "contenu_inapproprie", "autre"]
    if data.raison not in valid_reasons:
        raise HTTPException(status_code=400, detail=f"Raison invalide. Valeurs acceptees: {', '.join(valid_reasons)}")

    report = Report(
        raison=data.raison,
        description=data.description,
        date_creation=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        statut="en_attente",
        freelancer_id=data.freelancer_id,
        reporter_id=data.reporter_id
    )
    session.add(report)
    session.commit()
    session.refresh(report)
    return report

@app.get("/reports", tags=["Reports"])
def read_reports(session: Session = Depends(get_session)):
    """Obtenir tous les signalements (admin only)"""
    statement = select(Report)
    return session.exec(statement).all()

@app.get("/reports/{report_id}", tags=["Reports"])
def read_report(report_id: int, session: Session = Depends(get_session)):
    """Obtenir un signalement par ID"""
    report = session.get(Report, report_id)
    if not report:
        raise HTTPException(status_code=404, detail="Signalement non trouve")
    return report

@app.put("/reports/{report_id}/status", tags=["Reports"])
def update_report_status(report_id: int, statut: str, session: Session = Depends(get_session)):
    """Mettre a jour le statut d'un signalement (admin only)"""
    report = session.get(Report, report_id)
    if not report:
        raise HTTPException(status_code=404, detail="Signalement non trouve")

    valid_statuts = ["en_attente", "traite", "rejete"]
    if statut not in valid_statuts:
        raise HTTPException(status_code=400, detail=f"Statut invalide. Valeurs acceptees: {', '.join(valid_statuts)}")

    report.statut = statut
    session.add(report)
    session.commit()
    session.refresh(report)
    return report

@app.get("/freelancers/{freelancer_id}/reports", tags=["Reports"])
def read_freelancer_reports(freelancer_id: int, session: Session = Depends(get_session)):
    """Obtenir tous les signalements d'un freelancer"""
    freelancer = session.get(Freelancer, freelancer_id)
    if not freelancer:
        raise HTTPException(status_code=404, detail="Freelancer non trouve")

    reports = session.exec(select(Report).where(Report.freelancer_id == freelancer_id)).all()
    return reports

# ==================== STATISTIQUES ====================

@app.get("/stats", tags=["Statistiques"])
def get_stats(session: Session = Depends(get_session)):
    """Obtenir les statistiques de la plateforme"""
    total_users = session.query(func.count(Utilisateur.id)).scalar() or 0
    total_freelancers = session.query(func.count(Freelancer.id)).scalar() or 0
    total_clients = session.query(func.count(Client.id)).scalar() or 0
    total_annonces = session.query(func.count(Annonce.idAnnonce)).scalar() or 0
    total_ratings = session.query(func.count(Rating.id)).scalar() or 0
    total_reports = session.query(func.count(Report.id)).scalar() or 0

    # Calculer la moyenne generale des notes
    avg_rating = session.query(func.avg(Rating.note)).scalar() or 0

    return {
        "total_utilisateurs": total_users,
        "total_freelancers": total_freelancers,
        "total_clients": total_clients,
        "total_annonces": total_annonces,
        "total_ratings": total_ratings,
        "total_reports": total_reports,
        "moyenne_generale": round(float(avg_rating), 1) if avg_rating else 0
    }

# ==================== ROUTE RACINE ====================

@app.get("/", tags=["Root"])
def root():
    return {
        "message": "Bienvenue sur l'API OnlyJobs",
        "version": "2.0.0",
        "documentation": "/docs"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
