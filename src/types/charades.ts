// ========== 서버 응답 타입 ==========

export interface CharadesTeam {
    code: string;       // 팀 코드 (A, B, C...)
    name: string;       // 팀 이름
    color: string;      // 색상 키 (예: BLUE)
    colorHex: string;   // HEX 값 (#3B82F6)
    score: number;      // 점수
    orderIndex: number; // 진행 순서
}

export interface CharadesCurrent {
    teamIndex: number;  // 현재 진행 중인 팀 인덱스
    roundIndex: number; // 현재 라운드 인덱스
}

export type GameMode = "LIMITED" | "UNTIL_CLEAR";

export type GameStatus =
    | "READY"
    | "PLAYING"
    | "PAUSED"
    | "INTERMISSION"
    | "FINISHED";

export interface GameSnapshotResponse {
    code: string;
    mode: GameMode;
    durationSec: number | null;
    targetCount: number | null;
    passLimit: number;
    roundsPerTeam: number;
    status: GameStatus;
    teams: CharadesTeam[];
    current: CharadesCurrent;
}

export interface GameResultResponse {
    code: string;
    teams: CharadesTeam[];
}

export interface WordDto {
    id: number;
    text: string;
    description: string;
}

export interface WordBatchResponse {
    words: WordDto[];
}

export interface TurnWordRequest {
    idx?: number;
    wordId?: number;
    wordText: string;
    action: "CORRECT" | "PASS";
    atSec: number;
}

export interface FinalizeTurnRequest {
    timeUsedSec?: number;
    elapsedSec?: number;
    correctCount?: number;
    usedPass?: number;
    turnWords?: TurnWordRequest[];
}

export interface CreateGameRequest {
    teamNames?: string[];
    options: {
        mode: GameMode;
        durationSec?: number;
        targetCount?: number;
        passLimit: number;
        roundsPerTeam: number;
        categoryCodes?: string[];
    };
}

export interface CreateGameResponse {
    code: string;
}

// ========== 프론트 전용 타입 ==========

export interface CharadesGameViewModel extends GameSnapshotResponse {
    timer?: number; // 프론트에서 사용하는 남은 시간 표시용 (UI 전용)
}
