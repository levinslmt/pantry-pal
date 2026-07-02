"use client";

import type { Recipe } from "@/lib/schemas";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface Props {
  recipe: Recipe;
  onClose: () => void;
}

export default function RecipeModal({ recipe, onClose }: Props) {
  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto sm:max-w-2xl">
        <DialogTitle className="text-xl font-medium tracking-tight pr-8">
          {recipe.title}
        </DialogTitle>
        {recipe.description && (
          <DialogDescription>{recipe.description}</DialogDescription>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-muted/30 -mx-4 -mt-4 px-6 py-4 border-b border-border">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Yield</div>
            <div className="text-sm font-mono text-foreground mt-0.5">{recipe.servings} units</div>
          </div>
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Prep</div>
            <div className="text-sm font-mono text-foreground mt-0.5">{recipe.prepTime} min</div>
          </div>
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Cook</div>
            <div className="text-sm font-mono text-foreground mt-0.5">{recipe.cookTime} min</div>
          </div>
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Complexity</div>
            <div className="text-sm font-mono text-foreground mt-0.5">{recipe.difficulty}</div>
          </div>
        </div>

        {recipe.ingredients?.length > 0 && (
          <div>
            <h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Ingredients
            </h3>
            <ul className="space-y-2">
              {recipe.ingredients.map((ing, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-foreground/80">
                  <span className="font-mono text-xs text-muted-foreground mt-0.5 w-4 text-right shrink-0">
                    {i + 1}.
                  </span>
                  <span>{ing}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {recipe.instructions?.length > 0 && (
          <div>
            <h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Instructions
            </h3>
            <ol className="space-y-3">
              {recipe.instructions.map((step, i) => (
                <li key={i} className="flex gap-3">
                  <span className="flex-shrink-0 w-5 h-5 border border-border text-muted-foreground rounded flex items-center justify-center font-mono text-[10px] mt-0.5">
                    {i + 1}
                  </span>
                  <p className="text-sm text-foreground/80 leading-relaxed">{step}</p>
                </li>
              ))}
            </ol>
          </div>
        )}

        {recipe.tips && recipe.tips.length > 0 && (
          <div className="bg-muted/30 -mx-4 -mb-4 px-6 py-4 border-t border-border">
            <h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              Tips
            </h3>
            <ul className="space-y-1 text-xs text-muted-foreground font-mono">
              {recipe.tips.map((tip, i) => (
                <li key={i}>→ {tip}</li>
              ))}
            </ul>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
