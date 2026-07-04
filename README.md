# StockAnalyzer – Stock Analysis & Portfolio Management App
The goal of this software is to develop a web-based application that allows users to perform fundamental analysis of US stocks, as well as build and track their own stock portfolio. Additional functionality includes detailed evaluation of transactions recorded in the portfolio, generating statistics and performance-optimization suggestions based on them.

---

## Tech Stack
- Frontend: **React, Bulma**
- Backend: **C# .NET 9 - Entity Framework Core Web API**
- Database: **SQLite**
- Dev tools: Visual Studio Code, Visual Studio 2022
- Other: **Fetch API**
	Finnhub.io - https://finnhub.io - Finnhub Stock API
	API Ninjas - https://api-ninjas.com - API Ninjas Stock API

---

## Key Features
- Browsing stocks, viewing data for analysis
- Building a stock portfolio, tracking changes
- Recording stock transactions
- Evaluating portfolio performance
- Creating a stock watchlist
- Viewing educational materials
- Viewing transaction evaluations
- Viewing detailed performance statistics

---

## User Roles
1. Administrator role
The administrator role is designed to manage the educational module found within the software.
2. Investor role
The investor role allows the user to browse stocks, build and manage their own portfolio, and track and analyze investment performance.

---

## Security
- JWT token-based authentication
- Refresh token handling
- Authorization checks
- Password encryption

---

## Setup and Running
The system uses external API services (Finnhub, API Ninjas); using them requires providing your own API key.
These need to be added to the appsettings.json file (source links are available in the Tech Stack section).
Location of the appsettings.json file: backend/StockManager/StockManager/appsettings.json

### Starting the backend
The application uses an SQLite database.
On first run, the migrations will automatically create the database.
```bash
cd backend/StockManager/StockManager/
dotnet restore
dotnet ef database update
dotnet run
```

### Starting the frontend
```bash
cd frontend/StockManager
npm install
npm run dev
```

---

## Screenshots
![Login](docs/screenshots/login.png)
![Stock View](docs/screenshots/stock-view.png)
![Portfolio](docs/screenshots/portfolio.png)
![Transaction Details](docs/screenshots/transaction-details.png)
![Statistics](docs/screenshots/statistics-I.png)

---

## Note
The project can be started without API keys, but fetching external stock data will not work.
