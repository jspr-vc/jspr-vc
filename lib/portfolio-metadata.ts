import type { Metadata } from "next";
import { env } from "@/env";
import { portfolioOgParams } from "@/lib/og-params";
import { sanitizeMarkdown } from "@/lib/sanitize-md";
import type { GetPortfolioWithRelations } from "@/queries";

export function portfolioMetadata(
  portfolio: GetPortfolioWithRelations | undefined,
  path: string,
): Metadata {
  const title = `${portfolio?.name || "Portfolio"} — Portfolio`;
  const description =
    sanitizeMarkdown(portfolio?.headline) || "A full-stack portfolio website";
  const pageUrl = `${env.NEXT_PUBLIC_URL}${path}`;

  const image = `${env.NEXT_PUBLIC_URL}/og/portfolio?${portfolioOgParams({
    name: portfolio?.name || "",
    url: env.NEXT_PUBLIC_URL.replace("https://", ""),
    headline: portfolio?.headline || "",
    github: portfolio?.socialLinks?.github || "",
    linkedin: portfolio?.socialLinks?.linkedin || "",
    twitter: portfolio?.socialLinks?.twitter || "",
    website: portfolio?.socialLinks?.website || "",
  })}`;

  return {
    title: { absolute: title },
    description,
    openGraph: {
      images: [image],
      title,
      description,
      url: pageUrl,
      type: "profile",
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
