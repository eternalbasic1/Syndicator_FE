
// src/store/api/syndicateApi.ts
import type { Transaction } from '../../types/transaction.types';
import { baseApi } from './baseApi';

export interface SyndicateData {
  username: string;
  transactions: Transaction[];
  total_invested: number;
  total_returns: number;
}

export const syndicateApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSyndicateView: builder.query<SyndicateData, string>({
      query: (username) => ({
        url: `syndicate/?username=${username}`,
        method: 'GET',
      }),
      providesTags: ['Syndicate'],
    }),
  }),
});

export const { useGetSyndicateViewQuery } = syndicateApi;