import { GAME_LABELS } from "@/types/common";

export type SuggestionGameType = "WAKE_UP_MISSION" | "CHARADES" | "OTHER";

export const SUGGESTION_GAME_TYPE_LABELS: Record<SuggestionGameType, string> = {
  ...GAME_LABELS,
  OTHER: "기타",
};

export interface SuggestionRequest {
  gameType: SuggestionGameType;
  content: string;
  authorName: string;
}

export interface SuggestionDto {
  id: number;
  gameType: SuggestionGameType;
  content: string;
  authorName: string;
  createdAt: string;
}
