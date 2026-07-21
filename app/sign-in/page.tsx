import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth-options";
import { AuthScreen } from "./_auth-screen";

export default async function SignInPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="flex flex-col justify-center items-center container p-8 lg:px-0 h-screen">
      <AuthScreen />
    </div>
  );
}
