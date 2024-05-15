import { cn } from "@/lib/utils";
import { type HTMLAttributes, forwardRef } from "react";

export const TypographyH1 = forwardRef<
  HTMLHeadingElement,
  HTMLAttributes<HTMLHeadingElement>
>(function TypographyH1({ className, ...props }, ref) {
  return (
    <h1
      className={cn(
        "text-4xl font-extrabold tracking-tight text-foreground lg:text-5xl",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});

export const TypographyH2 = forwardRef<
  HTMLHeadingElement,
  HTMLAttributes<HTMLHeadingElement>
>(function TypographyH2({ className, ...props }, ref) {
  return (
    <h2
      className={cn(
        "scroll-m-20 pb-2 text-3xl font-semibold tracking-tight text-foreground transition-colors first:mt-0",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});

export const TypographyH3 = forwardRef<
  HTMLHeadingElement,
  HTMLAttributes<HTMLHeadingElement>
>(function TypographyH3({ className, ...props }, ref) {
  return (
    <h3
      className={cn(
        "scroll-m-20 text-2xl font-semibold tracking-tight text-foreground",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});

export const TypographyH4 = forwardRef<
  HTMLHeadingElement,
  HTMLAttributes<HTMLHeadingElement>
>(function TypographyH4({ className, ...props }, ref) {
  return (
    <h4
      className={cn(
        "scroll-m-20 text-xl font-semibold tracking-tight text-foreground",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});

export const TypographyP = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>(function TypographyP({ className, ...props }, ref) {
  return (
    <p
      className={cn("leading-7", className)}
      // className={cn("leading-7 [&:not(:first-child)]:mt-6", className)}
      ref={ref}
      {...props}
    />
  );
});

export const TypographyBlockquote = forwardRef<
  HTMLQuoteElement,
  HTMLAttributes<HTMLQuoteElement>
>(function TypographyBlockquote({ className, ...props }, ref) {
  return (
    <blockquote
      className={cn("mt-6 border-l-2 pl-6 italic", className)}
      ref={ref}
      {...props}
    />
  );
});

export const TypographyInlineCode = forwardRef<
  HTMLElement,
  HTMLAttributes<HTMLElement>
>(function TypographyInlineCode({ className, ...props }, ref) {
  return (
    <code
      className={cn(
        "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});

export const TypographyLead = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>(function TypographyLead({ className, ...props }, ref) {
  return (
    <p
      className={cn("text-xl text-muted-foreground", className)}
      ref={ref}
      {...props}
    />
  );
});

export const TypographyLarge = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(function TypographyLarge({ className, ...props }, ref) {
  return (
    <div
      className={cn("text-lg font-semibold", className)}
      ref={ref}
      {...props}
    />
  );
});

export const TypographySmall = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(function TypographySmall({ className, ...props }, ref) {
  return (
    <div
      className={cn("text-sm font-medium leading-none", className)}
      ref={ref}
      {...props}
    />
  );
});

export const TypographyMuted = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>(function TypographyMuted({ className, ...props }, ref) {
  return (
    <p
      className={cn("text-sm text-muted-foreground", className)}
      ref={ref}
      {...props}
    />
  );
});
