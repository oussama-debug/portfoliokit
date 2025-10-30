import { env } from "@repo/env";
import { betterAuth } from "better-auth";

import { Pool } from "pg";

export const createAuth = (databaseUrl?: string) => {
  return betterAuth({
    database: new Pool({
      connectionString: databaseUrl ?? env.DATABASE_URL,
    }),
    emailAndPassword: {
      enabled: true,
    },
    plugins: [],
    trustedOrigins: [
      "expo://",
      "mobile://",
      "zenlanes://",
      "exp://",
      "http://localhost:3000",
    ],
  });
};
