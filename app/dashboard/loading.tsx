import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Skeleton className="h-5 w-5 rounded-full" />
    </div>
  );
}
