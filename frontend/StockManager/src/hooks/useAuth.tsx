import { useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext.tsx';
import {
  emailKeyName,
  roleKeyName,
  tokenKeyName,
} from '../constants/constants.ts';
import api from '../api/api.ts';
import { jwtDecode } from 'jwt-decode';

const useAuth = () => {
  const { token, setToken, email, setEmail, role, setRole } =
    useContext(AuthContext);
  const isLoggedIn = !!token;

  const login = (email: string, password: string) => {
    return api.User.apiUserLoginPost({ email, password })
      .then((res) => {
        setToken(res.data.token!);
        localStorage.setItem(tokenKeyName, res.data.token!);
        const decodedToken: never = jwtDecode(res.data.token!);
        const role =
          decodedToken[
            'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
          ];
        setRole(role);
        localStorage.setItem(roleKeyName, role);
        setEmail(email);
        localStorage.setItem(emailKeyName, email);

        return res;
      })
      .catch((error) => {
        throw error;
      });
  };
  /*
  const register = (
    name: string,
    email: string,
    password: string,
    roleType: number
  ) => {
    api.User.apiUserRegisterPost({ name, email, password, roleType }).then(() =>
      alert('Sikeres regisztráció')
    );
  };
  */

  const logout = () => {
    localStorage.clear();
    setToken(null);
  };

  useEffect(() => {}, []);

  return {
    login,
    /*register,*/ logout,
    token,
    email,
    isLoggedIn,
    role,
    setRole,
  };
};

export default useAuth;
