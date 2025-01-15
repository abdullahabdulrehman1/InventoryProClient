import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import ServerUrl from "../../config/ServerUrl";

const api = createApi({
  reducerPath: "api",
  
  baseQuery: fetchBaseQuery({ baseUrl: `${ServerUrl}/` }),
  
  tagTypes: ["User", "Requisition", "PO", "Report"],
  
  endpoints: (builder) => ({
    myProfile: builder.query({
      query: () => ({
        url: `users/my`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["User"],
    }),
    updateRequisition: builder.mutation({
      query: ({ token, requisitionId, updateData }) => ({
        url: `requisition/updateRequisition`,
        method: "PUT",
        body: {
          requisitionId,
          updateData,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      invalidatesTags: ["Requisition"],
    }),
    createPO: builder.mutation({
      query: ({
        token,
        userId,
        poNumber,
        date,
        poDelivery,
        requisitionType,
        supplier,
        store,
        payment,
        purchaser,
        remarks,
        rows,
      }) => ({
        url: `poGeneral/createPO`,
        method: "POST",
        body: {
          userId,
          poNumber,
          date,
          poDelivery,
          requisitionType,
          supplier,
          store,
          payment,
          purchaser,
          remarks,
          rows,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      invalidatesTags: ["PO"],
    }),
    generatePdfReport: builder.mutation({
      query: ({ token, fromDate, toDate, sortBy, order, selectedColumns }) => ({
        url: `requisition/generatePdfReport`,
        method: "GET",
        params: {
          fromDate,
          toDate,
          sortBy,
          order,
          columns: selectedColumns.join(","),
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      invalidatesTags: ["Report"],
    }),
  }),
});

export default api;

export const {
  useGetMyProfileQuery,
  useUpdateRequisitionMutation,
  useCreatePOMutation,
  useGeneratePdfReportMutation,
} = api;
