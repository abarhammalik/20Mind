# Daily Learning App — Backend

## Setup

1. **Create a virtual environment:**
   ```bash
   cd backend
   python -m venv venv
   ```

2. **Activate it:**
   - Windows: `venv\Scripts\activate`
   - macOS/Linux: `source venv/bin/activate`

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables:**
   ```bash
   copy .env.example .env
   ```
   Edit `.env` as needed.

## Run

```bash
cd backend
uvicorn app.main:app --reload --port 8000
```

Or:

```bash
python -m app.main
```

## API Endpoints

| Method | Path              | Description                    |
|--------|-------------------|--------------------------------|
| GET    | `/api/health`     | Health check                   |
| GET    | `/api/categories` | List all learning categories   |
| GET    | `/api/today`      | Get today's structured lesson  |

## API Docs

Once running, visit: [http://localhost:8000/docs](http://localhost:8000/docs)
