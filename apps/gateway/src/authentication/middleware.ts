import { Application } from "@/application.js";
import type { Context, Next } from "hono";

export async function isAuthenticated(_context: Context, _next: Next) {
  const _header = _context.req.header("authorization");
  if (!_header || !_header.startsWith("Bearer ")) {
    return _context.json(
      { error: "Authorization header missing or invalid" },
      401
    );
  }

  const token = _header.split(" ")[1];

  if (!token) {
    return _context.json(
      { error: "Token missing from Authorization header" },
      401
    );
  }

  const auth_service = Application.authenticationService;
  const user = await auth_service.verify(token);

  _context.set("user", user.toObject());
  await _next();
}
