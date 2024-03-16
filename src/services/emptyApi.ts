// RTK Query
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";

// Actions
import { loggedIn, loggedOut } from "@slices/authSlice";

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_BASE_URL,
  prepareHeaders: (headers, api) => {
    if (!(api.extra as any)?.multipart) {
      headers.set("Content-Type", "application/json");
    }

    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      headers.set("Authorization", `Bearer ${accessToken}`);
    }

    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(
    args,
    { ...api, extra: extraOptions },
    extraOptions
  );
  const fetchArgs = args as FetchArgs;

  if (
    fetchArgs.url !== "/auth/login" &&
    result.error &&
    result.error.status === 401
  ) {
    if (!localStorage.getItem("refreshToken")) {
      api.dispatch(loggedOut());
      return {
        error: {
          status: 403,
          data: {
            message: "Your session has expired, please login again.",
          },
        },
      };
    }

    // try to get a new token
    const refreshResult = await baseQuery(
      {
        url: "/auth/refresh_token",
        method: "POST",
        body: {
          refreshToken: localStorage.getItem("refreshToken"),
        },
      },
      api,
      extraOptions
    );

    if (refreshResult.data) {
      const data = refreshResult.data as any;
      // store the new token
      api.dispatch(
        loggedIn({
          user: data.user,
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
        })
      );
      // retry the initial query
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(loggedOut());
      return {
        error: {
          status: 403,
          data: {
            message: "Your session has expired, please login again.",
          },
        },
      };
    }
  }
  return result;
};

export const emptyApi = createApi({
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({}),
  tagTypes: [
    "Service",
    "Tag",
    "Project",
    "ProjectTask",
    "ProjectMessage",
    "DailyTask",
    "Resource",
    "EcommerceChecklist",
    "User",
    "Profile",
    "SlackRelation",
    "Checkout",
  ],
});
