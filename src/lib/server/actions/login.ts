import { createServerFn } from "@tanstack/react-start";
import { parse } from "@telegram-apps/init-data-node";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { authMiddleware } from "~/lib/middleware/auth";
import { db } from "../db";
import { usersTable } from "../schema/telegramUser.schema";

export const login = createServerFn({
  method: "POST",
})
  .middleware([authMiddleware])
  .validator(z.object({ initData: z.string() }))
  .handler(async ({ data }) => {
    console.log("init data", data.initData, process.env.BOT_TOKEN);

    const parsedData = parse(data.initData);
    const telegramUser = parsedData.user;

    if (!telegramUser) {
      throw new Error("Invalid init data");
    }

    const existingUser = await db.query.usersTable.findFirst({
      where: eq(usersTable.id, telegramUser.id),
    });

    if (!existingUser) {
      const newUser = await db
        .insert(usersTable)
        .values({
          firstName: telegramUser.first_name,
          id: telegramUser.id,
          isPremium: telegramUser.is_premium,
          languageCode: telegramUser.language_code,
          lastName: telegramUser.last_name,
          photoUrl: telegramUser.photo_url,
          username: telegramUser.username,
        })
        .returning();

      return newUser[0];
    }

    return existingUser;
  });
