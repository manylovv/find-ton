import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { authMiddleware } from "~/lib/middleware/auth";
import { db } from "../db";
import { usersTable, type User } from "../schema/telegramUser.schema";

type UserUpdateInput = Partial<Omit<User, "id">>;

export const updateBalance = createServerFn({
  method: "POST",
})
  .middleware([authMiddleware])
  .validator(
    z.object({
      amount: z.number(),
    }),
  )
  .handler(async ({ data, context }) => {
    // Get current user
    const user = await db.query.usersTable.findFirst({
      where: eq(usersTable.id, context.userId),
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Increment balance instead of setting it
    const newBalance = Number((user.balance || 0) + data.amount);

    await db
      .update(usersTable)
      .set({ balance: Number(newBalance.toFixed(1)) })
      .where(eq(usersTable.id, context.userId));

    return db.query.usersTable.findFirst({
      where: eq(usersTable.id, context.userId),
    });
  });
