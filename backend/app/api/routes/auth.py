"""
Authentication routes for OnlyJobs platform
Handles login and registration for clients
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import verify_password, get_password_hash, create_access_token
from app.models.client import Client
from app.schemas.client import ClientCreate, ClientResponse, ClientLogin
from app.schemas.auth import Token, LoginRequest

router = APIRouter()

@router.post("/register", response_model=ClientResponse, status_code=status.HTTP_201_CREATED)
def register_client(client: ClientCreate, db: Session = Depends(get_db)):
    """
    Register a new client account
    - Checks if email already exists
    - Hashes password before storing
    - Returns created client data
    """
    # Check if email already exists
    existing_client = db.query(Client).filter(Client.email == client.email).first()
    if existing_client:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new client with hashed password
    hashed_password = get_password_hash(client.password)
    db_client = Client(
        nom=client.nom,
        prenom=client.prenom,
        email=client.email,
        password=hashed_password
    )
    
    db.add(db_client)
    db.commit()
    db.refresh(db_client)
    
    return db_client

@router.post("/login", response_model=Token)
def login(login_data: LoginRequest, db: Session = Depends(get_db)):
    """
    Authenticate a client and return JWT token
    - Validates credentials
    - Returns access token on success
    """
    # Find client by email
    client = db.query(Client).filter(Client.email == login_data.email).first()
    
    if not client:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"}
        )
    
    # Verify password
    if not verify_password(login_data.password, client.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"}
        )
    
    # Create access token
    access_token = create_access_token(
        data={"sub": client.email, "user_id": client.id, "user_type": "client"}
    )
    
    return Token(
        access_token=access_token,
        token_type="bearer",
        user_type="client",
        user_id=client.id
    )

@router.get("/me", response_model=ClientResponse)
def get_current_user(token: str, db: Session = Depends(get_db)):
    """
    Get current authenticated user's information
    Requires valid JWT token
    """
    from app.core.security import decode_token
    
    payload = decode_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )
    
    client = db.query(Client).filter(Client.email == payload.get("sub")).first()
    if not client:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return client
