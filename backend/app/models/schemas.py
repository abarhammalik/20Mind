"""Pydantic models for API request/response schemas."""

from pydantic import BaseModel


class HealthResponse(BaseModel):
    """Health check response."""
    status: str = "ok"


class CategoryResponse(BaseModel):
    """Category list response."""
    categories: list[str]


class LessonSection(BaseModel):
    """A single section of a lesson."""
    title: str
    content: str


class QuizQuestion(BaseModel):
    """A single multiple-choice quiz question."""
    question: str
    options: list[str]
    correct_option: int  # 0-indexed
    explanation: str


class SourceInfo(BaseModel):
    """Source attribution information."""
    name: str
    url: str


class DailyLesson(BaseModel):
    """The complete daily lesson response."""
    date: str
    title: str
    category: str
    duration_minutes: int
    description: str
    source: SourceInfo
    sections: list[LessonSection]
    facts: list[str]
    takeaways: list[str]
    quiz: list[QuizQuestion]
