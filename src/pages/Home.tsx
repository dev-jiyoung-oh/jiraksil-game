import { Link } from 'react-router-dom';
import './Home.css';

const games = [
  {
    id: 'wake-up-mission',
    name: 'Wake Up Mission',
    description: '기상 미션 수행 게임'
  },
  {
    id: 'quiz',
    name: '퀴즈 게임',
    description: '사진 보고 이름 맞추는 게임'
  },
  {
    id: 'body-language',
    name: '몸으로 말해요',
    description: '제시어를 몸으로 표현하는 게임'
  }
];

export default function Home() {
  return (
    <div className="home-container">
      <h1 className="home-title">지구오락실 게임 선택</h1>
      <ul className="game-card-list">
        {games.map((game) => (
          <li key={game.id}>
            <Link to={`/game/${game.id}`} className="game-card">
              <h3>{game.name}</h3>
              <p>{game.description}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
