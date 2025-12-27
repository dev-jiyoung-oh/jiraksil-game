import { Routes, Route } from "react-router-dom";
import ToastProvider from "@/components/common/toast/ToastProvider";
import Header from "@/components/common/Header";
import Home from '@/pages/Home';
import WakeUpMissionRouter from '@/pages/games/wake-up-mission/Router';
import CharadesRouter from '@/pages/games/charades/Router';
import './App.css';

function App() {

  return (
    <ToastProvider>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game" element={<Home />} />
        <Route path="/game/wake-up-mission/*" element={<WakeUpMissionRouter />} />
        <Route path="/game/charades/*" element={<CharadesRouter />} />
      </Routes>

    </ToastProvider>
  );
}

export default App;
