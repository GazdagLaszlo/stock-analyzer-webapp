import { useEffect, useState } from 'react';
import ProfileIcon from '../../../assets/images/profileIcon.png';

type Props = {
  onLogout: () => void;
};

const ProfileMenu = ({ onLogout }: Props) => {
  const [open, setOpen] = useState(false);
  const email = localStorage.getItem('email');

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
          <span className="icon">
            <img src={ProfileIcon} alt="Profile" />
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
          <p
            className="dropdown-item"
            style={{ borderBottom: '1px solid black', marginBottom: 5 }}
          >
            {email}
          </p>
          <a
            className="dropdown-item"
            onClick={(e) => {
              e.stopPropagation();
              onLogout();
              setOpen(false);
            }}
          >
            Logout
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProfileMenu;
