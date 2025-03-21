import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { authMiddleware } from "~/lib/middleware/auth";
import { db } from "../db";
import { usersTable, type User } from "../schema/telegramUser.schema";

type UserUpdateInput = Partial<Omit<User, "id">>;

export const updateUser = createServerFn({
  method: "POST",
})
  .middleware([authMiddleware])
  .validator(
    z.object({
      updateUser: z.object({}).passthrough() as z.ZodType<UserUpdateInput>,
    }),
  )
  .handler(async ({ data, context }) => {
    const updateData = data.updateUser;

    await db.update(usersTable).set(updateData).where(eq(usersTable.id, context.userId));

    return db.query.usersTable.findFirst({
      where: eq(usersTable.id, context.userId),
    });
  });
