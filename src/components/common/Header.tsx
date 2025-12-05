import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import AppLogo from "./AppLogo";
import ChevronDown from "@/components/icons/ChevronDown";
import type { GameType } from "@/types/common";
import "./Header.css";


export default function Header() {
  const [openMenu, setOpenMenu] = useState<GameType | null>(null);

  const menuRefs = {
    wakeUpMission: useRef<HTMLLIElement>(null),
    charades: useRef<HTMLLIElement>(null),
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
    if (menu === "charades") {
      if (e.key === "ArrowRight") menuRefs.wakeUpMission.current?.querySelector("button")?.focus();
      if (e.key === "ArrowDown") setOpenMenu("charades");
    }
    if (menu === "wakeUpMission") {
      if (e.key === "ArrowLeft") menuRefs.charades.current?.querySelector("button")?.focus();
      if (e.key === "ArrowDown") setOpenMenu("wakeUpMission");
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


  return (
    <header className="app-header" role="banner">
      <Link to="/" aria-label="지락실 홈으로 이동">
        <AppLogo size="base" />
      </Link>

      <nav aria-label="지락실 메뉴" className="header-nav">
        <ul role="menubar" className="menubar">
          
          {/* 자네 지금 뭐 하는 건가 메뉴 */}
          <li
            role="none"
            ref={menuRefs.wakeUpMission}
            onMouseEnter={() => handleMouseEnter("wakeUpMission")}
            onMouseLeave={(e) => handleMouseLeave(e, "wakeUpMission")}
          >
            <button
              type="button"
              role="menuitem"
              aria-haspopup="true"
              aria-expanded={openMenu === "wakeUpMission"}
              className="menu-trigger"
              onClick={() => toggleMenu("wakeUpMission")}
              onKeyDown={(e) => handleTriggerKeyDown(e, "wakeUpMission")}
            >
              자네 지금 뭐 하는 건가
              <ChevronDown className={`chevron ${openMenu === "wakeUpMission" ? "open" : ""}`} />
            </button>

            {openMenu === "wakeUpMission" && (
              <ul
                role="menu"
                className="submenu"
                aria-label="자네 지금 뭐 하는 건가 메뉴"
                onBlur={(e) => handleSubmenuBlur(e, "wakeUpMission")}
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
            ref={menuRefs.charades}
            onMouseEnter={() => handleMouseEnter("charades")}
            onMouseLeave={(e) => handleMouseLeave(e, "charades")}
          >
            <button
              type="button"
              role="menuitem"
              aria-haspopup="true"
              aria-expanded={openMenu === "charades"}
              className="menu-trigger"
              onClick={() => toggleMenu("charades")}
              onKeyDown={(e) => handleTriggerKeyDown(e, "charades")}
            >
              몸으로 말해요
              <ChevronDown className={`chevron ${openMenu === "charades" ? "open" : ""}`} />
            </button>

            {openMenu === "charades" && (
              <ul
                role="menu"
                className="submenu"
                aria-label="몸으로 말해요 메뉴"
                onBlur={(e) => handleSubmenuBlur(e, "charades")}
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
    </header>
  );
}
