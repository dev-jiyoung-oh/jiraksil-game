import { useState, useMemo, useEffect } from "react";
import { useToast } from "@/components/common/toast/useToast";
import { useTimer } from "@/hooks/common/useTimer";
import { useWordPool } from "@/hooks/charades/useWordPool";
import { finalizeGame } from "@/api/charades";
import { toLocalDateTimeString } from "@/utils/date";

import type {
  GameInfoDto,
  GameStatus,
  CharadesTeam,
  WordDto,
  FinalizeTurnRequest,
  CurrentTurn,
} from "@/types/charades";

interface UseCharadesGameParams {
  gameData: GameInfoDto | null;
  gameCode: string | undefined;
  isVerified: boolean;
}

interface UseCharadesGameReturn {
  // 턴 정보
  currentTurn: (CurrentTurn & { turnIndex: number }) | null;
  turns: FinalizeTurnRequest[];
  currentInfo: {
    team: CharadesTeam | null;
    roundIdx: number;
    isLast: boolean;
  };

  // 타이머
  timerSec: number;
  isRunning: boolean;

  // 단어
  currentWord: WordDto | null;
  wordIdx: number;

  // 모달
  modalType: Extract<GameStatus, "INTERMISSION" | "FINISHED"> | null;
  showModal: boolean;
  isGameSaved: boolean;

  // 핸들러
  handleStartTurn: () => void;
  handleRestartTurn: () => void;
  handlePauseTurn: () => void;
  handleCorrect: () => void;
  handlePass: () => void;
  handleEndTurn: () => void;
  handleNextTurn: () => void;
  handleSaveGame: () => Promise<void>;
  handleRestartGame: () => void;
}

