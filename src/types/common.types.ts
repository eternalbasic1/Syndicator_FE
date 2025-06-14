

// src/types/common.types.ts
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
  }
  
  export interface PaginatedResponse<T> {
    count: number;
    next?: string;
    previous?: string;
    results: T[];
  }
  
  export interface ErrorResponse {
    detail?: string;
    message?: string;
    non_field_errors?: string[];
    [key: string]: unknown;
  }