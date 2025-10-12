import { createEnv } from "@t3-oss/env-core";
import z from "zod";

export const env = createEnv({
  server: {
    NODE_ENV: z
      .enum(["development", "production", "test"])
      .default("development"),
    DATABASE_URL: z.string(),
  },
  clientPrefix: "NEXT_PUBLIC_",
  client: {},
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});
