import Dashboard from '../pages/Dashboard';
import Portfolio from '../pages/Portfolio.tsx';
import Stock from '../pages/Stock.tsx';
import Transaction from '../pages/Transaction';
import Watchlist from '../pages/WatchList';
import StockView from '../pages/StockView/StockView.tsx';
import TradeSummary from '../pages/TradeSummary.tsx';
import Login from '../pages/Login.tsx';

export const routes = [
  {
    path: 'dashboard',
    component: <Dashboard />,
    isPrivate: true,
  },
  {
    path: 'stocks',
    component: <Stock />,
    isPrivate: true,
  },
  {
    path: 'portfolio',
    component: <Portfolio />,
    isPrivate: true,
  },
  {
    path: 'portfolio/:portfolioId',
    component: <Portfolio />,
    isPrivate: true,
  },
  {
    path: 'watchlist',
    component: <Watchlist />,
    isPrivate: true,
  },
  {
    path: 'transactions',
    component: <Transaction />,
    isPrivate: true,
  },
  {
    path: 'stocks/:symbol/:tab?/:subtab?',
    component: <StockView />,
    isPrivate: true,
  },
  {
    path: 'results',
    component: <TradeSummary />,
    isPrivate: true,
  },
  {
    path: 'login',
    component: <Login />,
    isPrivate: false,
  },
];
