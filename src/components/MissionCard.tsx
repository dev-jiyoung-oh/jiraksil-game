import AppLogo from '@/components/AppLogo';
import type { Mission } from '@/types/mission';
import './MissionCard.css';

interface MissionCardProps {
  mission: Mission & { opened: boolean; viewed?: boolean };
  mode: 'user' | 'manager';
  isDisabled?: boolean;
  onToggle: () => void;
}

export default function MissionCard({
  mission,
  mode,
  isDisabled,
  onToggle,
}: MissionCardProps) {
  if (mode === 'manager') {
    return (
      

      <button
        type="button"
        className={`mission-card ${mission.opened ? 'opened' : ''} clickable`}
        aria-label={mission.opened ? '미션 내용' : '미공개 카드'}
        onClick={onToggle}
        >
        {mission.opened ? (
          <p className="mission-text">{mission.text}</p>
        ) : (
          <>
            <AppLogo />
            <span className="card-view-label">카드 보기</span>
          </>
        )}
      </button>
      
    );
  }

  if (mission.viewed) {
    return (
      <div
        className="mission-card viewed"
        aria-label="확인 완료"
      >
        <AppLogo />
        <span>확인 완료</span>
      </div>
    );
  }

  if (mission.opened) {
    return (
      <div
        className="mission-card opened"
        role="group"
        aria-label="미션 내용"
      >
        <p className="mission-text">{mission.text}</p>
        <button
          type="button"
          className="confirm"
          onClick={onToggle}
        >
          확인 완료
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      className="mission-card clickable"
      onClick={onToggle}
      disabled={isDisabled}
      aria-disabled={isDisabled}
      aria-label="카드 보기"
    >
      <AppLogo />
      <span className="card-view-label">카드 보기</span>
    </button>
  );
}
