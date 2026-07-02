"use client";

import { useState, useEffect } from "react";
import type { Recipe } from "@/lib/schemas";
import { getRecipes, deleteRecipe } from "@/lib/actions/recipes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Trash2Icon, FileDownIcon } from "lucide-react";
import { downloadRecipePdf } from "@/lib/recipe-pdf";

interface SavedRecipe extends Recipe {
  id: string;
  createdAt: string | Date;
}

interface Props {
  onSelect: (recipe: SavedRecipe) => void;
}

export default function SavedRecipes({ onSelect }: Props) {
  const [recipes, setRecipes] = useState<SavedRecipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    getRecipes()
      .then((data) => {
        if (!cancelled) setRecipes(data as SavedRecipe[]);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const remove = async (id: string) => {
    try {
      await deleteRecipe(id);
      setRecipes((prev) => prev.filter((r) => r.id !== id));
    } catch {
      console.error("Failed to delete recipe");
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Saved Recipes
            </CardTitle>
            <Skeleton className="h-3 w-12" />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="max-h-64">
            <div className="divide-y divide-border">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="px-5 py-3 flex items-center justify-between">
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                  <Skeleton className="h-4 w-4 ml-4" />
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    );
  }

  if (recipes.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-[10px] uppercase tracking-wider text-muted-foreground">
            Saved Recipes
          </CardTitle>
          <span className="font-mono text-[10px] text-muted-foreground">
            {recipes.length} items
          </span>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="max-h-64">
          <div className="divide-y divide-border">
            {recipes.map((r) => (
              <div
                key={r.id}
                className="px-5 py-3 flex items-center justify-between group hover:bg-muted/50 transition cursor-pointer"
                onClick={() => onSelect(r)}
              >
                <div className="min-w-0">
                  <h4 className="text-sm font-medium text-foreground truncate tracking-tight">
                    {r.title}
                  </h4>
                  <p className="text-[10px] font-mono text-muted-foreground mt-0.5">
                    {r.servings} units · {r.difficulty} ·{" "}
                    {new Date(r.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      downloadRecipePdf(r);
                    }}
                    className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-primary"
                    title="Download PDF"
                  >
                    <FileDownIcon />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      setConfirmId(r.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive"
                    title="Remove recipe"
                >
                  <Trash2Icon />
                </Button>
              </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
      {confirmId && (
        <Dialog open onOpenChange={(open) => !open && setConfirmId(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete recipe?</DialogTitle>
            </DialogHeader>
            <DialogDescription>
              Are you sure you want to remove &ldquo;
              {recipes.find((r) => r.id === confirmId)?.title}&rdquo;? This
              action cannot be undone.
            </DialogDescription>
            <DialogFooter>
              <Button variant="outline" onClick={() => setConfirmId(null)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={async () => {
                  await remove(confirmId);
                  setConfirmId(null);
                }}
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </Card>
  );
}
