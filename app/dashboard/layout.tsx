import type { Metadata } from "next";
import NextLink from "next/link";
import { type ReactNode, Suspense } from "react";
import { AuthMenu } from "@/components/auth-menu";
import { Wordmark } from "@/components/brand/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { getCurrentUser } from "@/server/session";
import DashboardTabs from "./_tabs";

export const metadata: Metadata = { title: "Dashboard" };

interface Props {
  children: ReactNode;
}

export default function DashboardLayout({ children }: Props) {
  return (
    <div className="min-h-dvh bg-ground pb-10">
      <div className="mx-auto max-w-[64rem] px-3 sm:px-6">
        <header>
          <div className="flex h-20 items-center justify-between gap-4 px-2">
            <NextLink
              href="/"
              aria-label="jspr.vc, home"
              className="shrink-0 rounded-sm"
            >
              <Wordmark className="text-[2rem]" />
            </NextLink>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Suspense
                fallback={<div className="size-8 rounded-full bg-muted" />}
              >
                <CurrentUserMenu />
              </Suspense>
            </div>
          </div>
          <div className="px-2 sm:px-3">
            <Suspense fallback={<div className="h-[46px]" />}>
              <DashboardTabs />
            </Suspense>
          </div>
        </header>
        <main className="mt-3 rounded-tile bg-background p-6 sm:p-9">
          {children}
        </main>
      </div>
    </div>
  );
}

async function CurrentUserMenu() {
  const user = await getCurrentUser();
  return <AuthMenu user={user} />;
}
