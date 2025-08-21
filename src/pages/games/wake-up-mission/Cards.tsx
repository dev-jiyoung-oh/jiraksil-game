import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import MissionCardList from '@/components/MissionCardList';
import type { Mission } from '@/types/mission';
import type { GameData } from '@/types/wakeUpMission';
import { formatDateTime } from '@/utils/date';
import './Cards.css';

type MissionWithState = Mission & { opened: boolean; viewed: boolean };

export default function Cards() {
  const location = useLocation();
  const state = location.state as GameData | undefined;

  const [missions, setMissions] = useState<MissionWithState[]>([]);
  const [wakeUpTime, setWakeUpTime] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (!state) {
      setError('잘못된 접근입니다. 게임 데이터가 없습니다.');
      setLoading(false);
      return;
    }
    
    setMissions(
      state.missions.map((m) => ({
        ...m,
        opened: false,
        viewed: false,
      }))
    );
    setWakeUpTime(state.wakeUpTime);
    setLoading(false);
  }, [state]);
  
  const handleToggle = (assignedPlayer: number) => {
    const target = missions.find((m) => m.assignedPlayer === assignedPlayer);
    if (!target || target.viewed) return;

    const anyOpened = missions.some((m) => m.opened);

    if (anyOpened) {
      // 확인 완료 처리
      setMissions((prev) =>
        prev.map((m) =>
          m.assignedPlayer === assignedPlayer ? { ...m, opened: false, viewed: true } : m
        )
      );
    } else {
      // 열기
      setMissions((prev) =>
        prev.map((m) =>
          m.assignedPlayer === assignedPlayer ? { ...m, opened: true } : m
        )
      );
    }
  };

  
  return (
    <div className="cards-container">
      <h2 className="cards-title">자네 지금 뭐 하는 건가 - 미션 확인</h2>

      { loading && <div>로딩 중...</div> }
      { error && <div>{error}</div> }

      <>
        {wakeUpTime && <p>기상시간: {formatDateTime(wakeUpTime)}</p>}
        <MissionCardList
          missions={missions}
          mode="user"
          onToggle={handleToggle}
        />
      </>
    </div>
  );
}
