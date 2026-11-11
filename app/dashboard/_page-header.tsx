import { IconArrowLeft } from "@tabler/icons-react";
import NextLink from "next/link";
import type { ReactNode } from "react";

interface Props {
  title: string;
  back?: { href: string; label: string };
  children?: ReactNode;
}

export function PageHeader({ title, back, children }: Props) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        {back && (
          <NextLink
            href={back.href}
            className="mb-3 inline-flex items-center gap-1.5 font-mono text-muted-foreground text-sm transition-colors hover:text-foreground"
          >
            <IconArrowLeft className="size-4" />
            {back.label}
          </NextLink>
        )}
        <h1 className="font-semibold text-2xl tracking-tight">{title}</h1>
      </div>
      {children}
    </div>
  );
}
