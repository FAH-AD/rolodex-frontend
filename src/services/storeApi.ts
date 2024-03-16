import { emptyApi } from "./emptyApi";

export const storeApi = emptyApi.injectEndpoints({
  endpoints: (builder) => ({
    getStore: builder.query({
      query: () => `/store`,
    }),
  }),
});

export const { useGetStoreQuery } = storeApi;
