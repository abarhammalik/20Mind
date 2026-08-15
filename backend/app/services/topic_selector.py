"""Deterministic daily topic selector.

Uses the current date as a seed to deterministically select:
1. A category
2. A search query for that category
3. A candidate article from Wikipedia search results

Includes an in-memory cache keyed by date to avoid repeated Wikipedia calls.
"""

import hashlib
import logging
from datetime import datetime
from zoneinfo import ZoneInfo
from typing import Optional

from app.config import settings
from app.constants import CATEGORIES, CATEGORY_QUERIES
from app.services import wikipedia

logger = logging.getLogger(__name__)

# ──────────────────────────────────────────────
# In-memory cache: date_str → (article_title, category, article_url)
# ──────────────────────────────────────────────
_daily_cache: dict[str, dict] = {}


def _get_today_str() -> str:
    """Get today's date string in the configured timezone."""
    tz = ZoneInfo(settings.TIMEZONE)
    return datetime.now(tz).strftime("%Y-%m-%d")


def _create_seed(date_str: str) -> int:
    """Create a deterministic integer seed from a date string."""
    hash_bytes = hashlib.sha256(
        f"daily-learn-{date_str}".encode()
    ).hexdigest()
    return int(hash_bytes[:12], 16)


def _select_from_list(items: list, seed: int) -> any:
    """Deterministically select one item from a list using a seed."""
    if not items:
        return None
    return items[seed % len(items)]


async def get_today_topic(date_override: Optional[str] = None) -> Optional[dict]:
    """Get today's topic. Returns cached result if available.

    Args:
        date_override: Optional date string (YYYY-MM-DD) for testing.

    Returns:
        Dict with 'title', 'category', 'url', 'summary' keys, or None.
    """
    date_str = date_override or _get_today_str()

    # Check cache first
    if date_str in _daily_cache:
        logger.info(f"Returning cached topic for {date_str}")
        return _daily_cache[date_str]

    # Generate deterministic seed
    seed = _create_seed(date_str)

    # Try multiple candidates in case some fail
    for attempt in range(5):
        adjusted_seed = seed + attempt

        # Select category
        category = _select_from_list(CATEGORIES, adjusted_seed)
        if not category:
            continue

        # Select search query for this category
        queries = CATEGORY_QUERIES.get(category, [category])
        query = _select_from_list(queries, adjusted_seed + 1)

        logger.info(
            f"Attempt {attempt + 1}: date={date_str}, "
            f"category={category}, query={query}"
        )

        # Search Wikipedia
        search_results = await wikipedia.search_articles(query, limit=10)
        if not search_results:
            logger.warning(f"No search results for query '{query}'")
            continue

        # Deterministically select a candidate
        candidate = _select_from_list(search_results, adjusted_seed + 2)
        if not candidate:
            continue

        # Fetch article summary to verify it's a good article
        summary = await wikipedia.get_article_summary(candidate["title"])
        if not summary or not summary.get("extract"):
            logger.warning(
                f"No summary for '{candidate['title']}', trying next"
            )
            continue

        # Build result
        result = {
            "title": summary["title"],
            "category": category,
            "url": summary.get("url", candidate.get("url", "")),
            "description": summary.get("description", ""),
            "extract": summary.get("extract", ""),
            "thumbnail": summary.get("thumbnail", ""),
        }

        # Cache it
        _daily_cache[date_str] = result
        logger.info(f"Selected topic for {date_str}: {result['title']}")
        return result

    logger.error(f"Failed to find a topic for {date_str} after 5 attempts")
    return None
