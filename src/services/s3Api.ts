import { emptyApi } from "./emptyApi";

export const s3Api = emptyApi.injectEndpoints({
  endpoints: (build) => ({
    getS3SignedUploadUrl: build.query<{ url: string }, { key: string }>({
      query: ({ key }) => ({
        url: `/s3/signed-upload-url?key=${key}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useLazyGetS3SignedUploadUrlQuery } = s3Api;
