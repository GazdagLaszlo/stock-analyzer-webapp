import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

type Props = {
  onLogout: () => void;
};

const ProfileMenu = ({ onLogout }: Props) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const username = localStorage.getItem('username');

  useEffect(() => {
    if (open) {
      document.addEventListener('click', () => setOpen(false));
    }
    return () => document.removeEventListener('click', () => setOpen(false));
  }, [open]);

  return (
    <div
      className={`dropdown ${open ? 'is-active' : ''}`}
      style={{ paddingLeft: '1vw' }}
    >
      <div className="dropdown-trigger is-flex is-align-items-center">
        <button
          className="button is-rounded is-light"
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
            onClick={(e) => {
              e.stopPropagation();
              onLogout();
              setOpen(false);
            }}
          >
            <div className="is-flex is-flex-direction-row is-align-items-center">
              <span className="icon mr-2">
                <i className="fas fa-sign-out-alt"></i>
              </span>
              <p>Logout</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProfileMenu;
