import { emptyApi } from "./emptyApi";

// Interfaces
import { Tag } from "@interfaces/tag";

export const tagApi = emptyApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllTags: builder.query<GetAllTagsResponse, void>({
      query: () => "/tags",
    }),
  }),
});

export const { useGetAllTagsQuery } = tagApi;

interface GetAllTagsResponse {
  tags: Tag[];
}
