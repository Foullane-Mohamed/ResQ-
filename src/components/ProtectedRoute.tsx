import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { canAccessPage } from "../lib/permissions";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPage?: string;
}

export const ProtectedRoute = ({
  children,
  requiredPage,
}: ProtectedRouteProps) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredPage && !canAccessPage(user, requiredPage)) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md mx-auto text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Accès refusé
          </h2>
          <p className="text-gray-600 mb-4">
            Vous n'avez pas les permissions nécessaires pour accéder à cette
            page.
          </p>
          <p className="text-sm text-gray-500">
            Votre rôle: <strong>{user?.role}</strong>
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
