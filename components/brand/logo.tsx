import { cn } from "@/lib/utils";

export const PEBBLE_PATH =
  "M34 14 C42 12 48 17 47.5 24.5 C47 32 41 34 35 33.5 C29 33 26.5 28.5 27 23.5 C27.5 18 30 15 34 14 Z";
export const J_PATH = "M30 40 H44 V74 Q44 88 30 88 H18 V76 H28 Q30 76 30 74 Z";

export function Wordmark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-block whitespace-nowrap font-sans font-semibold leading-none tracking-[-0.055em] text-foreground",
        className,
      )}
    >
      jspr
      <span
        aria-hidden="true"
        className="pebble mr-[0.05em] ml-[0.06em] h-[0.18em] w-[0.2em]"
      />
      <span className="sr-only">.</span>
      vc
    </span>
  );
}

export function Mark({
  className,
  title,
}: {
  className?: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <rect width="100" height="100" rx="22" fill="#1C1C1A" />
      <g transform="translate(13 0)">
        <path d={PEBBLE_PATH} fill="#D4FF3A" />
        <path d={J_PATH} fill="#EDEDE8" />
      </g>
    </svg>
  );
}
