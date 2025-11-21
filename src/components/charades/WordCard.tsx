import { useEffect, useState } from "react";
import "./WordCard.css";

interface WordCardProps {
  /** 현재 제시어 */
  word: string;
  /** 제시어 공개 여부 */
  isVisible: boolean;
  /** 현재 문제 번호 */
  index: number;
}

/**
 * 몸으로 말해요 - 제시어 카드
 * 
 * - 제시어 공개/비공개 상태 표시
 * - 전환 시 부드러운 플립 애니메이션 적용
 */
export default function WordCard({
  word,
  isVisible,
  index,
}: WordCardProps) {
  const [flip, setFlip] = useState(false);

  // 제시어 바뀔 때마다 플립 애니메이션 트리거
  useEffect(() => {
    setFlip(true);
    const timer = setTimeout(() => setFlip(false), 500);
    return () => clearTimeout(timer);
  }, [word]);

  return (
    <div className={`wordcard-container ${flip ? "flip" : ""}`}>
      <div className="wordcard">
        <div className={`wordcard-front ${isVisible ? "visible" : "hidden"}`}>
          <p className="word-text">{isVisible ? word : "❓"}</p>
        </div>
      </div>
      <p className={`word-index ${isVisible ? "visible" : "hidden"}`}>
        {index}
      </p>
    </div>
  );
}
