import type { Mission } from './mission';

export interface WakeUpMissionGame {
  code: string;
  wakeUpTime: string;
  missions: Mission[];
  contacts?: string;
}
