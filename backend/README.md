# FinAlliance Backend

Federated Fraud Detection Platform — FastAPI + Scikit-learn + SQLite

## Quick Start

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the server
uvicorn app.main:app --reload --port 8000
```

API docs available at: **http://localhost:8000/api/docs**

## Architecture

```
Next.js Frontend → Axios → FastAPI Backend → ML Model → Response
                                ↓
                           SQLite DB
```

## Key Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | Login (returns JWT) |
| POST | `/transactions/add` | Add transaction |
| GET | `/transactions/all` | List transactions |
| POST | `/fraud/predict` | Predict fraud probability |
| GET | `/fraud/high-risk` | Get flagged transactions |
| POST | `/federated/train-local` | Train bank's local model |
| POST | `/federated/send-update` | Send encrypted weights |
| POST | `/federated/aggregate` | Aggregate all updates |
| GET | `/federated/global-model` | Download global model |

## Docker

```bash
docker build -t finalliance-backend .
docker run -p 8000:8000 finalliance-backend
```
