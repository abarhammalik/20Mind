"""Application configuration loaded from environment variables."""

import os
from dotenv import load_dotenv

load_dotenv()


class Settings:
    """App settings from environment variables."""

    PORT: int = int(os.getenv("PORT", "8000"))
    HOST: str = os.getenv("HOST", "0.0.0.0")
    TIMEZONE: str = os.getenv("TIMEZONE", "Asia/Kolkata")
    WIKIPEDIA_API_BASE: str = os.getenv(
        "WIKIPEDIA_API_BASE", "https://en.wikipedia.org/api/rest_v1"
    )
    WIKIPEDIA_ACTION_API: str = os.getenv(
        "WIKIPEDIA_ACTION_API", "https://en.wikipedia.org/w/api.php"
    )


settings = Settings()
