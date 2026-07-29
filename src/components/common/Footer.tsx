import "./Footer.css";

/**
 * 공통 - 푸터 컴포넌트
 */
export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <nav className="footer-links">
          <a href="https://github.com/dev-jiyoung-oh/jiraksil-game" target="_blank" rel="noreferrer">
            GitHub (FE)
          </a>
          <a href="https://github.com/dev-jiyoung-oh/jiraksil-game-backend" target="_blank" rel="noreferrer">
            GitHub (BE)
          </a>
        </nav>
        <a className="footer-credit" href="https://github.com/dev-jiyoung-oh" target="_blank" rel="noreferrer">
          Made by JY
        </a>
      </div>
    </footer>
  );
}
