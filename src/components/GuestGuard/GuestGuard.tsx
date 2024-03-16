import React from "react";

// Routing
import { Navigate, Outlet } from "react-router-dom";

// Redux
import { useReduxSelector } from "@app/hook";
import { selectIsAuthenticated } from "@slices/authSlice";

// Props
type GuestGuardProps = {
  children?: React.ReactNode;
};

export const GuestGuard: React.FC<GuestGuardProps> = ({ children }) => {
  const isAuthenticated = useReduxSelector(selectIsAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/dashboard/message-center" replace />;
  }

  return (
    <>
      {children}
      <Outlet />
    </>
  );
};
