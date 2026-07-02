"use client";

import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircleIcon } from "lucide-react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <Card className="max-w-sm w-full text-center">
        <CardHeader>
          <div className="flex justify-center mb-2">
            <div className="size-10 rounded-lg bg-destructive/10 flex items-center justify-center">
              <AlertCircleIcon className="size-5 text-destructive" />
            </div>
          </div>
          <CardTitle>Something went wrong</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground font-mono max-w-xs mx-auto">
            {error.message || "An unexpected error occurred."}
          </p>
          <Button onClick={reset} variant="default" size="sm">
            Try again
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
