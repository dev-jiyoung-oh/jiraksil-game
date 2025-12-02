export type GameType = "wakeUpMission" | "charades";

export type GameAction = "play" | "manage";

export interface CodeModalConfig {
  game: GameType;
  action: GameAction;
}
