import api from "./api";
import type { UpdateProfileRequest, ChangePasswordRequest, MyGamesResponse } from "@/types/user";
import type { AuthUser } from "@/hooks/common/useAuth";

// 프로필 수정
export async function updateProfile(data: UpdateProfileRequest): Promise<AuthUser> {
  const res = await api.patch("/users/me/profile", data);
  return res.data;
}

// 비밀번호 변경
export async function changePassword(data: ChangePasswordRequest): Promise<void> {
  await api.patch("/users/me/password", data);
}

// 회원 탈퇴
export async function deleteAccount(password: string): Promise<void> {
  await api.delete("/users/me", { data: { password } });
}

// 내 게임 목록 조회
export async function getMyGames(): Promise<MyGamesResponse> {
  const res = await api.get("/users/me/games");
  return res.data;
}
