import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { getGameData } from "@/api/wakeUpMission";
import { useGameAccess } from '@/hooks/common/useGameAccess';
import { useManageMissionToggle } from '@/hooks/wake-up-mission/useWakeUpMissionGame';
import MissionCardList from '@/components/wake-up-mission/MissionCardList';
import GameAccessModal from '@/components/common/GameAccessModal';
import CopyButton from '@/components/common/CopyButton';
import type { WakeUpMissionGame, WakeUpMissionGameViewModel } from '@/types/wakeUpMission';
import { formatDateTime } from '@/utils/date';

import './Manage.css';

const toManageViewModel = (data: WakeUpMissionGame): WakeUpMissionGameViewModel => ({
  ...data,
  missions: data.missions.map((m) => ({ ...m, opened: false })),
  contacts: data.contacts ? data.contacts.split(',') : [],
});

/**
 * 자네 지금 뭐 하는 건가 - 게임 관리 페이지
 */
export default function Manage() {
  const { gameCode } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const hasCode = !!gameCode;
  const initialData = location.state as WakeUpMissionGame | undefined;

  const { gameData, setGameData, isVerified, errorMessage, handleAccessSubmit } =
    useGameAccess<WakeUpMissionGame, WakeUpMissionGameViewModel>({
      gameCode,
      initialData,
      fetcher: getGameData,
      routeBase: "/game/wake-up-mission/manage",
      transform: toManageViewModel,
    });

  // 전체/개별 미션 토글
  const { toggleAll, handleToggle } = useManageMissionToggle(setGameData);

  return (
    <div className="page-container-narrow">
      <h2 className='page-title-small'>자네 지금 뭐 하는 건가 - 관리 화면</h2>

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
        <div className="flex-column manage-contents">
          <div className="flex" style={{ alignItems: 'center', gap: '0.5rem' }}>
            <span>게임 코드: {gameCode}</span>
            <CopyButton text={gameCode!} />
          </div>
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
