import { useEffect, useMemo, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { getGameManage } from "@/api/charades";
import CopyButton from "@/components/common/CopyButton";
import GameAccessModal from "@/components/common/GameAccessModal";
import FinalResult from "@/components/charades/FinalResult";
import { GAME_MODE_LABEL } from "@/utils/charades/labels";
import { formatDateTime } from "@/utils/date";
import type { GameManageResponse, TurnDto } from "@/types/charades";

import "./Manage.css";

/**
 * 몸으로 말해요 - 게임 관리 페이지
 */
export default function Manage() {
  const { gameCode } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const hasCode = !!gameCode;
  const initialData = location.state as GameManageResponse | undefined;

  // 게임 정보
  const [gameData, setGameData] = useState<GameManageResponse | null>(null);

  // 게임 턴 정보(플레이 번호로 그룹핑)
  const groupedTurns = useMemo(() => {
    if (!gameData?.turns) return [];
    return groupTurnsByPlayNo(gameData.turns);
  }, [gameData?.turns]);

  // 인증 관련
  const [isVerified, setIsVerified] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");


  useEffect(() => {
    if (initialData) {
      setGameData(initialData);
      setIsVerified(true);
      return;
    }

    if (!gameCode) {
      setIsVerified(false);
      return;
    }

    setIsVerified(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameCode]);

  // 인증 요청
  const handleAccessSubmit = async (code: string, password: string) => {
    try {
      setErrorMessage("");

      const data = await getGameManage(code, password);

      if (gameCode) {
        setGameData(data);
        setIsVerified(true);
      } else {
        navigate(`/game/charades/manage/${data.gameInfo.code}`, {
          replace: true,
          state: data,
        });
      }
      
    } catch (err) {
      if (err instanceof Error) {
        setErrorMessage(err.message || "조회에 실패했습니다.");
      } else {
        setErrorMessage("알 수 없는 오류가 발생했습니다.");
      }
    }
  };

  // 플레이 화면으로 이동
  function handleGoPlay() {
    if (!gameCode || !gameData?.gameInfo) return;

    navigate(`/game/charades/play/${gameCode}`, {
      state: gameData.gameInfo,
    });
  }

  // 턴 플레이 번호(playNo)로 그룹화
  function groupTurnsByPlayNo(turns: TurnDto[]) {
    const map = new Map<number, TurnDto[]>();

    turns.forEach((t) => {
      if (!map.has(t.playNo)) {
        map.set(t.playNo, []);
      }
      map.get(t.playNo)!.push(t);
    });

    // 그룹 정렬
    return Array.from(map.entries())
      .sort((a, b) => a[0] - b[0]) // playNo 오름차순으로 그룹 정렬
      .map(([playNo, items]) => ({
        playNo,
        turns: items.sort((a, b) => a.roundIndex - b.roundIndex) // roundIndex 오름차순으로 그룹 내부 정렬
      }));
  }


  // 렌더링
  return (
    <div className="manage-container">

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

      {/* 인증 성공 후 메인 UI */}
      {isVerified && gameData && (
        <main className="manage-contents">

          <h2 className="manage-title">몸으로 말해요 - 관리 화면</h2>

          {/* 게임 정보 */}
          <section className="manage-section game-info-section">
            <header className="game-info-header">
              <div className="header-left">
                <h3 className="section-title">게임 정보</h3>
              </div>
              <div className="header-right">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleGoPlay}
                >
                  플레이 화면으로 이동
                </button>
              </div>
            </header>
            <ul className="game-info-list">
              <li className="info-item">
                <span className="info-label">게임 코드</span>
                <div className="info-row">
                  <span className="info-value">{gameData.gameInfo.code}</span>
                  <CopyButton text={gameData.gameInfo.code} />
                </div>
              </li>

              <li className="info-item">
                <span className="info-label">모드</span>
                <span className="info-value">{GAME_MODE_LABEL[gameData.gameInfo.mode]}</span>
              </li>

              {gameData.gameInfo.mode === "LIMITED" && (
                <li className="info-item">
                  <span className="info-label">제한 시간</span>
                  <span className="info-value">{gameData.gameInfo.durationSec}초</span>
                </li>
              )}

              {gameData.gameInfo.mode === "UNTIL_CLEAR" && (
                <li className="info-item">
                  <span className="info-label">목표 정답 수</span>
                  <span className="info-value">{gameData.gameInfo.targetCount}</span>
                </li>
              )}

              <li className="info-item">
                <span className="info-label">패스 제한</span>
                <span className="info-value">{gameData.gameInfo.passLimit}</span>
              </li>

              <li className="info-item">
                <span className="info-label">팀당 라운드 수</span>
                <span className="info-value">{gameData.gameInfo.roundsPerTeam}</span>
              </li>

              {/* <li className="info-item">
                <span className="info-label">게임 상태</span>
                <span className="info-value">{GAME_STATUS_LABEL[gameData.gameInfo.status]}</span>
              </li> */}
            </ul>
          </section>


          {/* 카테고리 */}
          <section className="manage-section category-section">
            <h3 className="section-title">카테고리</h3>
            <ul className="category-list">
              {gameData.categoryMaster.map((cat) => {
                const isSelected = gameData.gameInfo.categories.some(
                  (c) => c.code === cat.code
                );

                return (
                  <li
                    key={cat.code}
                    className={`category-chip ${isSelected ? "selected" : ""}`}
                  >
                    {cat.name}
                  </li>
                );
              })}
            </ul>
          </section>

          {/* 팀 목록 */}
          <section className="manage-section team-section">
            <h3 className="section-title">참여 팀</h3>
            <ul className="team-list">
              {gameData.gameInfo.teams.map((t) => (
                <li key={t.code} style={{ borderLeft: `8px solid ${t.colorHex}` }}>
                  {t.orderIndex + 1}번 — {t.name}
                </li>
              ))}
            </ul>
          </section>

          {/* 플레이 기록 */}
          <section className="manage-section play-section">
            <h3 className="section-title">플레이 기록</h3>

            {groupedTurns.map(({ playNo, turns }) => {
              const startedAt = turns[0].startedAt;

              return (
                <article key={playNo} className="play-group">
                  <header className="play-info">
                    <h4 className="play-no">플레이 #{playNo}</h4>
                    {startedAt && (
                      <span className="start-date">
                        {formatDateTime(startedAt)}
                      </span>
                    )}
                  </header>
                  <FinalResult
                    teams={gameData.gameInfo.teams}
                    turns={turns}
                  />
                </article>
              );
            })}
          </section>

        </main>
      )}
    </div>
  );
}
