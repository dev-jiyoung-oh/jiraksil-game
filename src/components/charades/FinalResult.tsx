import "./FinalResult.css";
import type { CharadesTeam, BaseTurn } from "@/types/charades";
import { computeResults } from "@/utils/charades/computeResults";

interface Props {
  teams: CharadesTeam[];
  turns: BaseTurn[];
  showSaveButton?: boolean;
  onSave?: () => void;
}

export default function FinalResult({ teams, turns, showSaveButton = false, onSave }: Props) {
  const { winners, result } = computeResults(teams, turns);

  return (
    <div className="final-result-container flex-column">
      
      {/* 우승 섹션 */}
      <section className="winner-section">
        <h3 className="title">
          🏆 {winners.length > 1 ? "공동 우승 팀" : "우승 팀"} 🏆
        </h3>

        <ul className="list">
          {winners.map(w => (
            <li key={w.teamCode} className="item is-winner">
              <span className="team-name">{w.teamName}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* 최종 순위 섹션 */}
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
            {result.map(team => (
              <tr key={team.teamCode} className={team.rank === 1 ? "is-winner" : ""}>
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

      {/* 결과 저장 섹션 */}
      {showSaveButton && (
        <footer>
          <button type="button" className="btn modal-btn save" onClick={onSave}>
            결과 저장
          </button>
        </footer>
      )}
    </div>
  );
}
