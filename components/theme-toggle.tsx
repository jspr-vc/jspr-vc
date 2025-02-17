"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { IconMoonFilled, IconSunFilled } from "@tabler/icons-react";
import { useTheme } from "next-themes";

interface Props {
  size?: "sm" | "md";
}
export function ThemeToggle({ size = "md" }: Props) {
  const { setTheme, theme } = useTheme();

  const small = size === "sm";
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className={cn(small ? "w-9 h-9" : "")}
    >
      <IconSunFilled
        className={cn(
          "rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0",
          small && "w-6 h-6",
        )}
      />
      <IconMoonFilled
        className={cn(
          "absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100",
          small && "w-6 h-6",
        )}
      />
    </Button>
  );
}
