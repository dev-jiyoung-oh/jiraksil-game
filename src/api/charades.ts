import api from "./api";
import type {
    CategoryDto,
    CreateGameRequest,
    UpdateGameRequest,
    GameInfoDto,
    WordBatchResponse,
    FinalizeGameRequest,
    GameManageResponse,
} from "@/types/charades";

// 게임 생성
export async function createGame(data: CreateGameRequest): Promise<GameInfoDto> {
    const res = await api.post("/charades", data);
    return res.data;
}

// 게임 수정
export async function updateGame(gameCode: string, data: UpdateGameRequest): Promise<GameInfoDto> {
    const res = await api.put(`/charades/${gameCode}`, data);
    return res.data;
}

// 카테고리 조회
export async function getCateories(): Promise<CategoryDto[]> {
    const res = await api.get("/charades/categories");
    return res.data;
}

// 게임 정보 조회
export async function getGameDetail(gameCode: string, password: string): Promise<GameInfoDto> {
    const res = await api.post(`/charades/${gameCode}`, { password });
    return res.data;
}

// 단어 배치 조회
export async function getWordBatch(
    gameCode: string,
    opts?: {
      limit?: number;
      exclude?: number[];
    }
): Promise<WordBatchResponse> {
    const params: Record<string, number | number[]> = {};

    if (opts?.limit) params.limit = opts.limit;
    if (opts?.exclude && opts.exclude.length > 0) params.exclude = opts.exclude;

    const res = await api.get(`/charades/${gameCode}/word-batch`, { params });
    return res.data;
}

// 최종 게임 결과 저장
export async function finalizeGame(gameCode: string, payload: FinalizeGameRequest): Promise<void> {
    await api.post(`/charades/${gameCode}/finalize`, payload);
}

// 게임 관리 정보 조회
export async function getGameManage(gameCode: string, password: string): Promise<GameManageResponse> {
    const res = await api.post(`/charades/${gameCode}/manage`, { password });
    return res.data;
}
