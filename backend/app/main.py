"""FastAPI application entrypoint for the Daily Learning App backend."""

import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import health, categories, daily
from app.config import settings

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)

app = FastAPI(
    title="Daily Learning App",
    description="Learn something new every day in about 20 minutes.",
    version="1.0.0",
)

# CORS — allow the mobile Expo dev server and web clients
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register route modules
app.include_router(health.router, prefix="/api")
app.include_router(categories.router, prefix="/api")
app.include_router(daily.router, prefix="/api")


@app.get("/")
async def root():
    """Root endpoint — redirect hint."""
    return {
        "message": "Daily Learning App API",
        "docs": "/docs",
        "health": "/api/health",
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=True,
    )
