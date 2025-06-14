import type { User } from "./auth.types";


// src/types/friend.types.ts
export interface FriendRequest {
    request_id: string;
    user_id: string;
    requested_id: string;
    status: 'pending' | 'accepted' | 'rejected' | 'canceled';
    created_at: string;
    sender?: User;
    receiver?: User;
  }
  
  export interface CreateFriendRequest {
    username: string;
    mutual_friend_name: string;
  }
  
  export interface UpdateFriendRequestStatus {
    request_id: string;
    status: 'accepted' | 'rejected' | 'canceled';
  }
  