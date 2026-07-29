/** 정지(⏹) 아이콘 */
export default function IconStop({ size = "1em" }: { size?: string | number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <rect x="5" y="5" width="14" height="14" />
    </svg>
  );
}
