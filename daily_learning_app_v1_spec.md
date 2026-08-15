# Daily 20-Minute Learning App — V1 Development Specification

## 1. Project Overview

Build a simple learning app whose purpose is:

> **Learn something new every day in about 20 minutes.**

The first version must stay intentionally simple.

The app should:
- Show one common "Topic of the Day" to every user.
- Select the topic dynamically from Wikipedia or another public knowledge source.
- NOT store the topic catalog in a database.
- NOT use an ML recommendation system.
- NOT require personalized recommendations.
- Allow users to browse/select learning categories.
- Present the selected topic in a clean, structured learning format rather than displaying a raw Wikipedia article.
- End each lesson with a short quiz.
- Track only basic local/user progress if needed.

The core product loop is:

```text
Open App
   ↓
Today's Topic
   ↓
Read / Learn
   ↓
Interesting Facts / Examples
   ↓
Quick Quiz
   ↓
Result
```

---

# 2. V1 Product Scope

## Must Have

1. Home screen
2. Topic of the Day
3. Category selection
4. Structured lesson screen
5. Quiz
6. Quiz result
7. Basic progress
8. Same topic for everyone on the same day
9. Dynamic topic retrieval from Wikipedia/API
10. Responsive mobile UI
11. Loading and error states
12. Basic caching so the same daily topic is consistently served

## Do NOT Build in V1

- ML recommendation system
- Vector database
- Knowledge graph
- Social features
- Leaderboards
- Chat system
- User-to-user following
- Complex personalization
- Microservices
- Kubernetes
- Complex analytics
- Large permanent topic database
- AI agents
- Complex admin dashboard

AI may be added later only for converting source material into a better lesson format.

---

# 3. Recommended Technology Stack

## Frontend

Use:

- React Native
- Expo
- TypeScript
- Expo Router
- React Query / TanStack Query for API state
- AsyncStorage for small local settings/progress if authentication is not implemented
- React Native Paper or another lightweight component library if useful

Reason:
- One codebase for Android/iOS.
- TypeScript gives safer code.
- Expo makes development easier.
- The architecture can later support a production mobile app.

## Backend

Use:

- Python 3.11+
- FastAPI
- Pydantic
- httpx for external API requests
- python-dotenv for environment variables

Reason:
- FastAPI is simple and fast.
- Python is useful for content processing.
- Pydantic gives structured API responses.

## External Content Source

Primary:

- Wikipedia REST/API endpoints

The backend should retrieve article information from Wikipedia rather than storing a permanent topic catalog.

Possible future sources:
- Wikidata
- Wikimedia Commons
- Open Library
- NASA APIs
- other public APIs

For V1, start with Wikipedia only.

## Database

Do NOT require a database for the first content-delivery prototype.

If progress/authentication is added:
- PostgreSQL can be introduced later.

## Deployment

During development:
- Frontend: Expo development server
- Backend: local FastAPI/Uvicorn

Later:
- Docker
- Cloud hosting

---

# 4. High-Level Architecture

```text
                    ┌──────────────────────┐
                    │       USER           │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │  React Native App    │
                    │      + Expo          │
                    │                      │
                    │  Home               │
                    │  Categories         │
                    │  Lesson             │
                    │  Quiz               │
                    │  Result             │
                    │  Progress           │
                    └──────────┬───────────┘
                               │
                          HTTPS / REST
                               │
                               ▼
                    ┌──────────────────────┐
                    │       FastAPI        │
                    │       Backend        │
                    │                      │
                    │  Daily Topic         │
                    │  Categories          │
                    │  Content Processing  │
                    │  Quiz                │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │    Wikipedia API     │
                    │                      │
                    │  Search              │
                    │  Article             │
                    │  Summary             │
                    │  Metadata            │
                    └──────────────────────┘
```

---

# 5. Important Product Rule: Same Topic for Everyone

Every user should see the same topic for a given calendar day.

Example:

```text
2026-08-07 → Black Holes
2026-08-08 → Marie Curie
2026-08-09 → Battle of Waterloo
```

User A, User B and User C should all receive the same topic on 2026-08-07.

The system must NOT select a fresh random Wikipedia article on every request.

---

# 6. How Daily Topic Selection Should Work

Use the date as part of deterministic topic selection.

