import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { prettyJSON } from "hono/pretty-json";
import { secureHeaders } from "hono/secure-headers";
import { logger } from "hono/logger";
import { csrf } from "hono/csrf";

const isDevelopment = process.env.NODE_ENV === "development";
const port = 4000;

export const app = new Hono({ strict: false });

app.use(
  csrf({
    origin: [
      "https://zenlanes.com",
      ...(isDevelopment ? ["http://localhost:3000"] : []),
    ],
  })
);

app.use(secureHeaders());
app.use(logger());
app.use(prettyJSON());

serve({
  fetch: app.fetch,
  port: port,
});
