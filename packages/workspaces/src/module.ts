import { Hono } from "hono";
import { Container, type Module } from "@repo/core";
import { SupabaseWorkspaceRepository } from "./repositories/supabase.repository.js";
import { WorkspaceService } from "./service.js";
import { routes } from "./route.js";
import { env } from "@repo/environment";

export class WorkspaceModule implements Module {
  readonly name = "workspaces";

  register(container: typeof Container): void {
    container.register(
      "WorkspaceRepository",
      () =>
        new SupabaseWorkspaceRepository(env.SUPABASE_URL, env.SUPABASE_ANON_KEY)
    );

    container.register(
      "WorkspaceService",
      () => new WorkspaceService(container.resolve("WorkspaceRepository"))
    );
  }

  routes(): Hono {
    return routes;
  }
}
