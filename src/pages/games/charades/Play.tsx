import { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';

import {
  getGameDetail,
  getWordBatch,
  finalizeGame,
} from "@/api/charades";

import type {
  GameDetailResponse,
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

/**
 * 몸으로 말해요 - 게임 메인 진행 페이지
 */
export default function Play() {
  const { gameCode } = useParams();

  // 게임 상세 정보
  const [gameData, setGameData] = useState<GameDetailResponse | null>(null);
  // 단어 배치
  const [words, setWords] = useState<WordDto[] | null>(null);
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
  // 타이머 상태
  const [isRunning, setIsRunning] = useState(false);
  const [timerSec, setTimerSec] = useState(0);

  // 초기 로딩
  useEffect(() => {
    if (!gameCode) return;

    getGameDetail(gameCode)
      .then(data => {
        setGameData(data);
        return loadMoreWords();
      })
      .catch(err => {
        alert("게임 정보를 불러오지 못했습니다.");
        console.log(err.message); // TODO 삭제
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameCode]);

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
    handleEndTurn();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameData, wordIdx, words, noMoreWords]);

  // 단어 조회
  async function loadMoreWords() {
    if (isLoadingWords || noMoreWords) return;

    setIsLoadingWords(true);

    try {
      const exclude = words ? words.map(w => w.id) : undefined;
      const batch = await getWordBatch(gameCode!, { exclude: exclude });

      // TODO limit 미만으로 변경
      if (batch.words.length === 0) {
        setNoMoreWords(true);
        return;
      }

      setWords(prev => [...(prev ?? []), ...batch.words]);

    } finally {
      setIsLoadingWords(false);
    }
  }

  /*
  // 데이터 준비 안된 경우
  if (!gameData || !words || !currentTeam) {
    return <p>게임 준비중...</p>;
  }
  */

  // 현재 턴에서의 팀/라운드 계산
  function calcCurrentTeamInfo() {
    if (!gameData) return { team: null, roundIdx: 0 };

    const totalTeams = gameData.teams.length;
    const turnIndex = turns.length;

    const teamIdx = turnIndex % totalTeams;
    const roundIdx = Math.floor(turnIndex / totalTeams);

    return {
      team: gameData.teams[teamIdx],
      roundIdx,
      isLast: roundIdx === gameData.roundsPerTeam - 1 && teamIdx === totalTeams - 1,
    };
  }

  const { team: currentTeam, roundIdx } = calcCurrentTeamInfo();
  
  if (!gameData || !currentTeam || !words || words.length === 0) {
    return <p>게임 준비중...</p>;
  }

  // 턴 시작
  const handleStartTurn = () => {
    // 최신 팀/라운드 다시 계산
    const { team: freshTeam, roundIdx: freshRound } = calcCurrentTeamInfo();
    if (!freshTeam) return;

    setCurrentTurn({
      teamCode: freshTeam.code,
      roundIndex: freshRound,
      correctCount: 0,
      usedPass: 0,
      timeUsedSec: gameData.mode === "LIMITED" ? 0 : undefined,
      elapsedSec: gameData.mode === "UNTIL_CLEAR" ? 0 : undefined,
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

  // 턴 종료
  const handleEndTurn = () => {
    if (!currentTurn?.startedAt) return;

    setIsRunning(false);
    const ended = new Date();

    const { isLast: freshIsLast } = calcCurrentTeamInfo();

    const finishedTurn: FinalizeTurnRequest = {
      ...currentTurn,
      startedAt: currentTurn.startedAt!.toISOString(),
      endedAt: ended.toISOString(),
      timeUsedSec: gameData.mode === "LIMITED" ? timerSec : undefined,
      elapsedSec: gameData.mode === "UNTIL_CLEAR" ? timerSec : undefined,
    };
    
    // 누적 기록 push
    setTurns(prev => [...prev, finishedTurn]);

    setModalType(freshIsLast ? "FINISHED" : "INTERMISSION");
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
    if (!currentTurn || !words[wordIdx]) return;

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

    setWordIdx(i => i + 1);
  };

  // 패스
  const handlePass = () => {
    if (!currentTurn || !words[wordIdx]) return;
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
  const handleFinishGame = async () => {
    if (!gameData) return;

    try {
      await finalizeGame(gameData.code, { turns });
      //alert("게임 결과 저장 완료!");
    } catch {
      alert("결과 저장 중 오류 발생!");
    }
  };

  // 렌더링
  return (
    <div className="play-container">

      {/* --- 상단 정보 바 --- */}
      <TurnInfoBar
        mode={gameData.mode}
        teamName={currentTeam.name}
        roundIndex={roundIdx + 1}
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

          teams={modalType === "FINISHED" ? gameData.teams : undefined}
          turns={modalType === "FINISHED" ? turns : undefined}
          onSave={modalType === "FINISHED" ? handleFinishGame : undefined}
        />
      )}
    </div>
  );
}
