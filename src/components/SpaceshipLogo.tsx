type Props = { className?: string };

export function SpaceshipLogo({ className }: Props) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        <linearGradient id="shipGlow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff00ff" />
          <stop offset="55%" stopColor="#ffabf3" />
          <stop offset="100%" stopColor="#00fbfb" />
        </linearGradient>
      </defs>
      <path
        d="M24 6 38 34H10L24 6Zm0 8-9 17h18L24 14Zm-2 12h4v10h-4V26Z"
        fill="url(#shipGlow)"
        stroke="#ff00ff"
        strokeWidth="1.2"
      />
      <path d="M14 36h20l2 6H12l2-6Z" fill="#00fbfb" fillOpacity={0.35} />
    </svg>
  );
}
