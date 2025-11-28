import { Routes, Route, Navigate } from "react-router-dom";
import { AuthPage } from "../components/AuthPage";
import { ProtectedRoute } from "../components/ProtectedRoute";
import Layout from "../components/Layout";
import Dashboard from "../pages/Dashboard";
import DispatchMap from "../pages/DispatchMap";
import Fleet from "../pages/Fleet";
import Incidents from "../pages/Incidents";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<AuthPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route
          path="dashboard"
          element={
            <ProtectedRoute requiredPage="dashboard">
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="map"
          element={
            <ProtectedRoute requiredPage="map">
              <DispatchMap />
            </ProtectedRoute>
          }
        />
        <Route
          path="fleet"
          element={
            <ProtectedRoute requiredPage="fleet">
              <Fleet />
            </ProtectedRoute>
          }
        />
        <Route
          path="incidents"
          element={
            <ProtectedRoute requiredPage="incidents">
              <Incidents />
            </ProtectedRoute>
          }
        />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;
