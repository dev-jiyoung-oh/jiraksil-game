import { useEffect } from "react";
import { useNavigate, NavLink, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/common/useAuth";
import "./Admin.css";

export default function AdminLayout() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user === null || user.role !== "ADMIN") {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  if (!user || user.role !== "ADMIN") return null;

  return (
    <div className="admin-layout">
      <nav className="admin-nav">
        <h2 className="admin-nav-title">관리자</h2>
        <NavLink to="/admin/suggestions" className={({ isActive }) => `admin-nav-link${isActive ? " active" : ""}`}>
          미션 제안
        </NavLink>
        <NavLink to="/admin/inquiries" className={({ isActive }) => `admin-nav-link${isActive ? " active" : ""}`}>
          고객 문의
        </NavLink>
      </nav>
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
}
