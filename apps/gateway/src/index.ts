import { serve } from "@hono/node-server";
import { env } from "@repo/env";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import { secureHeaders } from "hono/secure-headers";
import { Container, ModuleRegistry, type AppContext } from "./core/index.js";
import { requestId } from "./shared/middleware/index.js";
import { AuthenticationModule } from "./authentication/module.js";
import { BookingModule } from "./bookings/module.js";
import { handleErrors } from "./error.js";

const isDevelopment = env.NODE_ENV === "development";
const port = 4000;

export const app = new Hono<AppContext>({ strict: false });

// Initialize modules
const authModule = new AuthenticationModule();
const bookingModule = new BookingModule();

// Register modules
ModuleRegistry.register(authModule);
ModuleRegistry.register(bookingModule);

// Register services in DI container
authModule.register(Container);
bookingModule.register(Container);

// Global middleware
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
app.use(requestId);

// Health check
app.get("/health", (context) => {
  return context.json({
    success: true,
    status: "healthy",
    timestamp: new Date().toISOString(),
    modules: ModuleRegistry.getAll().map((m: { name: string }) => m.name),
  });
});

// Mount module routes
app.route("/v1/gateway/auth", authModule.routes());
app.route("/v1/gateway/bookings", bookingModule.routes());

// 404 handler
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

// Error handler
app.onError(handleErrors);

console.log(`🚀 Server starting on port ${port}`);
console.log(
  `📦 Modules loaded: ${ModuleRegistry.getAll()
    .map((m: { name: string }) => m.name)
    .join(", ")}`
);

serve({
  fetch: app.fetch,
  port: port,
});
