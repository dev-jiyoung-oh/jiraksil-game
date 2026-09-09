import api from "./api";
import type { InquiryRequest, InquiryListItem, InquiryDetail } from "@/types/inquiry";

export async function submitInquiry(data: InquiryRequest): Promise<void> {
  await api.post("/inquiries", data);
}

export async function getInquiries(): Promise<InquiryListItem[]> {
  const res = await api.get<InquiryListItem[]>("/inquiries");
  return res.data;
}

export async function getInquiryDetail(id: number, password?: string): Promise<InquiryDetail> {
  const res = await api.get<InquiryDetail>(`/inquiries/${id}`, {
    params: password ? { password } : undefined,
  });
  return res.data;
}

export async function getAdminInquiries(): Promise<InquiryDetail[]> {
  const res = await api.get<InquiryDetail[]>("/admin/inquiries");
  return res.data;
}

export async function replyInquiry(id: number, reply: string): Promise<void> {
  await api.post(`/admin/inquiries/${id}/reply`, { reply });
}
