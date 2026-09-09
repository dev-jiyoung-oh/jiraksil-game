import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getInquiryDetail } from "@/api/inquiry";
import { isAxiosError } from "@/api/api";
import { ERROR_CODE, type ApiErrorResponse } from "@/types/api";
import type { InquiryDetail as InquiryDetailType } from "@/types/inquiry";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import "./Inquiry.css";

export default function InquiryDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [detail, setDetail] = useState<InquiryDetailType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [needsPassword, setNeedsPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    if (!id) return;
    fetchDetail();
  }, [id]);

  const fetchDetail = async (pw?: string) => {
    if (!id) return;
    setIsLoading(true);
    setPasswordError("");
    try {
      const data = await getInquiryDetail(Number(id), pw);
      setDetail(data);
      setNeedsPassword(false);
    } catch (err: unknown) {
      const code = isAxiosError<ApiErrorResponse>(err) ? err.response?.data?.code : undefined;
      if (code === ERROR_CODE.PASSWORD_MISMATCH) {
        setNeedsPassword(true);
        if (pw) {
          setPasswordError("비밀번호가 일치하지 않습니다.");
        }
      } else {
        navigate("/inquiry");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;
    fetchDetail(password);
  };

  if (isLoading) return <div className="page-container"><LoadingSpinner /></div>;

  if (needsPassword) {
    return (
      <div className="page-container">
        <div className="inquiry-password-gate">
          <h2>비밀글입니다</h2>
          <p>비밀번호를 입력하면 내용을 확인할 수 있습니다.</p>
          <form onSubmit={handlePasswordSubmit} className="inquiry-password-form">
            <input
              type="password"
              className="form-input"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setPasswordError(""); }}
              autoFocus
            />
            {passwordError && <p className="form-error">{passwordError}</p>}
            <div className="inquiry-form-actions">
              <button type="button" className="btn btn-secondary" onClick={() => navigate("/inquiry")}>
                목록으로
              </button>
              <button type="submit" className="btn btn-primary">확인</button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  if (!detail) return null;

  return (
    <div className="page-container">
      <div className="inquiry-detail">
        <div className="inquiry-detail-header">
          <h1 className="inquiry-detail-title">
            {detail.isPrivate && <span className="inquiry-lock">🔒</span>}
            {detail.title}
          </h1>
          <div className="inquiry-detail-meta">
            <span>{detail.authorName}</span>
            <span>{new Date(detail.createdAt).toLocaleDateString("ko-KR")}</span>
          </div>
        </div>

        <div className="inquiry-detail-content">{detail.content}</div>

        {detail.reply && (
          <div className="inquiry-reply">
            <h3 className="inquiry-reply-title">답변</h3>
            <p className="inquiry-reply-content">{detail.reply}</p>
            {detail.repliedAt && (
              <span className="inquiry-reply-date">
                {new Date(detail.repliedAt).toLocaleDateString("ko-KR")}
              </span>
            )}
          </div>
        )}

        <button type="button" className="btn btn-secondary" onClick={() => navigate("/inquiry")}>
          목록으로
        </button>
      </div>
    </div>
  );
}
