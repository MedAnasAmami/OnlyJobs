"""
Pydantic schemas for Freelancer model
Defines request and response data structures
"""
from pydantic import BaseModel, EmailStr, Field, HttpUrl
from typing import Optional, List

class FreelancerBase(BaseModel):
    """Base schema with common freelancer attributes"""
    nom: str = Field(..., min_length=2, max_length=50, description="Last name")
    prenom: str = Field(..., min_length=2, max_length=50, description="First name")
    email: EmailStr = Field(..., description="Email address")
    description: Optional[str] = Field(None, description="Profile description")
    competences: Optional[str] = Field(None, description="Skills (comma-separated)")
    tarif_horaire: Optional[float] = Field(0.0, ge=0, description="Hourly rate")
    image_url: Optional[str] = Field('', description="Profile image URL")
    disponible: Optional[bool] = Field(True, description="Availability status")

class FreelancerCreate(FreelancerBase):
    """Schema for creating a new freelancer"""
    pass

class FreelancerUpdate(BaseModel):
    """Schema for updating freelancer information"""
    nom: Optional[str] = Field(None, min_length=2, max_length=50)
    prenom: Optional[str] = Field(None, min_length=2, max_length=50)
    email: Optional[EmailStr] = None
    description: Optional[str] = None
    competences: Optional[str] = None
    tarif_horaire: Optional[float] = Field(None, ge=0)
    image_url: Optional[str] = None
    disponible: Optional[bool] = None

class FreelancerResponse(FreelancerBase):
    """Schema for freelancer response"""
    id: int
    average_rating: float = 0.0
    rating_count: int = 0
    
    class Config:
        from_attributes = True

class FreelancerCard(BaseModel):
    """Schema for freelancer card display (simplified view)"""
    id: int
    nom: str
    prenom: str
    description: Optional[str]
    competences: Optional[str]
    tarif_horaire: float
    image_url: str
    disponible: bool
    average_rating: float = 0.0
    rating_count: int = 0
    
    class Config:
        from_attributes = True
