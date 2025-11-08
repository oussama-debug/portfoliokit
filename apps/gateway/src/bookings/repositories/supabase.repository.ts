import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { NotFoundError, InternalError } from "@/error.js";
import type { BookingRepository } from "../repository.js";
import { Booking } from "../model.js";

export class SupabaseBookingRepository implements BookingRepository {
  private readonly _client: SupabaseClient;

  constructor(supabaseUrl: string, supabaseKey: string) {
    this._client = createClient(supabaseUrl, supabaseKey);
  }

  async create(userId: string, title: string, startTime: Date, endTime: Date): Promise<Booking> {
    const { data, error } = await this._client
      .from("bookings")
      .insert({
        user_id: userId,
        title,
        start_time: startTime.toISOString(),
        end_time: endTime.toISOString(),
      })
      .select()
      .single();

    if (error) {
      throw new InternalError(`Failed to create booking: ${error.message}`);
    }

    return new Booking(
      data.id,
      data.user_id,
      data.title,
      new Date(data.start_time),
      new Date(data.end_time),
      new Date(data.created_at)
    );
  }

  async findById(id: string): Promise<Booking | null> {
    const { data, error } = await this._client.from("bookings").select("*").eq("id", id).single();

    if (error) {
      if (error.code === "PGRST116") return null;
      throw new InternalError(`Failed to fetch booking: ${error.message}`);
    }

    return new Booking(
      data.id,
      data.user_id,
      data.title,
      new Date(data.start_time),
      new Date(data.end_time),
      new Date(data.created_at)
    );
  }

  async findByUserId(userId: string): Promise<Booking[]> {
    const { data, error } = await this._client
      .from("bookings")
      .select("*")
      .eq("user_id", userId)
      .order("start_time", { ascending: true });

    if (error) {
      throw new InternalError(`Failed to fetch bookings: ${error.message}`);
    }

    return data.map(
      (item) =>
        new Booking(
          item.id,
          item.user_id,
          item.title,
          new Date(item.start_time),
          new Date(item.end_time),
          new Date(item.created_at)
        )
    );
  }

  async update(
    id: string,
    data: { title?: string; startTime?: Date; endTime?: Date }
  ): Promise<Booking> {
    const updateData: any = {};
    if (data.title) updateData.title = data.title;
    if (data.startTime) updateData.start_time = data.startTime.toISOString();
    if (data.endTime) updateData.end_time = data.endTime.toISOString();

    const { data: result, error } = await this._client
      .from("bookings")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw new InternalError(`Failed to update booking: ${error.message}`);
    }

    if (!result) {
      throw new NotFoundError("Booking not found");
    }

    return new Booking(
      result.id,
      result.user_id,
      result.title,
      new Date(result.start_time),
      new Date(result.end_time),
      new Date(result.created_at)
    );
  }

  async delete(id: string): Promise<void> {
    const { error } = await this._client.from("bookings").delete().eq("id", id);

    if (error) {
      throw new InternalError(`Failed to delete booking: ${error.message}`);
    }
  }
}
