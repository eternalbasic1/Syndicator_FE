// src/types/auth.types.ts

  //Looks Good
  export interface User {
    user_id: string;
    username: string;
    email: string;
    phone_number?: string;
    name?: string;
  }

  //Looks Good
  export interface LoginRequest {
    username: string;
    password: string;
  }
  
  //Looks Good
  export interface RegisterRequest {
    username: string;
    email: string;
    password: string;
    phone_number: string;
  }
  
  //Looks Good
  export interface AuthResponse {
    access: string;
    refresh?: string;
    user: User;
  }

  //Looks Good
  export interface RegisterResponse {
    message: string;
  }