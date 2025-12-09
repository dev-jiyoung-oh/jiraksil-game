import type { CharadesTeam, BaseTurn } from "@/types/charades";
import { computeResults } from "@/utils/charades/computeResults";

import "./FinalResult.css";

interface FinalResultProps {
  teams: CharadesTeam[];
  turns: BaseTurn[];
}

export default function FinalResult({ teams, turns }: FinalResultProps) {
  const { result } = computeResults(teams, turns);

  return (
    <div className="final-result-container flex-column">

      {/* 최종 순위 섹션 */}
      <section className="result-section">
        <h4 className="title sr-only">최종 순위</h4>

        <table className="score-table">
          <thead>
            <tr>
              <th>순위</th>
              <th>팀명</th>
              <th>정답</th>
              <th>패스</th>
              <th>걸린 시간(초)</th>
            </tr>
          </thead>

          <tbody>
            {result.map(team => (
              <tr key={team.teamCode} className={team.rank === 1 ? "is-winner" : ""}>
                <td className="rank">{team.rank}</td>
                <td className="name">{team.teamName}</td>
                <td className="score">{team.totalCorrect}</td>
                <td className="pass">{team.totalPass}</td>
                <td className="time">{team.totalTime}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
