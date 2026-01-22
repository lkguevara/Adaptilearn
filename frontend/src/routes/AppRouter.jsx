import { Routes, Route } from "react-router";
import Layout from "../components/layout/Layout.jsx";
import Home from "../pages/Home.jsx";
import Login from "../pages/Login.jsx";

const AppRouter = () => {
  return (
    <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="/login" element={<Login />} />
        </Route>
    </Routes>
  );
};

export default AppRouter;
