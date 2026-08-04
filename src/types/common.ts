export const GAME_META = [
  {
    key: "WAKE_UP_MISSION" as const,
    label: "자네 지금 뭐 하는 건가",
    description: "기상 미션 수행 게임",
    id: "wake-up-mission",
  },
  {
    key: "CHARADES" as const,
    label: "몸으로 말해요",
    description: "제시어를 몸으로 표현하는 게임",
    id: "charades",
  },
] as const;

export type GameType = typeof GAME_META[number]["key"];

export const GAME_LABELS = Object.fromEntries(
  GAME_META.map((g) => [g.key, g.label])
) as Record<GameType, string>;
