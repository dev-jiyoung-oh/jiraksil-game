import "./TurnInfoBar.css";
import type { GameMode } from "@/types/charades";

interface TurnInfoBarProps {
  mode: GameMode;
  teamName: string;
  roundIndex: number;
  passLimit: number;

  // 턴 진행 정보
  correctCount: number;
  usedPass: number;

  // UNTIL_CLEAR 전용
  targetCount?: number;
}

/**
 * 몸으로 말해요 - 턴 진행 정보 표시 바
 *
 * - 팀 이름 + 라운드
 * - 정답 / 패스
 * - UNTIL_CLEAR 모드일 경우 목표 정답 표시
 */
export default function TurnInfoBar({
  mode,
  teamName,
  roundIndex,
  passLimit,
  correctCount,
  usedPass,
  targetCount,
}: TurnInfoBarProps) {
  return (
    <div className="turn-info-bar">
      {/* 팀 & 라운드 정보 */}
      <div className="turn-info-bar__group">
        <span className="turn-info-bar__team">{teamName}</span>
        <span className="turn-info-bar__round">Round {roundIndex + 1}</span>
      </div>

      {/* 정답 / 패스 */}
      <div className="turn-info-bar__group">
        <div className="stat">
          <span className="stat__label">정답</span>
          <span className="stat__value">{correctCount}</span>
          {mode === "UNTIL_CLEAR" && targetCount !== undefined && (
            <span className="stat__extra"> / {targetCount}</span>
          )}
        </div>

        <div className="stat">
          <span className="stat__label">패스</span>
          <span className="stat__value">{usedPass}</span>
          <span className="stat__extra"> / {passLimit}</span>
        </div>
      </div>
    </div>
  );
}
