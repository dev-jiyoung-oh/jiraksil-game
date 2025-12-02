import "./ChevronDown.css";

/** 아래 화살표 SVG */
export default function ChevronDown({ className, width = 12, height = 8 }: { className?: string, width?: number, height?: number }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 12 8"
      aria-hidden="true"
    >
      <path
        d="M2 2l4 4 4-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
