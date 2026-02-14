export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: {
    id: string;
    email: string;
    name?: string;
  };
}

export interface SignupRequest {
  email: string;
  password: string;
  name?: string;
}