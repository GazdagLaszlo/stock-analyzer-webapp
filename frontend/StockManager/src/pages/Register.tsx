import { useState } from 'react';
import { COLORS } from '../constants/colors';
import Footer from '../components/Layout/Footer/Footer';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import api from '../api/api';

const Register = () => {
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    if (form.password !== form.confirmPassword) {
      setLoginError('Please make sure your passwords match.');
      return;
    }

    if (form.password.length < 8) {
      setLoginError('Password must be at least 8 characters long.');
      return;
    }

    if (!form.email.includes('@')) {
      setLoginError('Please enter a valid email address.');
      return;
    }

    try {
      const response = await api.User.apiUserRegisterPost({
        name: form.name,
        email: form.email,
        password: form.password,
      });

      if (response.status === 200) {
        setForm({ name: '', email: '', password: '', confirmPassword: '' });
      }

      navigate('/login', { state: { registrationSuccess: true } });
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 409) {
          setLoginError('Email already registered');
          return;
        }
      }

      setLoginError('Registration failed');
    }
  };

  return (
    <>
      <div
        className="is-flex is-justify-content-center is-align-items-center"
        style={{ height: '90vh' }}
      >
        <div
          className="p-6"
          style={{
            backgroundColor: COLORS.boxBackground,
            borderRadius: 10,
            width: '35vw',
            maxWidth: '420px',
          }}
        >
          <form onSubmit={handleSubmit}>
            <h3 className="title has-text-centered">Register</h3>

            <div className="field">
              <label className="label">Name</label>
              <div className="control">
                <input
                  className="input"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
            </div>

            <div className="field">
              <label className="label">Email</label>
              <div className="control">
                <input
                  className={`input ${
                    loginError?.toLowerCase().includes('email')
                      ? 'is-danger'
                      : ''
                  }`}
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
            </div>

            <div className="field">
              <label className="label">Password</label>
              <div className="control">
                <input
                  className={`input ${
                    loginError?.toLowerCase().includes('password')
                      ? 'is-danger'
                      : ''
                  }`}
                  type="password"
                  required
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="field">
              <label className="label">Confirm Password</label>
              <div className="control">
                <input
                  className={`input ${
                    loginError?.toLowerCase().includes('password')
                      ? 'is-danger'
                      : ''
                  }`}
                  type="password"
                  required
                  value={form.confirmPassword}
                  onChange={(e) =>
                    setForm({ ...form, confirmPassword: e.target.value })
                  }
                />
              </div>
            </div>

            {loginError && (
              <p className="help is-danger has-text-centered mt-2 is-size-6">
                {loginError}
              </p>
            )}

            <div className="mt-5">
              <button className="button button-navy is-fullwidth" type="submit">
                Register
              </button>
            </div>
          </form>

          <p className="mt-5 has-text-centered">
            Already have an account?
            <a
              className="pl-1 has-text-weight-bold"
              onClick={() => navigate('/login')}
            >
              Sign in
            </a>
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Register;
