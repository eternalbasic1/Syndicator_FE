import type { User } from "./auth.types";

// src/types/transaction.types.ts
export interface SyndicateDetail {
    principal_amount: number;
    interest: number;
  }
  
  export interface SyndicateDetails {
    [username: string]: SyndicateDetail;
  }
  
  export interface Transaction {
    transaction_id: string;
    risk_taker_id: string;
    syndicators: string[];
    total_principal_amount: number;
    total_interest: number;
    created_at: string;
    start_date: string;
    risk_taker?: User;
  }
  
  export interface CreateTransactionRequest {
    total_principal_amount: number;
    total_interest_amount: number;
    syndicate_details: SyndicateDetails;
  }
  
  export interface TransactionResponse {
    transaction_id: string;
    risk_taker_id: string;
    syndicators: SyndicateDetails;
    total_principal_amount: number;
    total_interest: number;
    created_at: string;
    start_date: string;
  }