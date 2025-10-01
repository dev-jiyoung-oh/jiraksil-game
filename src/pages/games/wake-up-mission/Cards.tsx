import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import MissionCardList from '@/components/MissionCardList';
import type { WakeUpMissionGame, WakeUpMissionGameViewModel } from '@/types/wakeUpMission';
import { formatDateTime } from '@/utils/date';
import './Cards.css';

export default function Cards() {
  const location = useLocation();
  const state = location.state as WakeUpMissionGame | undefined;

  const [gameData, setGameData] = useState<WakeUpMissionGameViewModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!state) {
      setError("잘못된 접근입니다. 게임 데이터가 없습니다.");
      setLoading(false);
      return;
    }

    setGameData({
      ...state,
      missions: state.missions.map((m) => ({
        ...m,
        opened: false,
        viewed: false,
      })),
      contacts: state.contacts?.split(",") || [],
    });
    setLoading(false);
  }, [state]);

  // 카드 토글
  const handleToggle = (assignedPlayer: number) => {
    setGameData((prev) => {
      if (!prev) return prev;
      
      const target = prev.missions.find((m) => m.assignedPlayer === assignedPlayer);
      if (!target || target.viewed) return prev;

      const anyOpened = prev.missions.some((m) => m.opened);

      return {
        ...prev,
        missions: prev.missions.map((m) =>
          m.assignedPlayer === assignedPlayer
            ? anyOpened
              ? { ...m, opened: false, viewed: true } // 확인 완료
              : { ...m, opened: true } // 열기
            : m
        ),
      };
    });
  };

  return (
    <div className="cards-container">
      <h2 className="cards-title">자네 지금 뭐 하는 건가 - 미션 확인</h2>

    { loading && <div>로딩 중...</div> }
    { error && <div>{error}</div> }

      {gameData && (
        <>
          {gameData.wakeUpTime && <p>기상시간: {formatDateTime(gameData.wakeUpTime)}</p>}
          <MissionCardList
            missions={gameData.missions}
            mode="user"
            onToggle={handleToggle}
          />
        </>
      )}
    </div>
  );
}