Conceptually:

```python
seed = "2026-08-07"
```

Use the seed to deterministically select:

1. A category
2. A Wikipedia search/query
3. A candidate article

However, Wikipedia's own random endpoint may return a different article on every request. Therefore, do not depend directly on a "random article" endpoint if consistency is required.

A better V1 approach is:

```text
Today's date
     ↓
Deterministic seed
     ↓
Select category
     ↓
Use category/topic query against Wikipedia
     ↓
Retrieve candidate articles
     ↓
Deterministically select one candidate
     ↓
Fetch article details
     ↓
Return today's lesson
```

The backend may use a short-lived in-memory cache keyed by date to avoid repeated Wikipedia requests.

Example:

```text
daily_topic_cache = {
    "2026-08-07": <topic>
}
```

This cache does not represent a permanent topic database.

---

# 7. Categories

Initial categories:

```text
Physics
Biology
Chemistry
Mathematics
Psychology
Books
Religion
History
Historic Figures
Battles
Movies
Sports
Artificial Intelligence
Machine Learning
Coding
Computer Science
Science
Technology
Space
Astronomy
Geography
Philosophy
Economics
Art
Music
Architecture
Animals
Nature
Inventions
Interesting Facts
Mythology
Languages
```

The category list should be stored in a simple Python configuration file for V1, not in PostgreSQL.

Example:

```python
CATEGORIES = [
    "Physics",
    "Biology",
    "Chemistry",
    "Mathematics",
    "Psychology",
    "History",
    "Technology",
    "Artificial Intelligence",
    "Space",
    "Geography",
    "Philosophy",
    "Sports",
    "Movies",
    "Books",
]
```

---

# 8. Category Selection

The user should be able to select categories they want to explore.

Example:

```text
What do you want to learn?

[x] Physics
[x] Biology
[ ] Chemistry
[x] History
[ ] Movies
[x] AI
[x] Technology

             Save
```

Important V1 behavior:

Category selection does not create a personalized ML recommendation system.

It only changes which categories are eligible for daily topic selection.

For a true "everyone sees the same topic" mode, the server can use a global default category pool.

If personalized category filtering is implemented, then users with different selections may see different topics. That should be an explicit optional mode, not the default.

---

# 9. Default Mode

V1 should have a default:

## Global Daily Discovery

Everyone sees the same topic.

The topic can be selected from all supported categories.

Example:

```text
Today:
How GPS Works

Category:
Technology
```

This should be the default behavior.

---

# 10. App Screens

V1 should have these screens:

```text
1. Home
2. Categories
3. Lesson
4. Quiz
5. Result
6. Progress
```

Optional:

7. Settings

---

# 11. Home Screen

Purpose:
- Immediately show today's topic.
- Encourage the user to start learning.

Example layout:

```text
-----------------------------------
Good evening

TODAY'S DISCOVERY

How Black Holes Work

Astronomy
18 min

Learn something new today.

[ START LEARNING ]

-----------------------------------

Today's progress
0 / 20 min

-----------------------------------
```

Home should also show:
- Category
- Estimated duration
- Short description
- Start button

Do not overload the home screen.

---

# 12. Categories Screen

Show categories as selectable cards/chips.

Example:

```text
Explore Categories

Science
[Physics] [Biology] [Chemistry] [Space]

Technology
[AI] [Coding] [Robotics] [Cybersecurity]

Humanities
[History] [Psychology] [Philosophy]

Culture
[Books] [Movies] [Music] [Art]
```

For V1, categories can simply be local/static data.

---

# 13. Lesson Screen

This is the core learning experience.

Do not display the raw Wikipedia article.

Transform the information into a consistent structure.

Recommended structure:

```text
TOPIC TITLE

Category
Estimated time

-----------------------------------

1. Hook

Start with an interesting question,
surprising fact, or real-world problem.

-----------------------------------

2. What is it?

Simple explanation.

-----------------------------------

3. How does it work?

Main concept explained clearly.

-----------------------------------

4. Why is it important?

Real-world significance.

-----------------------------------

5. Example

A practical example.

-----------------------------------

6. Interesting Facts

- Fact 1
- Fact 2
- Fact 3

-----------------------------------

7. Key Takeaways

- Point 1
- Point 2
- Point 3

-----------------------------------

[ TAKE THE QUIZ ]
```

