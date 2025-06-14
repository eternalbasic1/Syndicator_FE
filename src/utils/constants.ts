export const API_BASE_URL = 'http://localhost:8000/api';

export const API_ENDPOINTS = {
  LOGIN: '/login/',
  REGISTER: '/register/',
  PORTFOLIO: '/portfolio/',
  SYNDICATE: '/syndicate/',
  CREATE_FRIEND: '/create_friend/',
  CHECK_FRIEND_REQUEST_STATUS: '/check_friend_request_status/',
  UPDATE_FRIEND_REQUEST_STATUS: '/update_friend_request_status/',
  ALL_TRANSACTION: '/all_transaction/',
  CREATE_TRANSACTION: '/create_transaction/',
} as const;

export const FRIEND_REQUEST_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  CANCELED: 'canceled',
} as const;

export const REQUEST_TYPES = {
  SENT: 'sent',
  RECEIVED: 'received',
} as const;

export const TRANSACTION_TYPES = {
  SYNDICATED: 'syndicated',
  SOLO: 'solo',
} as const;

export const LOCAL_STORAGE_KEYS = {
  JWT_TOKEN: 'jwt_token',
  USER_DATA: 'user_data',
  REFRESH_TOKEN: 'refresh_token',
} as const;

export const COMMON_MESSAGES = {
  LOADING: 'Loading...',
  NO_DATA: 'No data available',
  ERROR_OCCURRED: 'An error occurred',
  SUCCESS: 'Operation completed successfully',
  NETWORK_ERROR: 'Network error. Please try again.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
} as const;

export const VALIDATION_MESSAGES = {
  REQUIRED_FIELD: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  PASSWORD_MIN_LENGTH: 'Password must be at least 8 characters',
  PHONE_INVALID: 'Please enter a valid phone number',
  AMOUNT_POSITIVE: 'Amount must be greater than 0',
  USERNAME_MIN_LENGTH: 'Username must be at least 3 characters',
} as const;

export const COLORS = {
  PRIMARY: '#1976d2',
  SECONDARY: '#dc004e',
  SUCCESS: '#2e7d32',
  ERROR: '#d32f2f',
  WARNING: '#ed6c02',
  INFO: '#0288d1',
} as const;