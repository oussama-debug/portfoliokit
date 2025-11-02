import "dotenv/config";

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schema";
import { env } from "@repo/env";

export const client = postgres(env.POSTGRES_URL);

export const db = drizzle(client, { schema });
