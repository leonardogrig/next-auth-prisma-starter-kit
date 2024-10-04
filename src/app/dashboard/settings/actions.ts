"use server";
import getSession from "@/auth";
import prisma from "@/lib/prisma";
import { updateProfileSchema, UpdateProfileValues } from "@/lib/validation";
import { revalidatePath } from "next/cache";

export async function updateProfile(values: UpdateProfileValues) {
  const session = await getSession();
  const userId = session?.user?.id;

  if (!userId) {
    throw Error("Unauthorized");
  }

  const { name } = updateProfileSchema.parse(values);

  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      name,
    },
  });

  revalidatePath("/");
}
