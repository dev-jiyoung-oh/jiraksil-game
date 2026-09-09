import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/common/useAuth";
import { useToast } from "@/components/common/toast/useToast";
import { submitInquiry } from "@/api/inquiry";
import "./Inquiry.css";

export default function InquiryNew() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [authorName, setAuthorName] = useState(user?.name ?? "");
  const [isPrivate, setIsPrivate] = useState(false);
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !authorName.trim()) return;
    if (isPrivate && !password.trim()) return;

    setIsSubmitting(true);
    try {
      await submitInquiry({
        title: title.trim(),
        content: content.trim(),
        authorName: authorName.trim(),
        isPrivate,
        password: isPrivate ? password : undefined,
      });
      showToast({ message: "문의가 등록되었습니다.", type: "success" });
      navigate("/inquiry");
    } catch {
      showToast({ message: "문의 등록에 실패했습니다.", type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-container">
      <h1>문의 작성</h1>

      <form className="inquiry-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="inquiry-title">제목</label>
          <input
            id="inquiry-title"
            type="text"
            className="form-input"
            placeholder="제목을 입력해 주세요."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="inquiry-content">내용</label>
          <textarea
            id="inquiry-content"
            className="form-textarea"
            rows={8}
            placeholder="문의 내용을 입력해 주세요."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="inquiry-author">이름</label>
          <input
            id="inquiry-author"
            type="text"
            className="form-input"
            placeholder="이름을 입력해 주세요."
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            readOnly={!!user}
            required
          />
        </div>

        <div className="form-group">
          <label className="inquiry-private-label">
            <input
              type="checkbox"
              checked={isPrivate}
              onChange={(e) => setIsPrivate(e.target.checked)}
            />
            비밀글
          </label>
          {isPrivate && (
            <input
              type="password"
              className="form-input inquiry-password"
              placeholder="비밀번호를 설정해 주세요."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          )}
        </div>

        <div className="inquiry-form-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate("/inquiry")}
          >
            취소
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? "등록 중..." : "등록"}
          </button>
        </div>
      </form>
    </div>
  );
}
