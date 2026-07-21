import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import type { ReactNode } from "react";
import { AuthMenu } from "@/components/auth-menu";
import { preloadGetPortfolio } from "@/queries";
import { authOptions } from "@/server/auth-options";
import DashboardTabs from "./_tabs";

interface Props {
  children: ReactNode;
}

export default async function DashboardLayout({ children }: Props) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/sign-in");
  }

  preloadGetPortfolio(session.user.id);

  return (
    <div className="container p-4 md:p-8">
      <div className="flex flex-col gap-4">
        <div className="self-end">
          <AuthMenu user={session.user} />
        </div>
        <main className="flex flex-col gap-4">
          <DashboardTabs isAdmin={session.user.role === "admin"} />
          {children}
        </main>
      </div>
    </div>
  );
}
