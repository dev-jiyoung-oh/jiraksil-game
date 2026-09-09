import { createContext, useContext } from "react";

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  role?: string;
}

export interface AuthContextValue {
  user: AuthUser | null;
  setUser: (user: AuthUser) => void;
  clearUser: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("AuthProvider 내부에서만 useAuth를 사용할 수 있습니다.");
  }
  return ctx;
}
