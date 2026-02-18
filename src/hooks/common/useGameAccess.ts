import { useState, useEffect, useCallback, type Dispatch, type SetStateAction } from "react";
import { useNavigate } from "react-router-dom";

interface UseGameAccessParams<TServer, TView = TServer> {
  gameCode: string | undefined;
  initialData: TServer | undefined;
  fetcher: (code: string, password: string) => Promise<TServer>;
  routeBase: string;
  extractCode?: (data: TServer) => string;
  transform?: (data: TServer) => TView;
}

interface UseGameAccessReturn<TView> {
  gameData: TView | null;
  setGameData: Dispatch<SetStateAction<TView | null>>;
  isVerified: boolean;
  errorMessage: string;
  handleAccessSubmit: (code: string, password: string) => Promise<void>;
}

export function useGameAccess<TServer, TView = TServer>({
  gameCode,
  initialData,
  fetcher,
  routeBase,
  extractCode = (d) => (d as { code: string }).code,
  transform,
}: UseGameAccessParams<TServer, TView>): UseGameAccessReturn<TView> {
  const navigate = useNavigate();

  const applyTransform = (data: TServer): TView => {
    return transform ? transform(data) : (data as unknown as TView);
  };

  const [gameData, setGameData] = useState<TView | null>(() =>
    initialData ? applyTransform(initialData) : null,
  );
  const [isVerified, setIsVerified] = useState(!!initialData);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (initialData) {
      setGameData(applyTransform(initialData));
      setIsVerified(true);
      return;
    }
    setIsVerified(false);
    // gameCode 변경 시에만 재실행 (initialData는 gameCode와 함께 변경됨)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameCode]);

  const handleAccessSubmit = useCallback(
    async (code: string, password: string) => {
      setErrorMessage("");

      try {
        const data = await fetcher(code, password);

        if (gameCode) {
          setGameData(applyTransform(data));
          setIsVerified(true);
        } else {
          navigate(`${routeBase}/${extractCode(data)}`, {
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
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [gameCode, fetcher, routeBase, extractCode],
  );

  return { gameData, setGameData, isVerified, errorMessage, handleAccessSubmit };
}
