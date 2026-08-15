# Daily Learning App V1

> **Learn something new every day in about 20 minutes.**

Daily Learning App is a lightweight cross-platform learning application designed to help users discover one new topic every day through a structured, distraction-free learning experience.

Each user receives the **same topic on the same calendar day**. Topics are selected deterministically and retrieved dynamically from Wikipedia, then transformed into a concise lesson followed by a 5-question interactive quiz.

---

## ✨ Features

### 📅 Deterministic Daily Topic

Every user receives the same daily topic.

A **SHA-256 date-seeded selection algorithm** determines the topic for each calendar day, eliminating the need to store daily topics in a database.

```text
Today's Date
     ↓
SHA-256 Seed
     ↓
Deterministic Topic Selection
     ↓
Same Topic for Everyone
```

### 📚 Wikipedia Integration

Topics are fetched dynamically from Wikipedia through the backend.

This allows the application to provide a large variety of learning content without maintaining a database of lessons.

### 🧠 Structured 20-Minute Lessons

Raw source material is transformed into digestible learning sections such as:

* Introduction
* Key Details
* Interesting Facts
* Key Takeaways

The goal is to make each lesson understandable within approximately **20 minutes**.

### 📝 Interactive Quiz

Every lesson is followed by a **5-question multiple-choice quiz**.

Users receive:

* Immediate answer feedback
* Correct/incorrect indication
* Answer explanations
* Final quiz score

### 🔥 Local Progress & Streaks

Learning progress is stored locally using **AsyncStorage**.

The application tracks:

* Completed lessons
* Quiz scores
* Quiz accuracy
* Daily learning streaks

No account or cloud database is required for V1.

### 🌙 Dark Mode

The interface includes a reading-focused dark mode designed to make longer learning sessions more comfortable.

---

# 🏗️ Architecture

```text
                 React Native App
                  Expo + TypeScript
                         │
                         │ HTTPS / REST API
                         ▼
                  FastAPI Backend
                         │
        ┌────────────────┼────────────────┐
        ▼                ▼                ▼
 Topic Selector    Wikipedia Service   Lesson Formatter
        │                │                │
        │          Wikipedia API          │
        │                │                │
        └────────────────┼────────────────┘
                         ▼
                    Daily Lesson
                         │
                         ▼
                  Mobile Application
                         │
              ┌──────────┴──────────┐
              ▼                     ▼
        Lesson Progress        Quiz Results
              │                     │
              └──────────┬──────────┘
                         ▼
                    AsyncStorage
```

---

# 🛠️ Technology Stack

| Layer            | Technology         |
| ---------------- | ------------------ |
| Mobile           | React Native       |
| Mobile Framework | Expo               |
| Language         | TypeScript         |
| Navigation       | Expo Router        |
| Backend          | FastAPI            |
| Backend Language | Python             |
| Data Source      | Wikipedia          |
| Local Storage    | AsyncStorage       |
| API              | REST               |
| Development      | Expo CLI + Uvicorn |

---

# 🚀 Getting Started

## Prerequisites

Install the following before running the project:

* **Python 3.10+**
* **Node.js**
* **npm**
* **Expo CLI / Expo Go**
* Git

Check your installed versions:

```bash
python --version
node --version
npm --version
```

---

# 1. Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

## Create a Virtual Environment

### Windows

```powershell
python -m venv venv
```

### macOS/Linux

```bash
python3 -m venv venv
```

## Activate the Virtual Environment

### Windows

```powershell
.\venv\Scripts\activate
```

### macOS/Linux

```bash
source venv/bin/activate
```

## Install Dependencies

```bash
pip install -r requirements.txt
```

## Configure Environment Variables

If the project uses environment variables, create a `.env` file based on:

```text
.env.example
```

Do not commit secrets or private credentials to Git.

## Start the Backend

```bash
uvicorn app.main:app --reload --port 8000
```

The API will be available at:

```text
http://localhost:8000
```

### Interactive API Documentation

FastAPI automatically provides Swagger documentation:

```text
http://localhost:8000/docs
```

You can also access the OpenAPI schema at:

```text
http://localhost:8000/openapi.json
```

---

# 2. Mobile App Setup

Open a new terminal and navigate to the mobile application:

