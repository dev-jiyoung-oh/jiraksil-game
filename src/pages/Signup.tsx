import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signup } from '@/api/auth';
import { useToast } from '@/components/common/toast/useToast';
import './Signup.css';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !password || !confirmPassword) {
      showToast({
        message: '이메일, 비밀번호, 비밀번호 확인을 입력해주세요.',
        type: 'warning',
      });
      return;
    }

    if (password.length < 4 || password.length > 24) {
      showToast({
        message: '비밀번호는 4~24자로 입력해주세요.',
        type: 'warning',
      });
      return;
    }

    if (password !== confirmPassword) {
      showToast({
        message: '비밀번호와 비밀번호 확인이 일치하지 않습니다.',
        type: 'warning',
      });
      return;
    }

    setIsLoading(true);
    try {
      const trimmedName = name.trim();
      await signup({
        email,
        password,
        ...(trimmedName ? { name: trimmedName } : {}),
      });

      showToast({
        message: '회원가입이 완료되었습니다.',
        type: 'success',
      });
      navigate('/login');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '회원가입에 실패했습니다.';
      showToast({
        message: errorMessage,
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signup-container center-container">
      <section className="signup-card card" aria-labelledby="signup-title">
        <header className="signup-header">
          <h1 id="signup-title" className="signup-title">
            회원가입
          </h1>
        </header>

        <form onSubmit={handleSubmit} className="signup-form form">
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              이메일
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일을 입력하세요"
              disabled={isLoading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              비밀번호
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력하세요 (4~24자)"
              disabled={isLoading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">
              비밀번호 확인
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="비밀번호를 다시 입력하세요"
              disabled={isLoading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="name" className="form-label">
              이름 (선택)
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="이름을 입력하세요"
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-large form-button signup-button"
            disabled={isLoading}
          >
            {isLoading ? '가입 중...' : '회원가입'}
          </button>
        </form>

        <p className="auth-link">
          이미 계정이 있으신가요? <Link to="/login">로그인</Link>
        </p>
      </section>
    </div>
  );
}
