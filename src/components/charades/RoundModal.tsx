import "./RoundModal.css";
import FinalResult from "./FinalResult";
import type { GameStatus, CharadesTeam, FinalizeTurnRequest } from "@/types/charades";

interface RoundModalProps {
  type: Extract<GameStatus,"INTERMISSION" | "FINISHED"> | null;
  
  // INTERMISSION
  currentTeam?: CharadesTeam;
  correctCount?: number;
  usedPass?: number;
  elapsedSec?: number; // 걸린 시간

  // FINISHED
  teams?: CharadesTeam[];
  turns?: FinalizeTurnRequest[];
  isSaved?: boolean;

  onNext?: () => void;
  onSave?: () => void;
  onRestart?: () => void;
  onGoManage?: () => void;
}

export default function RoundModal({
  type,
  currentTeam,
  correctCount,
  usedPass,
  elapsedSec,
  teams,
  turns,
  isSaved,
  onNext,
  onSave,
  onRestart,
  onGoManage
}: RoundModalProps) {
  if (!type) return null;

  const isIntermission = type === "INTERMISSION";
  const isFinished = type === "FINISHED";

  return (
    <div className="modal-backdrop">
      <div className="round-modal">

        {/* 공통 헤더 */}
        <h2 className="modal-title">
          {isIntermission ? "턴 종료" : "최종 결과"}
        </h2>

        {/* --- 턴 종료 결과(INTERMISSION) --- */}
        {isIntermission && currentTeam && (
          <section className="intermission-section">
            <p className="team-name">{currentTeam.name}</p>

            <table className="intermission-stats">
              <tbody>
                <tr>
                  <th>정답</th>
                  <td className="correct">{correctCount}</td>
                </tr>
                <tr>
                  <th>패스</th>
                  <td>{usedPass}</td>
                </tr>
                {elapsedSec !== undefined && (
                  <tr>
                    <th>걸린 시간(초)</th>
                    <td>{elapsedSec}</td>
                  </tr>
                )}
              </tbody>
            </table>

            {onNext && (
              <button type="button" className="btn modal-btn" onClick={onNext}>
                다음 턴 시작 ▶
              </button>
            )}
          </section>
        )}

        {/* --- 최종 결과(FINISHED) --- */}
        {isFinished && teams && turns && (
          <section className="finished-section">
            <FinalResult
              teams={teams}
              turns={turns}
            />

            {/* 버튼 묶음 */}
            <div className="result-actions">

              {onSave && (
                <button type="button" className="btn modal-btn save" onClick={onSave} disabled={isSaved}>
                  {isSaved ? "저장 완료" : "결과 저장"}
                </button>
              )}

              {onRestart && (
                <button type="button" className="btn modal-btn restart" onClick={onRestart}>
                  다시 하기
                </button>
              )}

              {onGoManage && (
                <button type="button" className="btn modal-btn manage" onClick={onGoManage}>
                  관리 화면으로 이동
                </button>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
