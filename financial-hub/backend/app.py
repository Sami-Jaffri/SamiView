import yfinance as yf
from flask import Flask, jsonify
from flask_cors import CORS
from datetime import date, timedelta
import requests
import logging
import os
from dotenv import load_dotenv

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# 1. Load your .env
load_dotenv()  

# 2. Read the key into a module-level constant
API_KEY = os.getenv("FINNHUB_API_KEY")
if not API_KEY:
    raise RuntimeError("Missing FINNHUB_API_KEY in .env")

app = Flask(__name__)
CORS(app)

@app.route("/api/candle/<symbol>")
def get_candle(symbol):
    try:
        logger.debug(f"Fetching data for symbol: {symbol}")
        
        # 1) Download last 30 days of daily data
        df = yf.download(
            symbol,
            period="1mo",
            interval="1d",
            progress=False,
            auto_adjust=True
        )
        
        logger.debug(f"Downloaded data shape: {df.shape}")
        logger.debug(f"Columns available: {df.columns.tolist()}")

        # 2) Check if we got any data
        if df.empty:
            logger.warning(f"No data available for {symbol}")
            return jsonify({"error": f"No data available for {symbol}"}), 400

        # 3) Forward-fill any missing values
        df = df.ffill()
        
        # 4) Build UNIX timestamp list and closing-price list
        timestamps = [int(ts.timestamp()) for ts in df.index]
        closes = [x[0] for x in df["Close"].values.tolist()] # Changed from "Adj Close" to "Close"
        
        logger.debug(f"Generated {len(timestamps)} data points")
        
        return jsonify({
            "t": timestamps,
            "c": closes
        })
    except Exception as e:
        logger.error(f"Error processing {symbol}: {str(e)}", exc_info=True)
        return jsonify({"error": f"Error processing {symbol}: {str(e)}"}), 500

@app.route("/api/news/<symbol>")
def get_news(symbol):
    # fetch the last week of news
    today    = date.today()
    week_ago = today - timedelta(days=7)
    resp = requests.get(
        "https://finnhub.io/api/v1/company-news",
        params={
          "symbol": symbol,
          "from": week_ago.isoformat(),
          "to": today.isoformat(),
          "token": API_KEY
        }
    )
    articles = resp.json()
    # optionally trim to top 5
    top5 = articles[:5] if isinstance(articles, list) else []
    return jsonify(top5)

if __name__ == "__main__":
    logger.info("Starting Flask server...")
    app.run(port=5000, debug=True)