"use client";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { GetPortfolioWithRelations } from "@/queries";
import { useState } from "react";

interface Props {
  tech: GetPortfolioWithRelations["experiences"][number]["stack"][number]["tech"];
}

export function StackItem({ tech }: Props) {
  const [opened, setOpened] = useState(false);

  return (
    <TooltipProvider>
      <Tooltip open={opened} onOpenChange={setOpened}>
        <TooltipTrigger className="leading-none">
          <Badge
            variant="secondary"
            className="text-muted-foreground hover:text-foreground"
          >
            {tech.name}
          </Badge>
        </TooltipTrigger>
        {tech.description && (
          <TooltipContent>{tech.description}</TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
}
