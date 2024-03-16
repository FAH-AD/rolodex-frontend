// Routing
import { Navigate } from "react-router-dom";

// Redux
import { useReduxSelector } from "@app/hook";
import { selectUser } from "@slices/authSlice";

// Interfaces
import { UserRole } from "@interfaces/auth";

// Props
type RoleGuardProps = {
  children: React.ReactNode;
  roles: UserRole[];
};

export const RoleGuard: React.FC<RoleGuardProps> = ({ children, roles }) => {
  const user = useReduxSelector(selectUser);

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  if (!roles.includes(user.role)) {
    return <Navigate to="/dashboard/services" replace />;
  }

  return <>{children}</>;
};
