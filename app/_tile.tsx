import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

/*
 * The panel from the brand boards: an Ink surface with large corners, set on
 * the darker page ground.
 */
export function Tile({ className, ...props }: ComponentProps<"section">) {
  return (
    <section
      className={cn("rounded-tile bg-background p-6 sm:p-9 lg:p-12", className)}
      {...props}
    />
  );
}

export function TileHeading({ className, ...props }: ComponentProps<"h2">) {
  return (
    <h2
      className={cn(
        "font-mono font-semibold text-2xl tracking-mono-display sm:text-[2rem]",
        className,
      )}
      {...props}
    />
  );
}
