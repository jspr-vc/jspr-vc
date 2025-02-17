import "@/styles/github-markdown.css";
import { siteConfig } from "@/config/site";
import { env } from "@/env.mjs";
import { postOgParams } from "@/lib/og-params";
import { sanitizeMarkdown } from "@/lib/sanitize-md";
import { getPublicPost, getPublicPosts } from "@/queries";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PostPageContent } from "../_post";

export const revalidate = 30;

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateStaticParams() {
  const portfolios = await getPublicPosts();

  return portfolios.map((portfolio) => {
    return {
      slug: portfolio.slug,
    };
  });
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const post = await getPublicPost(params.slug);
  const title = `${post?.title || "Blog"} — ${siteConfig.name}`;
  const description = sanitizeMarkdown(post?.excerpt || "");

  const relativeUrl = `/og/post?${postOgParams({
    title: post?.title || "",
    slug: post?.slug || "",
    author: post?.author.name || "",
    excerpt: post?.excerpt || "",
  })}`;

  const url = `${env.NEXT_PUBLIC_URL}${relativeUrl}`;

  return {
    title,
    description,
    openGraph: {
      images: [url],
      title,
      description,
      url: `${env.NEXT_PUBLIC_URL}/posts/${params.slug}`,
      type: "profile",
    },
    twitter: {
      card: "summary_large_image",
      images: [url],
      title,
      description,
      site: `${env.NEXT_PUBLIC_URL}/posts/${params.slug}`,
    },
  };
}
export default async function PostPage(props: Props) {
  const params = await props.params;
  const post = await getPublicPost(params.slug);
  if (!post) {
    notFound();
  }

  return <PostPageContent post={post} />;
}
