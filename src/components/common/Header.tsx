import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AppLogo from "./AppLogo";
import ChevronDown from "@/components/icons/ChevronDown";
import { logout } from "@/api/auth";
import { useAuth } from "@/hooks/common/useAuth";
import { useToast } from "@/components/common/toast/useToast";
import type { GameType } from "@/types/common";
import "./Header.css";


export default function Header() {
  const [openMenu, setOpenMenu] = useState<GameType | null>(null);
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { user, clearUser } = useAuth();

  const menuRefs = {
    WAKE_UP_MISSION: useRef<HTMLLIElement>(null),
    CHARADES: useRef<HTMLLIElement>(null),
  };

  // ESC 닫기
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenMenu(null);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  // 메뉴 열기/닫기
  const toggleMenu = (menu: GameType) => {
    setOpenMenu((prev) => (prev === menu ? null : menu));
  };

  // 마우스 진입
  const handleMouseEnter = (menu: GameType) => {
    setOpenMenu(menu);
  };

  // 마우스 떠날 때
  const handleMouseLeave = (e: React.MouseEvent, menu: GameType) => {
    const related = e.relatedTarget as EventTarget | null;
    const container = menuRefs[menu].current;

    // 포커스가 내부에 있으면 닫지 않음
    if (container?.contains(document.activeElement)) return;

    // 마우스가 submenu 영역 안으로 들어갔다면 닫지 않음
    if (related instanceof Node && container?.contains(related)) return;

    // 완전히 메뉴를 벗어난 경우에만 닫기
    setOpenMenu(null);
  };

  // 키보드 방향키 처리
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

  // 서브메뉴에서 포커스 나가면 닫기
  const handleSubmenuBlur = (
    e: React.FocusEvent<HTMLUListElement>,
    menu: GameType
  ) => {
    const related = e.relatedTarget as HTMLElement | null;
    const wrapper = menuRefs[menu].current;

    if (!wrapper?.contains(related)) {
      setOpenMenu(null);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      clearUser();
      showToast({
        message: "로그아웃되었습니다.",
        type: "success",
      });
      navigate("/");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "로그아웃에 실패했습니다.";
      showToast({
        message: errorMessage,
        type: "error",
      });
    }
  };


  return (
    <header className="app-header" role="banner">
      <Link to="/" aria-label="지락실 홈으로 이동">
        <AppLogo size="base" />
      </Link>

      <div className="header-right">
        <nav aria-label="지락실 메뉴" className="header-nav">
          <ul role="menubar" className="menubar">
          
            {/* 자네 지금 뭐 하는 건가 메뉴 */}
            <li
              role="none"
              ref={menuRefs.WAKE_UP_MISSION}
              onMouseEnter={() => handleMouseEnter("WAKE_UP_MISSION")}
              onMouseLeave={(e) => handleMouseLeave(e, "WAKE_UP_MISSION")}
            >
              <button
                type="button"
                role="menuitem"
                aria-haspopup="true"
                aria-expanded={openMenu === "WAKE_UP_MISSION"}
                className="menu-trigger"
                onClick={() => toggleMenu("WAKE_UP_MISSION")}
                onKeyDown={(e) => handleTriggerKeyDown(e, "WAKE_UP_MISSION")}
              >
                자네 지금 뭐 하는 건가
                <ChevronDown className={`chevron ${openMenu === "WAKE_UP_MISSION" ? "open" : ""}`} />
              </button>

              {openMenu === "WAKE_UP_MISSION" && (
                <ul
                  role="menu"
                  className="submenu"
                  aria-label="자네 지금 뭐 하는 건가 메뉴"
                  onBlur={(e) => handleSubmenuBlur(e, "WAKE_UP_MISSION")}
                >
                  <li role="none">
                    <Link role="menuitem" to="/game/wake-up-mission/new" onClick={() => setOpenMenu(null)}>
                      게임 생성
                    </Link>
                  </li>
                  <li role="none">
                    <Link role="menuitem" to="/game/wake-up-mission/play" onClick={() => setOpenMenu(null)}>
                      게임 플레이
                    </Link>
                  </li>
                  <li role="none">
                    <Link role="menuitem" to="/game/wake-up-mission/manage" onClick={() => setOpenMenu(null)}>
                      게임 관리
                    </Link>
                  </li>
                </ul>
              )}
            </li>
          
            {/* 몸으로 말해요 메뉴 */}
            <li
              role="none"
              ref={menuRefs.CHARADES}
              onMouseEnter={() => handleMouseEnter("CHARADES")}
              onMouseLeave={(e) => handleMouseLeave(e, "CHARADES")}
            >
              <button
                type="button"
                role="menuitem"
                aria-haspopup="true"
                aria-expanded={openMenu === "CHARADES"}
                className="menu-trigger"
                onClick={() => toggleMenu("CHARADES")}
                onKeyDown={(e) => handleTriggerKeyDown(e, "CHARADES")}
              >
                몸으로 말해요
                <ChevronDown className={`chevron ${openMenu === "CHARADES" ? "open" : ""}`} />
              </button>

              {openMenu === "CHARADES" && (
                <ul
                  role="menu"
                  className="submenu"
                  aria-label="몸으로 말해요 메뉴"
                  onBlur={(e) => handleSubmenuBlur(e, "CHARADES")}
                >
                  <li role="none">
                    <Link role="menuitem" to="/game/charades/new" onClick={() => setOpenMenu(null)}>
                      게임 생성
                    </Link>
                  </li>
                  <li role="none">
                    <Link role="menuitem" to="/game/charades/play" onClick={() => setOpenMenu(null)}>
                      게임 플레이
                    </Link>
                  </li>
                  <li role="none">
                    <Link role="menuitem" to="/game/charades/manage" onClick={() => setOpenMenu(null)}>
                      게임 관리
                    </Link>
                  </li>
                </ul>
              )}
            </li>
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
              <Link to="/login" className="header-auth-link">
                로그인
              </Link>
              <Link to="/signup" className="header-auth-link">
                회원가입
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
