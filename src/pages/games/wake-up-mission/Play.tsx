import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { getGameData } from "@/api/wakeUpMission";
import { useGameAccess } from '@/hooks/common/useGameAccess';
import { usePlayMissionToggle } from '@/hooks/wake-up-mission/useWakeUpMissionGame';
import GameAccessModal from '@/components/common/GameAccessModal';
import MissionCardList from '@/components/wake-up-mission/MissionCardList';
import type { WakeUpMissionGame, WakeUpMissionGameViewModel } from '@/types/wakeUpMission';
import { formatDateTime } from '@/utils/date';

import './Play.css';

const toPlayViewModel = (data: WakeUpMissionGame): WakeUpMissionGameViewModel => ({
  ...data,
  missions: data.missions.map((m) => ({
    ...m,
    opened: false,
    viewed: false,
  })),
  contacts: data.contacts && data.contacts.length > 0
    ? data.contacts.split(",")
    : undefined,
});

/**
 * 자네 지금 뭐 하는 건가 - 게임 진행 페이지
 */
export default function Play() {
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
      routeBase: "/game/wake-up-mission/play",
      transform: toPlayViewModel,
    });

  // 카드 토글
  const { handleToggle } = usePlayMissionToggle(setGameData);

  return (
    <div className="page-container-wide">
      <h2 className="page-title-small">자네 지금 뭐 하는 건가 - 미션 확인</h2>

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
