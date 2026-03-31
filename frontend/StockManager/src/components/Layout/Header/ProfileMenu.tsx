import { useContext, useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext';
import { COLORS } from '../../../constants/colors';

type Props = {
  onLogout: () => void;
  burgerActive: boolean;
  setBurgerActive: (active: boolean) => void;
};

const ProfileMenu = ({ onLogout, burgerActive, setBurgerActive }: Props) => {
  const { username } = useContext(AuthContext);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      document.addEventListener('click', () => setOpen(false));
    }
    return () => document.removeEventListener('click', () => setOpen(false));
  }, [open]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setBurgerActive(false);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return !burgerActive ? (
    <div
      className={`dropdown ${open ? 'is-active' : ''}`}
      style={{ paddingLeft: '1vw' }}
    >
      <div className="dropdown-trigger is-flex is-align-items-center">
        <button
          className="button is-rounded "
          style={{ width: '40px', height: '40px', padding: 0 }}
          aria-haspopup="true"
          onClick={(e) => {
            e.stopPropagation();
            setOpen(!open);
          }}
        >
          <span className="icon is-size-5">
            <i className="fa-regular fa-circle-user"></i>
          </span>
        </button>
      </div>
      <div
        className="dropdown-menu"
        id="dropdown-menu"
        role="menu"
        style={{ left: 'auto', right: 0 }}
      >
        <div className="dropdown-content">
          <a className="dropdown-item" onClick={() => navigate('/app/profile')}>
            <div className="is-flex is-flex-direction-row is-align-items-center">
              <span className="icon mr-2">
                <i className="fas fa-user"></i>
              </span>
              <p>{username}</p>
            </div>
          </a>
          <a
            className="dropdown-item"
            onClick={() => navigate('/app/education/dashboard')}
          >
            <div className="is-flex is-flex-direction-row is-align-items-center">
              <span className="icon mr-2">
                <i className="fa-solid fa-book"></i>
              </span>
              <p>Education Center</p>
            </div>
          </a>
          <a
            className="dropdown-item"
            onClick={(e) => {
              e.stopPropagation();
              onLogout();
              setOpen(false);
            }}
          >
            <div
              className="is-flex is-flex-direction-row is-align-items-center"
              style={{ color: COLORS.error }}
            >
              <span className="icon mr-2" style={{ color: 'inherit' }}>
                <i className="fas fa-sign-out-alt"></i>
              </span>
              <p>Logout</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  ) : (
    <div>
      <NavLink
        className={({ isActive }) =>
          'navbar-item' + (isActive ? ' active' : '')
        }
        style={({ isActive }) => ({
          backgroundColor: isActive ? COLORS.headerActive : 'transparent',
        })}
        to="/app/profile"
      >
        {username}
      </NavLink>
      <NavLink
        className={({ isActive }) =>
          'navbar-item' + (isActive ? ' active' : '')
        }
        style={({ isActive }) => ({
          backgroundColor: isActive ? COLORS.headerActive : 'transparent',
        })}
        to="/app/education/dashboard"
      >
        Education Center
      </NavLink>
      <a
        className="navbar-item"
        onClick={(e) => {
          e.stopPropagation();
          onLogout();
          setOpen(false);
        }}
      >
        <div
          className="is-flex is-flex-direction-row is-align-items-center"
          style={{ color: COLORS.error }}
        >
          <span className="icon mr-2" style={{ color: 'inherit' }}>
            <i className="fas fa-sign-out-alt"></i>
          </span>
          <p>Logout</p>
        </div>
      </a>
    </div>
  );
};

export default ProfileMenu;
