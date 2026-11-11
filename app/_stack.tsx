interface Tech {
  id: number;
  name: string;
  description: string | null;
}

/*
 * Tech tags with a CSS-only description on hover or keyboard focus.
 */
export function Stack({ items }: { items: Tech[] }) {
  if (items.length === 0) return null;

  return (
    <ul className="mt-5 flex flex-wrap gap-1.5">
      {items.map((tech) => (
        <li key={tech.id} className="group/tech relative">
          <span
            tabIndex={tech.description ? 0 : undefined}
            aria-describedby={tech.description ? `tech-${tech.id}` : undefined}
            className="inline-flex h-7 items-center rounded-md bg-muted px-2.5 font-mono text-[0.8125rem] text-soft transition-colors group-hover/tech:text-foreground"
          >
            {tech.name}
          </span>
          {tech.description && (
            <span
              role="tooltip"
              id={`tech-${tech.id}`}
              className="pointer-events-none invisible absolute bottom-full left-0 z-10 mb-2 w-max max-w-[min(18rem,70vw)] rounded-md bg-foreground px-2.5 py-1.5 text-background text-xs leading-snug opacity-0 transition-opacity group-focus-within/tech:visible group-focus-within/tech:opacity-100 group-hover/tech:visible group-hover/tech:opacity-100"
            >
              {tech.description}
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}
