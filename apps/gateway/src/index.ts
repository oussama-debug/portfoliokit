import { serve } from "@hono/node-server";
import { env } from "@repo/environment";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import { secureHeaders } from "hono/secure-headers";
import { Container, ModuleRegistry, type AppContext, handleErrors, type Module } from "@repo/core";
import { requestId } from "./middleware.js";

import { AuthenticationModule } from "@repo/authentication/module";
import { BookingModule } from "@repo/bookings/module";
import { WorkspaceModule } from "@repo/workspaces/module";

const isDevelopment = env.NODE_ENV === "development";
const PORT = 4000;

const ALLOWED_ORIGINS = isDevelopment
  ? ["http://localhost:3000", "https://portfoliokit-six.vercel.app"]
  : ["https://zenlanes.com", "https://portfoliokit-six.vercel.app"];

const modules: Module[] = [new AuthenticationModule(), new BookingModule(), new WorkspaceModule()];

modules.forEach((module) => {
  ModuleRegistry.register(module);
  module.register(Container);
});

export const app = new Hono<AppContext>({ strict: false });

app.use(cors({ origin: ALLOWED_ORIGINS, credentials: true }));
app.use(secureHeaders());
app.use(logger());
app.use(prettyJSON());
app.use(requestId);

app.get("/health", (context) => {
  return context.json({
    success: true,
    status: "healthy",
    timestamp: new Date().toISOString(),
    modules: ModuleRegistry.getAll().map((m) => m.name),
  });
});

app.route("/v1/gateway/auth", ModuleRegistry.get("authentication")!.routes());
app.route("/v1/gateway/bookings", ModuleRegistry.get("bookings")!.routes());
app.route("/v1/gateway", ModuleRegistry.get("workspaces")!.routes());

app.notFound((context) => {
  return context.json(
    {
      success: false,
      code: "not_found",
      message: "Route not found",
    },
    404
  );
});

app.onError(handleErrors);

console.log(`> Server starting on port ${PORT}`);
console.log(`> Environment: ${env.NODE_ENV}`);
console.log(
  `> Modules loaded: ${ModuleRegistry.getAll()
    .map((m) => m.name)
    .join(", ")}`
);

serve({
  fetch: app.fetch,
  port: PORT,
});
