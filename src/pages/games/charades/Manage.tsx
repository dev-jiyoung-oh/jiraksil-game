import { useParams } from "react-router-dom";
import { useMemo, useState } from "react";
import PasswordModal from "@/components/common/PasswordModal";
import FinalResult from "@/components/charades/FinalResult";
import { getGameManage } from "@/api/charades";
import { GAME_MODE_LABEL, GAME_STATUS_LABEL } from "@/utils/charades/labels";
import { formatDateTime } from "@/utils/date";
import type { GameManageResponse, TurnDto } from "@/types/charades";

import "./Manage.css";

export default function Manage() {
  const { gameCode } = useParams();
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

  // 비밀번호 제출
  const handlePasswordSubmit = async (password: string) => {
    try {
      setErrorMessage("");

      const data = await getGameManage(gameCode!, password);

      console.log('데이터!', data);
      // TODO
      if (data.gameInfo.code) {
        setGameData(data);
        setIsVerified(true);
      }
    } catch (err) {
      if (err instanceof Error) {
        setErrorMessage(err.message || "조회에 실패했습니다.");
      } else {
        setErrorMessage("알 수 없는 오류가 발생했습니다.");
      }
    }
  };

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
      <h2 className="manage-title">몸으로 말해요 - 관리 화면</h2>

      {/* 비밀번호 모달 */}
      {!isVerified && (
        <PasswordModal onSubmit={handlePasswordSubmit} errorMessage={errorMessage} />
      )}

      {/* 인증 성공 후 메인 UI */}
      {isVerified && gameData && (
        <main className="manage-contents">

          {/* 게임 정보 */}
          <section className="game-info-section">
            <h3>게임 정보</h3>
            <ul className="info-list">
              <li>
                <span className="key">게임 코드</span>
                <span className="value">{gameData.gameInfo.code}</span>
              </li>
              <li>
                <span className="key">모드</span>
                <span className="value">{GAME_MODE_LABEL[gameData.gameInfo.mode]}</span>
              </li>
              
              {gameData.gameInfo.mode === "LIMITED" && (
                <li>
                  <span className="key">제한 시간</span>
                  <span className="value">{gameData.gameInfo.durationSec}초</span>
                </li>
              )}

              {gameData.gameInfo.mode === "UNTIL_CLEAR" && (
                <li>
                  <span className="key">목표 정답 수</span>
                  <span className="value">{gameData.gameInfo.targetCount}</span>
                </li>
              )}

              <li>
                <span className="key">패스 제한</span>
                <span className="value">{gameData.gameInfo.passLimit}</span>
              </li>

              <li>
                <span className="key">팀당 라운드 수</span>
                <span className="value">{gameData.gameInfo.roundsPerTeam}</span>
              </li>

              <li>
                <span className="key">게임 상태</span>
                <span className="value">{GAME_STATUS_LABEL[gameData.gameInfo.status]}</span>
              </li>
            </ul>
          </section>


          {/* 카테고리 */}
          <section className="category-section">
            <h3>카테고리</h3>
            <ul className="category-list">
              {gameData.categoryMaster.map((cat) => {
                const isSelected = gameData.categories.some(
                  (c) => c.categoryCode === cat.code
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
          <section className="team-section">
            <h3>참여 팀</h3>
            <ul className="team-list">
              {gameData.gameInfo.teams.map((t) => (
                <li key={t.code} style={{ borderLeft: `8px solid ${t.colorHex}` }}>
                  {t.orderIndex + 1}번 — {t.name}
                </li>
              ))}
            </ul>
          </section>

          {/* 플레이 기록 */}
          <section className="play-section">
            <h3>플레이 기록</h3>

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
