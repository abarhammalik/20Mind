"""Wikipedia API client.

Handles searching articles, fetching summaries and content
from the Wikipedia REST and Action APIs.
"""

import httpx
import logging
from typing import Optional

from app.config import settings

logger = logging.getLogger(__name__)

# Reusable HTTP client timeout
_TIMEOUT = httpx.Timeout(15.0, connect=10.0)


async def search_articles(query: str, limit: int = 10) -> list[dict]:
    """Search Wikipedia for articles matching the query.

    Uses the MediaWiki Action API opensearch endpoint.

    Returns a list of dicts with 'title' and 'url' keys.
    """
    params = {
        "action": "opensearch",
        "search": query,
        "limit": limit,
        "namespace": 0,
        "format": "json",
    }

    try:
        async with httpx.AsyncClient(timeout=_TIMEOUT) as client:
            response = await client.get(
                settings.WIKIPEDIA_ACTION_API,
                params=params,
                headers={"User-Agent": "DailyLearningApp/1.0"},
            )
            response.raise_for_status()
            data = response.json()

            # opensearch returns: [query, [titles], [descriptions], [urls]]
            if len(data) < 4:
                return []

            titles = data[1]
            urls = data[3]

            results = []
            for title, url in zip(titles, urls):
                results.append({"title": title, "url": url})

            return results

    except (httpx.HTTPError, Exception) as e:
        logger.error(f"Wikipedia search failed for '{query}': {e}")
        return []


async def get_article_summary(title: str) -> Optional[dict]:
    """Get a Wikipedia article summary using the REST API.

    Returns a dict with title, extract (text summary), description,
    thumbnail info, and content_urls, or None on failure.
    """
    # URL-encode the title (spaces → underscores for Wikipedia)
    encoded_title = title.replace(" ", "_")
    url = f"{settings.WIKIPEDIA_API_BASE}/page/summary/{encoded_title}"

    try:
        async with httpx.AsyncClient(timeout=_TIMEOUT) as client:
            response = await client.get(
                url,
                headers={"User-Agent": "DailyLearningApp/1.0"},
                follow_redirects=True,
            )
            response.raise_for_status()
            data = response.json()

            # Skip disambiguation pages
            if data.get("type") == "disambiguation":
                logger.info(f"Skipping disambiguation page: {title}")
                return None

            return {
                "title": data.get("title", title),
                "description": data.get("description", ""),
                "extract": data.get("extract", ""),
                "url": data.get("content_urls", {}).get("desktop", {}).get("page", ""),
                "thumbnail": data.get("thumbnail", {}).get("source", ""),
            }

    except (httpx.HTTPError, Exception) as e:
        logger.error(f"Wikipedia summary failed for '{title}': {e}")
        return None


async def get_article_content(title: str) -> Optional[dict]:
    """Get full article content using the MediaWiki Action API.

    Returns parsed HTML content and categories, or None on failure.
    """
    encoded_title = title.replace(" ", "_")
    params = {
        "action": "parse",
        "page": encoded_title,
        "prop": "wikitext|categories|sections",
        "format": "json",
        "redirects": 1,
    }

    try:
        async with httpx.AsyncClient(timeout=_TIMEOUT) as client:
            response = await client.get(
                settings.WIKIPEDIA_ACTION_API,
                params=params,
                headers={"User-Agent": "DailyLearningApp/1.0"},
            )
            response.raise_for_status()
            data = response.json()

            if "error" in data:
                logger.error(f"Wikipedia API error for '{title}': {data['error']}")
                return None

            parse_data = data.get("parse", {})

            # Extract section info
            sections = []
            for sec in parse_data.get("sections", []):
                if sec.get("toclevel", 0) <= 2:
                    sections.append({
                        "title": sec.get("line", ""),
                        "level": sec.get("toclevel", 1),
                        "index": sec.get("index", ""),
                    })

            # Get wikitext content
            wikitext = parse_data.get("wikitext", {}).get("*", "")

            # Extract categories
            categories = [
                cat.get("*", "")
                for cat in parse_data.get("categories", [])
                if not cat.get("hidden", False)
            ]

            return {
                "title": parse_data.get("title", title),
                "wikitext": wikitext,
                "sections": sections,
                "categories": categories,
            }

    except (httpx.HTTPError, Exception) as e:
        logger.error(f"Wikipedia content failed for '{title}': {e}")
        return None


async def get_article_extracts(title: str) -> Optional[str]:
    """Get plain-text extract of an article using the Action API.

    This returns a cleaner text version than parsing wikitext.
    """
    params = {
        "action": "query",
        "titles": title,
        "prop": "extracts",
        "exintro": False,
        "explaintext": True,
        "exsectionformat": "plain",
        "format": "json",
        "redirects": 1,
    }

    try:
        async with httpx.AsyncClient(timeout=_TIMEOUT) as client:
            response = await client.get(
                settings.WIKIPEDIA_ACTION_API,
                params=params,
                headers={"User-Agent": "DailyLearningApp/1.0"},
            )
            response.raise_for_status()
            data = response.json()

            pages = data.get("query", {}).get("pages", {})
            for page_id, page_data in pages.items():
                if page_id == "-1":
                    return None
                return page_data.get("extract", "")

            return None

    except (httpx.HTTPError, Exception) as e:
        logger.error(f"Wikipedia extract failed for '{title}': {e}")
        return None
