import { useState, useEffect, useRef } from "react";
import "./GameAccessModal.css";

interface GameAccessModalProps {
  isOpen: boolean;
  code?: string;
  requireCode?: boolean; // 코드 입력 필요 여부
  requirePassword?: boolean; // 비밀번호 입력 필요 여부
  onSubmit: (code: string, password: string) => void;
  onClose: () => void;
  errorMessage?: string;
}

export default function GameAccessModal({
  isOpen,
  code: initialCode,
  requireCode = true,
  requirePassword = true,
  onSubmit,
  onClose,
  errorMessage,
}: GameAccessModalProps) {
  const [code, setCode] = useState(initialCode ?? "");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const codeRef = useRef<HTMLInputElement>(null);
  const pwRef = useRef<HTMLInputElement>(null);

  // 모달 열릴 때 초기화 + 포커스
  useEffect(() => {
    if (isOpen) {
      if (initialCode) setCode(initialCode); 
      setPassword("");

      // 코드가 필요하면 코드 인풋 포커스
      if (requireCode) {
        codeRef.current?.focus();
      } else {
        pwRef.current?.focus();
      }
    }
  }, [isOpen, initialCode, requireCode]);

  // ESC로 닫기
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  // 제출
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (requireCode && !code.trim()) {
      alert("게임 코드를 입력해주세요.");
      return;
    }
    if (requirePassword && !password.trim()) {
      alert("비밀번호를 입력해주세요.");
      return;
    }

    setLoading(true);
    try {
      onSubmit(code.trim().toUpperCase(), password.trim());
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="game-access-title"
    >
      <div className="game-access-modal">
        <h2 id="game-access-title">게임 접속</h2>

        <form onSubmit={handleSubmit}>
          {/* 게임 코드 입력칸 */}
          {requireCode && (
            <div className="form-group">
              <label htmlFor="code">게임 코드</label>
              <input
                ref={codeRef}
                id="code"
                type="text"
                value={code}
                minLength={12}
                maxLength={12}
                placeholder="A~Z, 0~9 조합의 12자리"
                onChange={(e) => setCode(e.target.value)}
                required={requireCode}
                disabled={!!initialCode}
                className={`code-input ${initialCode ? "readonly" : ""}`}
              />
            </div>
          )}

          {/* 비밀번호 입력칸 */}
          {requirePassword && (
            <div className="form-group">
              <label htmlFor="password">비밀번호</label>
              <input
                ref={pwRef}
                id="password"
                type="password"
                value={password}
                minLength={4}
                onChange={(e) => setPassword(e.target.value)}
                required={requirePassword}
                className="pw-input"
              />
            </div>
          )}

          {errorMessage && <p className="error-msg">{errorMessage}</p>}

          <div className="actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              확인
            </button>
            <button type="button" className="btn btn-danger" onClick={onClose}>
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
