import api from "./api";
import type { SuggestionRequest, SuggestionDto } from "@/types/suggest";

export async function submitSuggestion(data: SuggestionRequest): Promise<void> {
  await api.post("/suggestions", data);
}

export async function getAdminSuggestions(): Promise<SuggestionDto[]> {
  const res = await api.get<SuggestionDto[]>("/admin/suggestions");
  return res.data;
}
