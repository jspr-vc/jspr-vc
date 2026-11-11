import { IconPlus } from "@tabler/icons-react";
import NextLink from "next/link";
import type { ReactNode } from "react";
import { LinkButton } from "@/components/link-button";

export function RowList({ children }: { children: ReactNode }) {
  return <ul className="border-t">{children}</ul>;
}

interface RowProps {
  href: string;
  meta: ReactNode;
  title: ReactNode;
  children?: ReactNode;
}

/*
 * One record in a dashboard list. The whole row opens the edit page.
 */
export function Row({ href, meta, title, children }: RowProps) {
  return (
    <li className="border-b">
      <NextLink
        href={href}
        className="group grid gap-x-8 gap-y-1 py-4 sm:grid-cols-[11rem_minmax(0,1fr)]"
      >
        <p className="pt-0.5 font-mono text-[0.8125rem] text-muted-foreground">
          {meta}
        </p>
        <div className="min-w-0">
          <h2 className="font-medium underline decoration-transparent underline-offset-4 transition-colors group-hover:decoration-dot">
            {title}
          </h2>
          {children}
        </div>
      </NextLink>
    </li>
  );
}

export function AddButton({ href, label }: { href: string; label: string }) {
  return (
    <LinkButton href={href} size="lg">
      <IconPlus />
      {label}
    </LinkButton>
  );
}

export function EmptyList({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-xl border border-dashed px-4 py-10 text-center text-muted-foreground text-sm">
      {children}
    </p>
  );
}

export function TagLine({ tags }: { tags: string[] }) {
  if (tags.length === 0) return null;
  return (
    <p className="mt-1 truncate font-mono text-muted-foreground text-xs">
      {tags.join("  ")}
    </p>
  );
}
