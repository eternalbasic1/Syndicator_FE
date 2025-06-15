

// src/store/api/friendApi.ts
import { baseApi } from './baseApi';
import type { FriendRequest, CreateFriendRequest, UpdateFriendRequestStatus, CreateFriendResponse, UpdateFriendRequestStatusResponse } from '../../types/friend.types';

export const friendApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createFriendRequest: builder.mutation<CreateFriendResponse, CreateFriendRequest>({
      query: (friendData) => ({
        url: 'create_friend/',
        method: 'POST',
        body: friendData,
      }),
      invalidatesTags: ['FriendRequest'],
    }),
    getFriendRequests: builder.query<FriendRequest, void>({
      query: () => ({
        url: 'check_friend_request_status/',
        method: 'GET',
      }),
      providesTags: ['FriendRequest'],
    }),
    updateFriendRequestStatus: builder.mutation<UpdateFriendRequestStatusResponse, UpdateFriendRequestStatus>({
      query: (updateData) => ({
        url: 'update_friend_request_status/',
        method: 'POST',
        body: updateData,
      }),
      invalidatesTags: ['FriendRequest'],
    }),
  }),
});

export const {
  useCreateFriendRequestMutation,
  useGetFriendRequestsQuery,
  useUpdateFriendRequestStatusMutation,
} = friendApi;
