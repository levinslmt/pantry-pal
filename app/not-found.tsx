import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Page Not Found | PantryPal",
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="text-center">
        <p className="text-6xl font-bold text-muted-foreground/40 font-mono">
          404
        </p>
        <h1 className="mt-4 text-lg font-semibold tracking-tight text-foreground">
          Page not found
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Button render={<Link href="/" />} nativeButton={false} className="mt-6" size="sm">
          Back to home
        </Button>
      </div>
    </div>
  );
}
