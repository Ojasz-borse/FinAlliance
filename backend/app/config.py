import os
from typing import List
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # Application
    APP_NAME: str = "FinAlliance"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True

    # Database
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "sqlite:///./finalliance.db"
    )

    # JWT
    SECRET_KEY: str = os.getenv("SECRET_KEY", "finalliance-super-secret-key-change-in-production")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    # ML
    MODEL_PATH: str = "models/global_model.pkl"
    FRAUD_THRESHOLD: float = 0.8

    # Encryption
    ENCRYPTION_KEY: str = os.getenv("ENCRYPTION_KEY", "0" * 32)

    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3000",
    ]

    class Config:
        env_file = ".env"


settings = Settings()
