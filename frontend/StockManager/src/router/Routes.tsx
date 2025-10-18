import Dashboard from "../pages/Dashboard";
import Portfolio from "../pages/Portfolio/Portfolio.tsx";
import Stock from "../pages/Stock/Stock.tsx";
import Transaction from "../pages/Transaction";
import Watchlist from "../pages/WatchList";
import StockView from "../pages/StockView/StockView.tsx";
import TradeSummary from "../pages/TradeSummary.tsx";

export const routes = [
    {
        path: "dashboard",
        component: <Dashboard/>,
        isPrivate: false
    },
    {
        path: "stocks",
        component: <Stock/>,
        isPrivate: false
    },
    {
        path: "portfolio",
        component: <Portfolio/>,
        isPrivate: false
    },
    {
        path: "watchlist",
        component: <Watchlist/>,
        isPrivate: false
    },
    {
        path: "transactions",
        component: <Transaction/>,
        isPrivate: false
    },
    {
        path: "stocks/:symbol/:tab?/:subtab?",
        component: <StockView />,
        isPrivate: false
    },
    {
        path: "results",
        component: <TradeSummary/>,
        isPrivate: false
    },
]