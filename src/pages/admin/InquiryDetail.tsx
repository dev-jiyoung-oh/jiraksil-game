import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAdminInquiries, replyInquiry } from "@/api/inquiry";
import type { InquiryDetail as InquiryDetailType } from "@/types/inquiry";
import { useToast } from "@/components/common/toast/useToast";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import "./Admin.css";

export default function AdminInquiryDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [detail, setDetail] = useState<InquiryDetailType | null>(null);
  const [reply, setReply] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    // 관리자는 비밀번호 없이 조회 가능
    getAdminInquiries()
      .then((items) => {
        const found = items.find((i) => i.id === Number(id));
        if (!found) { navigate("/admin/inquiries"); return; }
        setDetail(found);
        setReply(found.reply ?? "");
      })
      .finally(() => setIsLoading(false));
  }, [id]);

  const handleSave = async () => {
    if (!id || !reply.trim()) return;
    setIsSaving(true);
    try {
      await replyInquiry(Number(id), reply.trim());
      showToast({ message: "답변이 저장되었습니다.", type: "success" });
      setDetail((prev) => prev ? { ...prev, reply: reply.trim(), hasReply: true } : prev);
    } catch {
      showToast({ message: "답변 저장에 실패했습니다.", type: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (!detail) return null;

  return (
    <div className="admin-inquiry-detail">
      <button type="button" className="btn btn-secondary admin-back-btn" onClick={() => navigate("/admin/inquiries")}>
        ← 목록으로
      </button>

      <div className="inquiry-detail-header">
        <h2 className="inquiry-detail-title">
          {detail.isPrivate && (
            <>
              <span aria-hidden="true">🔒 </span>
              <span className="sr-only">비공개</span>
            </>
          )}
          {detail.title}
        </h2>
        <div className="inquiry-detail-meta">
          <span>{detail.authorName}</span>
          <span>{new Date(detail.createdAt).toLocaleDateString("ko-KR")}</span>
        </div>
      </div>

      <div className="inquiry-detail-content">{detail.content}</div>

      <div className="admin-reply-section">
        <h3>답변 작성</h3>
        <textarea
          className="form-textarea"
          rows={6}
          placeholder="답변 내용을 입력해 주세요."
          value={reply}
          onChange={(e) => setReply(e.target.value)}
        />
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleSave}
          disabled={isSaving || !reply.trim()}
        >
          {isSaving ? "저장 중..." : "답변 저장"}
        </button>
      </div>
    </div>
  );
}
