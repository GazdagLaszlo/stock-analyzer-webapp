import { useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext.tsx';
import {
  emailKeyName,
  roleKeyName,
  tokenKeyName,
  usernameKeyName,
} from '../constants/constants.ts';
import api from '../api/api.ts';
import { jwtDecode } from 'jwt-decode';

const useAuth = () => {
  const { token, setToken, email, setEmail, role, setRole, setUsername } =
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
        const name =
          decodedToken[
            'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'
          ];
        localStorage.setItem(emailKeyName, email);
        setUsername(name);
        localStorage.setItem(usernameKeyName, name);

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
