"use client";
import {
  TypographyH2,
  TypographyH4,
  TypographySmall,
} from "@/components/ui/typography";
import { env } from "@/env.mjs";
import { cn } from "@/lib/utils";
import type { GetPortfolioWithRelations } from "@/queries";
import { IconArrowUpRight } from "@tabler/icons-react";
import { format } from "date-fns";
import NextImage from "next/image";
import NextLink from "next/link";

interface Props {
  posts: GetPortfolioWithRelations["posts"];
  authorName: string;
}

export function PostList({ posts = [], authorName }: Props) {
  return (
    <div id="posts" className="flex flex-col gap-4 scroll-m-8">
      <TypographyH2 className="border-none">Posts</TypographyH2>
      <div className="flex flex-col gap-2">
        {posts.map((post) => (
          <NextLink
            href={`/posts/${post.slug}`}
            target="_blank"
            className={cn(
              "p-4 flex flex-col-reverse sm:flex-row gap-4 group cursor-pointer transition-all rounded",
              "hover:bg-card/50 sm:bg-transparent bg-card/30 border border-muted sm:border-none",
            )}
            key={post.id}
          >
            <NextImage
              className="bg-white sm:h-[76px] sm:w-36 w-full flex-shrink-0 shadow aspect-[40/21] rounded"
              src={
                post.thumbnail ||
                `${env.NEXT_PUBLIC_URL}/og/post?${new URLSearchParams({
                  title: post.title,
                  slug: post.slug,
                  author: authorName,
                }).toString()}`
              }
              alt="thumbnail"
              width={1920}
              height={1080}
            />
            <div className="flex flex-col flex-1 gap-2">
              {post.publishedAt && (
                <TypographySmall className="text-sm text-muted-foreground/50 leading-none">
                  {format(post.publishedAt, "MMMM yyyy")}
                </TypographySmall>
              )}
              <TypographyH4 className="leading-none transition-colors text-foreground/90 group-hover:text-foreground">
                {post.title}
                <IconArrowUpRight className="w-4 h-4 ml-1 inline text-muted-foreground group-hover:text-foreground transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </TypographyH4>
              <TypographySmall className="leading-none">
                {post.excerpt}
              </TypographySmall>
            </div>
          </NextLink>
        ))}
      </div>
    </div>
  );
}
