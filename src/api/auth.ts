import api from "./api";
import type {
    LoginRequest,
    LoginResponse,
    SignupRequest,
} from "@/types/auth";

// 회원가입
export async function signup(data: SignupRequest): Promise<void> {
  await api.post("/auth/signup", data);
}

// 로그인 
export async function login(data: LoginRequest): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>("/auth/login", data);
  return response.data;
}

// 로그아웃
export async function logout(): Promise<void> {
  await api.post("/auth/logout");
}

