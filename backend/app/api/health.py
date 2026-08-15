"""Health check endpoint."""

from fastapi import APIRouter
from app.models.schemas import HealthResponse

router = APIRouter()


@router.get("/health", response_model=HealthResponse)
async def health_check():
    """Return server health status."""
    return HealthResponse(status="ok")
