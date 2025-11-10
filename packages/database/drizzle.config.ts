import "dotenv/config";

import { env } from "@repo/environment";
import type { Config } from "drizzle-kit";

export default {
  schema: "./src/schema.ts",
  out: "./drizzle",
  driver: "pg",
  dbCredentials: {
    connectionString: env.POSTGRES_URL,
  },
} satisfies Config;