The exact sections can vary by topic.

For example, a history lesson may use:

```text
Background
Timeline
Important People
What Happened
Why It Matters
Interesting Facts
```

A science lesson may use:

```text
What is it?
How does it work?
Why does it happen?
Real-world applications
Interesting facts
```

Therefore, the backend should return structured sections rather than assuming every topic uses exactly the same headings.

---

# 14. 20-Minute Design

Do not force every article to contain exactly 20 minutes of text.

Use an approximate target:

```text
10–15 minutes reading
+
3–5 minutes examples/facts
+
2–5 minutes quiz
=
approximately 20 minutes
```

Display:

```text
~18 min
```

or:

```text
~20 min
```

The duration is an estimate.

---

# 15. Quiz

Every lesson should have a short quiz.

V1:
- 5 questions
- Multiple choice
- 4 options
- One correct answer

Example:

```text
Question 1 / 5

What is an event horizon?

A. The center of a black hole
B. The boundary around a black hole
C. A type of star
D. A type of galaxy
```

After answering:

```text
Correct!

The event horizon is the boundary
beyond which light cannot escape
from a black hole.
```

At the end:

```text
YOUR RESULT

4 / 5
80%

[ FINISH ]
```

---

# 16. Result Screen

Show:

```text
Lesson Complete!

How Black Holes Work

Score
4 / 5

You learned:

✓ What a black hole is
✓ How an event horizon works
✓ Why light cannot escape
✓ How black holes can form

[ BACK TO HOME ]
```

---

# 17. Progress

V1 progress should be simple.

If no backend database is being used, store it locally.

Example:

```text
Progress

Topics completed: 7
Quiz questions answered: 35
Correct answers: 29

Current streak: 7 days

Categories explored:
Physics
History
AI
Technology
```

Use AsyncStorage for local V1 progress.

Later, move progress to PostgreSQL when accounts are added.

---

# 18. Backend API Design

Keep the API small.

## GET /api/health

Purpose:
Check if backend is running.

Response:

```json
{
  "status": "ok"
}
```

## GET /api/categories

Returns supported categories.

Example:

```json
{
  "categories": [
    "Physics",
    "Biology",
    "History",
    "Technology",
    "Artificial Intelligence"
  ]
}
```

## GET /api/today

Returns today's lesson.

Example:

```json
{
  "date": "2026-08-07",
  "title": "How Black Holes Work",
  "category": "Astronomy",
  "duration_minutes": 18,
  "source": {
    "name": "Wikipedia",
    "url": "..."
  },
  "description": "...",
  "sections": [
    {
      "title": "What is a black hole?",
      "content": "..."
    },
    {
      "title": "How does it form?",
      "content": "..."
    }
  ],
  "facts": [
    "...",
    "...",
    "..."
  ],
  "takeaways": [
    "...",
    "...",
    "..."
  ],
  "quiz": [
    {
      "question": "...",
      "options": [
        "...",
        "...",
        "...",
        "..."
      ],
      "correct_option": 1,
      "explanation": "..."
    }
  ]
}
```

## GET /api/topic

Optional development endpoint.

Returns a newly generated topic for testing.

This endpoint should NOT be used by the production Home screen because it would break the "same topic every day" requirement.

---

# 19. Backend Folder Structure

Use a simple structure:

```text
backend/
│
├── app/
│   ├── main.py
│   │
│   ├── api/
│   │   ├── health.py
│   │   ├── categories.py
│   │   └── daily.py
│   │
│   ├── services/
│   │   ├── wikipedia.py
│   │   ├── topic_selector.py
│   │   └── lesson_formatter.py
│   │
│   ├── models/
│   │   └── schemas.py
│   │
│   ├── config.py
│   └── constants.py
│
├── requirements.txt
├── .env
├── .env.example
└── README.md
```

---

# 20. Frontend Folder Structure

Use:

```text
mobile/
│
├── app/
│   ├── _layout.tsx
│   ├── index.tsx
│   ├── categories.tsx
│   ├── lesson.tsx
│   ├── quiz.tsx
│   ├── result.tsx
│   └── progress.tsx
│
├── components/
│   ├── TopicCard.tsx
│   ├── CategoryCard.tsx
│   ├── LessonSection.tsx
│   ├── QuizQuestion.tsx
│   └── ProgressCard.tsx
│
├── services/
│   └── api.ts
│
├── storage/
│   └── progress.ts
│
├── types/
│   └── api.ts
│
└── constants/
    └── categories.ts
```

