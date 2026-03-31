"""
Freelancer model for the OnlyJobs platform
Represents service providers who offer their skills
"""
from sqlalchemy import Column, Integer, String, Text, Float, Boolean
from sqlalchemy.orm import relationship
from app.core.database import Base

class Freelancer(Base):
    """Freelancer model - service providers"""
    __tablename__ = "freelancer"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    nom = Column(String(50), nullable=False)
    prenom = Column(String(50), nullable=False)
    email = Column(String(100), unique=True, nullable=False, index=True)
    description = Column(Text, nullable=True)
    competences = Column(String(255), nullable=True)
    tarif_horaire = Column(Float, default=0.0)
    image_url = Column(String(255), default='')
    disponible = Column(Boolean, default=True)
    
    # Relationship with ratings
    ratings = relationship("Rating", back_populates="freelancer", cascade="all, delete-orphan")
    
    @property
    def average_rating(self) -> float:
        """Calculate average rating from all reviews"""
        if not self.ratings:
            return 0.0
        total = sum(r.note for r in self.ratings)
        return round(total / len(self.ratings), 1)
    
    @property
    def rating_count(self) -> int:
        """Get total number of ratings"""
        return len(self.ratings)
    
    def __repr__(self):
        return f"<Freelancer(id={self.id}, email={self.email})>"
