export type SuggestionGameType = "WAKE_UP_MISSION" | "CHARADES" | "OTHER";

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
