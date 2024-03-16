import { emptyApi } from "./emptyApi";

// Interfaces
import { User, UserRole } from "@interfaces/auth";

export const userApi = emptyApi.injectEndpoints({
  endpoints: (build) => ({
    getUsersByRole: build.query<GetUsersByRoleResponse, UserRole[]>({
      query: (roles) => ({
        url: `/users/roles/${roles}`,
        method: "GET",
      }),
      providesTags: [{ type: "User" }],
    }),
    getAffiliates: build.query<GetAffiliatesResponse, void>({
      query: () => "/users/affiliates",
    }),
    createUser: build.mutation<any, CreateUserParams>({
      query: (body) => ({
        url: "/users",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "User" }],
    }),
    addClientStore: build.mutation<AddClientStoreParams, AddClientStoreParams>({
      query: (body) => ({
        url: `/users/add_client_store`,
        method: "POST",
        body,
      }),
    }),
    updateUser: build.mutation<any, UpdateUserParams>({
      query: (body) => ({
        url: `/users/${body.id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: [{ type: "User" }],
    }),
    updateProfile: build.mutation<UpdateProfileParams, UpdateProfileParams>({
      query: (body) => ({
        url: `/users/profile`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (result) => (result ? [{ type: "User" }, { type: "Profile" }] : []),
    }),
    updateFcmToken: build.mutation<any, string>({
      query: (fcmToken) => ({
        url: "/users/fcm_token",
        method: "PATCH",
        body: { fcmToken },
      }),
      invalidatesTags: (result) => (result ? [{ type: "User" }, { type: "Profile" }] : []),
    }),
    updateLastOnline: build.mutation<any, void>({
      query: () => ({
        url: "/users/last_online",
        method: "PATCH",
      }),
    }),
    deleteUser: build.mutation<any, number>({
      query: (id) => ({
        url: `/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result) => (result ? [{ type: "User" }] : []),
    }),
    sendEmailUpdate: build.mutation<any, SendEmailUpdateParams>({
      query: (params) => ({
        url: `/users/sendEmailUpdate/?projectId=${params.projectId}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetUsersByRoleQuery,
  useGetAffiliatesQuery,
  useCreateUserMutation,
  useAddClientStoreMutation,
  useUpdateUserMutation,
  useUpdateProfileMutation,
  useUpdateFcmTokenMutation,
  useUpdateLastOnlineMutation,
  useDeleteUserMutation,
  useSendEmailUpdateMutation,
} = userApi;

interface GetUsersByRoleResponse {
  users: User[];
}

interface GetAffiliatesResponse {
  affiliates: Pick<User, "id" | "name" | "email" | "createdAt">[];
}

interface CreateUserParams {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

interface UpdateUserParams extends Partial<Omit<CreateUserParams, "password">> {
  id: number;
}

interface UpdateProfileParams {
  name: string;
  email: string;
  phone: string | null;
  image: string | null;
  fcmToken?: string;
  stores: { name: string | null; url: string }[];
}

interface AddClientStoreParams {
  clientId: number;
  url: string;
}

interface SendEmailUpdateParams {
  projectId: number;
}