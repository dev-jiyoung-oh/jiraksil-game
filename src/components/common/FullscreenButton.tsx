import { useFullscreen } from "@/hooks/common/useFullscreen";
import "./FullscreenButton.css";

/**
 * 공통 - 전체화면 버튼 컴포넌트
 */
export default function FullscreenButton() {
  const { isFullscreen, toggle } = useFullscreen();

  return (
    <button
      type="button"
      className="fullscreen-btn"
      onClick={toggle}
      aria-label={isFullscreen ? "전체화면 종료" : "전체화면"}
    >
      {isFullscreen ? (
        /* 축소 아이콘 */
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M8 3v3a2 2 0 0 1-2 2H3" />
          <path d="M21 8h-3a2 2 0 0 1-2-2V3" />
          <path d="M3 16h3a2 2 0 0 1 2 2v3" />
          <path d="M16 21v-3a2 2 0 0 1 2-2h3" />
        </svg>
      ) : (
        /* 확장 아이콘 */
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M3 7V3h4" />
          <path d="M21 7V3h-4" />
          <path d="M3 17v4h4" />
          <path d="M21 17v4h-4" />
        </svg>
      )}
    </button>
  );
}
