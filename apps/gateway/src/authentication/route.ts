import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import {
  createSchema,
  loginSchema,
  logoutSchema,
  refreshSchema,
} from "./validator.js";
import { Application } from "@/application.js";
import { isAuthenticated } from "./middleware.js";

export const routes = new Hono();

routes.post("/register", zValidator("json", createSchema), async (_context) => {
  const { username, password } = _context.req.valid("json");
  const auth_service = Application.authenticationService;
  const register = await auth_service.register(username, password);

  return _context.json({
    success: true,
    user: register.user.toObject(),
    session: register.session.toObject(),
  });
});

routes.post("/login", zValidator("json", loginSchema), async (_context) => {
  const { username, password } = _context.req.valid("json");
  const auth_service = Application.authenticationService;
  const login = await auth_service.login(username, password);

  return _context.json({
    success: true,
    user: login.user.toObject(),
    session: login.session.toObject(),
  });
});

routes.post("/refresh", zValidator("json", refreshSchema), async (_context) => {
  const { token } = _context.req.valid("json");
  const auth_service = Application.authenticationService;
  const refresh = await auth_service.refresh(token);

  return _context.json({
    success: true,
    user: refresh.user.toObject(),
    session: refresh.session.toObject(),
  });
});

routes.post("/logout", zValidator("json", logoutSchema), async (_context) => {
  const { token } = _context.req.valid("json");
  const auth_service = Application.authenticationService;
  await auth_service.signout(token);

  return _context.json({ success: true });
});