```bash
cd mobile
```

Install dependencies:

```bash
npm install
```

Start the Expo development server:

```bash
npx expo start
```

Expo will display options for running the application.

You can use:

* Expo Go on a physical Android/iOS device
* Android Emulator
* iOS Simulator
* Web browser, where supported

---

# 📱 Running on a Physical Device

When testing the mobile application with a physical device, remember that:

```text
localhost
```

refers to the device itself, not your development computer.

If the FastAPI backend is running on your computer, configure the mobile API client to use your computer's local network IP.

For example:

```text
http://192.168.1.100:8000
```

Both the computer and mobile device should normally be connected to the same Wi-Fi network.

For production, use a publicly accessible **HTTPS backend URL** instead.

---

# 🔌 Backend API

The backend currently exposes the following primary endpoints:

| Method | Endpoint          | Description                          |
| ------ | ----------------- | ------------------------------------ |
| GET    | `/api/health`     | Check backend health                 |
| GET    | `/api/categories` | Return supported learning categories |
| GET    | `/api/today`      | Return today's deterministic lesson  |

### Health Check

```http
GET /api/health
```

Used to verify that the backend is running correctly.

### Categories

```http
GET /api/categories
```

Returns the application's supported knowledge categories.

### Today's Lesson

```http
GET /api/today
```

Returns the lesson selected for the current calendar day.

---

# 🧩 Daily Topic Selection

One of the core design decisions in V1 is that the application does **not require a database to determine the daily topic**.

The process is conceptually:

```text
Current Calendar Date
        ↓
Convert Date → String
        ↓
SHA-256 Hash
        ↓
Convert Hash → Deterministic Number
        ↓
Select Topic / Category
        ↓
Fetch Wikipedia Content
        ↓
Format Lesson
```

Because the same date produces the same deterministic value, every user receives the same topic.

For example:

```text
2026-08-16
     ↓
SHA-256
     ↓
Deterministic Seed
     ↓
Topic X
```

Another user requesting the topic on the same date will receive **Topic X** as well.

---

# 📖 Lesson Generation

The backend combines three main services:

### 1. Topic Selector

Responsible for selecting the daily topic using the deterministic date-based algorithm.

### 2. Wikipedia Service

Retrieves relevant information from Wikipedia.

### 3. Lesson Formatter

Transforms the retrieved information into a consistent learning structure.

Conceptually:

```text
Wikipedia Content
       ↓
Content Extraction
       ↓
Lesson Formatting
       ↓
Introduction
       ↓
Details
       ↓
Interesting Facts
       ↓
Key Takeaways
```

---

# 📝 Quiz System

Each lesson is followed by a five-question quiz.

The general flow is:

```text
Daily Lesson
     ↓
Read & Learn
     ↓
Start Quiz
     ↓
Question 1
     ↓
Question 2
     ↓
Question 3
     ↓
Question 4
     ↓
Question 5
     ↓
Calculate Score
     ↓
Show Results
```

The quiz provides immediate feedback and explanations to reinforce learning.

---

# 💾 Local Progress

V1 intentionally uses **AsyncStorage instead of a cloud database**.

The mobile application can store information such as:

```text
Completed Lessons
Quiz Scores
Quiz Accuracy
Last Learning Date
Current Streak
Longest Streak
```

This keeps the initial version lightweight and eliminates the need for authentication or database infrastructure.

---

# 📁 Repository Structure

```text
Daily Learning App V1/
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── health.py
│   │   │   ├── categories.py
│   │   │   └── daily.py
│   │   │
│   │   ├── models/
│   │   │   └── ...
│   │   │
│   │   ├── services/
│   │   │   ├── wikipedia.py
│   │   │   ├── topic_selector.py
│   │   │   └── lesson_formatter.py
│   │   │
│   │   ├── config.py
│   │   ├── constants.py
│   │   └── main.py
│   │
│   ├── .env.example
│   ├── requirements.txt
│   └── README.md
│
├── mobile/
│   ├── app/
│   │   ├── index.tsx
│   │   ├── categories.tsx
│   │   ├── lesson.tsx
│   │   ├── quiz.tsx
│   │   ├── result.tsx
│   │   └── progress.tsx
│   │
│   ├── components/
│   │   ├── TopicCard.tsx
│   │   ├── LessonSection.tsx
│   │   ├── QuizQuestion.tsx
│   │   └── ...
│   │
│   ├── constants/
│   │   └── categories.ts
│   │
│   ├── services/
│   │   └── api.ts
│   │
│   ├── storage/
│   │   └── progress.ts
│   │
│   ├── types/
│   │   └── ...
│   │
│   ├── app.json
│   └── package.json
│
├── daily_learning_app_v1_spec.md
├── .gitignore
└── README.md
```

