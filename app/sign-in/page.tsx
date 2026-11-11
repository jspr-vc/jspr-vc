import { redirect } from "next/navigation";
import { Suspense } from "react";
import { Wordmark } from "@/components/brand/logo";
import { getOptionalUser } from "@/server/session";
import { AuthScreen } from "./_auth-screen";

export default function SignInPage() {
  return (
    <main className="grid min-h-dvh place-items-center px-5 py-12">
      <div className="w-full max-w-xs">
        <Wordmark className="text-4xl" />
        <h1 className="mt-10 font-semibold text-2xl tracking-tight">Sign in</h1>
        <p className="mt-2 text-muted-foreground text-sm">
          New here? Signing in creates your portfolio. You can delete your
          account at any time.
        </p>
        <AuthScreen />
        <Suspense>
          <RedirectIfSignedIn />
        </Suspense>
      </div>
    </main>
  );
}

async function RedirectIfSignedIn() {
  if (await getOptionalUser()) {
    redirect("/dashboard");
  }
  return null;
}
