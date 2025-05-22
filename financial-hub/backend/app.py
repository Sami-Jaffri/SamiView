import os
import yfinance as yf
import requests
import pandas as pd
from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from datetime import date, timedelta
from sklearn.linear_model import LogisticRegression
import logging

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

load_dotenv()
API_KEY = os.getenv("FINNHUB_API_KEY")
if not API_KEY:
    raise RuntimeError("Missing FINNHUB_API_KEY in .env")

app = Flask(__name__)
CORS(app)


@app.route("/api/candle/<symbol>")
def get_candle(symbol):
    try:
        logger.debug(f"Fetching data for symbol: {symbol}")
        df = yf.download(
            symbol,
            period="max",
            interval="1d",
            progress=False,
            auto_adjust=True
        )
        logger.debug(f"Downloaded data shape: {df.shape}")
        logger.debug(f"Columns available: {df.columns.tolist()}")

        if df.empty:
            return jsonify({"error": f"No data available for {symbol}"}), 400

        df = df.ffill()
        timestamps = [int(ts.timestamp()) for ts in df.index]

        def get_col(df, col):
            if col in df.columns:
                return df[col].values.tolist()  
            for c in df.columns:
                if isinstance(c, tuple) and c[0] == col:
                    return df[c].values.tolist()
            raise KeyError(f"Column {col} not found in DataFrame")


        opens = get_col(df, "Open")
        highs = get_col(df, "High")
        lows = get_col(df, "Low")
        closes = get_col(df, "Close")

        # Check for missing/empty arrays
        if not (timestamps and opens and highs and lows and closes):
            return jsonify({"error": "Missing or empty OHLC data"}), 400

        return jsonify({
            "t": timestamps,
            "o": opens,
            "h": highs,
            "l": lows,
            "c": closes
        })

    except Exception as e:
        logger.error(f"Error in get_candle for {symbol}: {e}", exc_info=True)
        return jsonify({"error": str(e)}), 500


@app.route("/api/news/<symbol>")
def get_news(symbol):
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
    return jsonify(articles[:5] if isinstance(articles, list) else [])


@app.route("/api/predict/<symbol>")
def predict_trend(symbol):
    try:
        df = yf.download(
            symbol,
            period="1y",
            interval="1d",
            progress=False,
            auto_adjust=True
        )

        logger.debug(f"Predict: downloaded {df.shape} for {symbol}")
        if df.empty:
            return jsonify({"error": f"No data for {symbol}"}), 400

        df = df.ffill()

        closes = [x[0] for x in df["Close"].values.tolist()]
        data = pd.DataFrame({"Close": closes}, index=df.index)

        data["ma5"]  = data["Close"].rolling(5).mean()
        data["ma20"] = data["Close"].rolling(20).mean()
        data = data.dropna(subset=["ma5", "ma20"])

        data["ret_next"] = data["Close"].pct_change().shift(-1)
        data = data.dropna(subset=["ret_next"])
        data["up"] = (data["ret_next"] > 0).astype(int)

        X = (data["ma5"] - data["ma20"]).values.reshape(-1, 1)
        y = data["up"].values
        if len(X) < 50:
            return jsonify({"error": "Not enough data to train"}), 400

        X_train, y_train = X[:-1], y[:-1]
        X_last           = X[-1].reshape(1, -1)

        model = LogisticRegression()
        model.fit(X_train, y_train)

        pred = model.predict(X_last)[0]
        prob = model.predict_proba(X_last)[0, pred]
        trend = "Up" if pred == 1 else "Down"

        return jsonify({
            "trend":      trend,
            "confidence": round(float(prob), 2),
            "feature":    round(float(X_last[0][0]), 4)
        })

    except Exception as e:
        logger.error(f"Error in predict_trend for {symbol}: {e}", exc_info=True)
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    logger.info("Starting Flask server on port 5000…")
    app.run(port=5000, debug=True)
