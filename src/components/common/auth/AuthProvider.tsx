import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext, type AuthUser } from "@/hooks/common/useAuth";
import { registerUnauthorizedHandler, isAxiosError } from "@/api/api";
import { getMe } from "@/api/user";

function getStoredUser(): AuthUser | null {
  const storedUser = localStorage.getItem("user");
  if (!storedUser) return null;

  try {
    return JSON.parse(storedUser) as AuthUser;
  } catch {
    localStorage.removeItem("user");
    return null;
  }
}

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<AuthUser | null>(getStoredUser);
  const navigate = useNavigate();

  const setUser = useCallback((nextUser: AuthUser) => {
    localStorage.setItem("user", JSON.stringify(nextUser));
    setUserState(nextUser);
  }, []);

  const clearUser = useCallback(() => {
    localStorage.removeItem("user");
    setUserState(null);
  }, []);

  // 401 응답 시 → 인증 상태 초기화 + 로그인 페이지 이동
  useEffect(() => {
    registerUnauthorizedHandler(() => {
      clearUser();
      navigate("/login");
    });
  }, [clearUser, navigate]);

  // 앱 마운트 시 세션 유효성 검증
  // localStorage에 유저 정보가 있을 때만 호출 (비로그인 상태에서 불필요한 API 호출 방지)
  useEffect(() => {
    if (!getStoredUser()) return;

    getMe()
      .then((me) => setUser(me))   // 200: 서버의 최신 유저 정보로 갱신
      .catch((err) => {
        // 401(쿠키 만료/무효)일 때만 로그아웃, 네트워크 오류 등은 기존 상태 유지
        if (isAxiosError(err) && err.response?.status === 401) {
          clearUser();
        }
      });
  }, [setUser, clearUser]);

  return (
    <AuthContext.Provider value={{ user, setUser, clearUser }}>
      {children}
    </AuthContext.Provider>
  );
}
