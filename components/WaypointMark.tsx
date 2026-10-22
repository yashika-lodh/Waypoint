export function WaypointMark({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none" aria-hidden>
      <path d="M4 15V9.5a3 3 0 0 1 3-3h4a3 3 0 0 0 3-3V3" stroke="var(--wp-line)" strokeWidth="2" strokeLinecap="round" />
      <circle cx="4" cy="15" r="2.25" fill="var(--wp-route)" />
      <circle cx="14" cy="3" r="2.25" fill="none" stroke="var(--wp-route)" strokeWidth="1.5" />
    </svg>
  );
}
