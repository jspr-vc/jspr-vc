import Link from "next/link";
import { Wordmark } from "@/components/brand/logo";

export function SiteFooter() {
  return (
    <footer className="mx-auto flex max-w-[76rem] items-center justify-between gap-4 px-6 py-10 font-mono text-muted-foreground text-sm sm:px-8">
      <Wordmark className="text-xl" />
      <Link
        href="/dashboard"
        prefetch={false}
        className="transition-colors hover:text-foreground"
      >
        dashboard
      </Link>
    </footer>
  );
}
