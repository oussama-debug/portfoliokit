import type { Context, Next } from "hono";
import { nanoid } from "nanoid";

export async function requestId(context: Context, next: Next): Promise<void> {
  const id = context.req.header("x-request-id") || nanoid();
  context.set("requestId", id);
  context.header("x-request-id", id);
  await next();
}
