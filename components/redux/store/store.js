import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../reducers/auth";
import api from "../api/api";
import pdfSlice from "../reducers/misc";
export const store = configureStore({
  reducer: {
    [authSlice.name]: authSlice.reducer,
    [api.reducerPath]: api.reducer,
    [pdfSlice.reducerPath]: pdfSlice.reducer,
  },
  middleware: (getDefaultMiddleware) => [
    ...getDefaultMiddleware(),
    api.middleware,
  ],
});