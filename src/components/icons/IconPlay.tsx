/** 재생(▶) 아이콘 */
export default function IconPlay({ size = "1em" }: { size?: string | number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <polygon points="5,3 19,12 5,21" />
    </svg>
  );
}
