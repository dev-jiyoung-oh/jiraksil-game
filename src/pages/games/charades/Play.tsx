import { useParams, useLocation, useNavigate } from "react-router-dom";
import { getGameDetail } from "@/api/charades";
import { useGameAccess } from "@/hooks/common/useGameAccess";
import { useCharadesGame } from "@/hooks/charades/useCharadesGame";

import CopyButton from "@/components/common/CopyButton";
import GameAccessModal from "@/components/common/GameAccessModal";
import Timer from "@/components/charades/Timer";
import WordCard from "@/components/charades/WordCard";
import Controls from "@/components/charades/Controls";
import TurnInfoBar from "@/components/charades/TurnInfoBar";
import RoundModal from "@/components/charades/RoundModal";

import type { GameInfoDto } from "@/types/charades";

import "./Play.css";

/**
 * 몸으로 말해요 - 게임 진행 페이지
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

  // 관리 화면으로 이동
  const handleGoManage = () => {
    navigate(`/game/charades/manage/${gameCode}`);
  };

  // 렌더링
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
          <main className="flex-column play-contents">
            <h2 className="sr-only">몸으로 말해요 - 플레이 화면</h2>

            <section className="play-section toolbar-section">
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
              <div className="toolbar-right">
                <span className="code">게임 코드: {gameData.code}</span>
                <CopyButton text={gameData.code} />
              </div>
            </section>

            <section className="play-section turn-info-section">
              <h3 className="sr-only">현재 진행 상황</h3>
              <TurnInfoBar
                mode={gameData.mode}
                teamName={currentTeam.name}
                roundIndex={currentInfo.roundIdx + 1}
                correctCount={currentTurn?.correctCount ?? 0}
                usedPass={currentTurn?.usedPass ?? 0}
                passLimit={gameData.passLimit}
                targetCount={gameData.targetCount ?? undefined}
              />
            </section>

            <section className="play-section timer-section">
              <h3 className="sr-only">타이머</h3>
              <Timer
                mode={gameData.mode}
                sec={timerSec}
                durationSec={gameData.durationSec}
              />
            </section>

            <section className="play-section word-section">
              <h3 className="sr-only">제시어</h3>
              <WordCard
                word={currentWord?.text ?? "단어 조회 실패"}
                index={wordIdx + 1}
                isVisible={isRunning}
              />
            </section>

            <section className="play-section control-section">
              <h3 className="sr-only">게임 컨트롤 패널</h3>
              <Controls
                isRunning={isRunning}
                canPass={
                  (currentTurn?.usedPass ?? 0) < gameData.passLimit
                }
                onStart={currentTurn ? handleRestartTurn : handleStartTurn}
                onPause={handlePauseTurn}
                onCorrect={handleCorrect}
                onPass={handlePass}
                onEndTurn={handleEndTurn}
              />
            </section>
          </main>

          {/* --- 턴 종료/최종 결과 모달 --- */}
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
