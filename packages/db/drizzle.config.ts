import "dotenv/config";

import type { Config } from "drizzle-kit";
import { env } from "@repo/env";

export default {
  schema: "./src/schema.ts",
  out: "./drizzle",
  driver: "pg",
  dbCredentials: {
    connectionString: env.POSTGRES_URL,
  },
} satisfies Config;
