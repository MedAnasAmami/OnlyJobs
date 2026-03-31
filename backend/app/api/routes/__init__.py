"""API Routes for OnlyJobs platform"""
from fastapi import APIRouter
from .auth import router as auth_router
from .clients import router as clients_router
from .freelancers import router as freelancers_router
from .ratings import router as ratings_router

# Main API router
api_router = APIRouter()

# Include all route modules
api_router.include_router(auth_router, prefix="/auth", tags=["Authentication"])
api_router.include_router(clients_router, prefix="/clients", tags=["Clients"])
api_router.include_router(freelancers_router, prefix="/freelancers", tags=["Freelancers"])
api_router.include_router(ratings_router, prefix="/ratings", tags=["Ratings"])
