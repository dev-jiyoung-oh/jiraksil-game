import { useState } from 'react';
import './PasswordModal.css';

interface PasswordModalProps {
  onSubmit: (password: string) => Promise<void>;
  onClose?: () => void;
  errorMessage?: string;
}

export default function PasswordModal({ onSubmit, onClose, errorMessage }: PasswordModalProps) {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onSubmit(password);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="password-modal" role="dialog" aria-modal="true">
      <div className="password-modal-content">
        <h3>비밀번호 입력</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            name="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />

          {errorMessage && <p className="error">{errorMessage}</p>}

          <div className="buttons">
            {onClose && (
              <button
                type="button"
                className="btn back"
                onClick={onClose}
                disabled={loading}
              >
                뒤로가기
              </button>
            )}

            <button type="submit" className="btn" disabled={loading || !password.trim()}>
              확인
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
