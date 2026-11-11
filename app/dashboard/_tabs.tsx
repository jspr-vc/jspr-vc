"use client";

import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const tabs = [
  { href: "/dashboard/portfolio", label: "portfolio" },
  { href: "/dashboard/experiences", label: "experience" },
  { href: "/dashboard/projects", label: "projects" },
  { href: "/dashboard/posts", label: "posts" },
];

export default function DashboardTabs() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Dashboard"
      className="no-scrollbar flex gap-7 overflow-x-auto font-mono"
    >
      {tabs.map((tab) => {
        const active = pathname.startsWith(tab.href);
        return (
          <NextLink
            key={tab.href}
            href={tab.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "border-b-2 py-3 text-[0.9375rem] transition-colors",
              active
                ? "border-dot text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            {tab.label}
          </NextLink>
        );
      })}
    </nav>
  );
}
