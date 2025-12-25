// ========== 서버 응답 타입 ==========

export type GameMode = "LIMITED" | "UNTIL_CLEAR";

export type GameStatus =
    | "READY"
    | "PLAYING"
    | "PAUSED"
    | "INTERMISSION"
    | "FINISHED";

export type TurnAction = "CORRECT" | "PASS";

export interface CharadesTeam {
    code: string;       // 팀 코드 (A, B, C...)
    name: string;       // 팀 이름
    color: string;      // 색상 키 (예: BLUE)
    colorHex: string;   // HEX 값 (#3B82F6)
    score: number;      // 점수
    orderIndex: number; // 진행 순서
}

export interface CategoryDto {
    code: string;
    name: string;
}

export interface BaseTurn {
    teamCode: string;
    roundIndex: number;
    correctCount: number;
    usedPass: number;
    elapsedSec: number;
    startedAt: string;
    endedAt: string;
}

export interface TurnDto extends BaseTurn {
    code: string;
    teamName: string;
    playNo: number;
}

export interface WordDto {
    id: number;
    text: string;
    description: string;
}

export interface TurnWordDto {
    idx: number;
    wordId?: number;
    wordText: string;
    action: TurnAction;
    atSec: number;
}

export interface CurrentDto {
    teamIndex: number;  // 현재 진행 중인 팀 인덱스
    roundIndex: number; // 현재 라운드 인덱스
}

export interface CreateGameRequest {
    mode: GameMode;
    durationSec?: number;
    targetCount?: number;
    passLimit: number;
    roundsPerTeam: number;
    categoryCodes?: string[];
    teamNames?: string[];
    password: string;
}

export interface UpdateTeamDto {
  code: string | null;
  name: string;
}

export interface UpdateGameRequest {
    mode: GameMode;
    durationSec?: number;
    targetCount?: number;
    passLimit: number;
    roundsPerTeam: number;
    categoryCodes?: string[];
    teams: UpdateTeamDto[];
    password: string;
}

export interface GameInfoDto {
    code: string;
    mode: GameMode;
    durationSec: number | null;
    targetCount: number | null;
    passLimit: number;
    roundsPerTeam: number;
    status: GameStatus;
    teams: CharadesTeam[];
    categories: CategoryDto[];
}

export interface WordBatchResponse {
    words: WordDto[];
}

export interface FinalizeTurnRequest extends BaseTurn {
    words: TurnWordDto[];
}

export interface FinalizeGameRequest {
    turns: FinalizeTurnRequest[];
}

export interface GameManageResponse {
    gameInfo: GameInfoDto;
    categoryMaster: CategoryDto[];
    turns: TurnDto[];
}

// ========== 프론트 전용 타입 ==========

export interface CharadesGameViewModel extends GameInfoDto {
    timer?: number;
}

export type CurrentTurn = Omit<FinalizeTurnRequest, "startedAt" | "endedAt">
& {
    startedAt: Date | null;
    endedAt: Date | null;
};
