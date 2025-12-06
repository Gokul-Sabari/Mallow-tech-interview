import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import UsersPage from "../pages/UserPage";
import ProtectedRoute from "../routes/PrivateRoutes";

const AppRoutes: React.FC = () => {
  return (
    <Routes>

      <Route
        path="/"
        element={
          localStorage.getItem("token") ? (
            <Navigate to="/users" replace />
          ) : (
            <LoginPage />
          )
        }
      />


      <Route
        path="/users"
        element={
          <ProtectedRoute>
            <UsersPage />
          </ProtectedRoute>
        }
      />


      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
