import { useParams, useLocation, useNavigate } from "react-router-dom";
import { getGameDetail } from "@/api/charades";
import { useGameAccess } from "@/hooks/common/useGameAccess";
import { useCharadesGame } from "@/hooks/charades/useCharadesGame";

import GameAccessModal from "@/components/common/GameAccessModal";
import WordCard from "@/components/charades/WordCard";
import TurnInfoBar from "@/components/charades/TurnInfoBar";
import RoundModal from "@/components/charades/RoundModal";
import IconPlay from "@/components/icons/IconPlay";
import IconPause from "@/components/icons/IconPause";
import IconStop from "@/components/icons/IconStop";
import IconCheck from "@/components/icons/IconCheck";
import IconUndo from "@/components/icons/IconUndo";

import type { GameInfoDto } from "@/types/charades";

import "./Play.css";

/**
 * 몸으로 말해요 - 게임 진행 페이지
 *
 * 레이아웃:
 * - 모바일/패드: [정답] [스케치북] [패스] / 시작 / 턴종료
 * - PC (≥1024px): [스케치북] | [시작 / 정답 / 패스 / 턴종료]
 */
export default function Play() {
  const { gameCode } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const hasCode = !!gameCode;
  const initialData = location.state as GameInfoDto | undefined;

  // 인증
  const { gameData, isVerified, errorMessage, handleAccessSubmit } =
    useGameAccess<GameInfoDto>({
      gameCode,
      initialData,
      fetcher: getGameDetail,
      routeBase: "/game/charades/play",
    });

  // 게임 로직
  const {
    currentTurn,
    turns,
    currentInfo,
    timerSec,
    isRunning,
    currentWord,
    wordIdx,
    modalType,
    showModal,
    isGameSaved,
    handleStartTurn,
    handleRestartTurn,
    handlePauseTurn,
    handleCorrect,
    handlePass,
    handleEndTurn,
    handleNextTurn,
    handleSaveGame,
    handleRestartGame,
  } = useCharadesGame({ gameData, gameCode, isVerified });

  // 현재 팀 정보
  const currentTeam =
    gameData?.teams.find((t) => t.code === currentTurn?.teamCode) ||
    currentInfo.team;

  const canPass = (currentTurn?.usedPass ?? 0) < (gameData?.passLimit ?? 0);

  // 관리 화면으로 이동
  const handleGoManage = () => {
    navigate(`/game/charades/manage/${gameCode}`);
  };

  return (
    <div className="page-container-wide">
      {/* 인증 모달 */}
      {!isVerified && (
        <GameAccessModal
          isOpen={!isVerified}
          code={gameCode}
          requireCode={!hasCode}
          requirePassword={true}
          onSubmit={handleAccessSubmit}
          onClose={() => navigate(-1)}
          errorMessage={errorMessage}
        />
      )}

      {isVerified && gameData && currentTeam && (
        <>
          <main className="play-layout">
            <h2 className="sr-only">몸으로 말해요 - 플레이 화면</h2>

            {/* 툴바 */}
            <section className="area-toolbar">
              <h3 className="sr-only">상단 영역</h3>
              <div className="toolbar-left">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleGoManage}
                >
                  관리 화면으로 이동
                </button>
              </div>
            </section>

            {/* 팀 & 라운드 */}
            <div className="area-team">
              <span className="area-team__name">{currentTeam.name}</span>
              <div className="play-stat">
                <span className="play-stat__label">라운드</span>
                <span className="play-stat__value">{currentInfo.roundIdx + 1}</span>
              </div>
            </div>

            {/* 타이머 */}
            <section className="area-info">
              <h3 className="sr-only">현재 진행 상황</h3>
              <TurnInfoBar
                mode={gameData.mode}
                timerSec={timerSec}
                durationSec={gameData.durationSec}
                hasTurn={!!currentTurn}
                isRunning={isRunning}
                onPauseResume={currentTurn ? (isRunning ? handlePauseTurn : handleRestartTurn) : undefined}
                onEndTurn={currentTurn ? handleEndTurn : undefined}
              />
            </section>

            {/* 정답 & 패스 */}
            <div className="area-score">
              <div className="play-stat">
                <span className="play-stat__label">정답</span>
                <span className="play-stat__value">
                  {currentTurn?.correctCount ?? 0}
                  {gameData.mode === "UNTIL_CLEAR" && gameData.targetCount != null && ` / ${gameData.targetCount}`}
                </span>
              </div>
              <div className="play-stat">
                <span className="play-stat__label">패스</span>
                <span className="play-stat__value">{currentTurn?.usedPass ?? 0} / {gameData.passLimit}</span>
              </div>
            </div>

            {/* 제시어 스케치북 */}
            <section className="area-word">
              <h3 className="sr-only">제시어</h3>
              <WordCard
                word={currentWord?.text ?? "단어 조회 실패"}
                index={wordIdx + 1}
                isVisible={isRunning}
              />
            </section>

            {/* 정답 버튼 (스케치북 좌측) */}
            <div className="area-correct">
              <button
                type="button"
                className="btn btn-correct play-action-btn"
                onClick={handleCorrect}
                disabled={!isRunning}
              >
                <IconCheck size="1.2em" />
                정답
              </button>
            </div>

            {/* 패스 버튼 (스케치북 우측) */}
            <div className="area-pass">
              <button
                type="button"
                className="btn btn-pass play-action-btn"
                onClick={handlePass}
                disabled={!isRunning || !canPass}
              >
                <IconUndo size="1.2em" />
                패스
              </button>
            </div>

            {/* 일시정지 / 재시작 — 턴 진행 중에만 표시 */}
            {currentTurn && (
              <div className="area-start">
                {!isRunning ? (
                  <button
                    type="button"
                    className="btn btn-large btn-start play-ctrl-btn"
                    onClick={handleRestartTurn}
                  >
                    <IconPlay size="1.2em" />
                    재시작
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn btn-large btn-pause play-ctrl-btn"
                    onClick={handlePauseTurn}
                  >
                    <IconPause size="1.2em" />
                    일시정지
                  </button>
                )}
              </div>
            )}

            {/* 턴 종료 — 턴 진행 중에만 표시 */}
            {currentTurn && (
              <div className="area-end">
                <button
                  type="button"
                  className="btn btn-large btn-end play-ctrl-btn"
                  onClick={handleEndTurn}
                  disabled={!isRunning}
                >
                  <IconStop size="1.2em" />
                  턴 종료
                </button>
              </div>
            )}
          </main>

          {/* 턴 시작 전 전체화면 오버레이 */}
          {!currentTurn && !isRunning && (
            <div className="play-start-overlay">
              <button
                type="button"
                className="btn btn-start play-start-overlay__btn"
                onClick={handleStartTurn}
              >
                <IconPlay size="1.5em" />
                시작
              </button>
            </div>
          )}

          {/* 턴 종료 / 최종 결과 모달 */}
          {showModal && (
            <RoundModal
              type={modalType}
              currentTeam={currentTeam}
              correctCount={currentTurn?.correctCount ?? 0}
              usedPass={currentTurn?.usedPass ?? 0}
              elapsedSec={timerSec}
              onNext={modalType === "INTERMISSION" ? handleNextTurn : undefined}
              isSaved={isGameSaved}
              teams={modalType === "FINISHED" ? gameData.teams : undefined}
              turns={modalType === "FINISHED" ? turns : undefined}
              onSave={modalType === "FINISHED" ? handleSaveGame : undefined}
              onRestart={
                modalType === "FINISHED" ? handleRestartGame : undefined
              }
              onGoManage={
                modalType === "FINISHED" ? handleGoManage : undefined
              }
            />
          )}
        </>
      )}
    </div>
  );
}
