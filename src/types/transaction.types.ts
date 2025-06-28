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
}

export interface SplitwiseEntry {
  splitwise_id: string;
  syndicator_id: string;
  syndicator_username: string;
  syndicator_name: string | null;
  syndicator_email: string;
  principal_amount: number;
  original_interest: number;
  interest_after_commission: number;
  commission_deducted: number;
  is_risk_taker: boolean;
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
  commission_flag: boolean;
  commission_rate: number;
  total_commission_earned: number;
  created_at: string;
  start_date: string;
  splitwise_entries: SplitwiseEntry[];
}

export interface TransactionCounts {
  total: number;
  as_risk_taker: number;
  as_syndicate_member: number;
}

export interface TransactionResponse {
  message: string;
  user: {
    user_id: string;
    username: string;
    name: string;
  };
  transaction_counts: TransactionCounts;
  transactions: Transaction[];
}

export interface CreateTransactionRequest {
  total_principal_amount: number;
  total_interest_amount: number;
  risk_taker_flag: boolean;
  risk_taker_commission: number;
  syndicate_details: SyndicateDetails;
}

export interface CommissionDetails {
  risk_taker_flag: boolean;
  risk_taker_commission_percentage: number;
  commission_per_syndicator: number;
  syndicators_paying_commission: number;
}

export interface SplitwiseEntryResponse {
  splitwise_id: string;
  syndicator_username: string;
  syndicator_user_id: string;
  principal_amount: number;
  original_interest: number;
  interest_after_commission: number;
  commission_deducted: number;
}

export interface CreateTransactionResponse {
  message: string;
  transaction_id: string;
  risk_taker: {
    user_id: string;
    username: string;
  };
  total_principal_amount: number;
  total_interest: number;
  commission_details: CommissionDetails;
  transaction_type: string;
  splitwise_entries_count: number;
  splitwise_entries: SplitwiseEntryResponse[];
}

export interface PortfolioBreakdown {
  principal: number;
  interest: number;
  commission_earned: number;
}

export interface PortfolioBreakdownAsMember {
  principal: number;
  original_interest: number;
  interest_after_commission: number;
  commission_paid: number;
}

export interface PortfolioStats {
  total_principal_amount: number;
  total_original_interest: number;
  total_interest_after_commission: number;
  total_commission_impact: number;
  breakdown: {
    as_risk_taker: PortfolioBreakdown;
    as_syndicate_member: PortfolioBreakdownAsMember;
  };
}

export interface TransactionFormData {
  total_principal_amount: number;
  total_interest_amount: number;
  risk_taker_flag: boolean;
  risk_taker_commission: number;
  syndicate_details: SyndicateDetails;
}
