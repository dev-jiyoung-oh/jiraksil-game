import MissionCard from '@/components/MissionCard';
import type { Mission } from '@/types/mission';
import './MissionCardList.css';

interface MissionCardListProps {
  missions: (Mission & { opened: boolean })[];
  mode: 'user' | 'manager';
  onToggle: (id: number) => void;
}

export default function MissionCardList({
  missions,
  mode,
  onToggle,
}: MissionCardListProps) {
  const anyOpened = mode === 'user' && missions.some((m) => m.opened);

  return (
    <ul className="mission-card-list">
      {missions.map((m) => (
        <li key={m.assignedPlayer}>
          <MissionCard
            mission={m}
            mode={mode}
            isDisabled={
              mode === 'user' && !m.opened && anyOpened
            }
            onToggle={() => onToggle(m.assignedPlayer)}
          />
        </li>
      ))}
    </ul>
  );
}
