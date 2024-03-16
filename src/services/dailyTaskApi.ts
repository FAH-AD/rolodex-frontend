import { emptyApi } from "./emptyApi";

// Interfaces
import { DailyTask, DailyTaskStatus } from "@interfaces/dailyTask";

export const dailyTaskApi = emptyApi.injectEndpoints({
  endpoints: (builder) => ({
    getDailyTasksByUserId: builder.query<DailyTask[], GetDailyTasksByUserIdParams>({
      query: (body) => {
        if (body.startDate && body.endDate) {
          return `/daily_tasks/user/${body.userId}?startDate=${body.startDate}&endDate=${body.endDate}`;
        }
        return `/daily_tasks/user/${body.userId}`;
      },
      providesTags: (_r, _e, body) => [{ type: "DailyTask" as const, id: body.userId }],
    }),
    createDailyTask: builder.mutation<DailyTask, CreateDailyTaskParams>({
      query: (body) => ({
        url: "/daily_tasks",
        method: "POST",
        body,
      }),
      invalidatesTags: (_r, _e, body) => [{ type: "DailyTask" as const, id: body.userId }],
    }),
    updateDailyTask: builder.mutation<DailyTask, UpdateDailyTaskParams>({
      query: (body) => ({
        url: "/daily_tasks",
        method: "PUT",
        body,
      }),
      invalidatesTags: (_r, _e, body) => [{ type: "DailyTask" as const, id: body.userId }],
    }),
    deleteDailyTask: builder.mutation<any, DeleteDailyTaskParams>({
      query: (body) => ({
        url: `/daily_tasks/${body.id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_r, _e, body) => [{ type: "DailyTask" as const, id: body.userId }],
    }),
  }),
});

export const {
  useGetDailyTasksByUserIdQuery,
  useCreateDailyTaskMutation,
  useUpdateDailyTaskMutation,
  useDeleteDailyTaskMutation,
} = dailyTaskApi;

interface GetDailyTasksByUserIdParams {
  userId: number;
  startDate: string | null;
  endDate: string | null;
}

interface CreateDailyTaskParams {
  userId: number;
  name: string;
  description: string | null;
  dueDate: string | null;
}

interface UpdateDailyTaskParams {
  id: number;
  userId: number;
  status?: DailyTaskStatus;
  name?: string;
  description?: string | null;
  dueDate?: string | null;
}

interface DeleteDailyTaskParams {
  id: number;
  userId: number;
}
