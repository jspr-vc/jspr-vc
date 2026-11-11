import Link from "next/link";
import type { ReactNode } from "react";
import { Wordmark } from "@/components/brand/logo";
import { ThemeToggle } from "@/components/theme-toggle";

export function SiteHeader({ children }: { children?: ReactNode }) {
  return (
    <header className="mx-auto flex h-20 max-w-[76rem] items-center justify-between gap-4 px-4 sm:px-6">
      <Link
        href="/"
        aria-label="jspr.vc, home"
        className="shrink-0 rounded-sm pl-2"
      >
        <Wordmark className="text-[2rem]" />
      </Link>
      <div className="flex min-w-0 items-center gap-1 sm:gap-4">
        {children}
        <ThemeToggle />
      </div>
    </header>
  );
}

export function HeaderNav({ children }: { children: ReactNode }) {
  return (
    <nav
      aria-label="Sections"
      className="hidden items-center gap-7 font-mono text-[0.9375rem] sm:flex"
    >
      {children}
    </nav>
  );
}

export function HeaderNavLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      className="border-transparent border-b-2 py-1 text-muted-foreground transition-colors hover:border-dot hover:text-foreground"
    >
      {children}
    </a>
  );
}
