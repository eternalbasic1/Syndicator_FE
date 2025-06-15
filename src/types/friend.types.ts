// src/types/friend.types.ts
export interface FriendRequestMetaData {
  request_id: string;
  requested_id: string;
  requested_username: string;
  requested_name: string;
  user_id: string;
  sender_username: string;
  sender_name: string;
  status: string;
  created_at: string;
  request_type: string;
  other_user: {
      user_id: string,
      username: string,
      name: string
  }
}
export interface FriendRequest {
  message: string;
  user: string;
  user_id: string;
  total_requests: number;
  sent_requests_count: number;
  received_requests_count: number;
  status_summary: {
      pending: number;
      accepted: number;
      rejected: number;
      canceled: number;
  };
  requests: {
      all: FriendRequestMetaData[],
      sent: FriendRequestMetaData[],
      received: FriendRequestMetaData[],
  };
}
  
  export interface CreateFriendRequest {
    mutual_friend_name: string;
  }
  
  export interface CreateFriendResponse {
    message: string;
    friend_request_id: string;
    user: string;
    mutual_friend: string;
    status: 'pending' | 'accepted' | 'rejected' | 'canceled';
    created: boolean;
}
  export interface UpdateFriendRequestStatus {
    request_id: string;
    status: 'accepted' | 'rejected' | 'canceled';
  }

  
