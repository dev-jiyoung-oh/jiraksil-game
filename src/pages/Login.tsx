import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '@/api/auth';
import { useAuth } from '@/hooks/common/useAuth';
import { useToast } from '@/components/common/toast/useToast';
import './Login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const { showToast } = useToast();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!email || !password) {
      showToast({
        message: '이메일과 비밀번호를 입력해주세요.',
        type: 'warning',
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await login({ email, password });

      setUser(response.user);
      
      showToast({
        message: '로그인에 성공했습니다.',
        type: 'success',
      });
      
      // 홈으로 리다이렉트
      navigate('/');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '로그인에 실패했습니다.';
      showToast({
        message: errorMessage,
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container center-container">
      <section className="login-card card" aria-labelledby="login-title">
        <header className="login-header">
          <h1 id="login-title" className="login-title">
            로그인
          </h1>
        </header>

        <form onSubmit={handleSubmit} className="login-form form">
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
              placeholder="비밀번호를 입력하세요"
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-large form-button login-button"
            disabled={isLoading}
          >
            {isLoading ? '로그인 중...' : '로그인'}
          </button>
        </form>

        <p className="auth-link">
          계정이 없으신가요? <Link to="/signup">회원가입</Link>
        </p>
      </section>
    </div>
  );
}
