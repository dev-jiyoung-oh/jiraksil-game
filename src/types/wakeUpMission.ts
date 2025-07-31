import type { Mission } from './mission';

export interface GameData {
  id: string;
  wakeUpTime: string;
  missions: Mission[];
  contacts?: string;
}
