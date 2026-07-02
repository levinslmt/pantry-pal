"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { RecipeSchema } from "@/lib/schemas";

export async function getRecipes() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");

  return prisma.recipe.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      description: true,
      servings: true,
      prepTime: true,
      cookTime: true,
      difficulty: true,
      ingredients: true,
      instructions: true,
      tips: true,
      createdAt: true,
    },
  });
}

export async function saveRecipe(data: unknown) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");

  const raw = data as Record<string, unknown>;

  const difficultyMap: Record<string, string> = {
    easy: "Easy",
    medium: "Medium",
    hard: "Hard",
    moderate: "Medium",
  };

  const normalized = {
    title: String(raw.title ?? ""),
    description: String(raw.description ?? ""),
    servings: Number(raw.servings) || 0,
    prepTime: Number(raw.prepTime) || 0,
    cookTime: Number(raw.cookTime) || 0,
    difficulty: difficultyMap[String(raw.difficulty ?? "easy").toLowerCase()],
    ingredients: Array.isArray(raw.ingredients)
      ? raw.ingredients.filter(Boolean)
      : [],
    instructions: Array.isArray(raw.instructions)
      ? raw.instructions.filter(Boolean)
      : [],
    tips: Array.isArray(raw.tips) ? raw.tips.filter(Boolean) : [],
  };

  const parsed = RecipeSchema.parse(normalized);

  return prisma.recipe.create({
    data: {
      ...parsed,
      userId: session.user.id,
    },
  });
}

export async function deleteRecipe(id: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");

  const recipe = await prisma.recipe.findUnique({ where: { id } });
  if (!recipe) throw new Error("Not found");
  if (recipe.userId !== session.user.id) throw new Error("Forbidden");

  await prisma.recipe.delete({ where: { id } });
}

export async function getLatestRecipe() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");

  const latest = await prisma.latestRecipe.findUnique({
    where: { userId: session.user.id },
  });

  return latest?.recipe ?? null;
}

export async function updateLatestRecipe(recipe: unknown) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");

  const data = JSON.parse(JSON.stringify(recipe));

  await prisma.latestRecipe.upsert({
    where: { userId: session.user.id },
    create: { recipe: data, userId: session.user.id },
    update: { recipe: data },
  });
}
