import api from "./api";
import type {
    CreateGameRequest,
    WakeUpMissionGame,
} from "@/types/wakeUpMission";

// 게임 생성
export async function createGame(data: CreateGameRequest): Promise<WakeUpMissionGame> {
    const res = await api.post("/wake-up-mission", data);
    return res.data;
}

// 게임 정보 조회
export async function getGameData(gameCode: string, password: string): Promise<WakeUpMissionGame> {
    const res = await api.post(`/wake-up-mission/${gameCode}`, { password });
    return res.data;
}
