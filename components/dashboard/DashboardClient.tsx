"use client";

import { useState, useEffect } from "react";
import { signOut } from "next-auth/react";
import { experimental_useObject as useObject } from "@ai-sdk/react";
import RecipeForm from "@/components/recipes/RecipeForm";
import RecipeCard from "@/components/recipes/RecipeCard";
import RecipeCardSkeleton from "@/components/recipes/RecipeCardSkeleton";
import SavedRecipes from "@/components/recipes/SavedRecipes";
import RecipeModal from "@/components/recipes/RecipeModal";
import { RecipeSchema, type Recipe } from "@/lib/schemas";
import type { Session } from "next-auth";
import { toast } from "sonner";
import {
  getLatestRecipe,
  getRecipes,
  saveRecipe,
  deleteRecipe,
  updateLatestRecipe,
} from "@/lib/actions/recipes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  UtensilsCrossedIcon,
  Loader2Icon,
  LogOutIcon,
  AlertCircleIcon,
  Settings2Icon,
} from "lucide-react";

interface Props {
  user: Session["user"];
}

export default function DashboardClient({ user }: Props) {
  const [savedIds, setSavedIds] = useState<Map<string, string>>(new Map());
  const [savedVersion, setSavedVersion] = useState(0);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [saving, setSaving] = useState(false);
  const [storedRecipe, setStoredRecipe] = useState<Recipe | undefined>(
    undefined,
  );

  useEffect(() => {
    getLatestRecipe()
      .then((data) => {
        if (data) setStoredRecipe(data as Recipe);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    getRecipes()
      .then((recipes) => {
        const map = new Map<string, string>();
        recipes.forEach((r) => map.set(r.title, r.id));
        setSavedIds(map);
      })
      .catch(() => {});
  }, [savedVersion]);

  const { object, submit, isLoading, error } = useObject({
    api: "/api/generate",
    schema: RecipeSchema,
  });

  const handleGenerate = (data: FormData) => {
    const payload = {
      ingredients: data.get("ingredients"),
      cuisine: data.get("cuisine") || undefined,
      mealType: data.get("mealType") || undefined,
      servings: Number(data.get("servings")) || undefined,
      dietary: data.getAll("dietary"),
    };
    submit(payload);
  };

  const handleSaveRecipe = async () => {
    if (!recipe?.title) return;
    setSaving(true);
    const title = recipe.title;
    try {
      const saved = await saveRecipe(recipe);
      if (!saved?.id) return;
      setSavedIds((prev) => new Map(prev).set(title, saved.id));
      setSavedVersion((v) => v + 1);
      toast.success("Recipe saved!");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to save recipe");
    } finally {
      setSaving(false);
    }
  };

  const handleUnsaveRecipe = async () => {
    if (!recipe?.title) return;
    setSaving(true);
    const title = recipe.title;
    const id = savedIds.get(title);
    if (!id) return;
    try {
      await deleteRecipe(id);
      setSavedIds((prev) => {
        const next = new Map(prev);
        next.delete(title);
        return next;
      });
      setSavedVersion((v) => v + 1);
      toast.success("Recipe removed");
    } catch {
      toast.error("Failed to remove recipe");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    if (object?.title && !isLoading) {
      updateLatestRecipe(object).catch(() => {});
    }
  }, [object, isLoading]);

  const recipe = (isLoading ? object : object || storedRecipe) as
    | Recipe
    | undefined;

  const isSaved = recipe?.title ? savedIds.has(recipe.title) : false;

  const handleToggleSave = async () => {
    if (isSaved) {
      await handleUnsaveRecipe();
    } else {
      await handleSaveRecipe();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Dashboard Header */}
        <header className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Welcome back, {user?.name?.split(" ")[0] || "Chef"} 👋
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Let&apos;s turn those leftovers into something amazing.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {user && (
              <div className="flex items-center gap-3 bg-card rounded-full pl-1 pr-2 py-1 border border-border shadow-sm">
                <Avatar className="size-8">
                  {user.image ? (
                    <AvatarImage src={user.image} alt="" />
                  ) : (
                    <AvatarFallback className="text-xs">
                      {user.name?.charAt(0)?.toUpperCase() || "U"}
                    </AvatarFallback>
                  )}
                </Avatar>
                <span className="text-sm font-medium text-foreground hidden sm:block">
                  {user.name}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-7 rounded-full text-muted-foreground hover:text-foreground"
                  onClick={() => signOut()}
                  title="Sign out"
                >
                  <LogOutIcon className="size-3.5" />
                </Button>
              </div>
            )}
          </div>
        </header>

        {/* Main Grid Layout */}
        <div className="grid lg:grid-cols-12 gap-6">
          {/* Sidebar: Recipe Settings */}
          <aside className="lg:col-span-4 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Settings2Icon className="size-4" />
                  Recipe Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RecipeForm onGenerate={handleGenerate} isLoading={isLoading} />
              </CardContent>
            </Card>
          </aside>

          {/* Main Content: Recipe Display */}
          <main className="lg:col-span-8 space-y-6">
            {!recipe && !isLoading && (
              <Card className="border-dashed border-2 border-border/60 bg-muted/10">
                <CardContent className="p-12 sm:p-16 text-center flex flex-col items-center justify-center">
                  <div className="size-20 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/10 flex items-center justify-center mx-auto mb-6 shadow-inner">
                    <UtensilsCrossedIcon className="size-9 text-primary/70" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground tracking-tight mb-2">
                    Ready to cook something amazing?
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed mb-6">
                    Add your available ingredients on the left, set your
                    preferences, and let our AI chef create a custom recipe for
                    you.
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground/80">
                    <div className="size-1.5 rounded-full bg-secondary animate-pulse" />
                    <span>AI Engine Online & Ready</span>
                  </div>
                </CardContent>
              </Card>
            )}

            {isLoading && !recipe?.title && !recipe?.ingredients?.length && (
              <Card>
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="size-10 rounded-full bg-primary flex items-center justify-center">
                      <Loader2Icon className="size-5 text-primary-foreground animate-spin" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-foreground">
                        Creating your recipe...
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        This usually takes a few seconds
                      </p>
                    </div>
                  </div>
                  <RecipeCardSkeleton />
                </CardContent>
              </Card>
            )}

            {(recipe?.title || recipe?.ingredients?.length) && (
              <RecipeCard
                recipe={recipe as Recipe}
                isStreaming={isLoading}
                onSave={
                  !isLoading && recipe?.title ? handleToggleSave : undefined
                }
                isSaved={isSaved}
                saving={saving}
              />
            )}

            {error && (
              <Card className="border-destructive/30">
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="size-10 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
                    <AlertCircleIcon className="size-5 text-destructive" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-destructive mb-1">
                      Oops! Something went wrong
                    </h3>
                    <p className="text-sm text-destructive/80">
                      {error.message}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </main>

          {/* Saved Recipes */}
          <aside className="lg:col-span-12">
            <SavedRecipes key={savedVersion} onSelect={(r) => setSelectedRecipe(r)} />
          </aside>
        </div>

        {selectedRecipe && (
          <RecipeModal
            recipe={selectedRecipe}
            onClose={() => setSelectedRecipe(null)}
          />
        )}
      </div>
    </div>
  );
}
