import { Link, NavLink } from 'react-router-dom';
import ProfileMenu from './ProfileMenu';
import useAuth from '../../../hooks/useAuth';

const Header = () => {
  const { logout } = useAuth();

  return (
    <>
      <header className="py-3 px-6" style={{ height: '10vh' }}>
        <nav className="navbar">
          <div className="navbar-brand">
            <Link to="/">
              <p className="is-size-4 has-text-weight-bold">StockAnalyzer</p>
              <p>Stock Analysis & Portfolio Management</p>
            </Link>

            <a
              role="button"
              className="navbar-burger"
              aria-label="menu"
              aria-expanded="false"
              data-target="navbarBasicExample"
            >
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
            </a>
          </div>

          <div className="navbar-menu">
            <div className="navbar-end">
              <NavLink
                className={({ isActive }) =>
                  'navbar-item' + (isActive ? ' active' : '')
                }
                to="/app/dashboard"
              >
                Dashboard
              </NavLink>
              <NavLink
                className={({ isActive }) =>
                  'navbar-item' + (isActive ? ' active' : '')
                }
                to="/app/stocks"
              >
                Stocks
              </NavLink>
              <NavLink
                className={({ isActive }) =>
                  'navbar-item' + (isActive ? ' active' : '')
                }
                to="/app/portfolio"
              >
                Portfolio
              </NavLink>
              <NavLink
                className={({ isActive }) =>
                  'navbar-item' + (isActive ? ' active' : '')
                }
                to="/app/watchlist"
              >
                Watchlist
              </NavLink>
              <NavLink
                className={({ isActive }) =>
                  'navbar-item' + (isActive ? ' active' : '')
                }
                to="/app/transactions"
              >
                Transactions
              </NavLink>
              <NavLink
                className={({ isActive }) =>
                  'navbar-item' + (isActive ? ' active' : '')
                }
                to="/app/results"
              >
                Trade statistics
              </NavLink>
              <ProfileMenu onLogout={logout}></ProfileMenu>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
};

export default Header;
