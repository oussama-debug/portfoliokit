import { BaseService } from "@/core/base.js";
import { ForbiddenError, NotFoundError } from "@/error.js";
import type { Booking } from "./model.js";
import type { BookingRepository } from "./repository.js";

export class BookingService extends BaseService {
  constructor(private readonly _bookingRepository: BookingRepository) {
    super("BookingService");
  }

  async create(userId: string, title: string, startTime: Date, endTime: Date): Promise<Booking> {
    this.log(`Creating booking for user: ${userId}`);

    if (startTime >= endTime) {
      throw new Error("Start time must be before end time");
    }

    return await this._bookingRepository.create(userId, title, startTime, endTime);
  }

  async getById(id: string, userId: string): Promise<Booking> {
    const booking = await this._bookingRepository.findById(id);

    if (!booking) {
      throw new NotFoundError("Booking not found");
    }

    // Ensure user can only access their own bookings
    if (booking.userId !== userId) {
      throw new ForbiddenError("You don't have permission to access this booking");
    }

    return booking;
  }

  async getUserBookings(userId: string): Promise<Booking[]> {
    this.log(`Fetching bookings for user: ${userId}`);
    return await this._bookingRepository.findByUserId(userId);
  }

  async update(
    id: string,
    userId: string,
    data: { title?: string; startTime?: Date; endTime?: Date }
  ): Promise<Booking> {
    const booking = await this._bookingRepository.findById(id);

    if (!booking) {
      throw new NotFoundError("Booking not found");
    }

    if (booking.userId !== userId) {
      throw new ForbiddenError("You don't have permission to update this booking");
    }

    if (data.startTime && data.endTime && data.startTime >= data.endTime) {
      throw new Error("Start time must be before end time");
    }

    this.log(`Updating booking: ${id}`);
    return await this._bookingRepository.update(id, data);
  }

  async delete(id: string, userId: string): Promise<void> {
    const booking = await this._bookingRepository.findById(id);

    if (!booking) {
      throw new NotFoundError("Booking not found");
    }

    if (booking.userId !== userId) {
      throw new ForbiddenError("You don't have permission to delete this booking");
    }

    this.log(`Deleting booking: ${id}`);
    await this._bookingRepository.delete(id);
  }
}
