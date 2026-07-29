import { useRef, useEffect } from "react";
import "./WordCard.css";

interface WordCardProps {
  /** 현재 제시어 */
  word: string;
  /** 제시어 공개 여부 */
  isVisible: boolean;
  /** 현재 문제 번호 */
  index: number;
}

const RING_SIZE = 26;     // 스프링 링 1개 너비 (px)
const SPRING_MARGIN = 0.08; // 카드 좌우 여백 비율 (left: 8%, right: 8%)

/**
 * 몸으로 말해요 - 제시어 카드
 */
export default function WordCard({ word, isVisible, index }: WordCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const update = () => {
      const w = el.offsetWidth;
      const completeRings = Math.floor((w * (1 - SPRING_MARGIN * 2)) / RING_SIZE);
      const springWidth = completeRings * RING_SIZE;
      const margin = (w - springWidth) / 2;
      el.style.setProperty("--spring-left", `${margin}px`);
      el.style.setProperty("--spring-right", `${margin}px`);
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div className={`wordcard-container ${isVisible ? "is-visible" : "is-hidden"}`}>
      <div key={index} ref={cardRef} className="wordcard">
        <p className="word-text" aria-hidden={!isVisible}>
          {isVisible ? word : ""}
        </p>
        <p className="word-index">{index}</p>
      </div>
    </div>
  );
}
