import React, { useEffect } from "react";

// Redux
import { useReduxDispatch, useReduxSelector } from "@app/hook";
import { selectError, clearErrors } from "@slices/errorSlice";

// UI Utils
import { showNotification } from "@mantine/notifications";

// Icons
import { IconX } from "@tabler/icons";

// Props
type ErrorProviderProps = {
  children: React.ReactNode;
};

export const ErrorProvider: React.FC<ErrorProviderProps> = ({ children }) => {
  const dispatch = useReduxDispatch();
  const error = useReduxSelector(selectError);

  useEffect(() => {
    if (error.message) {
      showNotification({
        title: `Error - (${error.id})`,
        message: error.message,
        color: "red",
        icon: <IconX />,
      });
      dispatch(clearErrors());
    }
  }, [error]);

  return <React.Fragment>{children}</React.Fragment>;
};
