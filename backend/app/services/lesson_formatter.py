"""Lesson formatter.

Transforms raw Wikipedia content into a structured lesson with
sections, facts, takeaways, duration estimate, and quiz questions.

Uses heuristic text processing — no AI/LLM required for V1.
"""

import re
import hashlib
import logging
from typing import Optional

from app.models.schemas import (
    DailyLesson,
    LessonSection,
    QuizQuestion,
    SourceInfo,
)
from app.services import wikipedia

logger = logging.getLogger(__name__)

# Average reading speed (words per minute)
_WPM = 200


def _estimate_duration(text: str) -> int:
    """Estimate reading duration in minutes from word count."""
    words = len(text.split())
    # Add 3-5 min for quiz
    reading_min = max(5, words // _WPM)
    total = reading_min + 4  # quiz time
    # Clamp between 10 and 25 minutes
    return max(10, min(25, total))


def _clean_text(text: str) -> str:
    """Clean up extracted text by removing wiki-specific artifacts."""
    # Remove references like [1], [2], etc.
    text = re.sub(r'\[\d+\]', '', text)
    # Remove multiple newlines
    text = re.sub(r'\n{3,}', '\n\n', text)
    # Remove leading/trailing whitespace per line
    lines = [line.strip() for line in text.split('\n')]
    text = '\n'.join(lines)
    return text.strip()


def _split_into_sections(text: str) -> list[dict]:
    """Split plain text into sections based on headings.

    Wikipedia extracts use == Heading == style or just have
    content separated by double newlines.
    """
    # Try splitting by section headers (== Title ==)
    section_pattern = re.compile(r'^={2,}\s*(.+?)\s*={2,}$', re.MULTILINE)
    matches = list(section_pattern.finditer(text))

    sections = []

    if matches:
        # Extract intro (content before first heading)
        intro_text = text[:matches[0].start()].strip()
        if intro_text and len(intro_text) > 50:
            sections.append({
                "title": "Introduction",
                "content": _clean_text(intro_text),
            })

        # Extract each section
        for i, match in enumerate(matches):
            title = match.group(1).strip()
            start = match.end()
            end = matches[i + 1].start() if i + 1 < len(matches) else len(text)
            content = text[start:end].strip()

            if content and len(content) > 30:
                sections.append({
                    "title": title,
                    "content": _clean_text(content),
                })
    else:
        # No clear headings — split by paragraphs
        paragraphs = [p.strip() for p in text.split('\n\n') if p.strip()]
        if paragraphs:
            # First paragraph is intro
            sections.append({
                "title": "Introduction",
                "content": _clean_text(paragraphs[0]),
            })
            # Group remaining paragraphs
            if len(paragraphs) > 1:
                remaining = '\n\n'.join(paragraphs[1:])
                sections.append({
                    "title": "Details",
                    "content": _clean_text(remaining),
                })

    return sections


def _extract_facts(text: str, title: str) -> list[str]:
    """Extract interesting facts from article text.

    Uses heuristics to find sentences with interesting markers.
    """
    sentences = re.split(r'(?<=[.!?])\s+', text)
    facts = []

    # Keywords that often indicate interesting facts
    fact_markers = [
        "first", "largest", "smallest", "oldest", "fastest",
        "only", "unique", "discovered", "invented", "estimated",
        "approximately", "more than", "less than", "over",
        "million", "billion", "record", "famous",
        "surprising", "remarkable", "notable", "significant",
    ]

    for sentence in sentences:
        sentence = sentence.strip()
        if len(sentence) < 30 or len(sentence) > 300:
            continue

        lower = sentence.lower()
        # Check for fact markers
        if any(marker in lower for marker in fact_markers):
            clean = _clean_text(sentence)
            if clean and clean not in facts:
                facts.append(clean)

        if len(facts) >= 5:
            break

    # If we didn't find enough, take some informative sentences
    if len(facts) < 3:
        for sentence in sentences:
            sentence = sentence.strip()
            if (
                len(sentence) > 50
                and len(sentence) < 250
                and sentence not in facts
            ):
                facts.append(_clean_text(sentence))
            if len(facts) >= 3:
                break

    return facts[:5]


def _extract_takeaways(sections: list[dict], title: str) -> list[str]:
    """Generate key takeaways from section content."""
    takeaways = []

    for section in sections:
        content = section["content"]
        # Take the first sentence of each section as a takeaway
        sentences = re.split(r'(?<=[.!?])\s+', content)
        for sentence in sentences:
            sentence = sentence.strip()
            if len(sentence) > 30 and len(sentence) < 200:
                takeaways.append(_clean_text(sentence))
                break

    # Deduplicate and limit
    seen = set()
    unique = []
    for t in takeaways:
        if t not in seen:
            seen.add(t)
            unique.append(t)
        if len(unique) >= 3:
            break

    return unique


def _generate_quiz(
    sections: list[dict], title: str, facts: list[str], seed: int
) -> list[QuizQuestion]:
    """Generate quiz questions from lesson content.

    Uses heuristic approaches:
    1. Definition-based questions from section content
    2. Fact-based true/false style (presented as multiple choice)
    3. Section topic identification
    """
    questions: list[QuizQuestion] = []
    all_content = " ".join(s["content"] for s in sections)
    sentences = [
        s.strip() for s in re.split(r'(?<=[.!?])\s+', all_content)
        if len(s.strip()) > 40
    ]

    # Strategy 1: "What is..." questions from intro/first section
    if sections:
        intro = sections[0]["content"]
        intro_sentences = [
            s.strip() for s in re.split(r'(?<=[.!?])\s+', intro)
            if len(s.strip()) > 40
        ]

        if intro_sentences:
            correct_sentence = intro_sentences[0]
            # Truncate for the option
            correct_opt = correct_sentence[:150]
            if len(correct_sentence) > 150:
                correct_opt += "..."

            # Generate wrong options from other sentences
            wrong_opts = []
            for s in sentences[3:]:
                opt = s[:150]
                if len(s) > 150:
                    opt += "..."
                if opt != correct_opt:
                    wrong_opts.append(opt)
                if len(wrong_opts) >= 3:
                    break

            # Pad if needed
            generic_wrongs = [
                f"A concept unrelated to {title}",
                f"A different aspect not covered in this lesson",
                f"None of the above descriptions are accurate",
            ]
            while len(wrong_opts) < 3:
                wrong_opts.append(generic_wrongs[len(wrong_opts)])

            options = [correct_opt] + wrong_opts[:3]
            # Shuffle deterministically
            order = _deterministic_shuffle(4, seed)
            shuffled = [options[i] for i in order]
            correct_idx = shuffled.index(correct_opt)

            questions.append(QuizQuestion(
                question=f"Which of the following best describes {title}?",
                options=shuffled,
                correct_option=correct_idx,
                explanation=correct_sentence[:200],
            ))

    # Strategy 2: Section-based questions
    for i, section in enumerate(sections[1:4], start=1):
        content_sentences = [
            s.strip() for s in re.split(r'(?<=[.!?])\s+', section["content"])
            if len(s.strip()) > 40
        ]
        if not content_sentences:
            continue

        key_sentence = content_sentences[0]

        # Create a "Which section covers..." question
        correct_title = section["title"]
        other_titles = [
            s["title"] for s in sections
            if s["title"] != correct_title
        ][:3]

        # Pad with generic section names
        generic_sections = [
            "Unrelated Background", "Future Predictions",
            "Statistical Analysis", "Geographical Distribution",
        ]
        while len(other_titles) < 3:
            other_titles.append(
                generic_sections[len(other_titles) % len(generic_sections)]
            )

        options = [correct_title] + other_titles[:3]
        order = _deterministic_shuffle(4, seed + i)
        shuffled = [options[j] for j in order]
        correct_idx = shuffled.index(correct_title)

        questions.append(QuizQuestion(
            question=(
                f'The following information relates to which '
                f'aspect of {title}? "{key_sentence[:120]}..."'
            ),
            options=shuffled,
            correct_option=correct_idx,
            explanation=f'This information is covered in the "{correct_title}" section.',
        ))

        if len(questions) >= 5:
            break

    # Strategy 3: Fact-based questions
    if len(questions) < 5 and facts:
        for i, fact in enumerate(facts):
            if len(questions) >= 5:
                break

            # "Which of the following is true about [title]?"
            wrong_facts = [
                f"{title} has no notable characteristics in this area.",
                f"This topic is generally considered irrelevant to modern studies.",
                f"Experts have not yet reached any conclusions about this.",
            ]

            options = [fact[:150]] + wrong_facts[:3]
            order = _deterministic_shuffle(4, seed + 10 + i)
            shuffled = [options[j] for j in order]
            correct_idx = shuffled.index(fact[:150])

            questions.append(QuizQuestion(
                question=f"Which of the following is true about {title}?",
                options=shuffled,
                correct_option=correct_idx,
                explanation=fact[:200],
            ))

    # Ensure exactly 5 questions (pad with general knowledge questions)
    while len(questions) < 5:
        idx = len(questions)
        questions.append(QuizQuestion(
            question=f"What is the main topic of today's lesson?",
            options=[
                title,
                "A completely different subject",
                "This was not covered in the lesson",
                "None of the above",
            ],
            correct_option=0,
            explanation=f"Today's lesson is about {title}.",
        ))

    return questions[:5]


def _deterministic_shuffle(n: int, seed: int) -> list[int]:
    """Deterministically shuffle indices [0..n-1] using a seed.

    Uses Fisher-Yates with a seeded pseudo-random.
    """
    indices = list(range(n))
    # Simple deterministic shuffle
    hash_val = int(hashlib.md5(str(seed).encode()).hexdigest()[:8], 16)
    for i in range(n - 1, 0, -1):
        hash_val = (hash_val * 1103515245 + 12345) & 0x7FFFFFFF
        j = hash_val % (i + 1)
        indices[i], indices[j] = indices[j], indices[i]
    return indices


async def format_lesson(
    topic_info: dict, date_str: str
) -> Optional[DailyLesson]:
    """Format a Wikipedia topic into a structured daily lesson.

    Args:
        topic_info: Dict from topic_selector with title, category, url, etc.
        date_str: Date string (YYYY-MM-DD) for the lesson.

    Returns:
        A DailyLesson model or None on failure.
    """
    title = topic_info["title"]
    category = topic_info["category"]
    url = topic_info.get("url", "")

    logger.info(f"Formatting lesson for: {title}")

    # Get full article text
    full_text = await wikipedia.get_article_extracts(title)
    if not full_text or len(full_text) < 200:
        logger.warning(f"Insufficient content for '{title}'")
        return None

    # Clean up the text
    full_text = _clean_text(full_text)

    # Split into sections
    raw_sections = _split_into_sections(full_text)
    if not raw_sections:
        logger.warning(f"Could not create sections for '{title}'")
        return None

    # Limit content per section for readability
    lesson_sections = []
    for sec in raw_sections[:7]:  # Max 7 sections
        content = sec["content"]
        # Limit each section to ~300 words
        words = content.split()
        if len(words) > 300:
            content = ' '.join(words[:300]) + '...'

        lesson_sections.append(LessonSection(
            title=sec["title"],
            content=content,
        ))

    # Extract facts and takeaways
    facts = _extract_facts(full_text, title)
    takeaways = _extract_takeaways(raw_sections, title)

    # Generate quiz
    seed = int(hashlib.sha256(
        f"quiz-{date_str}-{title}".encode()
    ).hexdigest()[:8], 16)
    quiz = _generate_quiz(raw_sections, title, facts, seed)

    # Estimate duration
    total_content = full_text[:5000]  # Cap for duration estimate
    duration = _estimate_duration(total_content)

    # Build description from the topic info or intro
    description = topic_info.get("extract", "")
    if not description and raw_sections:
        first_sentences = raw_sections[0]["content"][:200]
        description = first_sentences

    return DailyLesson(
        date=date_str,
        title=title,
        category=category,
        duration_minutes=duration,
        description=description,
        source=SourceInfo(name="Wikipedia", url=url),
        sections=lesson_sections,
        facts=facts,
        takeaways=takeaways,
        quiz=quiz,
    )
