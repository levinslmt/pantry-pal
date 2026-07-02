"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { PlusIcon, Loader2Icon, SparklesIcon, XIcon } from "lucide-react";

interface Props {
  onGenerate: (data: FormData) => void;
  isLoading: boolean;
}

const CUISINES = ["Any", "Italian", "Mexican", "Asian", "Indian", "French", "Mediterranean", "American"];
const MEALS = ["Any", "Breakfast", "Lunch", "Dinner", "Snack", "Dessert"];
const DIETARY = ["Vegetarian", "Vegan", "Gluten-Free", "Dairy-Free", "Keto", "Low-Carb", "Nut-Free"];

export default function RecipeForm({ onGenerate, isLoading }: Props) {
  const [ingredients, setIngredients] = useState("");
  const [currentIngredient, setCurrentIngredient] = useState("");
  const [cuisine, setCuisine] = useState("Any");
  const [mealType, setMealType] = useState("Any");
  const [dietary, setDietary] = useState<string[]>([]);
  const [servings, setServings] = useState([4]);

  const addIngredient = () => {
    const trimmed = currentIngredient.trim();
    if (trimmed && !ingredients.toLowerCase().includes(trimmed.toLowerCase())) {
      setIngredients(ingredients ? `${ingredients}, ${trimmed}` : trimmed);
      setCurrentIngredient("");
    }
  };

  const removeIngredient = (name: string) => {
    setIngredients(
      ingredients
        .split(", ")
        .filter((i) => i.toLowerCase() !== name.toLowerCase())
        .join(", "),
    );
  };

  const toggleDietary = (d: string) => {
    setDietary((prev) =>
      prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d],
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData();
    fd.set("ingredients", ingredients);
    if (cuisine !== "Any") fd.set("cuisine", cuisine);
    if (mealType !== "Any") fd.set("mealType", mealType);
    fd.set("servings", servings[0].toString());
    dietary.forEach((d) => fd.append("dietary", d));
    onGenerate(fd);
  };

  const ingredientList = ingredients.split(", ").filter(Boolean);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Ingredients Input */}
      <div className="space-y-2.5">
        <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          What&apos;s in your pantry?
        </Label>
        <div className="flex gap-2">
          <Input
            type="text"
            value={currentIngredient}
            onChange={(e) => setCurrentIngredient(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && (e.preventDefault(), addIngredient())
            }
            placeholder="e.g. chicken, garlic, tomato..."
            className="h-10"
          />
          <Button type="button" variant="secondary" size="icon" onClick={addIngredient} className="shrink-0 h-10 w-10">
            <PlusIcon className="size-4" />
          </Button>
        </div>
        {ingredientList.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {ingredientList.map((ing) => (
              <Badge key={ing} variant="secondary" className="gap-1.5 pl-2.5 pr-1.5 py-1 text-xs font-normal bg-primary/5 text-foreground border border-border/50">
                {ing}
                <button
                  type="button"
                  onClick={() => removeIngredient(ing)}
                  className="size-4 rounded-full hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition"
                >
                  <XIcon className="size-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Preferences Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Cuisine</Label>
          <Select value={cuisine} onValueChange={(v) => setCuisine(v ?? "Any")}>
            <SelectTrigger className="h-10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CUISINES.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Meal Type</Label>
          <Select value={mealType} onValueChange={(v) => setMealType(v ?? "Any")}>
            <SelectTrigger className="h-10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MEALS.map((m) => (
                <SelectItem key={m} value={m}>{m}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Servings Slider */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Servings</Label>
          <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md">
            {servings[0]} people
          </span>
        </div>
        <Slider
          value={servings}
          onValueChange={(v) => setServings(Array.isArray(v) ? [...v] : [v])}
          min={1}
          max={12}
          step={1}
          className="py-2"
        />
      </div>

      {/* Dietary Tags */}
      <div className="space-y-2.5">
        <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Dietary Preferences
        </Label>
        <div className="flex flex-wrap gap-2">
          {DIETARY.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => toggleDietary(d)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                dietary.includes(d)
                  ? "bg-primary text-primary-foreground border-primary shadow-sm"
                  : "bg-background text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isLoading || ingredientList.length === 0}
        className="w-full h-11 text-sm font-semibold shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98]"
      >
        {isLoading ? (
          <>
            <Loader2Icon className="size-4 animate-spin" />
            Cooking up your recipe...
          </>
        ) : (
          <>
            <SparklesIcon className="size-4" />
            Generate Recipe
          </>
        )}
      </Button>
    </form>
  );
}