---

# 🔄 Application Flow

The complete user journey is:

```text
┌─────────────────┐
│     Open App    │
└────────┬────────┘
         ▼
┌─────────────────┐
│ Fetch Today's   │
│     Topic       │
└────────┬────────┘
         ▼
┌─────────────────┐
│ Read 20-Minute  │
│     Lesson      │
└────────┬────────┘
         ▼
┌─────────────────┐
│   Take Quiz     │
│    5 Questions  │
└────────┬────────┘
         ▼
┌─────────────────┐
│ View Quiz Score │
└────────┬────────┘
         ▼
┌─────────────────┐
│ Update Local    │
│ Progress/Streak │
└─────────────────┘
```

---

# 🧪 Development

When modifying the backend:

```bash
cd backend
uvicorn app.main:app --reload --port 8000
```

When modifying the mobile application:

```bash
cd mobile
npm install
npx expo start
```

Keep API contracts synchronized between:

```text
backend/
      ↕
mobile/services/
      ↕
mobile/types/
```

When adding or changing an API response, update the corresponding TypeScript types and API client.

---

# 🔐 Security & Privacy

V1 is designed to minimize the amount of user data collected.

* No user account is required.
* Learning progress is stored locally.
* No passwords are stored.
* No personal profile database is required.
* API communication should use HTTPS in production.
* Secrets and API keys should be stored in environment variables.
* `.env` files containing secrets must not be committed to Git.

---

# 🚧 Current Limitations

V1 intentionally keeps the architecture simple.

Current limitations include:

* Progress is stored only on the user's device.
* Progress does not automatically synchronize between devices.
* No user authentication.
* No cloud database.
* Daily content depends on external Wikipedia availability.
* Lesson formatting is heuristic and may require refinement for some topics.
* Quiz generation/content quality depends on the available lesson data.

---

# 🗺️ Future Roadmap

Potential improvements for future versions:

* [ ] User authentication
* [ ] Cloud-synchronized progress
* [ ] Cross-device streak synchronization
* [ ] Personalized learning history
* [ ] Bookmarks and saved lessons
* [ ] Search and topic exploration
* [ ] More advanced quiz generation
* [ ] Difficulty levels
* [ ] Spaced repetition
* [ ] Offline lesson caching
* [ ] Push notifications
* [ ] Daily learning reminders
* [ ] Achievement and badge system
* [ ] Shareable learning cards
* [ ] Analytics dashboard
* [ ] AI-powered lesson summarization
* [ ] AI-powered question generation

---

# 📄 Project Specification

Detailed project requirements and implementation notes are available in:

```text
daily_learning_app_v1_spec.md
```

Use this document as the reference when extending or modifying the application.

---

# 🤝 Contributing

Contributions and improvements are welcome.

Before submitting changes:

1. Test the FastAPI backend.
2. Test the mobile application.
3. Verify API communication.
4. Test the daily-topic selection.
5. Test quiz scoring.
6. Verify progress and streak calculations.
7. Ensure existing functionality is not broken.

Create a feature branch:

```bash
git checkout -b feature/your-feature
```

Commit your changes:

```bash
git add .
git commit -m "Add your feature"
```

Push the branch:

```bash
git push origin feature/your-feature
```

Then open a Pull Request with a clear description of the changes.

---

# 📜 License

No license has currently been specified for this project.

If you plan to publish the project as open source, add an appropriate `LICENSE` file.

---

## 🎯 Project Philosophy

Daily Learning App follows a simple principle:

> **One topic. Twenty minutes. Every day.**

Instead of overwhelming users with an endless feed of content, the application provides one structured learning experience each day, making consistent learning easier to maintain.

**Learn → Quiz → Track → Repeat.**
