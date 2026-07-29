import Timer from "@/components/charades/Timer";
import IconPlay from "@/components/icons/IconPlay";
import IconPause from "@/components/icons/IconPause";
import IconStop from "@/components/icons/IconStop";
import "./TurnInfoBar.css";
import type { GameMode } from "@/types/charades";

interface TurnInfoBarProps {
  mode: GameMode;
  timerSec: number;
  durationSec?: number | null;

  // 가로 모드 전용: 일시정지/재시작·턴종료 버튼
  hasTurn?: boolean;
  isRunning?: boolean;
  onPauseResume?: () => void;
  onEndTurn?: () => void;
}

/**
 * 몸으로 말해요 - 타이머 바
 *
 * 팀/라운드·정답/패스 정보는 play 레이아웃의 area-team·area-score 에서 담당.
 * 가로 모드: 타이머 양옆에 일시정지/재시작·턴종료 버튼 표시.
 */
export default function TurnInfoBar({
  mode,
  timerSec,
  durationSec,
  hasTurn,
  isRunning,
  onPauseResume,
  onEndTurn,
}: TurnInfoBarProps) {
  return (
    <div className="turn-info-bar">
      {/* 일시정지 / 재시작 */}
      <div className="tib-ctrl">
        {hasTurn && (
          <button
            type="button"
            className={`tib-ctrl-btn ${isRunning ? "tib-ctrl-btn--pause" : "tib-ctrl-btn--resume"}`}
            onClick={onPauseResume}
            aria-label={isRunning ? "일시정지" : "재시작"}
          >
            {isRunning ? <IconPause /> : <IconPlay />}
          </button>
        )}
      </div>

      <Timer mode={mode} sec={timerSec} durationSec={durationSec} />

      {/* 턴 종료 */}
      <div className="tib-ctrl">
        {hasTurn && (
          <button
            type="button"
            className="tib-ctrl-btn tib-ctrl-btn--end"
            onClick={onEndTurn}
            disabled={!isRunning}
            aria-label="턴 종료"
          >
            <IconStop />
          </button>
        )}
      </div>
    </div>
  );
}
