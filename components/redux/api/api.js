import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import ServerUrl from "../../config/ServerUrl";

const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: `${ServerUrl}/` }),
  tagTypes: ["User"],
  endpoints: (builder) => ({
    myProfile: builder.query({
      query: () => ({
        url: `users/my`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["User"],
    }),
  }),
});

export default api;
export const { useGetMyProfileQuery } = api;