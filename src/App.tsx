import { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Header from "@/components/common/Header";
import CodeModal from "@/components/common/CodeModal";
import Home from '@/pages/Home';
import WakeUpMissionRouter from '@/pages/games/wake-up-mission/Router';
import CharadesRouter from '@/pages/games/charades/Router';
import type { GameType, GameAction, CodeModalConfig } from "@/types/common";
import './App.css';

function App() {
  const navigate = useNavigate();

  // CodeModal 제어 상태
  const [modalConfig, setModalConfig] = useState<CodeModalConfig | null>(null);

  // Header → CodeModal 열기
  const openCodeModal = (config: { game: GameType; action: GameAction }) => {
    setModalConfig(config);
  };

  // CodeModal → 닫기
  const closeCodeModal = () => setModalConfig(null);

  // CodeModal → 코드 입력 완료 후 이동
  const handleSubmitCode = (code: string) => {
    if (!modalConfig) return;

    const { game, action } = modalConfig;
    closeCodeModal();

    if (game === "wakeUpMission") {
      if (action === "play") navigate(`/game/wake-up-mission/${code}`);
      else navigate(`/game/wake-up-mission/${code}/manage`);
    }

    if (game === "charades") {
      if (action === "play") navigate(`/game/charades/${code}`);
      else navigate(`/game/charades/${code}/manage`);
    }
  };

  return (
    <>
      <Header openCodeModal={openCodeModal} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game" element={<Home />} />
        <Route path="/game/wake-up-mission/*" element={<WakeUpMissionRouter />} />
        <Route path="/game/charades/*" element={<CharadesRouter />} />
      </Routes>

      {modalConfig && (
        <CodeModal
          isOpen={!!modalConfig}
          onClose={closeCodeModal}
          onSubmit={handleSubmitCode}
        />
      )}

    </>
  );
}

export default App;
