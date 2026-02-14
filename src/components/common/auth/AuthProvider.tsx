import { useCallback, useState } from "react";
import { AuthContext, type AuthUser } from "@/hooks/common/useAuth";

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

  const setUser = useCallback((nextUser: AuthUser) => {
    localStorage.setItem("user", JSON.stringify(nextUser));
    setUserState(nextUser);
  }, []);

  const clearUser = useCallback(() => {
    localStorage.removeItem("user");
    setUserState(null);
  }, []);

  return <AuthContext.Provider value={{ user, setUser, clearUser }}>{children}</AuthContext.Provider>;
}
