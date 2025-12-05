import { Routes, Route } from "react-router-dom";
import Header from "@/components/common/Header";
import Home from '@/pages/Home';
import WakeUpMissionRouter from '@/pages/games/wake-up-mission/Router';
import CharadesRouter from '@/pages/games/charades/Router';
import './App.css';

function App() {

  return (
    <>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game" element={<Home />} />
        <Route path="/game/wake-up-mission/*" element={<WakeUpMissionRouter />} />
        <Route path="/game/charades/*" element={<CharadesRouter />} />
      </Routes>

    </>
  );
}

export default App;
