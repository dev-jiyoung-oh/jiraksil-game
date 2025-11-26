import type { CharadesTeam, BaseTurn } from "@/types/charades";

/** 팀별 최종 결과 계산 */
export function computeResults(teams: CharadesTeam[], turns: BaseTurn[]) {
  const map = new Map<string, {
      teamCode: string;
      teamName: string;
      totalCorrect: number;
      totalTime: number;
      totalPass: number;
  }>();
  
  // 초기화
  for (const t of teams) {
    map.set(t.code, {
      teamCode: t.code,
      teamName: t.name,
      totalCorrect: 0,
      totalTime: 0,
      totalPass: 0,
    });
  }

  // 기록 누적
  for (const turn of turns) {
    const rec = map.get(turn.teamCode);
    if (!rec) continue;

    rec.totalCorrect += turn.correctCount ?? 0;
    rec.totalTime += turn.elapsedSec ?? 0;
    rec.totalPass += turn.usedPass ?? 0;
  }
  
  // 정렬: 정답(내림차순) → 시간(오름차순) → 패스(오름차순)
  const resultArray = Array.from(map.values()).sort((a, b) => {
    if (b.totalCorrect !== a.totalCorrect)
      return b.totalCorrect - a.totalCorrect;
    if (a.totalTime !== b.totalTime)
      return a.totalTime - b.totalTime;
    return a.totalPass - b.totalPass;
  });

  // 등수 처리
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

  const winners = ranked.filter((t) => t.rank === 1);

  return {
    winners,
    result: ranked,
  };
}