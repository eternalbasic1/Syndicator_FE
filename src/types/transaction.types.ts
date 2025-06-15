// src/types/transaction.types.ts

export interface SyndicateDetail {
  principal_amount: number;
  interest: number;
}

export interface SyndicateDetails {
  [username: string]: SyndicateDetail;
}

export interface TransactionSyndicatorMetaData {
  user_id: string;
  username: string;
  principal_amount: number;
  interest: number;
}

export interface TransactionMetaData {
  transaction_id: string;
  risk_taker_id: string;
  syndicators: TransactionSyndicatorMetaData[];
  total_principal_amount: number;
  total_interest: number;
  created_at: string;
  start_date: string;
}

export interface Transaction extends Omit<TransactionMetaData, 'syndicators'> {
  syndicators: Array<{
    user_id: string;
    username: string;
    principal_amount: number;
    interest: number;
  }>;
}

export interface CreateTransactionRequest {
  total_principal_amount: number;
  total_interest_amount: number;
  syndicate_details: SyndicateDetails;
  // risk_taker: {
  //   user_id: string;
  //   username: string;
  // };
  // transaction_type: string;
  // splitwise_entries_count: number;
}

export interface CreateTransactionResponse {
  success: boolean;
  transaction_id: string;
  message?: string;
}

export interface TransactionResponse {
  transactions: Transaction[];
}

export interface PortfolioStats {
  total_principal_amount: number;
  total_interest_amount: number;
  active_transactions: number;
}

export interface TransactionFormData {
  total_principal_amount: number;
  total_interest_amount: number;
  syndicate_details: SyndicateDetails;
}