import { useState } from "react";

import "./CopyButton.css";


/**
 * 공통 - 복사 버튼 컴포넌트
 */
interface CopyButtonProps {
  text: string;
  label?: string;
}

export default function CopyButton({ text, label = "복사" }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      alert("복사 실패!");
    }
  };

  return (
    <button type="button" onClick={handleCopy} className="copy-btn">
      {copied ? "복사됨!" : label}
    </button>
  );
}
