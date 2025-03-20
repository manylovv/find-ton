import { registerGlobalMiddleware } from "@tanstack/react-start";
import { authMiddleware } from "~/lib/middleware/auth";

registerGlobalMiddleware({
  middleware: [authMiddleware],
});
