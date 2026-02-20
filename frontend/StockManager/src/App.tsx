import { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import Routing from './router/Routing.tsx';
import { AuthContext } from './context/AuthContext.tsx';
import { PortfolioProvider } from './context/PortfolioProvider.tsx';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [email, setEmail] = useState(localStorage.getItem('email'));
  const [role, setRole] = useState(localStorage.getItem('role'));
  const [username, setUsername] = useState(localStorage.getItem('username'));

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
