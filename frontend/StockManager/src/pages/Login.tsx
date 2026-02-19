import { useState } from 'react';
import type { UserLoginDto } from '../../generated-sources/openapi';
import { COLORS } from '../constants/colors';
import Footer from '../components/Layout/Footer/Footer';
import useAuth from '../hooks/useAuth';

const Login = () => {
  const { login } = useAuth();
  const [loginError, setLoginError] = useState<unknown>();
  const [loginData, setLoginData] = useState<UserLoginDto>({
    email: '',
    password: '',
  });

  const submit = async () => {
    try {
      login(loginData.email, loginData.password);
    } catch (error) {
      setLoginError(error);
      console.log('Error: ', loginError);
    }
  };

  return (
    <>
      <div
        className="container is-fluid is-flex is-justify-content-center is-align-items-center"
        style={{ height: '90vh' }}
      >
        <div
          className="is-flex is-flex-direction-column p-6"
          style={{ backgroundColor: COLORS.boxBackground, borderRadius: 10 }}
        >
          <h3 className="title has-text-centered">Login</h3>
          <div className="field mb-4">
            <label className="label">Email</label>
            <div className="control">
              <input
                className="input"
                type="email"
                value={loginData?.email}
                onChange={(e) =>
                  setLoginData({
                    ...loginData,
                    email: e.target.value,
                  })
                }
              />
            </div>
          </div>
          <div className="field mb-0">
            <label className="label">Password</label>
            <div className="control">
              <input
                className="input"
                type="password"
                value={loginData?.password}
                onChange={(e) =>
                  setLoginData({
                    ...loginData,
                    password: e.target.value,
                  })
                }
              />
            </div>
          </div>
          <div className="is-flex is-justify-content-center mt-5">
            <button
              className="button button-navy"
              type="submit"
              onClick={submit}
            >
              Login
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Login;
