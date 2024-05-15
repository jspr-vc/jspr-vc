import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex w-full flex-col gap-4">
      <Skeleton className="item-start h-9 w-40" />
      <Skeleton className="h-28" />
    </div>
  );
}
