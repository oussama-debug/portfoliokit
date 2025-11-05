import type { Context, Next } from "hono";
import { Application } from "@/application";
import { UnauthorizedError } from "../error";

export async function isAuthenticated(_context: Context, _next: Next) {
  const _header = _context.req.header("authorization");

  if (!_header || !_header.startsWith("Bearer ")) {
    throw new UnauthorizedError("Authorization header missing or invalid");
  }

  const token = _header.split(" ")[1];

  if (!token) throw new UnauthorizedError("Token missing from Authorization header");

  const auth_service = Application.authenticationService;
  const user = await auth_service.verify(token);

  _context.set("user", user.toObject());
  await _next();
}
