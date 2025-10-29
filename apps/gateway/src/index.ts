import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { prettyJSON } from "hono/pretty-json";
import { secureHeaders } from "hono/secure-headers";

const port = 4000;

export const app = new Hono({ strict: false });
app.use("*", prettyJSON());
app.use("*", secureHeaders());

app.get("/", (c) => {
  return c.json({ message: "Hello, World!" });
});

serve({
  fetch: app.fetch,
  port: port,
});
