import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import AppLogo from "./AppLogo";
import ChevronDown from "@/components/icons/ChevronDown";
import type { CodeModalConfig } from "@/types/common";
import "./Header.css";


export default function Header({ openCodeModal }: { openCodeModal: (config: CodeModalConfig) => void }) {
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const menuRefs = {
    wakeUpMission: useRef<HTMLButtonElement>(null),
    charades: useRef<HTMLButtonElement>(null),
  };

  /* ESC 닫기 */
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenMenu(null);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const toggleMenu = (menu: string) => {
    setOpenMenu((prev) => (prev === menu ? null : menu));
  };

  const handleMenuKeyDown = (
    e: React.KeyboardEvent<HTMLButtonElement>,
    menu: "charades" | "wakeUpMission"
  ) => {
    if (menu === "wakeUpMission") {
      if (e.key === "ArrowLeft") menuRefs.charades.current?.focus();
      if (e.key === "ArrowDown") setOpenMenu("wakeUpMission");
    }
    if (menu === "charades") {
      if (e.key === "ArrowRight") menuRefs.wakeUpMission.current?.focus();
      if (e.key === "ArrowDown") setOpenMenu("charades");
    }
  };

  return (
    <header className="app-header">
      {/* 로고 → 홈 */}
      <Link to="/" aria-label="지락실 홈으로 이동">
        <AppLogo size="base" />
      </Link>

      <nav aria-label="지락실 메뉴" className="header-nav">
        <ul role="menubar" className="menubar">

          {/* ---- 자네 지금 뭐 하는 건가 ---- */}
          <li role="none">
            <button
              role="menuitem"
              aria-haspopup="true"
              aria-expanded={openMenu === "wakeUpMission"}
              ref={menuRefs.wakeUpMission}
              className="menu-trigger"
              onClick={() => toggleMenu("wakeUpMission")}
              onKeyDown={(e) => handleMenuKeyDown(e, "wakeUpMission")}
            >
              자네 지금 뭐 하는 건가
              <ChevronDown className={`chevron ${openMenu === "wakeUpMission" ? "open" : ""}`} />
            </button>

            {openMenu === "wakeUpMission" && (
              <ul role="menu" className="submenu" aria-label="자네 지금 뭐 하는 건가 메뉴">
                <li role="none">
                  <Link role="menuitem" to="/game/wake-up-mission/new">
                    게임 생성
                  </Link>
                </li>
                <li role="none">
                  <button
                    role="menuitem"
                    className="submenu-btn"
                    onClick={() => openCodeModal({ game: "wakeUpMission", action: "play" })}
                  >
                    게임 플레이
                  </button>
                </li>
                <li role="none">
                  <button
                    role="menuitem"
                    className="submenu-btn"
                    onClick={() => openCodeModal({ game: "wakeUpMission", action: "manage" })}
                  >
                    게임 관리
                  </button>
                </li>
              </ul>
            )}
          </li>

          {/* ---- 몸으로 말해요 ---- */}
          <li role="none">
            <button
              role="menuitem"
              aria-haspopup="true"
              aria-expanded={openMenu === "charades"}
              ref={menuRefs.charades}
              className="menu-trigger"
              onClick={() => toggleMenu("charades")}
              onKeyDown={(e) => handleMenuKeyDown(e, "charades")}
            >
              몸으로 말해요
              <ChevronDown className={`chevron ${openMenu === "charades" ? "open" : ""}`} />
            </button>

            {openMenu === "charades" && (
              <ul role="menu" className="submenu" aria-label="몸으로 말해요 메뉴">
                <li role="none">
                  <Link role="menuitem" to="/game/charades/new">
                    게임 생성
                  </Link>
                </li>
                <li role="none">
                  <button
                    role="menuitem"
                    className="submenu-btn"
                    onClick={() => openCodeModal({ game: "charades", action: "play" })}
                  >
                    게임 플레이
                  </button>
                </li>
                <li role="none">
                  <button
                    role="menuitem"
                    className="submenu-btn"
                    onClick={() => openCodeModal({ game: "charades", action: "manage" })}
                  >
                    게임 관리
                  </button>
                </li>
              </ul>
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
}
