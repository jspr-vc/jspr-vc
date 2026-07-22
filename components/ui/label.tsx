"use client";

import { cva } from "class-variance-authority";
import type * as React from "react";

import { cn } from "@/lib/utils";

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
);

function Label({ className, ...props }: React.ComponentProps<"label">) {
  // biome-ignore lint/a11y/noLabelWithoutControl: reusable label primitive; the control is associated via htmlFor at call sites (e.g. FormLabel)
  return <label className={cn(labelVariants(), className)} {...props} />;
}

export { Label };
