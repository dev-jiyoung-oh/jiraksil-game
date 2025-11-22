import "./Controls.css";

interface ControlsProps {
  isRunning: boolean;
  canPass: boolean;
  onStart: () => void;
  onPause: () => void;
  onCorrect: () => void;
  onPass: () => void;
  onEndTurn: () => void;
}

/**
 * 몸으로 말해요 - 게임 컨트롤 패널
 * 
 * - 시작 / 일시정지
 * - 정답 / 패스 / 턴 종료 버튼 제공
 */
export default function Controls({
  isRunning,
  canPass,
  onStart,
  onPause,
  onCorrect,
  onPass,
  onEndTurn,
}: ControlsProps) {
  return (
    <div className="controls-container">
      {/* 타이머 제어 */}
      <div className="controls-row">
        {!isRunning ? (
          <button type="button" className="btn btn-start" onClick={onStart}>
            ▶ 시작
          </button>
        ) : (
          <button type="button" className="btn btn-pause" onClick={onPause}>
            ⏸ 일시정지
          </button>
        )}
      </div>

      {/* 게임 액션 */}
      <div className="controls-row">
        <button type="button" className="btn btn-correct" onClick={onCorrect} disabled={!isRunning}>
          ✅ 정답
        </button>
        <button type="button" className="btn btn-pass" onClick={onPass} disabled={!isRunning || !canPass}>
          ↩ 패스
        </button>
      </div>

      {/* 턴 종료 */}
      <div className="controls-row">
        <button type="button" className="btn btn-end" onClick={onEndTurn} disabled={!isRunning}>
          ⏹ 턴 종료
        </button>
      </div>
    </div>
  );
}
