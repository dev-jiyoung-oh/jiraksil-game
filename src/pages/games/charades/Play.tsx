import { useEffect, useState, useMemo } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import CopyButton from "@/components/common/CopyButton";
import GameAccessModal from "@/components/common/GameAccessModal";
import { toLocalDateTimeString } from "@/utils/date";

import {
  getGameDetail,
  getWordBatch,
  finalizeGame,
} from "@/api/charades";

import type {
  GameInfoDto,
  WordDto,
  FinalizeTurnRequest,
  GameStatus,
  CurrentTurn,
} from "@/types/charades";

import Timer from "@/components/charades/Timer";
import WordCard from "@/components/charades/WordCard";
import Controls from "@/components/charades/Controls";
import TurnInfoBar from "@/components/charades/TurnInfoBar";
import RoundModal from "@/components/charades/RoundModal";

import "./Play.css";

/**
 * 몸으로 말해요 - 게임 진행 페이지
 */
export default function Play() {
  const { gameCode } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const hasCode = !!gameCode;

  /** 게임 생성 후 전달된 초기 데이터 (새로고침 시엔 존재 X) */
  const initialData = location.state as GameInfoDto | undefined;

  // 게임 상세 정보
  const [gameData, setGameData] = useState<GameInfoDto | null>(initialData ?? null);

  // 인증 관련
  const [isVerified, setIsVerified] = useState(!!initialData || false);
  const [errorMessage, setErrorMessage] = useState("");

  // 단어 배치
  const [words, setWords] = useState<WordDto[]>([]);
  const [noMoreWords, setNoMoreWords] = useState(false);
  const [isLoadingWords, setIsLoadingWords] = useState(false);
  const [wordIdx, setWordIdx] = useState(0);
  // 현재 턴 정보
  const [currentTurn, setCurrentTurn] = useState<CurrentTurn | null>(null);
  // 전체 턴 기록(누적)
  const [turns, setTurns] = useState<FinalizeTurnRequest[]>([]);
  // 모달 상태
  const [modalType, setModalType] = useState<Extract<GameStatus,"INTERMISSION" | "FINISHED"> | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isGameSaved, setIsGameSaved] = useState(false);
  // 타이머 상태
  const [isRunning, setIsRunning] = useState(false);
  const [timerSec, setTimerSec] = useState(0);
  // 현재 턴 정보 (팀/라운드/마지막 여부)
  const currentInfo = useMemo(() => {
    if (!gameData) return { team: null, roundIdx: 0, isLast: false };

    const totalTeams = gameData.teams.length;
    const turnIndex = turns.length;

    const teamIdx = turnIndex % totalTeams;
    const roundIdx = Math.floor(turnIndex / totalTeams);

    // 라운드 최대값 제한 (마지막 턴 이후 라운드 증가 방지)
    const maxRoundIdx = gameData.roundsPerTeam - 1;
    const safeRoundIdx = Math.min(roundIdx, maxRoundIdx);

    return {
      team: gameData.teams[teamIdx],
      roundIdx: safeRoundIdx,
      isLast: safeRoundIdx === maxRoundIdx && teamIdx === totalTeams - 1,
    };
  }, [turns, gameData]);


  // 초기 로딩
  useEffect(() => {
    if (initialData) {
      // 게임 생성 후 / 인증 후
      setGameData(initialData);
      setIsVerified(true);
      return;
    }
    
    // URL 접근인데 state 없음 → 코드/비번 인증 필요
    if (!gameCode) {
      setIsVerified(false);
      return;
    }
    
    // 코드만 있음 → 비번 인증 필요
    setIsVerified(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameCode]);

  // 인증 완료 후 데이터 로드
  useEffect(() => {
    if (isVerified && gameCode) {
      loadMoreWords();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVerified, gameCode]);

  // 타이머 동작
  useEffect(() => {
    if (!isRunning || !currentTurn) return;

    const id = setInterval(() => {
      setTimerSec(sec => {
        const next = sec + 1;

        // LIMITED 자동 종료 감지
        if (gameData?.mode === "LIMITED") {
          const duration = gameData.durationSec ?? 0;

          if (next >= duration) {
            clearInterval(id);
            handleEndTurn();
            return duration;
          }
        }

        return next;
      });
    }, 1000);

    return () => clearInterval(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning, currentTurn, gameData]);

  // 단어 부족 시 자동 로딩
  useEffect(() => {
    if (!words) return;
    if (noMoreWords) return;
    if (wordIdx < words.length - 50) return;

    loadMoreWords();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wordIdx, words, noMoreWords]);

  // 서버 단어 고갈 시 게임 종료
  useEffect(() => {
    if (!gameData || !words) return;
    if (!noMoreWords) return;
    if (wordIdx < words.length) return;

    alert("단어가 더 이상 없어 게임을 종료합니다.");
    forceEndGame();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameData, wordIdx, words, noMoreWords]);

  // 인증 요청
  const handleAccessSubmit = async (code: string, password: string) => {
    setErrorMessage("");
    
    try {
      const data = await getGameDetail(code, password);

      if (gameCode) {
        setGameData(data);
        setIsVerified(true);
        loadMoreWords();
      } else {
        navigate(`/game/charades/play/${data.code}`, { replace: true, state: data });
      }

    } catch (err) {
      if (err instanceof Error) {
        setErrorMessage(err.message || "조회에 실패했습니다.");
      } else {
        setErrorMessage("알 수 없는 오류가 발생했습니다.");
      }
    }
  };

  // 단어 조회
  async function loadMoreWords() {
    if (isLoadingWords || !gameCode || noMoreWords) return;

    setIsLoadingWords(true);

    try {
      const exclude = words ? words.map(w => w.id) : undefined;
      const batch = await getWordBatch(gameCode, { exclude: exclude });

      // TODO limit 미만으로 변경
      if (batch.words.length === 0) {
        setNoMoreWords(true);
        return;
      }

      setWords(prev => [...prev, ...batch.words]);

    } finally {
      setIsLoadingWords(false);
    }
  }

  // 턴 시작
  const handleStartTurn = () => {
    const { team: freshTeam, roundIdx: freshRound } = currentInfo;
    if (!freshTeam) return;

    setCurrentTurn({
      teamCode: freshTeam.code,
      roundIndex: freshRound,
      correctCount: 0,
      usedPass: 0,
      elapsedSec: 0,
      startedAt: new Date(),
      endedAt: null,
      words: [],
    });
    
    setTimerSec(0);
    setIsRunning(true);
  };

  // 턴 재시작
  const handleRestartTurn = () => {
    setIsRunning(true);
  };

  // 턴 일시정지
  const handlePauseTurn = () => {
    setIsRunning(false);
  };

  // 턴 종료 객체 생성
  const finalizeTurn = () => {
    if (!currentTurn?.startedAt) return null;

    setIsRunning(false);
    const ended = new Date();

    return {
      ...currentTurn,
      startedAt: toLocalDateTimeString(currentTurn.startedAt),
      endedAt: toLocalDateTimeString(ended),
      elapsedSec: timerSec,
    } as FinalizeTurnRequest;
  };

  // 턴 종료 (정상 종료)
  const handleEndTurn = () => {
    const currentTurn = finalizeTurn();
    if (!currentTurn) return;

    // 누적 기록 push
    setTurns(prev => [...prev, currentTurn]);

    const { isLast } = currentInfo;

    setModalType(isLast ? "FINISHED" : "INTERMISSION");
    setShowModal(true);
  };

  // 게임 강제 종료
  const forceEndGame = () => {
    const finishedTurn = finalizeTurn();
    if (!finishedTurn) return;

    setTurns(prev => [...prev, finishedTurn]);
    
    setModalType("FINISHED");
    setShowModal(true);
  };

  // 다음 턴 실행
  const handleNextTurn = async () => {
    setShowModal(false);
    setWordIdx(i => i + 1);
    handleStartTurn();
  };
  
  // 정답
  const handleCorrect = () => {
    if (!gameData || !currentTurn || !words || !words[wordIdx]) return;

    // 정답 1 증가한 값 계산 (setState 비동기 대비)
    const nextCorrect = currentTurn.correctCount + 1;

    setCurrentTurn(prev => ({
      ...prev!,
      correctCount: prev!.correctCount + 1,
      words: [
        ...prev!.words,
        {
          idx: prev!.words.length,
          wordId: words[wordIdx].id,
          wordText: words[wordIdx].text,
          action: "CORRECT",
          atSec: timerSec,
        },
      ]
    }));

    // UNTIL_CLEAR 모드 종료 조건 체크
    if (gameData.mode === "UNTIL_CLEAR") {
      const target = gameData.targetCount;
      
      if (target == null) {
        console.error("UNTIL_CLEAR 모드인데 targetCount 없음!");
        return;
      }

      if (nextCorrect >= target) {
        // 턴 즉시 종료
        handleEndTurn();
        return;
      }
    }

    // 다음 단어로 이동
    setWordIdx(i => i + 1);
  };

  // 패스
  const handlePass = () => {
    if (!gameData || !currentTurn || !words || !words[wordIdx]) return;
    if (currentTurn.usedPass >= gameData.passLimit) {
      alert("패스 제한을 초과했습니다."); // TODO 토스트 알림
      return;
    }

    setCurrentTurn(prev => ({
      ...prev!,
      usedPass: prev!.usedPass + 1,
      words: [
        ...prev!.words,
        {
          idx: prev!.words.length,
          wordId: words[wordIdx].id,
          wordText: words[wordIdx].text,
          action: "PASS",
          atSec: timerSec,
        },
      ]
    }));

    setWordIdx(i => i + 1);
  };

  // 게임 종료 저장
  const handleSaveGame = async () => {
    if (!gameData) return;

    try {
      await finalizeGame(gameData.code, { turns });
      alert("게임 결과 저장 완료!"); // TODO 토스트 팝업
      setIsGameSaved(true);
    } catch {
      alert("결과 저장 중 오류 발생!");
    }
  };

  // 게임 재시작
  const handleRestartGame = () => {
    // 현재 턴 중지
    setIsRunning(false);

    // 기록 초기화
    setTurns([]);
    setCurrentTurn(null);

    // 모달/저장 관련 초기화
    setShowModal(false);
    setModalType(null);
    setIsGameSaved(false);

    // 타이머 초기화
    setTimerSec(0);
  };


  // 관리 화면으로 이동
  const handleGoManage = () => {
    navigate(`/game/charades/manage/${gameCode}`);
  };

  // 현재 팀 정보
  const currentTeam = gameData?.teams.find(t => t.code === currentTurn?.teamCode) || currentInfo.team;
    
  // 렌더링
  return (
    <div className="play-container">

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
          {/* --- 게임 코드 복사 --- */}
          <div className="code-copy-box">
            <span className="code">게임 코드: {gameData.code}</span>
            <CopyButton text={gameData.code} />
          </div>

          {/* --- 상단 정보 바 --- */}
          <TurnInfoBar
            mode={gameData.mode}
            teamName={currentTeam.name}
            roundIndex={currentInfo.roundIdx + 1}
            correctCount={currentTurn?.correctCount ?? 0}
            usedPass={currentTurn?.usedPass ?? 0}
            passLimit={gameData.passLimit}
            targetCount={gameData.targetCount ?? undefined}
          />

          {/* --- 타이머 --- */}
          <Timer mode={gameData.mode} sec={timerSec} durationSec={gameData.durationSec} />

          {/* --- 제시어 --- */}
          <WordCard
            word={words[wordIdx]?.text ?? "단어 조회 실패"}
            index={wordIdx + 1}
            isVisible={isRunning}
          />

          {/* --- 게임 컨트롤 패널 --- */}
          <Controls
            isRunning={isRunning}
            canPass={(currentTurn?.usedPass ?? 0) < gameData.passLimit}
            onStart={currentTurn ? handleRestartTurn : handleStartTurn}
            onPause={handlePauseTurn}
            onCorrect={handleCorrect}
            onPass={handlePass}
            onEndTurn={handleEndTurn}
          />

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
              onRestart={modalType === "FINISHED" ? handleRestartGame : undefined}
              onGoManage={modalType === "FINISHED" ? handleGoManage : undefined}
            />
          )}
        </>
      )}
    </div>
  );
}
