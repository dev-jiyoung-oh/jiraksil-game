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
      <div className="turn-info-section">
        <span className="team-name">{teamName}</span>
        <span className="round">Round {roundIndex + 1}</span>
      </div>

      {/* 정답 / 패스 */}
      <div className="turn-info-section">
        <span className="stat">
          정답: <b>{correctCount}</b>
          {mode === "UNTIL_CLEAR" && targetCount !== undefined && ` / ${targetCount}`}
        </span>
        <span className="stat">
          패스: <b>{usedPass}</b> / {passLimit}
        </span>
      </div>
    </div>
  );
}
