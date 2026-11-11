import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div>
      <Skeleton className="mb-6 h-8 w-40" />
      <div className="flex flex-col gap-px">
        {["a", "b", "c"].map((key) => (
          <Skeleton key={key} className="h-20 w-full" />
        ))}
      </div>
    </div>
  );
}
