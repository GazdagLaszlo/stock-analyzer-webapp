import { useState } from 'react';
import type { UserLoginDto } from '../../generated-sources/openapi';
import { COLORS } from '../constants/colors';
import Footer from '../components/Layout/Footer/Footer';
import useAuth from '../hooks/useAuth';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const location = useLocation();
  const registrationSuccess = location.state?.registrationSuccess;
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginData, setLoginData] = useState<UserLoginDto>({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    try {
      await login(loginData.email, loginData.password);
    } catch (error: unknown) {
      console.log('error:', error);
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          setLoginError('Invalid email or password!');
        }
      } else {
        setLoginError('Unexpected error occurred');
      }
    }
  };

  return (
    <>
      <div
        className="is-flex is-justify-content-center is-align-items-center is-flex-direction-column"
        style={{
          height: '90vh',
          width: '100vw',
          backgroundColor: COLORS.background,
        }}
      >
        {registrationSuccess && (
          <div
            className="notification box"
            style={{
              textAlign: 'center',
              marginBottom: '1rem',
              width: '35vw',
              maxWidth: '400px',
            }}
          >
            <span
              className="icon mr-2 mb-5 is-size-2"
              style={{ color: COLORS.navy }}
            >
              <i className="fa-regular fa-circle-check"></i>
            </span>
            <p>
              Registration successful! <br /> Login to start your journey!
            </p>
          </div>
        )}
        <div
          className="is-flex is-flex-direction-row box is-justify-content-space-between p-0"
          style={{
            backgroundColor: COLORS.boxBackground,
            borderRadius: 10,
            width: '60vw',
            minWidth: '700px',
            maxWidth: '800px',
          }}
        >
          <div
            style={{
              backgroundColor: COLORS.infoBox,
              width: '50%',
              borderRadius: '10px 0px 0px 10px',
            }}
            className="p-5"
          >
            <div onClick={() => navigate('/app')} style={{ cursor: 'pointer' }}>
              <p className="is-size-5 has-text-weight-bold">StockAnalyzer</p>
              <p style={{ color: COLORS.infoText, fontSize: 14 }}>
                Stock Analysis & Portfolio Management
              </p>
            </div>
            <div className="mt-6">
              <div className="is-flex is-justify-content-center">
                <figure className="image is-128x128">
                  <img src="../public/img/start_icon.png" />
                </figure>
              </div>
              <div className="ml-6 mt-5">
                <ul>
                  <li className="py-2">
                    <span className="icon mr-2" style={{ color: COLORS.navy }}>
                      <i className="fa-solid fa-circle-check"></i>
                    </span>
                    Portfolio & Transaction tracking
                  </li>
                  <li className="py-2">
                    <span className="icon mr-2" style={{ color: COLORS.navy }}>
                      <i className="fa-solid fa-circle-check"></i>
                    </span>
                    Real-time prices & financials
                  </li>
                  <li className="py-2">
                    <span className="icon mr-2" style={{ color: COLORS.navy }}>
                      <i className="fa-solid fa-circle-check"></i>
                    </span>
                    Detailed transaction history
                  </li>
                  <li className="py-2">
                    <span className="icon mr-2" style={{ color: COLORS.navy }}>
                      <i className="fa-solid fa-circle-check"></i>
                    </span>
                    Trade statistics
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div style={{ width: '50%' }} className="mt-6 p-6">
            <form onSubmit={handleSubmit}>
              <h3 className="title has-text-centered">Login</h3>
              <div className="field mb-4">
                <label className="label">Email</label>
                <div className="control">
                  <input
                    className="input"
                    type="email"
                    required
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
                    required
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
              {loginError && (
                <p
                  className="help mt-3 has-text-centered"
                  style={{ color: COLORS.error }}
                >
                  {loginError}
                </p>
              )}
              <div className="is-flex is-justify-content-center mt-6">
                <button
                  className="button button-navy is-fullwidth"
                  type="submit"
                >
                  Login
                </button>
              </div>
            </form>
            <p className="mt-5 has-text-centered">
              Don't have an account?
              <a
                className="pl-1 has-text-weight-bold"
                onClick={() => navigate('/register')}
              >
                Register
              </a>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Login;
