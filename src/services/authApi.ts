import { emptyApi } from "./emptyApi";

// Interfaces
import { User } from "@interfaces/auth";

export const authApi = emptyApi.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query<ProfileResponse, void>({
      query: () => ({
        url: "/auth/profile",
        method: "POST",
        body: {
          refreshToken: localStorage.getItem("refreshToken"),
        },
      }),
      providesTags: ["Profile"],
    }),
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body,
      }),
    }),
    register: builder.mutation<any, RegisterRequest>({
      query: (body) => ({
        url: "/auth/register",
        method: "POST",
        body,
      }),
    }),
    registerPaswordless: builder.mutation<any, RegisterPaswordlessRequest>({
      query: (body) => ({
        url: "/auth/register-passwordless",
        method: "POST",
        body,
      }),
    }),
    loginWithGoogle: builder.mutation<LoginWithGoogleResponse, LoginWithGoogleRequest>({
      query: (body) => ({
        url: "/auth/google-login",
        method: "POST",
        body,
      }),
    }),
    sendMagicLink: builder.mutation<any, SendMagicLinkRequest>({
      query: (body) => ({
        url: "/auth/send-magic-link",
        method: "POST",
        body,
      }),
    }),
    loginWithMagicLink: builder.query<LoginWithMagicLinkResponse, LoginWithMagicLinkRequest>({
      query: (body) => ({
        url: "/auth/magic-link-login",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useGetProfileQuery,
  useLoginMutation,
  useRegisterMutation,
  useRegisterPaswordlessMutation,
  useLoginWithGoogleMutation,
  useLoginWithMagicLinkQuery,
  useSendMagicLinkMutation,
} = authApi;

interface ProfileResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

interface LoginResponse extends ProfileResponse {}

interface LoginRequest {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

interface RegisterPaswordlessRequest {
  name: string;
  email: string;
}

interface LoginWithGoogleRequest {
  accessToken: string;
}

interface LoginWithGoogleResponse extends ProfileResponse {}

interface SendMagicLinkRequest {
  email: string;
}

interface LoginWithMagicLinkResponse extends ProfileResponse {}

interface LoginWithMagicLinkRequest {
  token: string;
}
