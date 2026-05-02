# models.py - Modeles SQLModel pour OnlyJobs
from sqlmodel import Column, SQLModel, Field, String
from typing import Optional

# ============= TABLE UTILISATEUR (entite mere) =============
class Utilisateur(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    nom: str = Field(sa_column=Column(String(100)))
    email: str = Field(sa_column=Column(String(100)))
    motDePasse: str = Field(sa_column=Column(String(255)))
    telephone: str = Field(sa_column=Column(String(20)))

# ============= TABLE FREELANCER =============
class Freelancer(SQLModel, table=True):
    id: Optional[int] = Field(default=None, foreign_key="utilisateur.id", primary_key=True)
    status: str = Field(sa_column=Column(String(50)))

# ============= TABLE ADMIN =============
class Admin(SQLModel, table=True):
    id: Optional[int] = Field(default=None, foreign_key="utilisateur.id", primary_key=True)

# ============= TABLE CLIENT =============
class Client(SQLModel, table=True):
    id: Optional[int] = Field(default=None, foreign_key="utilisateur.id", primary_key=True)

# ============= TABLE PROFIL =============
class Profil(SQLModel, table=True):
    idProfil: Optional[int] = Field(default=None, primary_key=True)
    photo: Optional[str] = Field(default=None, sa_column=Column(String(255)))
    description: Optional[str] = Field(default=None, sa_column=Column(String(255)))
    competences: Optional[str] = Field(default=None, sa_column=Column(String(255)))
    experience: Optional[str] = Field(default=None, sa_column=Column(String(255)))
    statut: str = Field(default="en_attente", sa_column=Column(String(50)))
    freelancer_id: int = Field(foreign_key="freelancer.id", unique=True)

# ============= TABLE ANNONCE =============
class Annonce(SQLModel, table=True):
    idAnnonce: Optional[int] = Field(default=None, primary_key=True)
    titre: str = Field(sa_column=Column(String(255)))
    description: str = Field(sa_column=Column(String(500)))
    categorie: str = Field(default="General", sa_column=Column(String(100)))
    delai: int = Field(default=7)
    image: Optional[str] = Field(default=None, sa_column=Column(String(500)))  # URL ou chemin de l'image
    dateCreation: Optional[str] = Field(default=None, sa_column=Column(String(50)))
    statut: str = Field(default="en_attente", sa_column=Column(String(50)))
    freelancer_id: int = Field(foreign_key="freelancer.id")

# ============= TABLE SERVICE =============
class Service(SQLModel, table=True):
    idService: Optional[int] = Field(default=None, primary_key=True)
    titre: str = Field(sa_column=Column(String(255)))
    description: Optional[str] = Field(default=None, sa_column=Column(String(500)))
    delai: int = Field()
    categorie: str = Field(sa_column=Column(String(100)))
    statut: str = Field(default="actif", sa_column=Column(String(50)))
    freelancer_id: int = Field(foreign_key="freelancer.id")
    annonce_id: Optional[int] = Field(default=None, foreign_key="annonce.idAnnonce")
    client_id: Optional[int] = Field(default=None, foreign_key="client.id")
    date_choix: Optional[str] = Field(default=None, sa_column=Column(String(50)))

# ============= TABLE RATING =============
class Rating(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    note: int = Field(ge=1, le=5)  # Note de 1 à 5
    commentaire: Optional[str] = Field(default=None, sa_column=Column(String(500)))
    date_creation: Optional[str] = Field(default=None, sa_column=Column(String(50)))
    freelancer_id: int = Field(foreign_key="freelancer.id")
    client_id: int = Field(foreign_key="client.id")

# ============= TABLE REPORT =============
class Report(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    raison: str = Field(sa_column=Column(String(100)))  # spam, comportement, autre
    description: Optional[str] = Field(default=None, sa_column=Column(String(500)))
    date_creation: Optional[str] = Field(default=None, sa_column=Column(String(50)))
    statut: str = Field(default="en_attente", sa_column=Column(String(50)))  # en_attente, traite, rejete
    # A report can target either a freelancer OR a client.
    freelancer_id: Optional[int] = Field(default=None, foreign_key="freelancer.id")
    client_id: Optional[int] = Field(default=None, foreign_key="client.id")
    reporter_id: int = Field(foreign_key="utilisateur.id")
