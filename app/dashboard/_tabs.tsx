"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { LinkButton, type LinkButtonProps } from "@/components/ui/button";
import { usePathname } from "next/navigation";

interface Props {
  isAdmin?: boolean;
}

export default function DashboardTabs({ isAdmin = false }: Props) {
  const pathname = usePathname();
  const getProps = (path: string): LinkButtonProps["variant"] =>
    pathname.startsWith(path) ? "default" : "ghost";

  return (
    <div className="p-2 gap-2 rounded-md flex flex-row flex-nowrap bg-card/30 ring-1 ring-muted self-start">
      <LinkButton
        variant={getProps("/dashboard/portfolio")}
        href="/dashboard/portfolio"
        size="sm"
      >
        Portfolio
      </LinkButton>
      <LinkButton
        variant={getProps("/dashboard/experiences")}
        href="/dashboard/experiences"
        size="sm"
      >
        Experiences
      </LinkButton>
      <LinkButton
        variant={getProps("/dashboard/projects")}
        href="/dashboard/projects"
        size="sm"
      >
        Projects
      </LinkButton>
      <LinkButton
        variant={getProps("/dashboard/posts")}
        href="/dashboard/posts"
        size="sm"
      >
        Posts
      </LinkButton>
      {isAdmin && (
        <LinkButton
          variant={getProps("/dashboard/admin")}
          href="/dashboard/admin"
          size="sm"
        >
          Admin
        </LinkButton>
      )}
      <ThemeToggle size="sm" />
    </div>
  );
}
