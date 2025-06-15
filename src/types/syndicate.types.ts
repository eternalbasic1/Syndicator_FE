export interface SyndicateMember {
  user_id: string;
  username: string;
  name?: string;
  email: string;
  phone_number?: string;
}

export interface SyndicateData {
  friend_list_id: string;
  user: {
    user_id: string;
    username: string;
  };
  friends: SyndicateMember[];
  created_at: string;
}

export interface SyndicateStats {
  totalFriends: number;
  activeFriends: number;
  pendingRequests: number;
}

export interface SyndicateAction {
  type: 'add' | 'remove' | 'update';
  friend: SyndicateMember;
}

export interface SyndicateFormValues {
  friend_id: string;
  amount: number;
  interest_rate: number;
  start_date: string;
  end_date: string;
}

export interface SyndicateTransaction {
  transaction_id: string;
  friend_id: string;
  amount: number;
  interest_rate: number;
  start_date: string;
  end_date: string;
  status: 'pending' | 'active' | 'completed';
  created_at: string;
}

export interface SyndicateDashboard {
  stats: SyndicateStats;
  recentTransactions: SyndicateTransaction[];
  topFriends: SyndicateMember[];
}
