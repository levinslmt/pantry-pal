"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function RecipeCardSkeleton() {
  return (
    <Card className="max-w-2xl">
      <CardContent className="space-y-4 p-6">
        <div className="space-y-3">
          <div className="flex gap-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-28" />
          </div>
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-3 w-10" />
              <Skeleton className="h-4 w-14" />
            </div>
          ))}
        </div>
        <div className="space-y-3">
          <Skeleton className="h-3 w-32" />
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex gap-2">
              <Skeleton className="h-4 w-4 shrink-0" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </div>
        <div className="space-y-3">
          <Skeleton className="h-3 w-28" />
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex gap-2">
              <Skeleton className="h-5 w-5 shrink-0" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </div>
        <div className="space-y-2">
          <Skeleton className="h-3 w-24" />
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-3 w-full" />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
