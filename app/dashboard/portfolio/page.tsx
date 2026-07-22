import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { getPortfolio } from "@/queries";
import { authOptions } from "@/server/auth-options";
import { PortfolioDangerZone } from "./_danger_zone";
import { PortfolioForm } from "./_form";

export default async function PortfolioDashboard() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/sign-in");
  }

  const portfolio = await getPortfolio(session.user.id);
  if (!portfolio) {
    redirect("/");
  }

  return (
    <div className="flex flex-col gap-4">
      <PortfolioForm portfolio={portfolio} />
      <PortfolioDangerZone />
    </div>
  );
}
