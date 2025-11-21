import type { GameMode } from "@/types/charades";
import "./Timer.css";

/**
 * 게임 진행 타이머 컴포넌트
 * – 00:00 로 포맷팅
 * – LIMITED/UNTIL_CLEAR 구분
 * – sec은 외부에서 주입받음
 */
export default function Timer({
  mode,
  sec,
  durationSec
}: {
  mode: GameMode;
  sec: number;
  durationSec?: number | null;
}) {

  let displayValue = sec;

  if (mode === "LIMITED") {
    const total = durationSec ?? 0;
    const remaining = total - sec;
    displayValue = remaining > 0 ? remaining : 0;
  }

  // mm:ss 포맷
  const format = (s: number) => {
    const m = Math.floor(s / 60);
    const ss = s % 60;
    return `${String(m).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;
  };

  return (
    <div className="timer">
      <p className={`timer-value ${mode === "LIMITED" && sec <= 10 ? "font-danger" : ""}`}>
        {format(displayValue)}
      </p>
      <p className="timer-label">
        {mode === "LIMITED" ? "남은 시간" : "경과 시간"}
      </p>
    </div>
  );
}
