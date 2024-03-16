// Redux
import { useReduxSelector } from "@app/hook";
import { selectUser } from "@slices/authSlice";

// Types
import type { UserRole } from "@interfaces/auth";

export const useVerifyRole = () => {
  const user = useReduxSelector(selectUser);

  const verifyRole = (...roles: UserRole[]) => {
    return user ? roles.includes(user.role) : false;
  };

  return { user, verifyRole };
};
