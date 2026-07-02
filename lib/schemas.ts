import { z } from "zod";

export const RecipeSchema = z.object({
  title: z.string(),
  description: z.string(),
  servings: z.number(),
  prepTime: z.number(),
  cookTime: z.number(),
  difficulty: z.enum(["Easy", "Medium", "Hard"]),
  ingredients: z.array(z.string()),
  instructions: z.array(z.string()),
  tips: z.array(z.string()).optional(),
});

export type Recipe = z.infer<typeof RecipeSchema>;

export const FormSchema = z.object({
  ingredients: z.string().min(1, "Add at least one ingredient"),
  cuisine: z.string().optional(),
  dietary: z.array(z.string()).optional(),
  servings: z.number().min(1).max(12).optional(),
  mealType: z.string().optional(),
});

export type FormValues = z.infer<typeof FormSchema>;

export const SignupSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type SignupValues = z.infer<typeof SignupSchema>;

export const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export type LoginValues = z.infer<typeof LoginSchema>;