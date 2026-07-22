import { cn } from "@/lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  );
}

function InputSkeleton({ className }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <Skeleton className="w-32 h-2" />
      <Skeleton className="w-full h-6" />
    </div>
  );
}

function TextareaSkeleton({ className }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <Skeleton className="w-32 h-2" />
      <Skeleton className="w-full h-24" />
    </div>
  );
}

export { InputSkeleton, Skeleton, TextareaSkeleton };
