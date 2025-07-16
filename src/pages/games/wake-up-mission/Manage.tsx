import { useParams } from 'react-router-dom';
import { useState } from 'react';
import MissionCardList from '@/components/MissionCardList';
import PasswordModal from '@/components/PasswordModal';
import type { Mission } from '@/types/mission';
import type { GameData } from '@/types/wakeUpMission';
import './Manage.css';

type MissionWithState = Mission & { opened: boolean };

export default function Manage() {
  const { gameId } = useParams();
  const [missions, setMissions] = useState<MissionWithState[]>([]);
  const [wakeUpTime, setWakeUpTime] = useState<string | null>(null);
  const [contacts, setContacts] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState(false);

  const handleVerify = async (password: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/wake-up-mission/${gameId}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (res.status === 401) return null;
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || '조회 실패');
        return null;
      }

      const data: GameData = await res.json();
      setMissions(data.missions.map((m) => ({ ...m, opened: false })));
      setWakeUpTime(data.wakeUpTime);
      setContacts(data.contacts || []);
      setIsVerified(true);
      return data;
    } catch (err) {
      console.error(err);
      setError('서버 오류');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const toggleAll = () => {
    const allOpened = missions.every((m) => m.opened);
    setMissions((prev) =>
      prev.map((m) => ({ ...m, opened: !allOpened }))
    );
  };

  const handleToggle = (id: number) => {
    setMissions((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, opened: !m.opened } : m
      )
    );
  };

  if (error) return <div>{error}</div>;

  return (
    <div className="manage-container">
      {!isVerified && <PasswordModal onVerify={handleVerify} />}
      {isVerified && (
        <>
          <h2 className='manage-title'>Wake Up Mission - 관리 화면</h2>
          
          {loading && <p>로딩 중...</p>}

          {!loading && (
            <>
              {wakeUpTime && <p>기상시간: {wakeUpTime}</p>}
              {contacts.length > 0 && (
                <div>
                  <p>연락처:</p>
                  <ul className='contacts-list'>
                    {contacts.map((c) => (
                      <li key={c}>{c}</li>
                    ))}
                  </ul>
                </div>
              )}

              <button type="button" className="toggle-all-cards" onClick={toggleAll}>
                {missions.every((m) => m.opened) ? '모든 카드 닫기' : '모든 카드 뒤집기'}
              </button>

              <MissionCardList
                missions={missions}
                mode="manager"
                onToggle={handleToggle}
              />
            </>
          )}
        </>
      )}
    </div>
  );
}
