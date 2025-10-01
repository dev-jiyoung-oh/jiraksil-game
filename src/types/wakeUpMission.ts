// ========== 서버 응답 타입 ==========
export interface WakeUpMission {
    assignedPlayer: number;
    content: string;
}

export interface WakeUpMissionGame {
    code: string;
    wakeUpTime: string;
    missions: WakeUpMission[];
    contacts?: string; // "010-1111-2222,010-3333-4444"
}

// ========== 프론트 전용 타입 ==========

// UI에서 쓸 Mission 확장 타입
export interface WakeUpMissionMissionViewModel extends WakeUpMission {
    opened: boolean;
    viewed?: boolean; // Cards 화면에서는 사용, Manage 화면에서는 무시 가능
}

// UI 전용 Game 모델
export interface WakeUpMissionGameViewModel
    extends Omit<WakeUpMissionGame, "missions" | "contacts"> {
    missions: WakeUpMissionMissionViewModel[];
    contacts: string[];
}
