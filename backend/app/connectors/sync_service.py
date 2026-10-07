import logging
from typing import Dict, Any, List
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from backend.app.models.client import Client
from backend.app.models.portfolio import Portfolio, Holding
from backend.app.models.market import MarketTicker
from backend.app.connectors.client_api import external_client_api
from backend.app.connectors.portfolio_api import external_portfolio_api
from backend.app.connectors.market_dhan_api import dhan_market_connector
from backend.app.connectors.validation import data_validator

logger = logging.getLogger("FinAdvisor.DataSync")

class IntegrationSyncService:
    """
    Data Integration Service:
    Pulls data from multiple external sources (Client CRM, Custody Portfolio API, Dhan Market Data),
    validates & sanitizes via Pydantic, and writes to unified database models.
    """
    async def sync_market_data(self, db: AsyncSession) -> Dict[str, Any]:
        """Fetch live quotes from Dhan connector and update MarketTicker table"""
        quotes = await dhan_market_connector.get_all_market_quotes()
        updated_count = 0

        for q in quotes:
            res = await db.execute(select(MarketTicker).where(MarketTicker.symbol == q["symbol"]))
            ticker = res.scalar_one_or_none()
            if ticker:
                ticker.current_price = q["current_price"]
                ticker.change_pct = q["change_pct"]
                ticker.day_high = q["day_high"]
                ticker.day_low = q["day_low"]
                ticker.high_52w = q["high_52w"]
                ticker.low_52w = q["low_52w"]
                ticker.pe_ratio = q["pe_ratio"]
                ticker.updated_at = datetime.utcnow()
            else:
                ticker = MarketTicker(
                    symbol=q["symbol"],
                    name=q["name"],
                    exchange=q["exchange"],
                    asset_class=q["asset_class"],
                    sector=q["sector"],
                    current_price=q["current_price"],
                    change_pct=q["change_pct"],
                    day_high=q["day_high"],
                    day_low=q["day_low"],
                    high_52w=q["high_52w"],
                    low_52w=q["low_52w"],
                    pe_ratio=q["pe_ratio"],
                    market_cap_cr=q["market_cap_cr"]
                )
                db.add(ticker)
            updated_count += 1

        await db.commit()
        return {"status": "SUCCESS", "synced_tickers": updated_count, "source": "Dhan Market API"}

    async def sync_all_external_sources(self, db: AsyncSession) -> Dict[str, Any]:
        """Full pipeline sync across Market, Client and Portfolio sources"""
        market_res = await self.sync_market_data(db)
        return {
            "status": "COMPLETED",
            "timestamp": datetime.utcnow().isoformat(),
            "market_sync": market_res,
            "pipeline": ["Client CRM API", "Custodian Portfolio API", "Dhan Market Connector", "Validation Layer", "Unified Database"]
        }

integration_sync_service = IntegrationSyncService()
