import { useState } from 'react';
import type { UserLoginDto } from '../../generated-sources/openapi';
import { COLORS } from '../constants/colors';
import Footer from '../components/Layout/Footer/Footer';
import useAuth from '../hooks/useAuth';

const Login = () => {
  const { login } = useAuth();
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
    } catch (error: any) {
      if (error.response.status === 401) {
        setLoginError('Invalid email or password!');
      }
    }
  };

  return (
    <>
      <div
        className="container is-fluid is-flex is-justify-content-center is-align-items-center"
        style={{ height: '90vh' }}
      >
        <form
          onSubmit={handleSubmit}
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
            <p className="help is-danger mt-3 has-text-centered">
              {loginError}
            </p>
          )}
          <div className="is-flex is-justify-content-center mt-5">
            <button className="button button-navy" type="submit">
              Login
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default Login;
