/** 체크(✅) 아이콘 */
export default function IconCheck({ size = "1em" }: { size?: string | number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="20,6 9,17 4,12" />
    </svg>
  );
}
