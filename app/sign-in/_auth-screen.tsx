"use client";
import {
  IconBrandDiscordFilled,
  IconBrandGithubFilled,
} from "@tabler/icons-react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function AuthScreen() {
  return (
    <div className="mt-8 flex flex-col gap-2">
      <Button
        size="lg"
        onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
      >
        <IconBrandGithubFilled />
        Continue with GitHub
      </Button>
      <Button
        size="lg"
        variant="outline"
        onClick={() => signIn("discord", { callbackUrl: "/dashboard" })}
      >
        <IconBrandDiscordFilled />
        Continue with Discord
      </Button>
    </div>
  );
}
