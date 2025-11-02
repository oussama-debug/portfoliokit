import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { prettyJSON } from "hono/pretty-json";
import { secureHeaders } from "hono/secure-headers";
import { logger } from "hono/logger";
import { cors } from "hono/cors";

import { routes as auth_routes } from "./authentication/route.js";
import { Application } from "./application.js";
import { env } from "@repo/env";
import { handleErrors } from "./error.js";

const isDevelopment = env.NODE_ENV === "development";
const port = 4000;

export const app = new Hono({ strict: false });

Application.initialize(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);

app.use(
  cors({
    origin: isDevelopment
      ? ["http://localhost:3000", "https://portfoliokit-six.vercel.app"]
      : ["https://zenlanes.com", "https://portfoliokit-six.vercel.app"],
    credentials: true,
  })
);

app.use(secureHeaders());
app.use(logger());
app.use(prettyJSON());

app.get("/health", (_context) => {
  return _context.json({
    success: true,
    status: "healthy",
    timestamp: new Date().toISOString(),
  });
});

app.route("/v1/gateway/auth", auth_routes);

app.notFound((_context) => {
  return _context.json(
    {
      success: false,
      code: "not_found",
      message: "Route not found",
    },
    404
  );
});

app.onError(handleErrors);

serve({
  fetch: app.fetch,
  port: port,
});
