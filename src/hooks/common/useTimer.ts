import { useState, useEffect, useCallback } from "react";

interface UseTimerParams {
  /** 설정 시 해당 초에 도달하면 자동 정지 + isTimeUp = true */
  durationSec?: number;
}

interface UseTimerReturn {
  /** 경과 시간 (항상 0부터 증가) */
  sec: number;
  isRunning: boolean;
  /** durationSec에 도달했는지 여부 */
  isTimeUp: boolean;
  start: () => void;
  pause: () => void;
  /** sec=0, isRunning=false로 초기화 */
  reset: () => void;
}

export function useTimer({
  durationSec,
}: UseTimerParams = {}): UseTimerReturn {
  const [sec, setSec] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const isTimeUp = durationSec != null && sec >= durationSec;

  // 매 초 sec 증가 (durationSec 도달 시 캡)
  useEffect(() => {
    if (!isRunning || isTimeUp) return;

    const id = setInterval(() => {
      setSec((prev) => {
        const next = prev + 1;
        if (durationSec != null && next >= durationSec) {
          return durationSec;
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(id);
  }, [isRunning, durationSec, isTimeUp]);

  // time-up 감지: durationSec에 도달하면 자동 정지
  useEffect(() => {
    if (!isTimeUp || !isRunning) return;
    setIsRunning(false);
  }, [isTimeUp, isRunning]);

  const start = useCallback(() => setIsRunning(true), []);
  const pause = useCallback(() => setIsRunning(false), []);
  const reset = useCallback(() => {
    setIsRunning(false);
    setSec(0);
  }, []);

  return { sec, isRunning, isTimeUp, start, pause, reset };
}
