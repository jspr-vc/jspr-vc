import NextImage from "next/image";
import NextLink from "next/link";
import { MarkdownWithCode } from "@/components/markdown";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { formatDay } from "@/lib/format";
import type { GetPublicPost } from "@/queries";

interface Props {
  post: NonNullable<GetPublicPost>;
}

export function PostPageContent({ post }: Props) {
  return (
    <div className="min-h-dvh bg-ground">
      <SiteHeader>
        <NextLink
          href={`/${post.author.slug}`}
          className="truncate font-mono text-muted-foreground text-sm transition-colors hover:text-foreground"
        >
          {post.author.name}
        </NextLink>
      </SiteHeader>

      <main className="mx-auto max-w-[76rem] px-3 sm:px-6">
        <article className="rounded-tile bg-background px-6 py-12 sm:px-9 sm:py-16 lg:py-20">
          <div className="mx-auto max-w-[70ch]">
            <header>
              {post.publishedAt && (
                <p className="font-mono text-muted-foreground text-sm">
                  <time dateTime={post.publishedAt.toISOString()}>
                    {formatDay(post.publishedAt)}
                  </time>
                </p>
              )}
              <h1 className="mt-4 text-balance font-semibold text-[clamp(2.25rem,6vw,4rem)] leading-[1.02] tracking-[-0.05em]">
                {post.title}
              </h1>
              {post.excerpt && (
                <p className="mt-6 font-mono text-lg text-soft leading-snug sm:text-xl">
                  {post.excerpt}
                </p>
              )}
            </header>
            {post.thumbnail && (
              <NextImage
                className="mt-10 w-full rounded-xl border"
                alt=""
                width={1200}
                height={630}
                sizes="(min-width: 768px) 720px, 92vw"
                priority
                src={post.thumbnail}
              />
            )}
            <MarkdownWithCode
              content={post.body}
              className="mt-10 text-[1.0625rem]"
            />
          </div>
        </article>
      </main>

      <SiteFooter />
    </div>
  );
}
