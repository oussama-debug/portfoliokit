import type { Booking } from "./model.js";

export interface BookingRepository {
  create(userId: string, title: string, startTime: Date, endTime: Date): Promise<Booking>;
  findById(id: string): Promise<Booking | null>;
  findByUserId(userId: string): Promise<Booking[]>;
  update(id: string, data: { title?: string; startTime?: Date; endTime?: Date }): Promise<Booking>;
  delete(id: string): Promise<void>;
}
