import { env } from "@/env.mjs";
import { portfolioOgParams } from "@/lib/og-params";
import { sanitizeMarkdown } from "@/lib/sanitize-md";
import { getPortfolioWithRelations, getPortfolios } from "@/queries";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PortfolioPage } from "../_portfolio";

export const revalidate = 30;

type Props = {
  params: Promise<{ "portfolio-slug": string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateStaticParams() {
  const portfolios = await getPortfolios();

  return portfolios.map((portfolio) => {
    return {
      "portfolio-slug": portfolio.slug,
    };
  });
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;

  const { "portfolio-slug": portfolioSlug = "" } = params;

  const portfolio = await getPortfolioWithRelations(portfolioSlug);
  const title = `${portfolio?.name || "Portfolio"} — Portfolio`;
  const description =
    sanitizeMarkdown(portfolio?.headline) || "A full-stack portfolio website";

  const url = `${env.NEXT_PUBLIC_URL}/og/portfolio?${portfolioOgParams({
    name: portfolio?.name || "",
    url: env.NEXT_PUBLIC_URL.replace("https://", ""),
    headline: portfolio?.headline || "",
    github: portfolio?.socialLinks?.github || "",
    linkedin: portfolio?.socialLinks?.linkedin || "",
    twitter: portfolio?.socialLinks?.twitter || "",
    website: portfolio?.socialLinks?.website || "",
  })}`;

  return {
    title,
    description,
    openGraph: {
      images: [url],
      title,
      description,
      url: `${env.NEXT_PUBLIC_URL}/${portfolioSlug}`,
      type: "profile",
    },
    twitter: {
      card: "summary_large_image",
      images: [url],
      title,
      description,
      site: `${env.NEXT_PUBLIC_URL}/${portfolioSlug}`,
    },
  };
}

export default async function PortfolioIndividualPage(props: Props) {
  const params = await props.params;
  const { "portfolio-slug": portofolioSlug = "" } = params;
  const portfolio = await getPortfolioWithRelations(portofolioSlug);

  if (!portfolio) {
    notFound();
  }

  return <PortfolioPage portfolio={portfolio} />;
}
