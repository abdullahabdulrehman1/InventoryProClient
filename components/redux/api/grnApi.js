import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import * as SecureStore from "expo-secure-store";
import ServerUrl from "../../config/ServerUrl";

export const grnApi = createApi({
  reducerPath: 'grnApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${ServerUrl}/`,
    prepareHeaders: async (headers) => {
      const token = await SecureStore.getItemAsync("token");
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    generatePdfReport: builder.mutation({
      query: ({ fromDate, toDate, sortBy, order, selectedColumns }) => ({
        url: `grnGeneral/generatePdfReport`,
        method: 'GET',
        params: {
          fromDate,
          toDate,
          sortBy,
          order,
          columns: selectedColumns.join(','),
        },
      }),
    }),
  }),
});

export const { useGeneratePdfReportMutation } = grnApi;