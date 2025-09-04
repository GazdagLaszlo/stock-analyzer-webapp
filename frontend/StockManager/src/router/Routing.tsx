import {Navigate, Route, Routes} from "react-router-dom";
import BasicLayout from "../components/Layout/BasicLayout.tsx";
//import useAuth from "../hooks/useAuth.tsx";
import { routes } from "./Routes.tsx";
//import {ReactElement} from "react";

const Routing = () => {
  return (
    <Routes>
        <Route path="/" element={<Navigate to="dashboard" />} />
      
        <Route element={<BasicLayout />}>
            {routes.map((route) => (
            <Route
                key={route.path}
                path={route.path}
                element={route.component}
            />
            ))}
        </Route>

        <Route path="*" element={<div>404 - Page not found</div>} />
    </Routes>
  );
};

export default Routing;