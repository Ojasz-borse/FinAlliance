from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.config import settings
from app.database import init_db
from app.routes import auth_routes, transaction_routes, fraud_routes, federated_routes, trainer_routes
from app.utils.logger import get_logger
from app.services.fraud_model import train_model

logger = get_logger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup / shutdown events."""
    logger.info(f"Starting {settings.APP_NAME} v{settings.APP_VERSION}")
    init_db()
    logger.info("Database tables created")

    # Pre-train the fraud model so predictions work immediately
    try:
        result = train_model()
        logger.info(f"Initial model trained: {result}")
    except Exception as e:
        logger.error(f"Model training failed: {e}")

    yield  # Application is running
    logger.info("Shutting down FinAlliance backend")


app = FastAPI(
    title=settings.APP_NAME,
    description=(
        "Federated Fraud Detection Platform — "
        "Collaborative AI across banks without sharing sensitive data."
    ),
    version=settings.APP_VERSION,
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    lifespan=lifespan,
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(auth_routes.router)
app.include_router(transaction_routes.router)
app.include_router(fraud_routes.router)
app.include_router(federated_routes.router)
app.include_router(trainer_routes.router)


@app.get("/", tags=["Health"])
def root():
    return {
        "name": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "status": "operational",
        "docs": "/api/docs",
    }


@app.get("/health", tags=["Health"])
def health():
    return {"status": "healthy"}
