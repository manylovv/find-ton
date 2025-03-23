import { createMiddleware } from "@tanstack/react-start";
import { retrieveRawInitData } from "@telegram-apps/bridge";
import { parse, validate } from "@telegram-apps/init-data-node";

export const authMiddleware = createMiddleware()
  .client(async ({ next, context }) => {
    return next({
      sendContext: {
        initData: retrieveRawInitData(),
      },
    });
  })
  .server(async ({ next, data, context }) => {
    console.log("server hi", context.initData, process.env.BOT_TOKEN);
    validate(context.initData as string, process.env.BOT_TOKEN!, {
      expiresIn: 0,
    });
    const initData = parse(context.initData as string);

    const telegramUser = initData.user;

    console.log("telegram user", telegramUser);

    if (!telegramUser) {
      throw new Error("Invalid init data");
    }

    return next({ context: { userId: telegramUser.id } });
  });
