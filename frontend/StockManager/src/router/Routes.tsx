import Dashboard from "../pages/Dashboard";
import Portfolio from "../pages/Portfolio";
import Stock from "../pages/Stock";
import Transaction from "../pages/Transaction";
import Watchlist from "../pages/WatchList";
import StockView from "../pages/StockView.tsx";

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
        path: "stocks/:symbol",
        component: <StockView />,
        isPrivate: false
    },
]