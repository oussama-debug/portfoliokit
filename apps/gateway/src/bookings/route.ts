import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { Container, getUser } from "@/core/index.js";
import { isAuthenticated } from "@/shared/middleware/auth.middleware.js";
import type { BookingService } from "./service.js";
import { createBookingSchema, updateBookingSchema, bookingIdSchema } from "./validator.js";

export const routes = new Hono();

routes.use("*", isAuthenticated);

routes.post("/", isAuthenticated, zValidator("json", createBookingSchema), async (context) => {
  const user = getUser(context);
  const { title, startTime, endTime } = context.req.valid("json");

  const bookingService = Container.resolve<BookingService>("BookingService");
  const booking = await bookingService.create(
    user.id,
    title,
    new Date(startTime),
    new Date(endTime)
  );

  return context.json({
    success: true,
    booking: booking.toObject(),
  });
});

routes.get("/", isAuthenticated, async (context) => {
  const user = getUser(context);

  const bookingService = Container.resolve<BookingService>("BookingService");
  const bookings = await bookingService.getUserBookings(user.id);

  return context.json({
    success: true,
    bookings: bookings.map((b) => b.toObject()),
  });
});

routes.get("/:id", isAuthenticated, zValidator("param", bookingIdSchema), async (context) => {
  const user = getUser(context);
  const { id } = context.req.valid("param");

  const bookingService = Container.resolve<BookingService>("BookingService");
  const booking = await bookingService.getById(id, user.id);

  return context.json({
    success: true,
    booking: booking.toObject(),
  });
});

routes.patch(
  "/:id",
  isAuthenticated,
  zValidator("param", bookingIdSchema),
  zValidator("json", updateBookingSchema),
  async (context) => {
    const user = getUser(context);
    const { id } = context.req.valid("param");
    const data = context.req.valid("json");

    const updateData: any = {};
    if (data.title) updateData.title = data.title;
    if (data.startTime) updateData.startTime = new Date(data.startTime);
    if (data.endTime) updateData.endTime = new Date(data.endTime);

    const bookingService = Container.resolve<BookingService>("BookingService");
    const booking = await bookingService.update(id, user.id, updateData);

    return context.json({
      success: true,
      booking: booking.toObject(),
    });
  }
);

routes.delete("/:id", isAuthenticated, zValidator("param", bookingIdSchema), async (context) => {
  const user = getUser(context);
  const { id } = context.req.valid("param");

  const bookingService = Container.resolve<BookingService>("BookingService");
  await bookingService.delete(id, user.id);

  return context.json({
    success: true,
    message: "Booking deleted successfully",
  });
});
