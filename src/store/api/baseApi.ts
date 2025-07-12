// src/store/api/baseApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../index";
import { API_BASE_URL } from "@/utils/constants";

console.log("API_BASE_URL", API_BASE_URL);

const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL + "/api/",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    headers.set("content-type", "application/json");
    return headers;
  },
});

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery,
  tagTypes: ["User", "Transaction", "FriendRequest", "Syndicate"],
  endpoints: () => ({}),
});
