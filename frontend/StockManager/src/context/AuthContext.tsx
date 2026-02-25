import { createContext } from 'react';
import { tokenKeyName } from '../constants/constants';

interface AuthContext {
  token: string | null;
  setToken: (token: string | null) => void;
  email: string | null;
  setEmail: (email: string | null) => void;
  role: string | null;
  setRole: (role: string | null) => void;
  username: string | null;
  setUsername: (name: string | null) => void;
}

export const AuthContext = createContext<AuthContext>({
  token: localStorage.getItem(tokenKeyName),
  setToken: () => {},
  email: null,
  setEmail: () => {},
  role: null,
  setRole: () => {},
  username: null,
  setUsername: () => {},
});
