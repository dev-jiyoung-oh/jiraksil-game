import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import WakeUpMissionRouter from './pages/games/wake-up-mission/Router'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/game" element={<Home />} />
      <Route path="/game/wake-up-mission/*" element={<WakeUpMissionRouter />} />
    </Routes>
  )
}

export default App
