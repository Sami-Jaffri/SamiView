# SamiView Project Report

## 1. Project Overview  
**Goal:** Build a TradingView-style financial hub that:  
- Fetches real-time (and historical) stock data  
- Renders interactive charts  
- Displays company news in a slide-out drawer  
- Predicts next-day price direction via a simple ML model  

Divided the work into two main parts: a **React** frontend and a **Flask** backend, connected by JSON APIs.

---

## 2. Technology Stack  

| Layer               | Technology                  | Purpose                                      |
|---------------------|-----------------------------|----------------------------------------------|
| **Frontend**        | React                       | UI framework                                 |
|                     | axios                       | HTTP client                                  |
|                     | Chart.js & react-chartjs-2  | Data visualization (line charts)             |
|                     | Framer Motion               | Drawer animations                            |
| **Backend**         | Python 3.10+                | Language runtime                             |
|                     | Flask                       | Web server + routing                         |
|                     | flask-cors                  | Enable React→Flask cross-origin calls        |
|                     | yfinance                    | Pull market data without API keys            |
|                     | requests                    | HTTP calls (for Finnhub news)                |
|                     | python-dotenv               | Load environment variables                   |
| **Machine Learning**| pandas                      | Data manipulation                            |
|                     | scikit-learn                | Logistic regression model                    |
| **Dev Tools**       | Node.js & npm               | Frontend package management                  |
|                     | Vite                        | React app bootstrapping                      |
|                     | virtualenv                  | Python env isolation                         |
|                     | Git / GitHub                | Version control                              |

---

## 3. Frontend Architecture  

### 3.1 `App.jsx`  
- **State:**  
  - `ticker` (current stock symbol)  
  - `input` (controlled ticker input)  
  - `isOpen` (news-drawer open flag)  
- **Layout:**  
  - Centered title (`<h1>`)  
  - Controls: black buttons (white text & border) + centered input  
  - `<StockChart>` in a wide, centered container  
  - `<NewsDrawer>` overlays from the right  

### 3.2 `StockChart.jsx`  
- **Lifecycle:**  
  1. On `symbol` change → fetch `/api/candle/:symbol` → render Chart.js line chart  
  2. Then fetch `/api/predict/:symbol` → display “Next day trend: Up/Down (xx% confidence)”  
- **Design:**  
  - Dark background, sharp corners, fixed height (450px), responsive width  
  - Inline styles for rapid iteration  

### 3.3 `NewsDrawer.jsx` & `StockNews.jsx`  
- Slide-out panel built with Framer Motion for smooth animations  
- Fetch `/api/news/:symbol` → display top 5 articles  
- Scrollable content, card-style entries, compact typography  

---

## 4. Backend Architecture  

### 4.1 Project Layout

```plaintext
backend/
├── app.py
├── .env
└── venv/      # Python virtualenv 
```

### 4.2 Configuration  
- `.env` holds `FINNHUB_API_KEY` for news  
- `python-dotenv` loads it at startup  

### 4.3 API Endpoints  
- **GET /api/candle/&lt;symbol&gt;**  
  - Uses `yfinance.download(..., auto_adjust=True)` for last 1 month of daily data  
  - Forward-fills missing values  
  - Flattens `df["Close"]` into a 1D list  
  - Returns:
    ```json
    { "t": [unix_ts…], "c": [closing_prices…] }
    ```
- **GET /api/news/&lt;symbol&gt;**  
  - Calls Finnhub’s `/company-news` for the past week  
  - Returns the first 5 articles  
- **GET /api/predict/&lt;symbol&gt;**  
  - Downloads 1 year of daily data (adjusted closes)  
  - Forward-fills and drops NaNs  
  - **Feature:** 5-day MA – 20-day MA  
  - **Label:** Next-day return > 0 (binary)  
  - Trains `LogisticRegression` on all but last point  
  - Predicts trend & probability for the final day  
  - Returns:
    ```json
    {
      "trend": "Up"|"Down",
      "confidence": 0.xx,
      "feature":  y.yy
    }
    ```

### 4.4 Error Handling & Logging  
- `try/except` around each route  
- Python `logging` for structured diagnostics  
- HTTP 400 on user errors (no data), HTTP 500 on unexpected failures  

---

## 5. Development Workflow  

1. **Backend Setup**  
   - `cd backend` → `python -m venv venv` → `.\venv\Scripts\Activate.ps1` → `python app.py`  
2. **Frontend Setup**  
   - `npm install` → `npm run dev` (Vite)  
3. **Integration**  
   - Backend on port 5000, frontend on 5173 → CORS allows cross-calls  
   - Use DevTools Network & Console to debug JSON payloads  

---

## 6. Key Learnings & Next Steps  

- **Decoupling UI & Data:** Flask serves data/ML, React handles presentation  
- **Avoiding Rate Limits:** Switched from Alpha Vantage → yfinance for pricing, Finnhub for news  
- **Rapid Prototyping:** Inline styles & minimal deps for quick UI iteration  
- **ML in Production:** Even a basic logistic regression yields a useful “gut check” signal  

**Future Enhancements:**  
- Additional features: RSI, MACD, LSTM sequence models  
- User accounts & watchlists (persistent storage)  
- Deployment: Docker, host backend on Render/DO, frontend on Vercel  
- Theming: integrate TailwindCSS or CSS-in-JS for scalable styles  

---
