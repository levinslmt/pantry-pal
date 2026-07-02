import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { streamObject } from "ai";
import { model } from "@/lib/ai";
import { RecipeSchema, FormSchema } from "@/lib/schemas";
import { rateLimit } from "@/lib/rate-limit";
import { z } from "zod";

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { success } = await rateLimit.limit(session.user.id);
    if (!success) {
      return Response.json(
        { error: "Too many requests. Try again later." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const parsed = FormSchema.parse(body);
    const { ingredients, cuisine, dietary, servings, mealType } = parsed;

    const result = await streamObject({
      model,
      schema: RecipeSchema,
      prompt: `Create a recipe using these ingredients: ${ingredients}.
${cuisine ? `Cuisine style: ${cuisine}.` : ""}
${dietary?.length ? `Dietary restrictions: ${dietary.join(", ")}.` : ""}
${mealType ? `Meal type: ${mealType}.` : ""}
${servings ? `Servings: ${servings}.` : "Servings: 4."}

Be creative but practical. Use the provided ingredients as the base.
Return clear, step-by-step instructions.`,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      );
    }
    console.error("Generation error:", error);
    return Response.json(
      { error: "Failed to generate recipe" },
      { status: 500 }
    );
  }
}
