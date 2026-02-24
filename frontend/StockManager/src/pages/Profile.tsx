import useAuth from '../hooks/useAuth';

const Profile = () => {
  const name = localStorage.getItem('username');
  const email = localStorage.getItem('email');

  const { logout } = useAuth();

  return (
    <div
      className="is-flex is-flex-direction-column mt-6 is-align-items-center"
      style={{ height: '80vh' }}
    >
      <div style={{ width: '40vw' }}>
        <div className="is-flex is-align-items-center is-flex-direction-column">
          <span className="mb-4">
            <i className="fa-regular fa-circle-user fa-5x"></i>
          </span>
          <p className="is-size-4 has-text-weight-bold">{name}</p>
          <p style={{ color: 'grey' }}>{email}</p>
          <button className="button button-navy mt-4">Edit Profile</button>

          <hr
            className="has-background-grey-light"
            style={{ width: '80%', height: '0.5px' }}
          />
          <div
            className="is-flex is-justify-content-center mt-2 is-flex-direction-column is-align-items-center"
            style={{ width: '100%', gap: 5 }}
          >
            <div
              className="is-flex is-align-items-center p-3"
              style={{
                border: '1px solid grey',
                width: '80%',
                borderRadius: '10px',
                height: '5vh',
                cursor: 'pointer',
              }}
              onClick={() => console.log('change password')}
            >
              <span className="icon mr-2">
                <i className="fa-solid fa-key"></i>
              </span>
              <span>Change password</span>
            </div>
            <div
              className="is-flex is-align-items-center p-3"
              style={{
                border: '1px solid grey',
                width: '80%',
                borderRadius: '10px',
                height: '5vh',
                cursor: 'pointer',
              }}
              onClick={logout}
            >
              <span className="icon mr-2 has-text-danger">
                <i className="fas fa-sign-out-alt"></i>
              </span>
              <span className="has-text-danger">Logout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
