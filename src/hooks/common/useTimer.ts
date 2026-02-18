import { useState, useEffect, useRef, useCallback } from "react";

interface UseTimerParams {
  /** 설정 시 해당 초에 도달하면 onTimeUp 호출 후 자동 정지 */
  durationSec?: number;
  /** 시간 만료 콜백 (durationSec 설정 시에만 의미 있음) */
  onTimeUp?: () => void;
}

interface UseTimerReturn {
  /** 경과 시간 (항상 0부터 증가) */
  sec: number;
  isRunning: boolean;
  start: () => void;
  pause: () => void;
  /** sec=0, isRunning=false로 초기화 */
  reset: () => void;
}

export function useTimer({
  durationSec,
  onTimeUp,
}: UseTimerParams = {}): UseTimerReturn {
  const [sec, setSec] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  // onTimeUp의 최신 버전을 항상 참조 (stale closure 방지)
  // 선언 순서상 아래 time-up 감지 effect보다 먼저 실행됨
  const onTimeUpRef = useRef(onTimeUp);
  useEffect(() => {
    onTimeUpRef.current = onTimeUp;
  });

  // 매 초 sec 증가 (durationSec 도달 시 캡)
  useEffect(() => {
    if (!isRunning) return;

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
  }, [isRunning, durationSec]);

  // time-up 감지: sec이 durationSec에 도달하면 정지 + 콜백 호출
  // onTimeUpRef 갱신 effect 이후에 실행되므로 최신 콜백 참조 보장
  useEffect(() => {
    if (durationSec == null || !isRunning || sec < durationSec) return;

    setIsRunning(false);
    onTimeUpRef.current?.();
  }, [sec, durationSec, isRunning]);

  const start = useCallback(() => setIsRunning(true), []);
  const pause = useCallback(() => setIsRunning(false), []);
  const reset = useCallback(() => {
    setIsRunning(false);
    setSec(0);
  }, []);

  return { sec, isRunning, start, pause, reset };
}
