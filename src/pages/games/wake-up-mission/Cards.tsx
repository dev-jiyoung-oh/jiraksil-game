import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import MissionCardList from '@/components/MissionCardList';
import type { Mission } from '@/types/mission';
import type { GameData } from '@/types/wakeUpMission';
import './Cards.css';

type MissionWithState = Mission & { opened: boolean; viewed: boolean };

export default function Cards() {
  const { gameId } = useParams();
  const [missions, setMissions] = useState<MissionWithState[]>([]);
  const [wakeUpTime, setWakeUpTime] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/wake-up-mission/${gameId}`);
        if (response.status === 404) {
          setError('존재하지 않는 게임입니다.');
          return;
        }
        const data: GameData = await response.json();
        setMissions(data.missions.map((m) => ({
          ...m,
          opened: false,
          viewed: false,
        })));
        setWakeUpTime(data.wakeUpTime);
      } catch (err) {
        setError('데이터 로딩 실패');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [gameId]);

  const handleToggle = (id: number) => {
    const target = missions.find((m) => m.id === id);
    if (!target || target.viewed) return;

    const anyOpened = missions.some((m) => m.opened);

    if (anyOpened) {
      // 확인 완료 처리
      setMissions((prev) =>
        prev.map((m) =>
          m.id === id ? { ...m, opened: false, viewed: true } : m
        )
      );
    } else {
      // 열기
      setMissions((prev) =>
        prev.map((m) =>
          m.id === id ? { ...m, opened: true } : m
        )
      );
    }
  };

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="cards-container">
      <h2>Wake Up Mission - 카드</h2>
      {wakeUpTime && <p>기상시간: {wakeUpTime}</p>}
      <MissionCardList
        missions={missions}
        mode="user"
        onToggle={handleToggle}
      />
    </div>
  );
}
