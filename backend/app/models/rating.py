"""
Rating model for the OnlyJobs platform
Represents reviews/ratings given by clients to freelancers
"""
from sqlalchemy import Column, Integer, Text, DateTime, ForeignKey, CheckConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class Rating(Base):
    """Rating model - client reviews for freelancers"""
    __tablename__ = "rating"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    note = Column(Integer, nullable=False)
    commentaire = Column(Text, nullable=True)
    date_creation = Column(DateTime, default=func.now())
    freelancer_id = Column(Integer, ForeignKey("freelancer.id", ondelete="CASCADE"), nullable=False)
    client_id = Column(Integer, ForeignKey("client.id", ondelete="CASCADE"), nullable=False)
    
    # Constraints
    __table_args__ = (
        CheckConstraint('note >= 1 AND note <= 5', name='check_note_range'),
    )
    
    # Relationships
    freelancer = relationship("Freelancer", back_populates="ratings")
    client = relationship("Client", back_populates="ratings")
    
    def __repr__(self):
        return f"<Rating(id={self.id}, note={self.note}, freelancer_id={self.freelancer_id})>"
