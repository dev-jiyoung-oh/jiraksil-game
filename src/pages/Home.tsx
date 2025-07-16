import { useNavigate } from 'react-router-dom'
import './Home.css'

const games = [
  {
    id: 'wake-up-mission',
    name: 'Wake Up Mission',
    description: '기상 미션 수행 게임'
  },
  {
    id: 'quiz',
    name: '퀴즈 게임',
    description: '인물, 과자, 아이스크림 퀴즈 맞추기'
  },
  {
    id: 'body-language',
    name: '몸으로 말해요',
    description: '제시어를 몸으로 표현하는 게임'
  }
]

export default function Home() {
  const navigate = useNavigate()

  const handleClick = (id: string) => {
    if (id === 'quiz') {
      // 퀴즈 카테고리 선택 기본값: character
      navigate(`/game/quiz/character`)
    } else {
      navigate(`/game/${id}`)
    }
  }

  return (
    <div className="home-container">
      <h1 className="home-title">지구오락실 게임 선택</h1>
      <div className="game-card-list">
        {games.map((game) => (
          <div
            key={game.id}
            className="game-card"
            onClick={() => handleClick(game.id)}
          >
            <h3>{game.name}</h3>
            <p>{game.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
