import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { authMiddleware } from "~/lib/middleware/auth";
import { db } from "../db";
import { usersTable } from "../schema/telegramUser.schema";

export const getUserName = createServerFn({
  method: "GET",
})
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    return db.query.usersTable.findFirst({
      where: eq(usersTable.id, context.userId),
      columns: { username: true },
    });
  });
