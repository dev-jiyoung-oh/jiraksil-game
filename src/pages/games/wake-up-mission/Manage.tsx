import api from "@/api/api";
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import MissionCardList from '@/components/wake-up-mission/MissionCardList';
import PasswordModal from '@/components/common/PasswordModal';
import type { WakeUpMissionGame, WakeUpMissionGameViewModel } from '@/types/wakeUpMission';
import { formatDateTime } from '@/utils/date';
import './Manage.css';

export default function Manage() {
  const { gameCode } = useParams();
  const [gameData, setGameData] = useState<WakeUpMissionGameViewModel | null>(null);
  
  const [showModal, setShowModal] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const handlePasswordSubmit = async (password: string) => {
    try {
      setErrorMessage("");
      
      const { data } = await api.post<WakeUpMissionGame>(
        `/wake-up-mission/${gameCode}`,
        { password },
      );

      setGameData({
        ...data,
        missions: data.missions.map((m) => ({ ...m, opened: false })),
        contacts: data.contacts?.split(',') || [],
      });
      setShowModal(false);

    } catch (err) {
      if (err instanceof Error) {
        setErrorMessage(err.message || "조회에 실패했습니다.");
      } else {
        setErrorMessage("알 수 없는 오류가 발생했습니다.");
      }
    }
  };

  // 모든 미션 토글
  const toggleAll = () => {
    setGameData((prev) => {
      if (!prev) return prev; // null safety

      const allOpened = prev.missions.every((m) => m.opened);
      return {
        ...prev,
        missions: prev.missions.map((m) => ({ ...m, opened: !allOpened })),
      };
    });
  };

  // 특정 미션 토글
  const handleToggle = (assignedPlayer: number) => {
    setGameData((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        missions: prev.missions.map((m) =>
          m.assignedPlayer === assignedPlayer ? { ...m, opened: !m.opened } : m
        )
      };
    });
  };
  

  return (
    <div className="manage-container">
      <h2 className='manage-title'>자네 지금 뭐 하는 건가 - 관리 화면</h2>

      {showModal && <PasswordModal onSubmit={handlePasswordSubmit} errorMessage={errorMessage}/>}

      {!showModal && gameData && (
        <div className="manage-contents">
          {gameData.wakeUpTime && <p>기상시간: {formatDateTime(gameData.wakeUpTime)}</p>}
          {gameData.contacts && gameData.contacts.length > 0 && (
            <div>
              <p>연락처:</p>
              <ul className='contacts-list'>
                {gameData.contacts.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </div>
          )}

          <button type="button" className="btn toggle-all-cards" onClick={toggleAll}>
            {gameData.missions.every((m) => m.opened) ? '모든 카드 닫기' : '모든 카드 열기'}
          </button>

          <MissionCardList
            missions={gameData.missions}
            mode="manager"
            onToggle={handleToggle}
          />
        </div>
      )}
    </div>
  );
}
