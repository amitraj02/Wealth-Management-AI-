from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging

from backend.app.config import settings
from backend.app.database import engine, Base, AsyncSessionLocal
from backend.app.data.seed_data import seed_database
from backend.app.routers import clients, portfolios, agent, governance, integrations, advisor

# Logging Configuration
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger("FinAdvisor.Main")

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Initializing FinAdvisor AI Database Tables...")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    # Seed initial synthetic wealth data
    async with AsyncSessionLocal() as session:
        await seed_database(session)
    logger.info("FinAdvisor AI Data Seed Complete. Application ready.")
    yield
    logger.info("FinAdvisor AI Backend Shutting Down.")

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Governed AI Platform for Wealth Management Workflows — Multi-source Financial Integration, MCP Tools, Policy Engine & Human Approval Queue",
    version="2.0.0",
    lifespan=lifespan
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(advisor.router, prefix=settings.API_V1_STR)
app.include_router(clients.router, prefix=settings.API_V1_STR)
app.include_router(portfolios.router, prefix=settings.API_V1_STR)
app.include_router(agent.router, prefix=settings.API_V1_STR)
app.include_router(governance.router, prefix=settings.API_V1_STR)
app.include_router(integrations.router, prefix=settings.API_V1_STR)

@app.get("/")
async def root():
    return {
        "app": settings.PROJECT_NAME,
        "version": "2.0.0",
        "status": "OPERATIONAL",
        "docs_url": "/docs",
        "architecture": {
            "integration_layer": ["Client CRM API", "Custodian Portfolio API", "Dhan Market Connector"],
            "mcp_server": "Enabled (7 Wealth Tools)",
            "governance_engine": "5 Policies Enforced with Human-in-the-Loop",
            "audit_trail": "Immutable SQLite/PostgreSQL Logging"
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app.main:app", host="0.0.0.0", port=8000, reload=True)
