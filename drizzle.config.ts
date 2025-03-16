import { config } from "dotenv";
import type { Config } from "drizzle-kit";
config({ path: ".env" });

export default {
  schema: "./src/lib/server/schema/index.ts",
  out: "./supabase/migrations",
  dialect: "postgresql",
  breakpoints: true,
  verbose: true,
  strict: true,
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
} satisfies Config;
