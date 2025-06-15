/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback } from 'react';
import { useGetAllTransactionsQuery, useCreateTransactionMutation } from '../../store/api/transactionApi';
import { useGetSyndicateViewQuery } from '../../store/api/syndicateApi';
import type { TransactionFormData } from '../../types/transaction.types';

export const useTransactions = () => {
  // Fetch transactions data
  const { 
    data: transactionsData, 
    isLoading: isTransactionsLoading, 
    error: transactionsError,
    refetch: refetchTransactions 
  } = useGetAllTransactionsQuery();

  // Fetch syndicate data for friends list
  const { 
    data: syndicateData, 
    isLoading: isSyndicateLoading 
  } = useGetSyndicateViewQuery();

  // Create transaction mutation
  const [
    createTransaction, 
    { 
      isLoading: isCreatingTransaction,
      error: createTransactionError
    }
  ] = useCreateTransactionMutation();

  // Calculate transaction statistics
  const calculateStats = useCallback(() => {
    const transactions = Array.isArray(transactionsData) ? transactionsData : [];
    
    const totalPrincipal = transactions.reduce(
      (sum, t) => sum + (t?.total_principal_amount || 0), 
      0
    );
    
    const totalInterest = transactions.reduce(
      (sum, t) => sum + ((t?.total_principal_amount || 0) * (t?.total_interest || 0) / 100), 
      0
    );
    
    return { totalPrincipal, totalInterest };
  }, [transactionsData]);

  // Handle transaction creation
  const handleCreateTransaction = useCallback(async (formData: TransactionFormData) => {
    try {
      await createTransaction(formData).unwrap();
      await refetchTransactions();
      return { success: true };
    } catch (error) {
      console.error('Failed to create transaction:', error);
      return { 
        success: false, 
        error: (error as any)?.data?.error || 'Failed to create transaction' 
      };
    }
  }, [createTransaction, refetchTransactions]);

  return {
    // Data
    transactions: Array.isArray(transactionsData) ? transactionsData : [],
    friends: Array.isArray(syndicateData?.friends) ? syndicateData.friends : [],
    stats: calculateStats(),
    
    // Loading states
    isLoading: isTransactionsLoading || isSyndicateLoading,
    isCreating: isCreatingTransaction,
    
    // Errors
    transactionsError,
    createTransactionError,
    
    // Actions
    createTransaction: handleCreateTransaction,
    refetchTransactions,
  };
};
