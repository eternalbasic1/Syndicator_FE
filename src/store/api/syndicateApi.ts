
// src/store/api/syndicateApi.ts
import { baseApi } from './baseApi';

// Looks Good
export interface SyndicateData {
  friend_list_id: string;
  user: {
      user_id: string,
      username: string
  },
  friends: [
      {
          user_id: string,
          username: string,
          name: string | null,
          email: string
      }
  ],
  created_at: string
}

export const syndicateApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSyndicateView: builder.query<SyndicateData, void>({
      query: () => ({
        url: 'syndicate/',
        method: 'GET',
      }),
      providesTags: ['Syndicate'],
    }),
  }),
});

export const { useGetSyndicateViewQuery } = syndicateApi;