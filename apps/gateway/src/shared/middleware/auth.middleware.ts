import type { Context, Next } from "hono";
import { Container } from "@/core/index.js";
import { UnauthorizedError } from "@/error.js";
import type { AuthenticationService } from "../../authentication/service.js";

export async function isAuthenticated(context: Context, next: Next): Promise<void> {
  const header = context.req.header("authorization");

  if (!header || !header.startsWith("Bearer ")) {
    throw new UnauthorizedError("Authorization header missing or invalid");
  }

  const token = header.split(" ")[1];

  if (!token) {
    throw new UnauthorizedError("Token missing from Authorization header");
  }

  const authService = Container.resolve<AuthenticationService>("AuthenticationService");
  const user = await authService.verify(token);

  context.set("user", user.toObject());
  await next();
}
