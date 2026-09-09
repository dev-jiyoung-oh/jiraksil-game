import { useCallback } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { WakeUpMissionGameViewModel } from "@/types/wakeUpMission";

type SetGameData = Dispatch<SetStateAction<WakeUpMissionGameViewModel | null>>;

// 플레이 화면: 한 번에 하나의 카드만 열리고, 다시 누르면 확인 완료로 처리된다.
export function usePlayMissionToggle(setGameData: SetGameData) {
  const handleToggle = useCallback((assignedPlayer: number) => {
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
  }, [setGameData]);

  return { handleToggle };
}

// 관리 화면: 전체 열기/닫기와 개별 카드 토글을 독립적으로 처리한다.
export function useManageMissionToggle(setGameData: SetGameData) {
  const toggleAll = useCallback(() => {
    setGameData((prev) => {
      if (!prev) return prev;

      const allOpened = prev.missions.every((m) => m.opened);
      return {
        ...prev,
        missions: prev.missions.map((m) => ({ ...m, opened: !allOpened })),
      };
    });
  }, [setGameData]);

  const handleToggle = useCallback((assignedPlayer: number) => {
    setGameData((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        missions: prev.missions.map((m) =>
          m.assignedPlayer === assignedPlayer ? { ...m, opened: !m.opened } : m
        ),
      };
    });
  }, [setGameData]);

  return { toggleAll, handleToggle };
}
