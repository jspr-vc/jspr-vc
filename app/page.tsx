import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { portfolioMetadata } from "@/lib/portfolio-metadata";
import { getFirstPortfolio } from "@/queries";
import { PortfolioPage } from "./_portfolio";

// The whole route is prerendered. Nothing here may render per request.
export const ensureStatic = "navigation";

export async function generateMetadata(): Promise<Metadata> {
  return portfolioMetadata(await getFirstPortfolio(), "");
}

export default async function AboutPage() {
  const portfolio = await getFirstPortfolio();

  if (!portfolio) {
    notFound();
  }

  return <PortfolioPage portfolio={portfolio} />;
}
