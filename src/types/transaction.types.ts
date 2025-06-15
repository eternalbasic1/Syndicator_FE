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

export interface SplitwiseEntry {
  splitwise_id: string;
  syndicator_id: string;
  syndicator_username: string;
  syndicator_name: string | null;
  syndicator_email: string;
  principal_amount: number;
  interest_amount: number;
  created_at: string;
}

export interface Transaction {
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

export interface TransactionResponse {
  message: string;
  user: {
    user_id: string;
    username: string;
    name: string;
  };
  transaction_count: number;
  transactions: Transaction[];
}

export interface CreateTransactionRequest {
  total_principal_amount: number;
  total_interest_amount: number;
  syndicate_details: SyndicateDetails;
}

export interface CreateTransactionResponse {
  success: boolean;
  transaction_id: string;
  message?: string;
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