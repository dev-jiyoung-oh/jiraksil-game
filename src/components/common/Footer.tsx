import { useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import AppLogo from "@/components/common/AppLogo";
import "./Footer.css";

/**
 * 공통 - 푸터 컴포넌트
 */
export default function Footer() {
  const { pathname } = useLocation();
  const isPlayPage = pathname.includes("/play");
  const [isOpen, setIsOpen] = useState(false);

  const touchStartY = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY.current === null) return;
    const diff = touchStartY.current - e.changedTouches[0].clientY;
    if (diff > 30) setIsOpen(true);
    if (diff < -30) setIsOpen(false);
    touchStartY.current = null;
  };

  const inner = (
    <div className="footer-inner">
      <Link to="/" className="footer-logo">
        <AppLogo size="sm" />
      </Link>
      <nav className="footer-links">
        <a
          href="https://github.com/dev-jiyoung-oh/jiraksil-game"
          target="_blank"
          rel="noreferrer"
        >
          GitHub (FE)
        </a>
        <a
          href="https://github.com/dev-jiyoung-oh/jiraksil-game-backend"
          target="_blank"
          rel="noreferrer"
        >
          GitHub (BE)
        </a>
      </nav>
      <a
        className="footer-credit"
        href="https://github.com/dev-jiyoung-oh"
        target="_blank"
        rel="noreferrer"
      >
        Made by JY
      </a>
    </div>
  );

  if (isPlayPage) {
    return (
      <footer
        className={`footer footer--fixed footer--drawer${isOpen ? " footer--open" : ""}`}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <button
          className="footer-handle"
          onClick={() => setIsOpen((v) => !v)}
          aria-label="푸터 열기/닫기"
        />
        {inner}
      </footer>
    );
  }

  return <footer className="footer">{inner}</footer>;
}
