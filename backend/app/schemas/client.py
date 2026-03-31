"""
Pydantic schemas for Client model
Defines request and response data structures
"""
from pydantic import BaseModel, EmailStr, Field
from typing import Optional

class ClientBase(BaseModel):
    """Base schema with common client attributes"""
    nom: str = Field(..., min_length=2, max_length=50, description="Last name")
    prenom: str = Field(..., min_length=2, max_length=50, description="First name")
    email: EmailStr = Field(..., description="Email address")

class ClientCreate(ClientBase):
    """Schema for creating a new client"""
    password: str = Field(..., min_length=6, description="Password (min 6 characters)")

class ClientUpdate(BaseModel):
    """Schema for updating client information"""
    nom: Optional[str] = Field(None, min_length=2, max_length=50)
    prenom: Optional[str] = Field(None, min_length=2, max_length=50)
    email: Optional[EmailStr] = None
    password: Optional[str] = Field(None, min_length=6)

class ClientResponse(ClientBase):
    """Schema for client response (excludes password)"""
    id: int
    
    class Config:
        from_attributes = True

class ClientLogin(BaseModel):
    """Schema for client login"""
    email: EmailStr
    password: str
