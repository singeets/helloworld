# React + FastAPI Starter (Updated)

Includes profile update with place autocomplete using OpenStreetMap Nominatim.

## Quick local run

Backend:
```
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
export DATABASE_URL="sqlite:///./dev.db"
uvicorn app.main:app --reload --port 8000
```

Frontend:
```
cd frontend
npm install
VITE_API_URL=http://localhost:8000 npm run dev
```

## DB Migration (Postgres)
If using Postgres and your `users` table exists, run:
```
ALTER TABLE users ADD COLUMN full_name VARCHAR;
ALTER TABLE users ADD COLUMN date_of_birth DATE;
ALTER TABLE users ADD COLUMN place_of_birth VARCHAR;
ALTER TABLE users ADD COLUMN latitude DOUBLE PRECISION;
ALTER TABLE users ADD COLUMN longitude DOUBLE PRECISION;
```