---

# 21. Wikipedia Service

Create:

```text
services/wikipedia.py
```

Responsibilities:

1. Search Wikipedia.
2. Retrieve article information.
3. Retrieve summary/content.
4. Handle HTTP errors.
5. Handle missing pages.
6. Avoid requesting huge amounts of content unnecessarily.
7. Return clean Python objects.

Do not put Wikipedia API calls directly inside the FastAPI route.

Bad:

```python
@app.get("/today")
def today():
    # 100 lines of Wikipedia logic
```

Better:

```python
@app.get("/today")
def today():
    return daily_topic_service.get_today()
```

And:

```text
daily.py
    ↓
topic_selector.py
    ↓
wikipedia.py
```

---

# 22. Topic Selector

Create:

```text
services/topic_selector.py
```

Responsibilities:

1. Determine today's date.
2. Create deterministic seed.
3. Select a category.
4. Select/search for candidate Wikipedia articles.
5. Select one candidate deterministically.
6. Return the article ID/title.

Pseudo-code:

```python
def get_today_topic():
    today = get_current_date()
    seed = create_seed(today)

    category = select_category(seed)

    candidates = wikipedia.search(category)

    topic = deterministic_select(candidates, seed)

    return topic
```

Important:
The same date must produce the same result.

---

# 23. Lesson Formatter

Create:

```text
services/lesson_formatter.py
```

Its job is to convert source information into the app's structured lesson model.

Input:

```text
Wikipedia article
```

Output:

```text
Lesson
├── title
├── category
├── description
├── duration
├── sections
├── facts
├── takeaways
└── quiz
```

Initially, use Python rules/templates.

Do not require an LLM for V1.

---

# 24. AI Integration — Later

After the basic app works, add an optional:

```text
services/ai_formatter.py
```

Pipeline:

```text
Wikipedia
    ↓
Source article
    ↓
LLM
    ↓
Structured JSON
    ↓
Validation
    ↓
Lesson
    ↓
App
```

The AI should not be the source of truth.

Wikipedia/source content should be the factual source.

AI's job should be:
- Simplify
- Organize
- Create explanations
- Create questions
- Create summaries

The system should instruct the AI not to invent unsupported facts.

---

# 25. Data Models

Use Pydantic.

Example conceptual model:

```python
class LessonSection(BaseModel):
    title: str
    content: str


class QuizQuestion(BaseModel):
    question: str
    options: list[str]
    correct_option: int
    explanation: str


class DailyLesson(BaseModel):
    date: str
    title: str
    category: str
    duration_minutes: int
    description: str
    source_url: str
    sections: list[LessonSection]
    facts: list[str]
    takeaways: list[str]
    quiz: list[QuizQuestion]
```

The exact implementation can be adjusted during development.

---

# 26. Caching

Because every user requests the same daily lesson, avoid repeatedly calling Wikipedia.

Use a simple in-memory cache initially:

```python
daily_cache = {}
```

Conceptually:

```text
GET /today
     ↓
Is today's date in cache?
     │
  ┌──┴──┐
 YES    NO
  │      │
  ↓      ↓
Return  Generate
cache   today's topic
           ↓
        Save in cache
           ↓
        Return
```

Important:
The cache can disappear when the server restarts. That is acceptable for the first development version.

If production reliability becomes important, use a persistent cache/database later.

---

# 27. Timezone

The daily topic depends on the date.

For V1, define one global timezone for the daily topic.

For example:

```text
Asia/Kolkata
```

The server should use this timezone when deciding what today's date is.

Do not use the server's local timezone accidentally.

Later, if users worldwide need their own local "day", implement timezone-aware daily topics.

---

# 28. Error Handling

The app must handle:

## Wikipedia unavailable

Show:

```text
We couldn't load today's discovery.

Please try again.
```

## No suitable article

Backend should retry with another candidate.

## Slow network

Show a loading screen:

```text
Finding today's discovery...
```

## Invalid lesson data

Backend should validate the data before returning it.

