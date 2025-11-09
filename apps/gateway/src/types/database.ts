import type { Database } from "@repo/supabase";

export type WorkspaceRow = Database["public"]["Tables"]["workspaces"]["Row"];
export type OrganizationRow = Database["public"]["Tables"]["organizations"]["Row"];
export type WorkspaceMemberRow = Database["public"]["Tables"]["workspace_members"]["Row"];
export type OrganizationMemberRow = Database["public"]["Tables"]["organization_members"]["Row"];
export type BookingRow = Database["public"]["Tables"]["bookings"]["Row"];
export type BookingTypeRow = Database["public"]["Tables"]["booking_types"]["Row"];
export type AvailabilityScheduleRow = Database["public"]["Tables"]["availability_schedules"]["Row"];
export type AvailabilitySlotRow = Database["public"]["Tables"]["availability_slots"]["Row"];

export type WorkspaceInsert = Database["public"]["Tables"]["workspaces"]["Insert"];
export type OrganizationInsert = Database["public"]["Tables"]["organizations"]["Insert"];
export type WorkspaceMemberInsert = Database["public"]["Tables"]["workspace_members"]["Insert"];
export type OrganizationMemberInsert =
  Database["public"]["Tables"]["organization_members"]["Insert"];
export type BookingInsert = Database["public"]["Tables"]["bookings"]["Insert"];
export type BookingTypeInsert = Database["public"]["Tables"]["booking_types"]["Insert"];
export type AvailabilityScheduleInsert =
  Database["public"]["Tables"]["availability_schedules"]["Insert"];
export type AvailabilitySlotInsert = Database["public"]["Tables"]["availability_slots"]["Insert"];

export type WorkspaceUpdate = Database["public"]["Tables"]["workspaces"]["Update"];
export type OrganizationUpdate = Database["public"]["Tables"]["organizations"]["Update"];
export type WorkspaceMemberUpdate = Database["public"]["Tables"]["workspace_members"]["Update"];
export type OrganizationMemberUpdate =
  Database["public"]["Tables"]["organization_members"]["Update"];
export type BookingUpdate = Database["public"]["Tables"]["bookings"]["Update"];
export type BookingTypeUpdate = Database["public"]["Tables"]["booking_types"]["Update"];
export type AvailabilityScheduleUpdate =
  Database["public"]["Tables"]["availability_schedules"]["Update"];
export type AvailabilitySlotUpdate = Database["public"]["Tables"]["availability_slots"]["Update"];

export type MemberRole = Database["public"]["Enums"]["member_role"];
export type DayOfWeek = Database["public"]["Enums"]["day_of_week"];
export type BookingStatus = Database["public"]["Enums"]["booking_status"];
