import { ThemeToggle } from "@/components/theme-toggle";
import { MarkdownWithCode } from "@/components/ui/md-prism";
import { Separator } from "@/components/ui/separator";
import {
  TypographyH2,
  TypographyLarge,
  TypographySmall,
} from "@/components/ui/typography";
import type { GetPublicPost } from "@/queries";
import { format } from "date-fns/esm";
import NextImage from "next/image";
import NextLink from "next/link";

interface Props {
  post: NonNullable<GetPublicPost>;
}

export function PostPageContent({ post }: Props) {
  return (
    <div className="mx-auto min-h-screen max-w-screen-xl py-16 px-4 sm:px-8 lg:py-20">
      <div className="flex flex-col gap-8">
        <header className="flex flex-col gap-1">
          <TypographyH2 className="font-extrabold leading-none">
            {post.title}
          </TypographyH2>
          <TypographyLarge className="leading-none">
            {post.excerpt}
          </TypographyLarge>
          <div className="flex items-center gap-2 my-2">
            <NextLink
              href={`/${post.author.slug}`}
              className="text-sm text-foreground font-bold"
            >
              {post.author.name}
            </NextLink>
            <Separator orientation="vertical" className="h-5" />
            {post.publishedAt && (
              <TypographySmall className="text-center">
                {format(post.publishedAt, "MMMM dd, yyyy")}
              </TypographySmall>
            )}
            <Separator orientation="vertical" className="h-5" />
            <ThemeToggle size="sm" />
          </div>
        </header>
        {post.thumbnail && (
          <div className="flex flex-col gap-2 aspect-[41/20]">
            <NextImage
              className="rounded"
              alt="thumbnail"
              width={1200}
              height={630}
              src={post.thumbnail}
            />
          </div>
        )}
        <main className="markdown-body">
          <MarkdownWithCode content={post.body} />
        </main>
      </div>
    </div>
  );
}
