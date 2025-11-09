import { Hono } from "hono";
import { Container, type Module } from "@/core/index.js";
import { SupabaseAuthenticationRepository } from "./repositories/supabase.repository.js";
import { AuthenticationService } from "./service.js";
import { routes } from "./route.js";
import { env } from "@repo/env";

export class AuthenticationModule implements Module {
  readonly name = "authentication";

  register(container: typeof Container): void {
    container.register(
      "AuthenticationRepository",
      () => new SupabaseAuthenticationRepository(env.SUPABASE_URL, env.SUPABASE_ANON_KEY)
    );

    container.register(
      "AuthenticationService",
      () => new AuthenticationService(container.resolve("AuthenticationRepository"))
    );
  }

  routes(): Hono {
    return routes;
  }
}
