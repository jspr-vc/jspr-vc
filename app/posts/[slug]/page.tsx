import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { siteConfig } from "@/config/site";
import { env } from "@/env";
import { postOgParams } from "@/lib/og-params";
import { sanitizeMarkdown } from "@/lib/sanitize-md";
import { getPublicPost, getPublicPosts } from "@/queries";
import { PostPageContent } from "../_post";

// The whole route is prerendered. Nothing here may render per request.
export const ensureStatic = "navigation";

type Props = {
  params: Promise<{ slug: string }>;
};

// Cache Components needs at least one param to prerender. The placeholder
// renders the 404 page when nothing is published yet.
export async function generateStaticParams() {
  const posts = await getPublicPosts();
  const slugs = posts.map((post) => post.slug);

  return (slugs.length > 0 ? slugs : ["-"]).map((slug) => ({ slug }));
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const post = await getPublicPost(params.slug);
  const title = `${post?.title || "Blog"} — ${siteConfig.name}`;
  const description = sanitizeMarkdown(post?.excerpt || "");
  const pageUrl = `${env.NEXT_PUBLIC_URL}/posts/${params.slug}`;

  const image = `${env.NEXT_PUBLIC_URL}/og/post?${postOgParams({
    title: post?.title || "",
    slug: post?.slug || "",
    author: post?.author.name || "",
    excerpt: post?.excerpt || "",
  })}`;

  return {
    title: { absolute: title },
    description,
    openGraph: {
      images: [image],
      title,
      description,
      url: pageUrl,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      images: [image],
      title,
      description,
      site: pageUrl,
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
