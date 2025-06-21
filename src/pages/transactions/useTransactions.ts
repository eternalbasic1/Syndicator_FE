/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback } from 'react';
import { useGetAllTransactionsQuery, useCreateTransactionMutation } from '../../store/api/transactionApi';
import { useGetSyndicateViewQuery } from '../../store/api/syndicateApi';
import type { TransactionFormData, TransactionSyndicatorMetaData } from '../../types/transaction.types';

interface SplitwiseEntry {
  user_id: string;
  amount: number;
  splitwise_id: string;
}

// interface Transaction {
//   splitwise_entries: SplitwiseEntry[];
//   total_principal_amount: number;
//   total_interest: number;
// }

export interface Friend {
  user_id: string;
  username: string;
  name?: string;
}

export const useTransactions = () => {
  // Fetch transactions data
  const { 
    data: transactionsData, 
    isLoading: isTransactionsLoading, 
    error: transactionsError,
    refetch: refetchTransactions 
  } = useGetAllTransactionsQuery();
  console.log("useTransactions, transactionsData=", transactionsData)
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
    
    // Calculate user's invested amount from Splitwise
    const userInvestedAmount = transactions.reduce((sum, t) => {
      // Get the user's splitwise entry
      const userEntry = t.splitwise_entries?.find((entry: SplitwiseEntry) => entry.user_id === syndicateData?.user?.user_id);
      if (userEntry) {
        // Add the user's invested amount
        sum += userEntry.amount;
      }
      return sum;
    }, 0);

    // Calculate interest based on user's invested amount
    const totalInterest = transactions.reduce((sum, t) => {
      const userEntry = t.splitwise_entries?.find((entry: SplitwiseEntry) => entry.user_id === syndicateData?.user?.user_id);
      if (userEntry) {
        // Calculate interest based on user's proportion of investment
        const userInterest = (userEntry.amount / t.total_principal_amount) * ((t.total_principal_amount * t.total_interest) / 100);
        sum += userInterest;
      }
      return sum;
    }, 0);
    
    return { totalPrincipal: userInvestedAmount, totalInterest };
  }, [transactionsData, syndicateData]);

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

  // Include current user in friends list
  const friendsWithSelf = [
    {
      user_id: syndicateData?.user?.user_id || '',
      username: syndicateData?.user?.username || '',
      name: syndicateData?.user?.name || syndicateData?.user?.username || 'You'
    },
    ...(Array.isArray(syndicateData?.friends) ? syndicateData.friends.map(friend => ({
      ...friend,
      name: friend.name || friend.username
    })) : [])
  ];

  return {
    // Data
    transactions: Array.isArray(transactionsData?.transactions) ? transactionsData.transactions : [],
    friends: friendsWithSelf,
    currentUser: syndicateData?.user,
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

interface Transaction {
  transaction_id: string;
  risk_taker_id: string;
  risk_taker_username: string;
  risk_taker_name: string | null;
  syndicators: TransactionSyndicatorMetaData[];
  total_principal_amount: number;
  total_interest: number;
  created_at: string;
  start_date: string;
  splitwise_entries: SplitwiseEntry[];
}
