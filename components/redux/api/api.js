import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import ServerUrl from "../../config/ServerUrl";

const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: `${ServerUrl}/` }),
  tagTypes: ["User", "Requisition", "PO"],
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
          token,
          requisitionId,
          updateData,
        },
      }),
      invalidatesTags: ["Requisition"],
    }),
    createPO: builder.mutation({
      query: ({ token, userId, poNumber, date, poDelivery, requisitionType, supplier, store, payment, purchaser, remarks, rows }) => ({
        url: `poGeneral/createPO`,
        method: "POST",
        body: {
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
        },
      }),
      invalidatesTags: ["PO"],
    }),
  }),
});

export default api;
export const { useGetMyProfileQuery, useUpdateRequisitionMutation, useCreatePOMutation } = api;