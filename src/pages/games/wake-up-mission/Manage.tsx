import { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { getGameData } from "@/api/wakeUpMission";
import MissionCardList from '@/components/wake-up-mission/MissionCardList';
import GameAccessModal from '@/components/common/GameAccessModal';
import type { WakeUpMissionGameViewModel } from '@/types/wakeUpMission';
import { formatDateTime } from '@/utils/date';

import './Manage.css';

/**
 * 자네 지금 뭐 하는 건가 - 게임 관리 페이지
 */
export default function Manage() {
  const { gameCode } = useParams();

  const location = useLocation();
  const navigate = useNavigate();

  const hasCode = !!gameCode;
  const initialData = location.state as WakeUpMissionGameViewModel | undefined;
  
  const [gameData, setGameData] = useState<WakeUpMissionGameViewModel | null>(null);

  // 인증 관련
  const [isVerified, setIsVerified] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");


  useEffect(() => {
    if (initialData) {
      setGameData(initialData);
      setIsVerified(true);
      return;
    }

    if (!gameCode) {
      setIsVerified(false);
      return;
    }

    setIsVerified(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameCode]);
  
  // 인증 요청
  const handleAccessSubmit = async (code: string, password: string) => {
    setErrorMessage("");
    
    try {
      const data = await getGameData(code, password);
      const viewModel = {
          ...data,
          missions: data.missions.map((m) => ({ ...m, opened: false })),
          contacts: data.contacts ? data.contacts.split(',') : [],
      };

      if (gameCode) {
        setGameData(viewModel);
        setIsVerified(true);
      } else {
        navigate(`/game/wake-up-mission/manage/${data.code}`, {
          replace: true,
          state: viewModel,
        });
      }

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

      {!isVerified && (
        <GameAccessModal
          isOpen={!isVerified}
          code={gameCode}
          requireCode={!hasCode}
          requirePassword={true}
          onSubmit={handleAccessSubmit}
          onClose={() => navigate(-1)}
          errorMessage={errorMessage}
        />
      )}

      {isVerified && gameData && (
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

          <button type="button" className="btn btn-primary" onClick={toggleAll}>
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
