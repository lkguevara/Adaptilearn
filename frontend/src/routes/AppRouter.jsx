import { Routes, Route } from "react-router";
import Layout from "../components/Layout.jsx";
import Home from "../pages/Home.jsx";
import Login from "../pages/Login.jsx";

const AppRouter = () => {
  return (
    <Layout>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
        </Routes>
    </Layout>
  );
};

export default AppRouter;
