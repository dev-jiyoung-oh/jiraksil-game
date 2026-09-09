import { useState } from "react";
import { useAuth } from "@/hooks/common/useAuth";
import { useToast } from "@/components/common/toast/useToast";
import { submitSuggestion } from "@/api/suggest";
import { SUGGESTION_GAME_TYPE_LABELS, type SuggestionGameType } from "@/types/suggest";
import "./Suggest.css";

export default function Suggest() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [gameType, setGameType] = useState<SuggestionGameType>("CHARADES");
  const [content, setContent] = useState("");
  const [authorName, setAuthorName] = useState(user?.name ?? "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !authorName.trim()) return;

    setIsSubmitting(true);
    try {
      await submitSuggestion({ gameType, content: content.trim(), authorName: authorName.trim() });
      showToast({ message: "제안이 등록되었습니다. 감사합니다!", type: "success" });
      setContent("");
    } catch {
      showToast({ message: "제안 등록에 실패했습니다.", type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-container-narrow">
      <h1 className="suggest-title">미션 / 단어 제안</h1>
      <p className="suggest-desc">
        게임에 추가되었으면 하는 미션이나 단어를 자유롭게 제안해 주세요.
      </p>

      <form className="suggest-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">게임 종류</label>
          <div className="suggest-game-types">
            {(Object.keys(SUGGESTION_GAME_TYPE_LABELS) as SuggestionGameType[]).map((type) => (
              <label key={type} className="radio-label">
                <input
                  type="radio"
                  name="gameType"
                  value={type}
                  checked={gameType === type}
                  onChange={() => setGameType(type)}
                />
                {SUGGESTION_GAME_TYPE_LABELS[type]}
              </label>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="suggest-content">제안 내용</label>
          <textarea
            id="suggest-content"
            className="form-textarea"
            rows={6}
            placeholder="제안하고 싶은 미션이나 단어를 입력해 주세요."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="suggest-author">이름</label>
          <input
            id="suggest-author"
            type="text"
            className="form-input"
            placeholder="이름을 입력해 주세요."
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            readOnly={!!user}
            required
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary btn-large"
          disabled={isSubmitting || !content.trim() || !authorName.trim()}
        >
          {isSubmitting ? "제출 중..." : "제안하기"}
        </button>
      </form>
    </div>
  );
}
