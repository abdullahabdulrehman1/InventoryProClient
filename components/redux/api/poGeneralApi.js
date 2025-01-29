import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import * as SecureStore from "expo-secure-store";
import ServerUrl from "../../config/ServerUrl";

export const poGeneralApi = createApi({
  reducerPath: 'poGeneralApi',
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
    updatePurchaseOrder: builder.mutation({
      query: ({ userId, purchaseOrderId, updateData }) => ({
        url: `/poGeneral/editPurchaseOrder`,
        method: 'PUT',
        body: { userId, purchaseOrderId, updateData },
      }),
    }),
    createPurchaseOrder: builder.mutation({
      query: ({ userId, createData }) => ({
        url: `/poGeneral/createPO`,
        method: 'POST',
        body: { userId, createData },
      }),
    }),
    generatePdfReport: builder.mutation({
      query: ({ token, fromDate, toDate, sortBy, order, selectedColumns }) => ({
        url: `/poGeneral/generatePdfReport`,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
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

export const { useUpdatePurchaseOrderMutation, useCreatePurchaseOrderMutation, useGeneratePdfReportMutation } = poGeneralApi;