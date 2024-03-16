import { configureStore } from "@reduxjs/toolkit";

// Reducers
import authReducer from "@slices/authSlice";
import dailyTaskReducer from "@slices/dailyTaskSlice";
import layoutReducer from "@slices/layoutSlice";
import errorReducer from "@slices/errorSlice";

// APIs
import { emptyApi } from "@services/emptyApi";
import { authApi } from "@services/authApi";
import { serviceApi } from "@services/serviceApi";
import { tagApi } from "@services/tagApi";
import { projectApi } from "@services/projectApi";
import { projectMessageApi } from "@services/projectMessageApi";
import { projectTaskApi } from "@services/projectTaskApi";
import { projectOfferApi } from "@services/projectOfferApi";
import { userApi } from "@services/userApi";
import { dailyTaskApi } from "@services/dailyTaskApi";
import { resourceApi } from "@services/resourceApi";
import { checkoutApi } from "@services/checkoutApi";
import { slackRelationApi } from "@services/slackRelationApi";
import { paypalApi } from "@services/paypalApi";
import { s3Api } from "@services/s3Api";

// Middlewares
import rtkQueryErrorLogger from "./middlewares/rtkQueryErrorLogger";

const store = configureStore({
  reducer: {
    auth: authReducer,
    dailyTask: dailyTaskReducer,
    layout: layoutReducer,
    error: errorReducer,
    [emptyApi.reducerPath]: emptyApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [serviceApi.reducerPath]: serviceApi.reducer,
    [tagApi.reducerPath]: tagApi.reducer,
    [projectApi.reducerPath]: projectApi.reducer,
    [projectMessageApi.reducerPath]: projectMessageApi.reducer,
    [projectTaskApi.reducerPath]: projectTaskApi.reducer,
    [projectOfferApi.reducerPath]: projectOfferApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [dailyTaskApi.reducerPath]: dailyTaskApi.reducer,
    [resourceApi.reducerPath]: resourceApi.reducer,
    [checkoutApi.reducerPath]: checkoutApi.reducer,
    [slackRelationApi.reducerPath]: slackRelationApi.reducer,
    [paypalApi.reducerPath]: paypalApi.reducer,
    [s3Api.reducerPath]: s3Api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(emptyApi.middleware, rtkQueryErrorLogger),
  devTools: import.meta.env.DEV,
});

export type RootState = ReturnType<typeof store.getState>;
export type ReduxDispatch = typeof store.dispatch;

export default store;
