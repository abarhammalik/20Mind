"""Daily topic endpoint — GET /api/today."""

import logging
from fastapi import APIRouter, HTTPException

from app.models.schemas import DailyLesson
from app.services import topic_selector, lesson_formatter

logger = logging.getLogger(__name__)

router = APIRouter()

# In-memory cache for the fully formatted lesson
_lesson_cache: dict[str, DailyLesson] = {}


@router.get("/today", response_model=DailyLesson)
async def get_today_lesson():
    """Return today's structured lesson.

    The same topic is served to every user on the same calendar day.
    Results are cached in memory so repeated requests don't hit Wikipedia.
    """
    # Get today's date from the topic selector (timezone-aware)
    date_str = topic_selector._get_today_str()

    # Check lesson cache
    if date_str in _lesson_cache:
        logger.info(f"Returning cached lesson for {date_str}")
        return _lesson_cache[date_str]

    # Step 1: Select today's topic
    topic_info = await topic_selector.get_today_topic()
    if not topic_info:
        raise HTTPException(
            status_code=503,
            detail="We couldn't load today's discovery. Please try again later.",
        )

    # Step 2: Format into a lesson
    lesson = await lesson_formatter.format_lesson(topic_info, date_str)
    if not lesson:
        raise HTTPException(
            status_code=503,
            detail="We couldn't prepare today's lesson. Please try again later.",
        )

    # Cache the lesson
    _lesson_cache[date_str] = lesson
    logger.info(f"Lesson ready for {date_str}: {lesson.title}")

    return lesson
