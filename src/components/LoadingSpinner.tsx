import './LoadingSpinner.css';

export default function LoadingSpinner() {
  return (
    <div
      className="loading-spinner-overlay"
      role="status"
      aria-live="polite"
      aria-label="로딩 중"
    >
      <div className="loading-spinner-content">
        <div className="spinner-circle"></div>
        <span className="spinner-text">로딩 중...</span>
      </div>
    </div>
  );
}
