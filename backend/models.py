# models.py - Modeles SQLModel pour OnlyJobs
from sqlmodel import Column, SQLModel, Field, String
from typing import Optional

# ============= TABLE UTILISATEUR (entite mere) =============
class Utilisateur(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    nom: str = Field(sa_column=Column(String(25)))
    email: str = Field(sa_column=Column(String(25)))
    motDePasse: str = Field(sa_column=Column(String(25)))
    telephone: str = Field(sa_column=Column(String(25)))

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
    photo: str = Field(sa_column=Column(String(255)))
    description: str = Field(sa_column=Column(String(255)))
    competences: str = Field(sa_column=Column(String(255)))
    experience: str = Field(sa_column=Column(String(255)))
    freelancer_id: int = Field(foreign_key="freelancer.id", unique=True)

# ============= TABLE ANNONCE =============
class Annonce(SQLModel, table=True):
    idAnnonce: Optional[int] = Field(default=None, primary_key=True)
    titre: str = Field(sa_column=Column(String(255)))
    description: str = Field(sa_column=Column(String(255)))
    dateCreation: str = Field(sa_column=Column(String(50)))
    freelancer_id: int = Field(foreign_key="freelancer.id")

# ============= TABLE AUTHENTIFICATION =============
class Authentification(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    utilisateur_id: int = Field(foreign_key="utilisateur.id")
