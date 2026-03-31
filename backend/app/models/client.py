"""
Client model for the OnlyJobs platform
Represents users who post projects and hire freelancers
"""
from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.core.database import Base

class Client(Base):
    """Client model - users who hire freelancers"""
    __tablename__ = "client"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    nom = Column(String(50), nullable=False)
    prenom = Column(String(50), nullable=False)
    email = Column(String(100), unique=True, nullable=False, index=True)
    password = Column(String(255), nullable=False)
    
    # Relationship with ratings
    ratings = relationship("Rating", back_populates="client", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<Client(id={self.id}, email={self.email})>"
