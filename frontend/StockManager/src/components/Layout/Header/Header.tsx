import { Link, NavLink, useNavigate } from 'react-router-dom';
import ProfileMenu from './ProfileMenu';
import useAuth from '../../../hooks/useAuth';
import { COLORS } from '../../../constants/colors';

const Header = () => {
  const { logout, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  return (
    <>
      <header
        className="py-3 px-6"
        style={{ height: '10vh', backgroundColor: COLORS.header }}
      >
        <nav className="navbar" style={{ backgroundColor: COLORS.header }}>
          <div className="navbar-brand">
            <Link to="/">
              <p className="is-size-5 has-text-weight-bold">StockAnalyzer</p>
              <p style={{ color: COLORS.infoText, fontSize: 14 }}>
                Stock Analysis & Portfolio Management
              </p>
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
            <div
              className={`${isLoggedIn ? `navbar-end` : 'is-justify-content-center'} is-flex is-flex-direction-row is-align-items-center`}
              style={{ flexGrow: 1 }}
            >
              <NavLink
                className={({ isActive }) =>
                  'navbar-item' + (isActive ? ' active' : '')
                }
                style={({ isActive }) => ({
                  backgroundColor: isActive
                    ? COLORS.headerActive
                    : 'transparent',
                })}
                to="/app/dashboard"
              >
                Dashboard
              </NavLink>
              <NavLink
                className={({ isActive }) =>
                  'navbar-item' + (isActive ? ' active' : '')
                }
                style={({ isActive }) => ({
                  backgroundColor: isActive
                    ? COLORS.headerActive
                    : 'transparent',
                })}
                to="/app/stocks"
              >
                Stocks
              </NavLink>
              {isLoggedIn && (
                <>
                  <NavLink
                    className={({ isActive }) =>
                      'navbar-item' + (isActive ? ' active' : '')
                    }
                    style={({ isActive }) => ({
                      backgroundColor: isActive
                        ? COLORS.headerActive
                        : 'transparent',
                    })}
                    to="/app/portfolio"
                  >
                    Portfolio
                  </NavLink>

                  <NavLink
                    className={({ isActive }) =>
                      'navbar-item' + (isActive ? ' active' : '')
                    }
                    style={({ isActive }) => ({
                      backgroundColor: isActive
                        ? COLORS.headerActive
                        : 'transparent',
                    })}
                    to="/app/watchlist"
                  >
                    Watchlist
                  </NavLink>
                  <NavLink
                    className={({ isActive }) =>
                      'navbar-item' + (isActive ? ' active' : '')
                    }
                    style={({ isActive }) => ({
                      backgroundColor: isActive
                        ? COLORS.headerActive
                        : 'transparent',
                    })}
                    to="/app/transactions"
                  >
                    Transactions
                  </NavLink>
                  <NavLink
                    className={({ isActive }) =>
                      'navbar-item' + (isActive ? ' active' : '')
                    }
                    style={({ isActive }) => ({
                      backgroundColor: isActive
                        ? COLORS.headerActive
                        : 'transparent',
                    })}
                    to="/app/statistics"
                  >
                    Statistics
                  </NavLink>

                  <ProfileMenu onLogout={logout}></ProfileMenu>
                </>
              )}
            </div>
            {!isLoggedIn && (
              <div className="is-flex is-align-items-center">
                <button
                  onClick={() => navigate('/login')}
                  className="button "
                  style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    boxShadow: 'none',
                  }}
                >
                  Login
                </button>

                <button
                  className="button button-navy"
                  style={{ height: '40px' }}
                  onClick={() => navigate('/register')}
                >
                  Sign up
                </button>
              </div>
            )}
          </div>
        </nav>
      </header>
    </>
  );
};

export default Header;
