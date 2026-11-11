import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { portfolioMetadata } from "@/lib/portfolio-metadata";
import { getPortfolioSlugs, getPortfolioWithRelations } from "@/queries";
import { PortfolioPage } from "../_portfolio";

// The whole route is prerendered. Nothing here may render per request.
export const ensureStatic = "navigation";

type Props = {
  params: Promise<{ "portfolio-slug": string }>;
};

// Cache Components needs at least one param to prerender. The placeholder
// renders the 404 page when the database has no portfolios yet.
export async function generateStaticParams() {
  const portfolios = await getPortfolioSlugs();
  const slugs = portfolios.map((portfolio) => portfolio.slug);

  return (slugs.length > 0 ? slugs : ["-"]).map((slug) => ({
    "portfolio-slug": slug,
  }));
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { "portfolio-slug": slug } = await props.params;
  return portfolioMetadata(await getPortfolioWithRelations(slug), `/${slug}`);
}

export default async function PortfolioIndividualPage(props: Props) {
  const { "portfolio-slug": slug } = await props.params;
  const portfolio = await getPortfolioWithRelations(slug);

  if (!portfolio) {
    notFound();
  }

  return <PortfolioPage portfolio={portfolio} />;
}
