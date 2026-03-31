"""
Pydantic schemas for authentication
Token and user authentication data structures
"""
from pydantic import BaseModel
from typing import Optional

class Token(BaseModel):
    """Schema for JWT token response"""
    access_token: str
    token_type: str = "bearer"
    user_type: str  # 'client' or 'freelancer'
    user_id: int

class TokenData(BaseModel):
    """Schema for decoded token data"""
    email: Optional[str] = None
    user_type: Optional[str] = None
    user_id: Optional[int] = None

class LoginRequest(BaseModel):
    """Schema for login request"""
    email: str
    password: str
    user_type: str = "client"  # 'client' or 'freelancer'