---

# 29. Source Attribution

Because content is retrieved from Wikipedia, show a source section.

Example:

```text
Source

Wikipedia
Article: How Black Holes Work

Read the original source →
```

Follow Wikipedia/Wikimedia attribution and licensing requirements when using their content. Do not simply copy an entire article into the app.

The app should summarize and structure source information rather than reproducing large portions verbatim.

---

# 30. Security Basics

For V1:

- Never put secret API keys inside the mobile app.
- External API keys, if any, belong in the FastAPI backend environment.
- Use `.env`.
- Add `.env` to `.gitignore`.
- Validate external API responses.
- Validate all user-provided data.
- Do not trust client-side quiz scores for future server-side features.

Example:

```text
.env

API_KEY=...
```

Never commit this file to GitHub.

Provide:

```text
.env.example
```

instead.

---

# 31. Development Phases

## Phase 1 — Frontend Prototype

Build screens using static mock data.

Required flow:

```text
Home
 ↓
Lesson
 ↓
Quiz
 ↓
Result
```

Goal:
Make the UI functional before connecting APIs.

---

## Phase 2 — FastAPI

Create:

```text
GET /api/health
GET /api/categories
GET /api/today
```

Initially `/today` can return static JSON.

---

## Phase 3 — Connect Mobile App to Backend

Replace mock data with API data.

Flow:

```text
React Native
     ↓
GET /api/today
     ↓
FastAPI
     ↓
JSON
     ↓
Lesson UI
```

---

## Phase 4 — Wikipedia Integration

Implement:

```text
Wikipedia Service
       ↓
Topic Selector
       ↓
Daily Topic
       ↓
Lesson Formatter
```

---

## Phase 5 — Same Daily Topic

Implement deterministic selection based on the date.

Test with:

```text
2026-08-07
```

Call `/api/today` many times.

It must always return the same topic.

---

## Phase 6 — Quiz

Add quiz questions to the lesson response.

Implement:
- Answer selection
- Submit
- Explanation
- Score
- Result screen

---

## Phase 7 — Local Progress

Use AsyncStorage to save:

```text
completed topics
quiz scores
completion dates
streak
total learning time
```

No database required yet.

---

# 32. Testing Requirements

Test the following.

## Daily consistency

Call:

```text
GET /api/today
```

10 times on the same date.

Expected:

```text
Same topic every time
```

## Date change

Change the test date.

Expected:

```text
Different topic
```

## Wikipedia failure

Simulate API failure.

Expected:

```text
Graceful fallback/error
```

## Empty search results

Expected:

```text
Try another category/candidate
```

## Quiz

Test:
- Correct answer
- Wrong answer
- All correct
- All wrong
- Missing selection

## Offline frontend

The UI should not crash if the API is unavailable.

---

# 33. MVP Definition of Done

The first version is complete when:

- [ ] App opens successfully.
- [ ] Home screen shows today's topic.
- [ ] Topic comes from an external knowledge source.
- [ ] Everyone receives the same topic for the same day.
- [ ] Topic is not stored in a permanent topic database.
- [ ] Lesson is structured into readable sections.
- [ ] Lesson shows source attribution.
- [ ] User can complete a 5-question quiz.
- [ ] Quiz score is displayed.
- [ ] User can see basic progress.
- [ ] Categories are visible.
- [ ] API errors are handled.
- [ ] Loading states exist.
- [ ] Mobile UI is responsive.
- [ ] No secret keys are exposed in frontend code.

---

# 34. Recommended V1 Architecture

The final V1 architecture should remain this simple:

```text
                    MOBILE APP
                 React Native + Expo
                         │
                         │ REST API
                         ▼
                     FASTAPI
                         │
            ┌────────────┼────────────┐
            │            │            │
            ▼            ▼            ▼
       Topic Selector  Wikipedia   Lesson
                       Service     Formatter
            │            │            │
            └────────────┴────────────┘
                         │
                         ▼
                    Daily Lesson
                         │
                         ▼
                       APP
                         │
                  ┌──────┴──────┐
                  ▼             ▼
               Lesson          Quiz
                  │             │
                  └──────┬──────┘
                         ▼
                    Local Progress
                     AsyncStorage
```

No database is necessary for the first working version.

---

