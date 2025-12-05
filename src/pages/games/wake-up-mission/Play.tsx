import { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { getGameData } from "@/api/wakeUpMission";
import GameAccessModal from '@/components/common/GameAccessModal';
import MissionCardList from '@/components/wake-up-mission/MissionCardList';
import type { WakeUpMissionGame, WakeUpMissionGameViewModel } from '@/types/wakeUpMission';
import { formatDateTime } from '@/utils/date';

import './Play.css';

/**
 * 자네 지금 뭐 하는 건가 - 게임 진행 페이지
 */
export default function Play() {
  const { gameCode } = useParams();

  const location = useLocation();
  const navigate = useNavigate();

  const hasCode = !!gameCode;
  const initialData = location.state as WakeUpMissionGame | undefined;

  const [gameData, setGameData] = useState<WakeUpMissionGameViewModel | null>(null);

  // 인증 관련
  const [isVerified, setIsVerified] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (initialData) {
      setGameData({
        ...initialData,
        missions: initialData.missions.map((m) => ({
          ...m,
          opened: false,
          viewed: false,
        })),
        contacts: initialData.contacts && initialData.contacts.length > 0 ? initialData.contacts.split(",") : undefined,
      });
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

      if (gameCode) {
        setGameData({
          ...data,
          missions: data.missions.map((m) => ({
            ...m,
            opened: false,
            viewed: false,
          })),
          contacts: data.contacts && data.contacts.length > 0 ? data.contacts.split(",") : undefined,
        });
        setIsVerified(true);
      } else {
        navigate(`/game/wake-up-mission/play/${data.code}`, {
          replace: true,
          state: data,
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
    <div className="play-container">
      <h2 className="play-title">자네 지금 뭐 하는 건가 - 미션 확인</h2>

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
