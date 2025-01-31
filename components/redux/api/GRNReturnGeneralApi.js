import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import ServerUrl from '../../config/ServerUrl';
import * as SecureStore from 'expo-secure-store';

export const grnReturnGeneralApi = createApi({
  reducerPath: 'grnReturnGeneralApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${ServerUrl}/`,
    prepareHeaders: async (headers) => {
      try {
        const token = await SecureStore.getItemAsync("token");
        if (token) {
          headers.set('Authorization', `Bearer ${token}`);
        }
      } catch (error) {
        console.error("Error fetching token from SecureStore:", error);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    generatePdfReport: builder.mutation({
      query: ({ fromDate, toDate, sortBy, order, selectedColumns }) => ({
        url: `grnReturnGeneral/generatePdfReport`,
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

export const { useGeneratePdfReportMutation } = grnReturnGeneralApi;