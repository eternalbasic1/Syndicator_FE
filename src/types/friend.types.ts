/* eslint-disable @typescript-eslint/no-explicit-any */
import type { User } from "./auth.types";


// src/types/friend.types.ts
export interface FriendRequest {
    // TODO: check other_user & request_type not part of original flow
    other_user?: any;
    request_type?: string;
    request_id: string;
    user_id: string;
    requested_id: string;
    status: 'pending' | 'accepted' | 'rejected' | 'canceled';
    created_at: string;
    sender?: User;
    receiver?: User;
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

  
