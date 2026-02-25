import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext.tsx';
import api from '../api/api.ts';
import { tokenKeyName } from '../constants/constants.ts';

const useAuth = () => {
  const { token, setToken, email, setEmail, role, setRole, setUsername } =
    useContext(AuthContext);
  const isLoggedIn = !!token;

  const login = (email: string, password: string) => {
    return api.User.apiUserLoginPost({ email, password })
      .then((res) => {
        const accessToken = res.data.accessToken!;
        localStorage.setItem(tokenKeyName, accessToken);
        setToken(accessToken);
        return res;
      })
      .catch((error) => {
        throw error;
      });
  };

  const logout = async () => {
    try {
      await api.User.apiUserLogoutPost();
    } catch (err) {
      console.error(err);
    } finally {
      localStorage.removeItem(tokenKeyName);
      setToken(null);
      setRole(null);
      setUsername(null);
      setEmail(null);
    }
  };

  return {
    login,
    logout,
    token,
    email,
    isLoggedIn,
    role,
    setRole,
    username: useContext(AuthContext).username,
  };
};

export default useAuth;
