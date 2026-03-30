import Dashboard from '../pages/Dashboard';
import Portfolio from '../pages/Portfolio.tsx';
import Stock from '../pages/Stock.tsx';
import Transaction from '../pages/Transaction';
import Watchlist from '../pages/WatchList';
import StockView from '../pages/StockView/StockView.tsx';
import Login from '../pages/Login.tsx';
import Register from '../pages/Register.tsx';
import Profile from '../pages/Profile.tsx';
import TransactionDetails from '../pages/TransactionDetails.tsx';
import Education from '../pages/Education.tsx';
import Statistics from '../pages/Statistics.tsx';

export const routes = [
  {
    path: 'dashboard',
    component: <Dashboard />,
    isPrivate: false,
  },
  {
    path: 'stocks',
    component: <Stock />,
    isPrivate: false,
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
    path: 'transactions/:id',
    component: <TransactionDetails />,
    isPrivate: true,
  },
  {
    path: 'stocks/:symbol/:tab?/:subtab?',
    component: <StockView />,
    isPrivate: false,
  },
  {
    path: 'statistics/:tab?',
    component: <Statistics />,
    isPrivate: true,
  },
  {
    path: 'login',
    component: <Login />,
    isPrivate: false,
  },
  {
    path: 'register',
    component: <Register />,
    isPrivate: false,
  },
  {
    path: 'education/:topic',
    component: <Education />,
    isPrivate: true,
  },
  {
    path: 'profile',
    component: <Profile />,
    isPrivate: true,
  },
];
