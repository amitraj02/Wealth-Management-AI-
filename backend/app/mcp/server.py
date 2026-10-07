from typing import Dict, Any, List

class MCPServer:
    """
    Model Context Protocol (MCP) Server for FinAdvisor AI
    Exposes discovery schemas and execution endpoints for LLMs.
    """
    TOOLS_SCHEMA = [
        {
            "name": "get_client_profile",
            "description": "Fetch a client's core profile, risk rating, target allocations, and goals.",
            "parameters": {
                "type": "object",
                "properties": {
                    "client_id": {"type": "integer", "description": "The client database ID"}
                },
                "required": ["client_id"]
            }
        },
        {
            "name": "get_portfolio",
            "description": "Retrieve comprehensive portfolio valuation, holdings list, asset weights, and returns.",
            "parameters": {
                "type": "object",
                "properties": {
                    "client_id": {"type": "integer", "description": "The client database ID"}
                },
                "required": ["client_id"]
            }
        },
        {
            "name": "get_transactions",
            "description": "Get chronological trade history and cash movements for a client.",
            "parameters": {
                "type": "object",
                "properties": {
                    "client_id": {"type": "integer", "description": "The client database ID"},
                    "limit": {"type": "integer", "default": 10, "description": "Max transactions to return"}
                },
                "required": ["client_id"]
            }
        },
        {
            "name": "get_market_data",
            "description": "Fetch real-time stock/index quotes, 52-week range, and P/E ratios from Dhan Market API.",
            "parameters": {
                "type": "object",
                "properties": {
                    "symbol": {"type": "string", "description": "NSE Ticker symbol (e.g. TCS, RELIANCE, NIFTY50)"}
                },
                "required": ["symbol"]
            }
        },
        {
            "name": "calculate_asset_allocation",
            "description": "Analyze actual equity/debt/cash vs target policy allocation and detect portfolio drift.",
            "parameters": {
                "type": "object",
                "properties": {
                    "client_id": {"type": "integer", "description": "The client database ID"}
                },
                "required": ["client_id"]
            }
        },
        {
            "name": "calculate_portfolio_returns",
            "description": "Compute 30-day and 1-year returns, realized/unrealized P&L, and Sharpe ratio.",
            "parameters": {
                "type": "object",
                "properties": {
                    "client_id": {"type": "integer", "description": "The client database ID"}
                },
                "required": ["client_id"]
            }
        },
        {
            "name": "search_client_documents",
            "description": "Semantic search in client IPS guidelines, tax documents, and historical notes.",
            "parameters": {
                "type": "object",
                "properties": {
                    "client_id": {"type": "integer", "description": "The client database ID"},
                    "query": {"type": "string", "description": "Search keyword or question"}
                },
                "required": ["client_id", "query"]
            }
        }
    ]

    @classmethod
    def list_tools(cls) -> List[Dict[str, Any]]:
        return cls.TOOLS_SCHEMA

mcp_server = MCPServer()
