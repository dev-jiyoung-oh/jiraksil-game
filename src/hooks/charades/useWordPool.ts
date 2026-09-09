import { useState, useEffect, useCallback, useRef } from "react";
import { getWordBatch } from "@/api/charades";
import type { WordDto } from "@/types/charades";

const WORD_BUFFER_SIZE = 50; // 단어 로딩 버퍼 크기 - 남은 단어 이하일 때 트리거
const WORD_BATCH_SIZE = 300; // 단어 배치 조회 크기 - 한 번에 조회할 배치 단어 수

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

  // words의 최신 값을 loadMoreWords가 재생성되지 않고도 참조할 수 있도록 동기화
  const wordsRef = useRef<WordDto[]>(words);
  useEffect(() => {
    wordsRef.current = words;
  }, [words]);

  const loadMoreWords = useCallback(async () => {
    if (isLoadingRef.current || !gameCode || noMoreWords) return;

    isLoadingRef.current = true;
    setIsLoadingWords(true);

    try {
      // 이미 로드된 단어 제외
      const currentWords = wordsRef.current;
      const exclude = currentWords.length > 0 ? currentWords.map((w) => w.id) : undefined;

      // 단어 배치 조회
      const batch = await getWordBatch(gameCode, { limit: WORD_BATCH_SIZE, exclude });

      // 단어 배치 조회 결과가 있으면 추가
      if (batch.words.length > 0) {
        setWords((prev) => [...prev, ...batch.words]);
      } else {
        // 단어 배치 조회 결과가 없으면 noMoreWords 설정
        setNoMoreWords(true);
      }
    } catch (error) {
      // 에러 시 noMoreWords는 false 유지 → 자동 로딩 트리거가 재시도 가능
      console.error(error);

    } finally {
      isLoadingRef.current = false;
      setIsLoadingWords(false);
    }
  }, [gameCode, noMoreWords]);

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
    if (wordIdx < words.length - WORD_BUFFER_SIZE) return;

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
