import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import AppLogo from "./AppLogo";
import ChevronDown from "@/components/icons/ChevronDown";
import { logout } from "@/api/auth";
import { useAuth } from "@/hooks/common/useAuth";
import { useToast } from "@/components/common/toast/useToast";
import type { GameType } from "@/types/common";
import "./Header.css";

const MENUS: { key: GameType; label: string; items: { to: string; label: string }[] }[] = [
  {
    key: "WAKE_UP_MISSION",
    label: "자네 지금 뭐 하는 건가",
    items: [
      { to: "/game/wake-up-mission/new", label: "게임 생성" },
      { to: "/game/wake-up-mission/play", label: "게임 플레이" },
      { to: "/game/wake-up-mission/manage", label: "게임 관리" },
    ],
  },
  {
    key: "CHARADES",
    label: "몸으로 말해요",
    items: [
      { to: "/game/charades/new", label: "게임 생성" },
      { to: "/game/charades/play", label: "게임 플레이" },
      { to: "/game/charades/manage", label: "게임 관리" },
    ],
  },
];

export default function Header() {
  const [openMenu, setOpenMenu] = useState<GameType | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mobileOpenMenu, setMobileOpenMenu] = useState<GameType | null>(null);
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { user, clearUser } = useAuth();
  const { pathname } = useLocation();
  const headerRef = useRef<HTMLElement>(null);

  const menuRefs = {
    WAKE_UP_MISSION: useRef<HTMLLIElement>(null),
    CHARADES: useRef<HTMLLIElement>(null),
  };

  // 페이지 이동 시 메뉴 닫기
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // 헤더 높이를 CSS 변수로 설정 (오버레이 위치 계산용)
  useEffect(() => {
    const update = () => {
      const h = headerRef.current?.offsetHeight ?? 0;
      document.documentElement.style.setProperty("--header-height", `${h}px`);
    };
    update();
    const ro = new ResizeObserver(update);
    if (headerRef.current) ro.observe(headerRef.current);
    return () => ro.disconnect();
  }, []);

  // 모바일 메뉴 열릴 때 스크롤 잠금
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isMenuOpen]);

  // ESC 닫기
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenMenu(null);
        setIsMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const closeMobileMenu = () => {
    setIsMenuOpen(false);
    setMobileOpenMenu(null);
  };

  // 메뉴 열기/닫기
  const toggleMenu = (menu: GameType) => {
    setOpenMenu((prev) => (prev === menu ? null : menu));
  };

  const handleMouseEnter = (menu: GameType) => setOpenMenu(menu);

  const handleMouseLeave = (e: React.MouseEvent, menu: GameType) => {
    const related = e.relatedTarget as EventTarget | null;
    const container = menuRefs[menu].current;
    if (container?.contains(document.activeElement)) return;
    if (related instanceof Node && container?.contains(related)) return;
    setOpenMenu(null);
  };

  const handleTriggerKeyDown = (
    e: React.KeyboardEvent<HTMLButtonElement>,
    menu: GameType
  ) => {
    if (menu === "CHARADES") {
      if (e.key === "ArrowRight") menuRefs.WAKE_UP_MISSION.current?.querySelector("button")?.focus();
      if (e.key === "ArrowDown") setOpenMenu("CHARADES");
    }
    if (menu === "WAKE_UP_MISSION") {
      if (e.key === "ArrowLeft") menuRefs.CHARADES.current?.querySelector("button")?.focus();
      if (e.key === "ArrowDown") setOpenMenu("WAKE_UP_MISSION");
    }
  };

  const handleSubmenuBlur = (e: React.FocusEvent<HTMLUListElement>, menu: GameType) => {
    const related = e.relatedTarget as HTMLElement | null;
    if (!menuRefs[menu].current?.contains(related)) setOpenMenu(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
      clearUser();
      closeMobileMenu();
      showToast({ message: "로그아웃되었습니다.", type: "success" });
      navigate("/");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "로그아웃에 실패했습니다.";
      showToast({ message: errorMessage, type: "error" });
    }
  };

  return (
    <header ref={headerRef} className="app-header" role="banner">
      <div className="header-row">
        <Link to="/" aria-label="지락실 홈으로 이동">
          <AppLogo size="base" />
        </Link>

        {/* PC 네비게이션 */}
        <div className="header-right">
          <nav aria-label="지락실 메뉴" className="header-nav">
            <ul role="menubar" className="menubar">
              {MENUS.map((menu) => (
                <li
                  key={menu.key}
                  role="none"
                  ref={menuRefs[menu.key]}
                  onMouseEnter={() => handleMouseEnter(menu.key)}
                  onMouseLeave={(e) => handleMouseLeave(e, menu.key)}
                >
                  <button
                    type="button"
                    role="menuitem"
                    aria-haspopup="true"
                    aria-expanded={openMenu === menu.key}
                    className="menu-trigger"
                    onClick={() => toggleMenu(menu.key)}
                    onKeyDown={(e) => handleTriggerKeyDown(e, menu.key)}
                  >
                    {menu.label}
                    <ChevronDown className={`chevron ${openMenu === menu.key ? "open" : ""}`} />
                  </button>

                  {openMenu === menu.key && (
                    <ul
                      role="menu"
                      className="submenu"
                      aria-label={menu.label}
                      onBlur={(e) => handleSubmenuBlur(e, menu.key)}
                    >
                      {menu.items.map((item) => (
                        <li key={item.to} role="none">
                          <Link role="menuitem" to={item.to} onClick={() => setOpenMenu(null)}>
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <div className="header-auth">
            {user ? (
              <>
                <Link to="/mypage" className="header-user-name header-user-link">
                  {user.name || user.email}
                </Link>
                <button type="button" className="header-auth-btn" onClick={handleLogout}>
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="header-auth-link">로그인</Link>
                <Link to="/signup" className="header-auth-link">회원가입</Link>
              </>
            )}
          </div>
        </div>

        {/* 모바일 햄버거 버튼 */}
        <button
          type="button"
          className="hamburger-btn"
          aria-label={isMenuOpen ? "메뉴 닫기" : "메뉴 열기"}
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((prev) => !prev)}
        >
          <span className={`hamburger-icon ${isMenuOpen ? "open" : ""}`} aria-hidden="true">
            <span /><span /><span />
          </span>
        </button>
      </div>

      {/* 모바일 패널 */}
      {isMenuOpen && (
        <div className="mobile-panel" aria-label="모바일 메뉴">
          {/* 인증 영역 */}
          <div className="mobile-panel-auth">
            {user ? (
              <>
                <div className="mobile-auth-user">
                  <Link to="/mypage" className="mobile-auth-username" onClick={closeMobileMenu}>
                    {user.name || user.email}
                  </Link>
                  <Link to="/mypage" className="mobile-auth-icon-btn" aria-label="마이페이지" onClick={closeMobileMenu}>
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <circle cx="12" cy="8" r="4" />
                      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                    </svg>
                  </Link>
                </div>
                <button type="button" className="mobile-auth-btn" onClick={handleLogout}>
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="mobile-auth-link" onClick={closeMobileMenu}>로그인</Link>
                <Link to="/signup" className="mobile-auth-link" onClick={closeMobileMenu}>회원가입</Link>
              </>
            )}
          </div>

          <hr className="mobile-panel-divider" />

          {/* 게임 메뉴 */}
          <nav aria-label="모바일 게임 메뉴">
            {MENUS.map((menu) => (
              <div key={menu.key} className="mobile-menu-group">
                <button
                  type="button"
                  className="mobile-menu-trigger"
                  aria-expanded={mobileOpenMenu === menu.key}
                  onClick={() => setMobileOpenMenu((prev) => prev === menu.key ? null : menu.key)}
                >
                  {menu.label}
                  <ChevronDown className={`chevron ${mobileOpenMenu === menu.key ? "open" : ""}`} />
                </button>
                {mobileOpenMenu === menu.key && (
                  <ul className="mobile-submenu">
                    {menu.items.map((item) => (
                      <li key={item.to}>
                        <Link to={item.to} onClick={closeMobileMenu}>{item.label}</Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
