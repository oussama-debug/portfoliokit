/**
 * Central type definitions
 * All packages extend from these base types
 */

export type MemberRole = "owner" | "admin" | "member";

export type DayOfWeek =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export type BookingStatus = "pending" | "confirmed" | "cancelled" | "completed";

export interface UserObject {
  id: string;
  username: string;
  createdAt: string;
  email_confirmed: boolean;
}

export interface SessionObject {
  access_token: string;
  refresh_token: string;
}

export interface WorkspaceObject {
  id: string;
  organizationId: string;
  name: string;
  slug: string;
  description: string | null;
  timezone: string;
  isActive: boolean;
  createdAt: string;
}

export interface OrganizationObject {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logoUrl: string | null;
  createdAt: string;
}

export interface MemberObject {
  id: string;
  userId: string;
  role: MemberRole;
  createdAt: string;
}

export interface WorkspaceMemberObject extends MemberObject {
  workspaceId: string;
}

export interface OrganizationMemberObject extends MemberObject {
  organizationId: string;
}

export interface BookingObject {
  id: string;
  userId: string;
  title: string;
  startTime: string;
  endTime: string;
  createdAt: string;
}

export interface BookingTypeObject {
  id: string;
  workspaceId: string;
  name: string;
  slug: string;
  description: string | null;
  duration: number;
  color: string;
  isActive: boolean;
  createdAt: string;
}

export interface AvailabilityScheduleObject {
  id: string;
  workspaceId: string;
  userId: string;
  name: string;
  timezone: string;
  isDefault: boolean;
  createdAt: string;
}

export interface AvailabilitySlotObject {
  id: string;
  scheduleId: string;
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
  createdAt: string;
}
