import { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import Routing from './router/Routing.tsx';
import { AuthContext } from './context/AuthContext.tsx';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [email, setEmail] = useState(localStorage.getItem('email'));
  const [role, setRole] = useState(localStorage.getItem('role'));

  return (
    <>
      <BrowserRouter>
        <AuthContext.Provider
          value={{ token, setToken, email, setEmail, role, setRole }}
        >
          <Routing />
        </AuthContext.Provider>
      </BrowserRouter>
    </>
  );
}

export default App;
