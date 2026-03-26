import { useContext, useState } from 'react';
import useAuth from '../hooks/useAuth';
import { AuthContext } from '../context/AuthContext';
import { COLORS } from '../constants/colors';
import ChangePasswordModal, {
  type ChangePasswordForm,
} from '../components/ChangePasswordModal';
import api from '../api/api';
import { enqueueSnackbar } from 'notistack';

const Profile = () => {
  const { username, email, role } = useContext(AuthContext);
  const [changePasswordModalOpen, setChangePasswordModalOpen] = useState(false);

  const { logout } = useAuth();

  const changePassword = async (form: ChangePasswordForm) => {
    if (
      form.oldPassword == '' ||
      form.newPassword == '' ||
      form.confirmPassword == ''
    ) {
      enqueueSnackbar('Please fill all fields!', { variant: 'warning' });
      return;
    }

    if (form.oldPassword == form.newPassword) {
      enqueueSnackbar(
        'The new password cannot be the same as the old password!',
        { variant: 'warning' }
      );
      return;
    }

    if (form.newPassword.length < 8) {
      enqueueSnackbar('The password must be at least 8 characters long!', {
        variant: 'warning',
      });
      return;
    }

    try {
      await api.User.apiUserChangePasswordPut(form);
      enqueueSnackbar('Password changed successfully!', { variant: 'success' });
      setChangePasswordModalOpen(false);
    } catch (error: any) {
      if (error?.response?.status === 401 && error.response.data?.message) {
        enqueueSnackbar(error.response.data.message, { variant: 'error' });
      }
    }
  };

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
          <div
            className="p-1 is-size-7"
            style={{
              backgroundColor: COLORS.background,
              borderRadius: 10,
              position: 'relative',
              bottom: 30,
              marginBottom: -20,
            }}
          >
            <p>{role}</p>
          </div>
          <p className="is-size-4 has-text-weight-bold">{username}</p>
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
              onClick={() => setChangePasswordModalOpen(true)}
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
      <ChangePasswordModal
        open={changePasswordModalOpen}
        onClose={() => setChangePasswordModalOpen(false)}
        onChange={(form) => changePassword(form)}
      />
    </div>
  );
};

export default Profile;