export function useCharadesGame({
  gameData,
  gameCode,
  isVerified,
}: UseCharadesGameParams): UseCharadesGameReturn {
  const { showToast } = useToast();

  // ── 턴 상태 ──
  const [currentTurn, setCurrentTurn] = useState<
    (CurrentTurn & { turnIndex: number }) | null
  >(null);
  const [turns, setTurns] = useState<FinalizeTurnRequest[]>([]);

  // ── 모달 상태 ──
  const [modalType, setModalType] = useState<
    Extract<GameStatus, "INTERMISSION" | "FINISHED"> | null
  >(null);
  const [showModal, setShowModal] = useState(false);
  const [isGameSaved, setIsGameSaved] = useState(false);

  // ── 현재 턴 정보 (팀/라운드/마지막 여부) ──
  const currentInfo = useMemo(() => {
    if (!gameData) return { team: null, roundIdx: 0, isLast: false };

    const totalTeams = gameData.teams.length;
    const turnIndex = turns.length;

    const teamIdx = turnIndex % totalTeams;
    const roundIdx = Math.floor(turnIndex / totalTeams);

    const maxRoundIdx = gameData.roundsPerTeam - 1;
    const safeRoundIdx = Math.min(roundIdx, maxRoundIdx);

    return {
      team: gameData.teams[teamIdx],
      roundIdx: safeRoundIdx,
      isLast: safeRoundIdx === maxRoundIdx && teamIdx === totalTeams - 1,
    };
  }, [turns, gameData]);

  // ── 턴 종료 객체 생성 ──
  const finalizeTurn = (elapsedSec: number) => {
    if (!currentTurn?.startedAt) return null;

    const ended = new Date();
    const { turnIndex, ...validTurn } = currentTurn;
    void turnIndex;

    return {
      ...validTurn,
      startedAt: toLocalDateTimeString(currentTurn.startedAt),
      endedAt: toLocalDateTimeString(ended),
      elapsedSec,
    } as FinalizeTurnRequest;
  };

  // ── 턴 종료 공통 로직 ──
  const endTurn = (elapsedSec: number, forceFinish: boolean = false) => {
    const finished = finalizeTurn(elapsedSec);
    if (!finished || !currentTurn) return;

    const idx = currentTurn.turnIndex;

    setTurns((prev) => {
      const next = [...prev];
      next[idx] = finished;
      return next;
    });

    timer.pause();
    setModalType(forceFinish || currentInfo.isLast ? "FINISHED" : "INTERMISSION");
    setShowModal(true);
  };

  // ── 타이머 ──
  const timer = useTimer({
    durationSec:
      gameData?.mode === "LIMITED"
        ? (gameData.durationSec ?? undefined)
        : undefined,
  });

  // 시간 만료 시 턴 종료
  useEffect(() => {
    if (timer.isTimeUp) {
      endTurn(gameData?.durationSec ?? 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timer.isTimeUp]);

  // ── 단어 풀 ──
  const wordPool = useWordPool({
    gameCode,
    enabled: isVerified,
  });

  // ── 단어 고갈 시 강제 종료 ──
  useEffect(() => {
    if (!gameData || !wordPool.isDepleted || !currentTurn) return;

    showToast({ message: "단어가 더 이상 없어 게임을 종료합니다." });
    endTurn(timer.sec, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wordPool.isDepleted]);

  // ── 핸들러 ──

  const handleStartTurn = () => {
    const { team: freshTeam, roundIdx: freshRound } = currentInfo;
    if (!freshTeam) return;

    const turnIndex = turns.length;

    setCurrentTurn({
      teamCode: freshTeam.code,
      roundIndex: freshRound,
      correctCount: 0,
      usedPass: 0,
      elapsedSec: 0,
      startedAt: new Date(),
      endedAt: null,
      words: [],
      turnIndex,
    });

    timer.reset();
    timer.start();
  };

  const handleRestartTurn = () => {
    timer.start();
  };

  const handlePauseTurn = () => {
    timer.pause();
  };

  const handleCorrect = () => {
    if (!gameData || !currentTurn || !wordPool.currentWord) return;

    const nextCorrect = currentTurn.correctCount + 1;

    setCurrentTurn((prev) => ({
      ...prev!,
      correctCount: nextCorrect,
      words: [
        ...prev!.words,
        {
          idx: prev!.words.length,
          wordId: wordPool.currentWord!.id,
          wordText: wordPool.currentWord!.text,
          action: "CORRECT",
          atSec: timer.sec,
        },
      ],
    }));

    // UNTIL_CLEAR 모드 종료 조건 체크
    if (gameData.mode === "UNTIL_CLEAR") {
      const target = gameData.targetCount;
      if (target != null && nextCorrect >= target) {
        endTurn(timer.sec);
        return;
      }
    }

    wordPool.advance();
  };

  const handlePass = () => {
    if (!gameData || !currentTurn || !wordPool.currentWord) return;
    if (currentTurn.usedPass >= gameData.passLimit) {
      showToast({ message: "패스 제한을 초과했습니다." });
      return;
    }

    setCurrentTurn((prev) => ({
      ...prev!,
      usedPass: prev!.usedPass + 1,
      words: [
        ...prev!.words,
        {
          idx: prev!.words.length,
          wordId: wordPool.currentWord!.id,
          wordText: wordPool.currentWord!.text,
          action: "PASS",
          atSec: timer.sec,
        },
      ],
    }));

    wordPool.advance();
  };

  const handleEndTurn = () => {
    endTurn(timer.sec);
  };

  const handleNextTurn = () => {
    setShowModal(false);
    wordPool.advance();
    handleStartTurn();
  };

  const handleSaveGame = async () => {
    if (!gameData) return;

    try {
      await finalizeGame(gameData.code, { turns });
      showToast({
        message: "게임 결과 저장을 완료했습니다.",
        type: "success",
      });
      setIsGameSaved(true);
    } catch {
      showToast({
        message: "게임 결과 저장 중 오류가 발생했습니다.",
        type: "error",
      });
    }
  };

  const handleRestartGame = () => {
    timer.reset();
    setTurns([]);
    setCurrentTurn(null);
    setShowModal(false);
    setModalType(null);
    setIsGameSaved(false);
  };

  return {
    currentTurn,
    turns,
    currentInfo,

    timerSec: timer.sec,
    isRunning: timer.isRunning,

    currentWord: wordPool.currentWord,
    wordIdx: wordPool.wordIdx,

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
  };
}
