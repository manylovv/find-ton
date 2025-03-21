import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { authMiddleware } from "~/lib/middleware/auth";
import { db } from "../db";
import { usersTable } from "../schema/telegramUser.schema";

export const updateUserBalance = createServerFn({
  method: "POST",
})
  .middleware([authMiddleware])
  .validator(
    z.object({
      amount: z.number().int(),
    }),
  )
  .handler(async ({ data, context }) => {
    const { amount } = data;

    // Get current user
    const currentUser = await db.query.usersTable.findFirst({
      where: eq(usersTable.id, context.userId),
    });

    if (!currentUser) {
      throw new Error("User not found");
    }

    // Calculate new balance
    const newBalance = currentUser.balance + amount;

    // Update user balance
    await db
      .update(usersTable)
      .set({ balance: newBalance })
      .where(eq(usersTable.id, context.userId));

    // Return updated user
    return db.query.usersTable.findFirst({
      where: eq(usersTable.id, context.userId),
    });
  });
