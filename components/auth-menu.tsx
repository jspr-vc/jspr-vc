"use client";
import type { GetPortfolio } from "@/queries";
import { IconBrandTabler, IconLogout, IconUser } from "@tabler/icons-react";
import type { User } from "next-auth";
import { signOut } from "next-auth/react";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface Props {
  user: User;
}

export function AuthMenu({ user }: Props) {
  const router = useRouter();
  const navigateToPortfolio = async () => {
    try {
      const result = await fetch(`/api/profile/${user.id}`);
      const newPortfolio: GetPortfolio = await result.json();
      router.push(`/${newPortfolio.slug}`);
    } catch (e) {
      console.error(e);
    }
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer">
          <AvatarImage
            className="m-0"
            src={user.image ?? ""}
            alt={user.name ?? ""}
          />
          <AvatarFallback>{(user.name ?? "")[0] ?? ""}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-card/90" align="end">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none text-foreground">
              {user.name}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={navigateToPortfolio}>
            <IconUser className="mr-2 h-4 w-4" />
            <span>Portfolio Page</span>
          </DropdownMenuItem>
          <NextLink href="/dashboard">
            <DropdownMenuItem>
              <IconBrandTabler className="mr-2 h-4 w-4" />
              <span>Dashboard</span>
            </DropdownMenuItem>
          </NextLink>
          <DropdownMenuItem onClick={() => signOut()}>
            <IconLogout className="mr-2 h-4 w-4" />
            <span>Logout</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
