import { Hono } from "hono";
import { Container, type Module } from "@/core/index.js";
import { SupabaseBookingRepository } from "./repositories/supabase.repository.js";
import { BookingService } from "./service.js";
import { routes } from "./route.js";
import { env } from "@repo/env";

export class BookingModule implements Module {
  readonly name = "bookings";

  register(container: typeof Container): void {
    container.register(
      "BookingRepository",
      () => new SupabaseBookingRepository(env.SUPABASE_URL, env.SUPABASE_ANON_KEY)
    );

    container.register(
      "BookingService",
      () => new BookingService(container.resolve("BookingRepository"))
    );
  }

  routes(): Hono {
    return routes;
  }
}
