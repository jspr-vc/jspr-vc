import "server-only";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth-options";

/*
 * The signed-in user for server components. Cached per browser session, so
 * dashboard routes can be prefetched with their session content and navigate
 * without a loading state. Server actions re-read the session themselves.
 */
export async function getCurrentUser() {
  "use cache: private";
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/sign-in");
  }
  return session.user;
}

export async function getOptionalUser() {
  "use cache: private";
  const session = await getServerSession(authOptions);
  return session?.user ?? null;
}
