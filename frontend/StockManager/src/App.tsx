import { useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import Routing from './router/Routing.tsx';
import { AuthContext } from './context/AuthContext.tsx';
import { PortfolioProvider } from './context/PortfolioProvider.tsx';
import { tokenKeyName } from './constants/constants.ts';
import { jwtDecode } from 'jwt-decode';

interface jwtDecodeType {
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier': string;
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name': string;
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress': string;
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role': string;
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/sid': string;
  auth_time: Date;
  exp: number;
  iss: string;
  aud: string;
}

function App() {
  const [token, setToken] = useState<string | null>(
    sessionStorage.getItem(tokenKeyName)
  );
  const [email, setEmail] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      try {
        const decoded: jwtDecodeType = jwtDecode(token);

        setEmail(
          decoded[
            'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'
          ]
        );
        setRole(
          decoded[
            'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
          ]
        );
        setUsername(
          decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name']
        );
      } catch (error) {
        console.error('Token error!', error);
        setToken(null);
        sessionStorage.removeItem(tokenKeyName);
      }
    } else {
      setEmail(null);
      setRole(null);
      setUsername(null);
    }
  }, [token]);

  return (
    <>
      <BrowserRouter>
        <AuthContext.Provider
          value={{
            token,
            setToken,
            email,
            setEmail,
            role,
            setRole,
            username,
            setUsername,
          }}
        >
          <PortfolioProvider>
            <Routing />
          </PortfolioProvider>
        </AuthContext.Provider>
      </BrowserRouter>
    </>
  );
}

export default App;
