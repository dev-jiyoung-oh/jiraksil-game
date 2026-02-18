import { useState, useEffect, useCallback, useRef } from "react";
import { getWordBatch } from "@/api/charades";
import type { WordDto } from "@/types/charades";

interface UseWordPoolParams {
  gameCode: string | undefined;
  /** true일 때만 단어 로딩 시작 (인증 완료 후) */
  enabled: boolean;
}

interface UseWordPoolReturn {
  words: WordDto[];
  wordIdx: number;
  currentWord: WordDto | null;
  noMoreWords: boolean;
  isLoadingWords: boolean;
  /** wordIdx를 1 증가 */
  advance: () => void;
  /** 서버 단어가 고갈되고 현재 풀도 소진됨 */
  isDepleted: boolean;
}

export function useWordPool({
  gameCode,
  enabled,
}: UseWordPoolParams): UseWordPoolReturn {
  const [words, setWords] = useState<WordDto[]>([]);
  const [wordIdx, setWordIdx] = useState(0);
  const [noMoreWords, setNoMoreWords] = useState(false);
  const [isLoadingWords, setIsLoadingWords] = useState(false);

  const isLoadingRef = useRef(false);

  const loadMoreWords = useCallback(async () => {
    if (isLoadingRef.current || !gameCode || noMoreWords) return;

    isLoadingRef.current = true;
    setIsLoadingWords(true);

    try {
      const exclude = words.length > 0 ? words.map((w) => w.id) : undefined;
      const batch = await getWordBatch(gameCode, { exclude });

      // TODO limit 미만으로 변경
      if (batch.words.length === 0) {
        setNoMoreWords(true);
        return;
      }

      setWords((prev) => [...prev, ...batch.words]);
    } finally {
      isLoadingRef.current = false;
      setIsLoadingWords(false);
    }
  }, [gameCode, noMoreWords, words]);

  // 인증 완료 후 최초 로딩
  useEffect(() => {
    if (enabled && gameCode) {
      loadMoreWords();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, gameCode]);

  // 단어 부족 시 자동 로딩
  useEffect(() => {
    if (!words.length || noMoreWords) return;
    if (wordIdx < words.length - 50) return;

    loadMoreWords();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wordIdx, words.length, noMoreWords]);

  const advance = useCallback(() => {
    setWordIdx((i) => i + 1);
  }, []);

  const currentWord = words[wordIdx] ?? null;
  const isDepleted = noMoreWords && wordIdx >= words.length;

  return {
    words,
    wordIdx,
    currentWord,
    noMoreWords,
    isLoadingWords,
    advance,
    isDepleted,
  };
}