# 35. Future Architecture — Not V1

Only after the basic app works, consider:

```text
PostgreSQL
User accounts
Cloud progress
AI lesson generation
AI quiz generation
Redis
Push notifications
Spaced repetition
Personalized recommendations
Vector search
Knowledge graph
Audio lessons
```

Do not implement these before validating that users actually enjoy the basic daily-learning experience.

---

# 36. Suggested Project Repository

```text
daily-learning-app/
│
├── mobile/
│   ├── app/
│   ├── components/
│   ├── services/
│   ├── storage/
│   ├── types/
│   └── constants/
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── services/
│   │   ├── models/
│   │   ├── constants.py
│   │   ├── config.py
│   │   └── main.py
│   ├── requirements.txt
│   ├── .env.example
│   └── README.md
│
├── docs/
│   └── architecture.md
│
├── .gitignore
└── README.md
```

---

# 37. IDE Coding Instructions

When giving this specification to an AI coding IDE, instruct it to follow these rules:

1. Build V1 only.
2. Do not add features outside this specification.
3. Do not introduce a database unless explicitly required.
4. Do not implement ML recommendations.
5. Keep frontend and backend separate.
6. Use TypeScript on the frontend.
7. Use Python/FastAPI on the backend.
8. Use Pydantic models for API contracts.
9. Keep external API logic inside service modules.
10. Do not put Wikipedia API calls directly in React Native components.
11. Do not expose backend secrets to the mobile app.
12. Use environment variables for configuration.
13. Add useful error handling.
14. Add loading and empty states.
15. Keep functions small and modular.
16. Use clear naming.
17. Avoid unnecessary dependencies.
18. Do not create microservices.
19. Do not add ML, vector databases, Redis, or PostgreSQL in V1.
20. Write a README with setup and run instructions.

---

# 38. First Development Task for the IDE

Do NOT ask the IDE to generate the entire application at once.

Start with:

## Task 1

Create the project structure for:

```text
daily-learning-app/
├── mobile/
└── backend/
```

Set up:

- React Native + Expo + TypeScript
- FastAPI + Python
- Basic `/api/health` endpoint
- Basic mobile Home screen
- API service on the frontend
- README

Do not implement Wikipedia yet.

---

# 39. Second Development Task

After Task 1 works:

Implement:

```text
GET /api/categories
```

Return the static category list.

Then create the Categories screen.

---

# 40. Third Development Task

Implement:

```text
GET /api/today
```

Initially return a hardcoded lesson.

Connect the Home and Lesson screens.

---

# 41. Fourth Development Task

Replace the hardcoded lesson with Wikipedia integration.

Create:

```text
wikipedia.py
topic_selector.py
lesson_formatter.py
```

Keep the API response structure stable so the frontend does not need major changes.

---

# 42. Fifth Development Task

Implement deterministic daily selection.

Requirement:

```text
Same date → same topic
Different date → normally different topic
```

Do not use a database to store daily topics.

---

# 43. Sixth Development Task

Implement the quiz.

The lesson response should contain quiz questions.

Create:

```text
Lesson → Quiz → Result
```

---

# 44. Seventh Development Task

Implement local progress with AsyncStorage.

Store only basic information.

Example:

```json
{
  "completedDates": [
    "2026-08-05",
    "2026-08-06",
    "2026-08-07"
  ],
  "quizScores": {
    "2026-08-07": 4
  }
}
```

---

# 45. Final V1 Goal

The finished first version should feel like this:

```text
                 OPEN APP
                     │
                     ▼
          ┌─────────────────────┐
          │ TODAY'S DISCOVERY    │
          │                     │
          │ How GPS Works       │
          │ Technology          │
          │ ~18 minutes         │
          │                     │
          │ [ START LEARNING ]  │
          └──────────┬──────────┘
                     │
                     ▼
             READ / LEARN
                     │
                     ▼
             KEY TAKEAWAYS
                     │
                     ▼
                5 QUESTIONS
                     │
                     ▼
                  RESULT
                     │
                     ▼
              MARK COMPLETE
                     │
                     ▼
           COME BACK TOMORROW
```

The central philosophy of V1 is:

> **One topic. One day. One shared discovery. About 20 minutes.**

Build this experience first. Everything else can be added after this core loop is working reliably.
