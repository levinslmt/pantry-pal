"use server";

import { hash } from "bcryptjs";
import { prisma } from "@/lib/db";
import { SignupSchema } from "@/lib/schemas";

export async function signup(_prevState: unknown, formData: FormData) {
  const raw = Object.fromEntries(formData);

  const parsed = SignupSchema.safeParse(raw);
  if (!parsed.success) {
    const first = parsed.error.errors[0];
    return { error: first.message };
  }

  const { name, email, password } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "An account with this email already exists" };
  }

  const hashedPassword = await hash(password, 10);

  await prisma.user.create({
    data: { name, email, password: hashedPassword },
  });

  return { success: true };
}
