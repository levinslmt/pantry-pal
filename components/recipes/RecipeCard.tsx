"use client";

import type { Recipe } from "@/lib/schemas";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  BookmarkIcon, 
  ClockIcon, 
  UsersIcon, 
  ChefHatIcon, 
  FlameIcon,
  SparklesIcon,
  Loader2Icon,
  FileDownIcon,
} from "lucide-react";
import { downloadRecipePdf } from "@/lib/recipe-pdf";

interface Props {
  recipe: Recipe;
  isStreaming?: boolean;
  onSave?: () => void;
  isSaved?: boolean;
  saving?: boolean;
}

export default function RecipeCard({ recipe, isStreaming, onSave, isSaved, saving }: Props) {
  if (!recipe.title && !recipe.ingredients?.length) return null;

  return (
    <Card className="overflow-hidden border-border/50 shadow-sm hover:shadow-md transition-shadow duration-300">
      {/* Header with subtle gradient */}
      <div className="relative px-6 py-5 bg-gradient-to-br from-primary/5 via-background to-background border-b border-border/50">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 text-[10px] font-medium">
                <SparklesIcon className="size-3 mr-1" /> AI Generated
              </Badge>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              {recipe.title || "Creating your recipe..."}
              {isStreaming && (
                <span className="inline-block w-1.5 h-5 bg-primary animate-pulse ml-1 align-middle rounded-sm"></span>
              )}
            </h2>
            {recipe.description && (
              <p className="text-sm text-muted-foreground max-w-lg leading-relaxed">
                {recipe.description}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {onSave && !isStreaming && recipe?.title && (
              <Button
                variant="outline"
                size="icon"
                onClick={() => downloadRecipePdf(recipe)}
                title="Download PDF"
                className="shrink-0 text-muted-foreground"
              >
                <FileDownIcon className="size-4" />
              </Button>
            )}
            {onSave && (
              <Button
                variant="outline"
                size="icon"
                onClick={onSave}
                disabled={saving}
                title={isSaved ? "Saved" : "Save recipe"}
                className={`shrink-0 ${isSaved ? "bg-primary/10 border-primary/20 text-primary" : "text-muted-foreground"}`}
              >
                {saving ? (
                  <Loader2Icon className="size-4 animate-spin" />
                ) : (
                  <BookmarkIcon fill={isSaved ? "currentColor" : "none"} className="size-4" />
                )}
              </Button>
            )}
          </div>
        </div>
      </div>

      <CardContent className="p-0 divide-y divide-border/50">
        {/* Stats Grid */}
        <div className="px-6 py-4 grid grid-cols-2 sm:grid-cols-4 gap-4 bg-muted/20">
          {recipe.servings && (
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-lg bg-background border border-border flex items-center justify-center">
                <UsersIcon className="size-4 text-muted-foreground" />
              </div>
              <div>
                <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Servings</div>
                <div className="text-sm font-semibold text-foreground">{recipe.servings}</div>
              </div>
            </div>
          )}
          {recipe.prepTime && (
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-lg bg-background border border-border flex items-center justify-center">
                <ClockIcon className="size-4 text-muted-foreground" />
              </div>
              <div>
                <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Prep</div>
                <div className="text-sm font-semibold text-foreground">{recipe.prepTime}m</div>
              </div>
            </div>
          )}
          {recipe.cookTime && (
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-lg bg-background border border-border flex items-center justify-center">
                <FlameIcon className="size-4 text-muted-foreground" />
              </div>
              <div>
                <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Cook</div>
                <div className="text-sm font-semibold text-foreground">{recipe.cookTime}m</div>
              </div>
            </div>
          )}
          {recipe.difficulty && (
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-lg bg-background border border-border flex items-center justify-center">
                <ChefHatIcon className="size-4 text-muted-foreground" />
              </div>
              <div>
                <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Level</div>
                <div className="text-sm font-semibold text-foreground">{recipe.difficulty}</div>
              </div>
            </div>
          )}
        </div>

        {/* Ingredients */}
        {recipe.ingredients && recipe.ingredients.length > 0 && (
          <div className="px-6 py-5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
              Ingredients
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5">
              {recipe.ingredients.map((ing, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-foreground/90">
                  <span className="size-1.5 rounded-full bg-primary/60 mt-2 shrink-0" />
                  <span>{ing}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Instructions */}
        {recipe.instructions && recipe.instructions.length > 0 && (
          <div className="px-6 py-5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
              Instructions
            </h3>
            <ol className="space-y-4">
              {recipe.instructions.map((step, i) => (
                <li key={i} className="flex gap-4">
                  <span className="flex-shrink-0 size-6 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center justify-center text-xs font-bold mt-0.5">
                    {i + 1}
                  </span>
                  <p className="text-sm text-foreground/90 leading-relaxed pt-0.5">{step}</p>
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* Tips */}
        {recipe.tips && recipe.tips.length > 0 && (
          <div className="px-6 py-5 bg-amber-50/50 dark:bg-amber-950/10 border-t border-amber-100 dark:border-amber-900/20">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400 mb-2 flex items-center gap-1.5">
              <SparklesIcon className="size-3" /> Chef&apos;s Tips
            </h3>
            <ul className="space-y-1.5 text-sm text-amber-800/90 dark:text-amber-200/80">
              {recipe.tips.map((tip, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-amber-500">•</span> {tip}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}