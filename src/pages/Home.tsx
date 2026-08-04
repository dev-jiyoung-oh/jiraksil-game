import { Link } from 'react-router-dom';
import { GAME_META } from '@/types/common';
import './Home.css';

export default function Home() {
  return (
    <div className="page-container-wide">
      <h1 className="page-title">지구오락실 게임 선택</h1>
      <ul className="game-card-list">
        {GAME_META.map((game) => (
          <li key={game.id}>
            <Link to={`/game/${game.id}`} className="game-card">
              <h3>{game.label}</h3>
              <p>{game.description}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
