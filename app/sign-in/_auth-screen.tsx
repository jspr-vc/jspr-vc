"use client";
import { Button } from "@/components/ui/button";
import { TypographyH3, TypographyP } from "@/components/ui/typography";
import {
  IconBrandDiscordFilled,
  IconBrandGithubFilled,
} from "@tabler/icons-react";
import { signIn } from "next-auth/react";

export function AuthScreen() {
  return (
    <div className="w-[350px] flex flex-col gap-2">
      <TypographyH3 className="text-center">Sign in / sign up</TypographyH3>
      <TypographyP className="text-center">
        You can always delete your account anytime
      </TypographyP>
      <div className="flex flex-col gap-2 text-foreground my-4">
        <Button variant="outline" size="sm" onClick={() => signIn("discord")}>
          <IconBrandDiscordFilled className="mr-2 h-4 w-4" />
          Login with Discord
        </Button>
        <Button variant="outline" size="sm" onClick={() => signIn("github")}>
          <IconBrandGithubFilled className="mr-2 h-4 w-4" />
          Login with Github
        </Button>
      </div>
    </div>
  );
}
