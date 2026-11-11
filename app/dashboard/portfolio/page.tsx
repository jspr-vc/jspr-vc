import { redirect } from "next/navigation";
import { getPortfolio } from "@/queries";
import { deleteUser } from "@/server/server-actions";
import { getCurrentUser } from "@/server/session";
import { DeleteZone } from "../_delete-zone";
import { PageHeader } from "../_page-header";
import { PortfolioForm } from "./_form";

export default async function PortfolioDashboard() {
  const user = await getCurrentUser();
  const portfolio = await getPortfolio(user.id);
  if (!portfolio) {
    redirect("/");
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <PageHeader title="Portfolio" />
        <PortfolioForm portfolio={portfolio} />
      </div>
      <DeleteZone
        noun="account"
        consequence="Your portfolio, experience, projects and posts are deleted immediately. This cannot be undone."
        action={deleteUser}
        redirectTo="/"
      />
    </div>
  );
}
