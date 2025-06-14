// src/store/api/transactionApi.ts
import { baseApi } from './baseApi';
import type { Transaction, CreateTransactionRequest, TransactionResponse } from '../../types/transaction.types';

export const transactionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createTransaction: builder.mutation<TransactionResponse, CreateTransactionRequest>({
      query: (transactionData) => ({
        url: 'create_transaction/',
        method: 'POST',
        body: transactionData,
      }),
      invalidatesTags: ['Transaction'],
    }),
    getAllTransactions: builder.query<Transaction[], string>({
      query: (username) => ({
        url: `all_transaction/?username=${username}`,
        method: 'GET',
      }),
      providesTags: ['Transaction'],
    }),
    getPortfolio: builder.query<Transaction[], void>({
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