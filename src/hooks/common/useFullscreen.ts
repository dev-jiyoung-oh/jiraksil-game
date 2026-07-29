import { useState, useEffect, useCallback } from "react";

const FULLSCREEN_CLASS = "is-fullscreen";

/**
 * 공통 - 전체화면 훅
 */
export function useFullscreen() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const onChange = () => {
      const active = !!document.fullscreenElement;
      setIsFullscreen(active);
      document.documentElement.classList.toggle(FULLSCREEN_CLASS, active);
    };

    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  const toggle = useCallback(async () => {
    if (!document.fullscreenElement) {
      try {
        await document.documentElement.requestFullscreen();
      } catch {
        // iOS Safari doesn't support Fullscreen API — fallback to class toggle
        const next = !isFullscreen;
        setIsFullscreen(next);
        document.documentElement.classList.toggle(FULLSCREEN_CLASS, next);
      }
    } else {
      await document.exitFullscreen();
    }
  }, [isFullscreen]);

  return { isFullscreen, toggle };
}
