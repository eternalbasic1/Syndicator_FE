// src/types/auth.types.ts
export interface User {
    user_id: string;
    username: string;
    email: string;
    phone_number?: string;
    name?: string;
  }
  
  export interface LoginRequest {
    username: string;
    password: string;
  }
  
  export interface RegisterRequest {
    username: string;
    email: string;
    password: string;
    phone_number?: string;
  }
  
  export interface AuthResponse {
    access: string;
    refresh: string;
    user: User;
  }