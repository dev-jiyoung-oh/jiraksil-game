import type { Mission } from './mission';

export interface GameData {
  wakeUpTime: string;
  missions: Mission[];
  contacts?: string[];
}
