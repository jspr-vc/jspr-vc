// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { type DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "admin" | "default";
      portfolioId: number;
      portfolioSlug: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role: "admin" | "default";
    portfolioId: number;
    portfolioSlug: string;
  }

  /**
   * Usually contains information about the provider being used
   * and also extends `TokenSet`, which is different tokens returned by OAuth Providers.
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface Account {}

  /** The OAuth profile returned from your provider */
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface Profile {}
}
