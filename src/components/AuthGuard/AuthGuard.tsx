import React from "react";

// Routing
import { Navigate } from "react-router-dom";

// Redux
import { useReduxSelector } from "@app/hook";
import { selectIsAuthenticated } from "@slices/authSlice";

// Props
type AuthGuardProps = {
  children?: React.ReactNode;
};

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const isAuthenticated = useReduxSelector(selectIsAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  return <>{children}</>;
};
