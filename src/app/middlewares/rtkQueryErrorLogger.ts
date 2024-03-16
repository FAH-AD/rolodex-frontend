import { isRejectedWithValue } from "@reduxjs/toolkit";
import type { MiddlewareAPI, Middleware } from "@reduxjs/toolkit";

// Actions
import { getErrors } from "@slices/errorSlice";

const rtkQueryErrorLogger: Middleware = (api: MiddlewareAPI) => (next) => (action) => {
  if (isRejectedWithValue(action)) {
    const id = action.meta.arg.endpointName;

    if (id === "getProfile" && action.payload?.data?.code !== "EXPIRED_REFRESH_TOKEN") {
      return next(action);
    }

    const message =
      action.payload?.data?.message || "Something went wrong, please try again later.";

    api.dispatch(getErrors({ id, message }));
  }

  return next(action);
};

export default rtkQueryErrorLogger;
