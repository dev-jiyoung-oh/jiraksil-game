import "./RoundModal.css";
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

  onNext?: () => void;
  onSave?: () => void;
}

/** 팀별 최종 결과 계산 */
function computeResults(teams: CharadesTeam[], turns: FinalizeTurnRequest[]) {
  // 1) 팀별 집계
  const map = new Map<string, {
      teamCode: string;
      teamName: string;
      totalCorrect: number;
      totalTime: number;
      totalPass: number;
  }>();
  // 1-1) 초기화
  for (const t of teams) {
    map.set(t.code, {
      teamCode: t.code,
      teamName: t.name,
      totalCorrect: 0,
      totalTime: 0,
      totalPass: 0,
    });
  }
  // 1-2) 기록 누적
  for (const turn of turns) {
    const rec = map.get(turn.teamCode);
    if (!rec) continue;

    rec.totalCorrect += turn.correctCount ?? 0;
    rec.totalTime += turn.elapsedSec ?? turn.timeUsedSec ?? 0;
    rec.totalPass += turn.usedPass ?? 0;
  }
  
  // 2) 정렬
  const resultArray = Array.from(map.values()).sort((a, b) => {
    if (b.totalCorrect !== a.totalCorrect)
      return b.totalCorrect - a.totalCorrect; // 정답 큰 팀 우선
    if (a.totalTime !== b.totalTime)
      return a.totalTime - b.totalTime;       // 시간 적게 쓴 팀 우선
    return a.totalPass - b.totalPass;         // 패스 적은 팀 우선
  });

  // 3) 등수(rank) 계산 (동점 처리)
  let currentRank = 1;
  const ranked = resultArray.map((team, index) => {
    if (index === 0) {
      return { ...team, rank: 1 };
    }

    const prev = resultArray[index - 1];
    const isTie =
      team.totalCorrect === prev.totalCorrect &&
      team.totalTime === prev.totalTime &&
      team.totalPass === prev.totalPass;

    if (!isTie) {
      currentRank = index + 1;
    }

    return { ...team, rank: currentRank };
  });

  // 4) winner 결정 (rank === 1 모두)
  const winners = ranked.filter((t) => t.rank === 1);

  return {
    winners,
    result: ranked,
  };
}

export default function RoundModal({
  type,
  currentTeam,
  correctCount,
  usedPass,
  elapsedSec,
  teams,
  turns,
  onNext,
  onSave,
}: RoundModalProps) {
  if (!type) return null;

  const isIntermission = type === "INTERMISSION";
  const isFinished = type === "FINISHED";

  let finalResult: ReturnType<typeof computeResults> | null = null;

  if (isFinished && teams?.length && turns?.length) {
    finalResult = computeResults(teams, turns);
  }

  return (
    <div className="modal-backdrop">
      <div className="round-modal">

        {/* 공통 헤더 */}
        <h2 className="modal-title">
          {isIntermission ? "턴 종료" : "최종 결과"}
        </h2>

        {/* --- INTERMISSION --- */}
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
                    <th>걸린 시간</th>
                    <td>{elapsedSec}</td>
                  </tr>
                )}
              </tbody>
            </table>

            <button type="button" className="modal-btn" onClick={onNext}>
              다음 턴 시작 ▶
            </button>
          </section>
        )}

        {/* --- FINISHED --- */}
        {isFinished && finalResult && (
          <section className="finished-section">
            <section className="winner-section">
              <h3 className="title">🏆 {finalResult.winners.length > 1 ? "공동 우승 팀" : "우승 팀"} 🏆</h3>
              
              <ul className="list">
                {finalResult.winners.map(w => (
                    <li key={w.teamCode} className="item is-winner">
                      <span className="team-name">{w.teamName}</span>
                    </li>
                  ))}
              </ul>
            </section>

            <section className="result-section">
              <h4 className="title">최종 순위</h4>
              <table className="score-table">
                <thead>
                  <tr>
                    <th>순위</th>
                    <th>팀명</th>
                    <th>정답</th>
                    <th>걸린 시간(초)</th>
                    <th>패스</th>
                  </tr>
                </thead>

                <tbody>
                  {finalResult.result.map(team => (
                    <tr
                      key={team.teamCode}
                      className={team.rank === 1 ? "is-winner" : ""}
                    >
                      <td className="rank">{team.rank}</td>
                      <td className="name">{team.teamName}</td>
                      <td className="score">{team.totalCorrect}</td>
                      <td className="time">{team.totalTime}</td>
                      <td className="pass">{team.totalPass}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>

            <footer>
              <button type="button" className="btn modal-btn save" onClick={onSave}>
                결과 저장
              </button>
            </footer>
          </section>
        )}
      </div>
    </div>
  );
}
