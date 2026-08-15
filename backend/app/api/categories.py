"""Categories endpoint."""

from fastapi import APIRouter
from app.models.schemas import CategoryResponse
from app.constants import CATEGORIES

router = APIRouter()


@router.get("/categories", response_model=CategoryResponse)
async def get_categories():
    """Return all supported learning categories."""
    return CategoryResponse(categories=CATEGORIES)
