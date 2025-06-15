// src/store/api/transactionApi.ts
import { baseApi } from './baseApi';
import type { Transaction, CreateTransactionRequest, CreateTransactionResponse, PortfolioStats, TransactionResponse } from '../../types/transaction.types';

export const transactionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createTransaction: builder.mutation<CreateTransactionResponse, CreateTransactionRequest>({
      query: (transactionData) => ({
        url: 'create_transaction/',
        method: 'POST',
        body: transactionData,
      }),
      // {
    // "error": "Syndicator(s) admin2 are not accepted friends. Please ensure friend requests are accepted before creating transactions."
    // }
      invalidatesTags: ['Transaction'],
    }),
    getAllTransactions: builder.query<TransactionResponse, void>({
      query: () => ({
        url: 'all_transaction/',
        method: 'GET',
      }),
      providesTags: ['Transaction'],
    }),
    getPortfolio: builder.query<PortfolioStats, void>({
      query: () => ({
        url: 'portfolio/',
        method: 'GET',
      }),
      providesTags: ['Transaction'],
    }),
  }),
});

export const {
  useCreateTransactionMutation,
  useGetAllTransactionsQuery,
  useGetPortfolioQuery,
} = transactionApi;