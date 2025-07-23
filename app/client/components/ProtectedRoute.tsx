import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import useUserStore from "../stores/userStore";
interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const user = useUserStore((state) => state.user);

  if (!user) {
    // Si l'utilisateur n'est pas authentifié, redirigez vers la page de connexion
    return <Navigate to="/" />;
  }

  // Sinon, rendez le composant enfant
  return <>{children}</>;
};

export default ProtectedRoute;
