import { z } from "zod";

export const createBookingSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title is too long"),
  startTime: z.string().datetime("Invalid start time format"),
  endTime: z.string().datetime("Invalid end time format"),
});

export const updateBookingSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  startTime: z.string().datetime().optional(),
  endTime: z.string().datetime().optional(),
});

export const bookingIdSchema = z.object({
  id: z.string().uuid("Invalid booking ID"),
});
