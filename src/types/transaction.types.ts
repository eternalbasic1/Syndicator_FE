// src/types/transaction.types.ts
export interface SyndicateDetail {
    principal_amount: number;
    interest: number;
  }
  
  export interface SyndicateDetails {
    [username: string]: SyndicateDetail;
  }
  
  export interface TransactionSyndicatorMetaData {
    user_id: string,
    username: string
  }
  export interface TransactionMetaData {
        transaction_id: string,
        risk_taker_id: string,
        syndicators: TransactionSyndicatorMetaData[],
        total_principal_amount: number,
        total_interest: number,
        created_at: string,
        start_date: string
    }

// Looks Good
  export interface Transaction {
    message: string;
    user: {
        user_id: string,
        username: string,
        name: string
    },
    transaction_count: number,
    transactions: TransactionMetaData[]
}

// Looks Good
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

  // Looks Good
  export interface CreateTransactionResponse {
      message: string,
      transaction_id: string,
      risk_taker: {
          user_id: string,
          username: string
      },
      total_principal_amount: number,
      total_interest: number,
      transaction_type: string,
      splitwise_entries_count: number
  }
    
  // Looks Good
  export interface PortfolioResponse {
    total_principal_amount: number,
    total_interest_amount: number
}