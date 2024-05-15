import "@/styles/globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { siteConfig } from "@/config/site";
import { fontSans } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import { Analytics } from "@vercel/analytics/react";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout(props: { children: ReactNode }) {
  return (
    <html lang="en">
      <head />
      <body
        suppressHydrationWarning
        className={cn(
          "relative min-h-screen bg-background font-sans text-muted-foreground antialiased",
          fontSans.variable,
        )}
        style={{
          backgroundImage:
            "radial-gradient(circle at 100% 80%, var(--bg-ring) 0%, transparent 100%), radial-gradient(circle at 20px 20px, var(--dots) 2%, transparent 0%)",
          backgroundSize: "100% 100%, 50px 50px",
          backgroundAttachment: "fixed",
        }}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {props.children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
