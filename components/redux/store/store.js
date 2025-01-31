import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../reducers/auth";
import api from "../api/api";
import pdfSlice from "../reducers/misc";
import { poGeneralApi } from "../api/poGeneralApi";
import { setupListeners } from '@reduxjs/toolkit/query';
import { grnApi } from "../api/grnApi";
import { issueGeneralApi } from "../api/issueApi";
import { issueReturnApi } from "../api/issueReturnApi";


export const store = configureStore({
  reducer: {
    [authSlice.name]: authSlice.reducer,
    [api.reducerPath]: api.reducer,
    [pdfSlice.reducerPath]: pdfSlice.reducer,
    [poGeneralApi.reducerPath]: poGeneralApi.reducer,
    [grnApi.reducerPath]: grnApi.reducer,
    [issueGeneralApi.reducerPath]: issueGeneralApi.reducer,
    [issueReturnApi.reducerPath]: issueReturnApi.reducer,
  },
  middleware: (getDefaultMiddleware) => [
    ...getDefaultMiddleware(),
    api.middleware,
    poGeneralApi.middleware,
    issueGeneralApi.middleware,
    grnApi.middleware,
    issueReturnApi.middleware
  ],
});

setupListeners(store.dispatch);