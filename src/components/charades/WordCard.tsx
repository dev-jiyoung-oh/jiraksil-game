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
 */
export default function WordCard({
  word,
  isVisible,
  index,
}: WordCardProps) {

  return (
    <div className={`wordcard-container ${isVisible ? "is-visible" : "is-hidden"}`}>
      <div className="wordcard">
        <p key={word} className="word-text" aria-hidden={!isVisible}>
          {isVisible ? word : ""}
        </p>
      </div>
    
      <p className="word-index">{index}</p>
    </div>
  );
}
