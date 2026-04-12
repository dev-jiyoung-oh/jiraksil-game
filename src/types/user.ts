import type { GameMode, GameStatus } from "@/types/charades";
import type { GameType } from "@/types/common";

export interface UpdateProfileRequest {
  name: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface MyGameSummary {
  code: string;
  gameType: GameType;
  mode: GameMode | null;    // WAKE_UP_MISSION은 null
  status: GameStatus | null; // WAKE_UP_MISSION은 null
  createdAt: string; // ISO 8601
}

export interface MyGamesResponse {
  games: MyGameSummary[];
}
