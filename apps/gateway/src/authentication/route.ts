import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { Container } from "@/core/index.js";
import type { AuthenticationService } from "./service.js";
import {
  createSchema,
  loginSchema,
  logoutSchema,
  refreshSchema,
} from "./validator.js";

export const routes = new Hono();

routes.post("/register", zValidator("json", createSchema), async (context) => {
  const { username, password } = context.req.valid("json");
  const authService = Container.resolve<AuthenticationService>(
    "AuthenticationService"
  );
  const result = await authService.register(username, password);

  return context.json({
    success: true,
    user: result.user.toObject(),
    session: result.session.toObject(),
  });
});

routes.post("/login", zValidator("json", loginSchema), async (context) => {
  const { username, password } = context.req.valid("json");
  const authService = Container.resolve<AuthenticationService>(
    "AuthenticationService"
  );
  const result = await authService.login(username, password);

  return context.json({
    success: true,
    user: result.user.toObject(),
    session: result.session.toObject(),
  });
});

routes.post("/refresh", zValidator("json", refreshSchema), async (context) => {
  const { token } = context.req.valid("json");
  const authService = Container.resolve<AuthenticationService>(
    "AuthenticationService"
  );
  const result = await authService.refresh(token);

  return context.json({
    success: true,
    user: result.user.toObject(),
    session: result.session.toObject(),
  });
});

routes.post("/logout", zValidator("json", logoutSchema), async (context) => {
  const { token } = context.req.valid("json");
  const authService = Container.resolve<AuthenticationService>(
    "AuthenticationService"
  );
  await authService.signout(token);

  return context.json({ success: true });
});
