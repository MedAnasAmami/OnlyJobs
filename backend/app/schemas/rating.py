"""
Pydantic schemas for Rating model
Defines request and response data structures
"""
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class RatingBase(BaseModel):
    """Base schema with common rating attributes"""
    note: int = Field(..., ge=1, le=5, description="Rating score (1-5)")
    commentaire: Optional[str] = Field(None, description="Review comment")

class RatingCreate(RatingBase):
    """Schema for creating a new rating"""
    freelancer_id: int = Field(..., description="Freelancer being rated")
    client_id: int = Field(..., description="Client giving the rating")

class RatingUpdate(BaseModel):
    """Schema for updating a rating"""
    note: Optional[int] = Field(None, ge=1, le=5)
    commentaire: Optional[str] = None

class RatingResponse(RatingBase):
    """Schema for rating response"""
    id: int
    freelancer_id: int
    client_id: int
    date_creation: datetime
    client_nom: Optional[str] = None
    client_prenom: Optional[str] = None
    
    class Config:
        from_attributes = True

class RatingWithClient(RatingBase):
    """Schema for rating with client details"""
    id: int
    date_creation: datetime
    client: dict
    
    class Config:
        from_attributes = True
