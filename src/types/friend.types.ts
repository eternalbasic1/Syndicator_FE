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

// Looks Good
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
  // Looks Good
  export interface CreateFriendRequest {
    mutual_friend_name: string;
  }
  // Looks Good
  export interface CreateFriendResponse {
    message: string;
    friend_request_id: string;
    user: string;
    mutual_friend: string;
    status: 'pending' | 'accepted' | 'rejected' | 'canceled';
    created: boolean;
}

  // Looks Good
  export interface UpdateFriendRequestStatus {
    request_id: string;
    status: 'accepted' | 'rejected' | 'canceled';
  }

  //Looks Good
  export interface UpdateFriendRequestStatusResponse {
    message: string;
    request_id: string;
    old_status: string;
    new_status: string;
    authenticated_user: string;
    requester: string;
    recipient: string;
    friends_added: boolean;
    requester_details: {
        user_id: string,
        username: string,
        name: string
    },
    recipient_details: {
        user_id: string,
        username: string,
        name: string | null
    },
    friend_lists_created: {
        requester_list_created: boolean,
        requested_list_created: boolean
    }
}
    
  
