import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import UsersPage from "../pages/UserPage";

export default function AppRoutes() {
  const token = localStorage.getItem("token");
  return (
    <Routes>
      <Route path="/" element={token ? <Navigate to="/users" /> : <LoginPage />} />
      <Route path="/users" element={token ? <UsersPage /> : <Navigate to="/" />} />
    </Routes>
  );
}
