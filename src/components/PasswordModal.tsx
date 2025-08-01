import { useState } from 'react';
import './PasswordModal.css';
import type { GameData } from '@/types/wakeUpMission';


interface PasswordModalProps {
  onVerify: (password: string) => Promise<GameData | null>;
  onCancel?: () => void;
}

export default function PasswordModal({ onVerify, onCancel }: PasswordModalProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const data = await onVerify(password);
    if (!data) {
      setError('게임 ID가 존재하지 않거나 비밀번호가 일치하지 않습니다.');
    }
    setLoading(false);
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

          {error && <p className="error">{error}</p>}

          <div className="buttons">
            {onCancel && (
              <button
                type="button"
                className="btn back"
                onClick={onCancel}
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
