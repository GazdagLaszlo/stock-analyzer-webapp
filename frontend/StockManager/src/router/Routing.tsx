import { Navigate, Route, Routes } from 'react-router-dom';
import BasicLayout from '../components/Layout/BasicLayout/BasicLayout.tsx';
import { routes } from './Routes.tsx';
import type { ReactElement } from 'react';
import useAuth from '../hooks/useAuth.ts';

const PrivateRoute = ({ element }: { element: ReactElement }) => {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? element : <Navigate to="/login" />;
};

const AuthenticatedRedirect = ({ element }: { element: ReactElement }) => {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? <Navigate to="/app" /> : element;
};

const Routing = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={<AuthenticatedRedirect element={<Navigate to="login" />} />}
      />
      {routes
        .filter((route) => !route.isPrivate)
        .map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={<AuthenticatedRedirect element={route.component} />}
          />
        ))}
      <Route />
      <Route path="app" element={<BasicLayout />}>
        <Route path="" element={<Navigate to="dashboard" />} />
        {routes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={
              route.isPrivate ? (
                <PrivateRoute element={route.component} />
              ) : (
                route.component
              )
            }
          />
        ))}
      </Route>
      <Route path="*" element={<div>404 - Page not found</div>} />
    </Routes>
  );
};

export default Routing;
