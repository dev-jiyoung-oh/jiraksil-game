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

  const enter = useCallback(async () => {
    if (document.fullscreenElement) return;
    try {
      await document.documentElement.requestFullscreen();
    } catch {
      setIsFullscreen(true);
      document.documentElement.classList.add(FULLSCREEN_CLASS);
    }
  }, []);

  const toggle = useCallback(async () => {
    if (!document.fullscreenElement) {
      await enter();
    } else {
      await document.exitFullscreen();
    }
  }, [enter]);

  return { isFullscreen, toggle, enter };
}
