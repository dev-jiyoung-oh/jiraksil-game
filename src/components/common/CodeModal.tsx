import { useState, useEffect, useRef } from "react";
import "./CodeModal.css";

interface CodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (code: string) => void;
}

export default function CodeModal({ isOpen, onClose, onSubmit }: CodeModalProps) {
  const [code, setCode] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // 모달 열릴 때 input 자동 포커스
  useEffect(() => {
    if (isOpen) {
      setCode("");
      inputRef.current?.focus();
    }
  }, [isOpen]);

  // ESC 닫기
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  // 제출
  const handleSubmit = () => {
    if (!code.trim()) {
      alert("게임 코드를 입력해주세요!");
      return;
    }
    onSubmit(code.trim().toUpperCase());
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="modal">
        <h2 id="modal-title">게임 코드 입력</h2>
        <p>게임 코드를 입력하세요:</p>

        <input
          ref={inputRef}
          type="text"
          name="code-modal__code-input"
          value={code}
          placeholder="예: ABC123"
          onChange={(e) => setCode(e.target.value)}
          className="code-input"
        />

        <div className="actions">
          <button type="button" onClick={handleSubmit} className="confirm-btn btn btn-primary">
            확인
          </button>
          <button type="button" onClick={onClose} className="cancel-btn btn btn-danger">
            취소
          </button>
        </div>
      </div>
    </div>
  );
}
