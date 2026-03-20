import { LoginInputSchema, SessionUserSchema, safeDecode } from "@tome/domain";

import { prisma } from "./db";

export async function loginUser(input: unknown) {
  const parsed = safeDecode(LoginInputSchema, input);

  if (!parsed.success) {
    throw new Error(parsed.error);
  }

  const user = await prisma.user.upsert({
    where: {
      email: parsed.data.email.toLowerCase(),
    },
    update: {
      name: parsed.data.name,
      mode: parsed.data.mode,
    },
    create: {
      name: parsed.data.name,
      email: parsed.data.email.toLowerCase(),
      mode: parsed.data.mode,
    },
  });

  return SessionUserSchema.make({
    id: user.id,
    name: user.name,
    email: user.email,
    mode: user.mode,
  });
}

export async function getUserById(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    return null;
  }

  return SessionUserSchema.make({
    id: user.id,
    name: user.name,
    email: user.email,
    mode: user.mode,
  });
}
