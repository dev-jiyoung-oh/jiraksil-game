import type { GameMode, GameStatus, TurnAction } from "@/types/charades";

export const GAME_MODE_LABEL: Record<GameMode, string> = {
  LIMITED: "제한 시간 모드",
  UNTIL_CLEAR: "목표 달성 모드",
};

export const GAME_STATUS_LABEL: Record<GameStatus, string> = {
  READY: "대기 중",
  PLAYING: "진행 중",
  PAUSED: "일시 중지됨",
  INTERMISSION: "휴식 시간",
  FINISHED: "종료됨",
};

export const TURN_ACTION_LABEL: Record<TurnAction, string> = {
  CORRECT: "정답",
  PASS: "패스",
};
