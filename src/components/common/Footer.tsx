import { useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import AppLogo from "@/components/common/AppLogo";
import "./Footer.css";

/**
 * 공통 - 푸터 컴포넌트
 */
export default function Footer() {
  const { pathname } = useLocation();
  const isPlayPage = pathname.includes("/play");
  const footerRef = useRef<HTMLElement>(null);

  // 플레이 페이지: 푸터 높이를 CSS 변수로 설정 (풀스크린 버튼 위치 계산용)
  useEffect(() => {
    if (!isPlayPage) {
      document.documentElement.style.removeProperty("--footer-height");
      return;
    }

    const update = () => {
      const h = footerRef.current?.offsetHeight ?? 0;
      document.documentElement.style.setProperty("--footer-height", `${h}px`);
    };

    update();
    const ro = new ResizeObserver(update);
    if (footerRef.current) ro.observe(footerRef.current);
    return () => ro.disconnect();
  }, [isPlayPage]);

  return (
    <footer ref={footerRef} className={`footer${isPlayPage ? " footer--fixed" : ""}`}>
      <div className="footer-inner">
        <Link to="/" className="footer-logo">
          <AppLogo size="sm" />
        </Link>
        <nav className="footer-links">
          <a href="https://github.com/dev-jiyoung-oh/jiraksil-game" target="_blank" rel="noreferrer">
            GitHub (FE)
          </a>
          <a href="https://github.com/dev-jiyoung-oh/jiraksil-game-backend" target="_blank" rel="noreferrer">
            GitHub (BE)
          </a>
        </nav>
        <a className="footer-credit" href="https://github.com/dev-jiyoung-oh" target="_blank" rel="noreferrer">
          Made by JY
        </a>
      </div>
    </footer>
  );
}
