from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from typing import List

from backend.app.database import get_db
from backend.app.models.portfolio import Portfolio
from backend.app.models.transaction import Transaction
from backend.app.schemas.portfolio import PortfolioResponse, TransactionSchema
from backend.app.mcp.tools import mcp_tools

router = APIRouter(prefix="/portfolios", tags=["Portfolios"])

@router.get("/{client_id}", response_model=PortfolioResponse)
async def get_client_portfolio(client_id: int, db: AsyncSession = Depends(get_db)):
    """Fetch portfolio with holdings for a given client"""
    query = select(Portfolio).where(Portfolio.client_id == client_id).options(selectinload(Portfolio.holdings))
    res = await db.execute(query)
    portfolio = res.scalar_one_or_none()
    if not portfolio:
        raise HTTPException(status_code=404, detail="Portfolio not found")
    return portfolio

@router.get("/{client_id}/transactions", response_model=List[TransactionSchema])
async def get_client_transactions(client_id: int, limit: int = 50, db: AsyncSession = Depends(get_db)):
    """Fetch transactions for a client"""
    query = select(Transaction).where(Transaction.client_id == client_id).order_by(Transaction.timestamp.desc()).limit(limit)
    res = await db.execute(query)
    return res.scalars().all()

@router.get("/{client_id}/allocation-analytics")
async def get_allocation_analytics(client_id: int, db: AsyncSession = Depends(get_db)):
    """Calculate asset allocation drift and sector concentrations"""
    return await mcp_tools.calculate_asset_allocation(db, client_id)
