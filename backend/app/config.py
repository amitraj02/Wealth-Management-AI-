import os
from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    PROJECT_NAME: str = "FinAdvisor AI"
    API_V1_STR: str = "/api/v1"
    DATABASE_URL: str = "sqlite+aiosqlite:///./finadvisor.db"
    CORS_ORIGINS: List[str] = ["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000", "*"]
    
    # LLM Settings (OpenAI / Gemini / Fallback)
    OPENAI_API_KEY: str = ""
    GEMINI_API_KEY: str = ""
    LLM_MODEL: str = "gpt-4o"
    
    # Dhan Market API Settings
    DHAN_CLIENT_ID: str = "1104228365"
    DHAN_ACCESS_TOKEN: str = "DHAN_DEMO_TOKEN"
    DHAN_ENV: str = "sandbox"
    
    # Governance Policies
    AUTO_APPROVE_LOW_RISK: bool = False
    ENFORCE_POLICY_CHECKS: bool = True
    
    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
