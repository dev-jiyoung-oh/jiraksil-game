import api from "./api";
import type {
  WordBatchResponse,
  FinalizeGameRequest,
  GameResultResponse,
  GameDetailResponse,
} from "@/types/charades";

// 게임 정보 조회
export async function getGameDetail(gameCode: string): Promise<GameDetailResponse> {
  const res = await api.get(`/charades/${gameCode}`);
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
export async function finalizeGame(
  gameCode: string,
  payload: FinalizeGameRequest
): Promise<void> {
  await api.post(`/charades/${gameCode}/finalize`, payload);
}

// 게임 결과 조회
export async function getGameResult(gameCode: string): Promise<GameResultResponse> {
  const res = await api.get(`/charades/${gameCode}/result`);
  return res.data;
}
