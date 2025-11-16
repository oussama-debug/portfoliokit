import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  text,
  boolean,
  integer,
  pgEnum,
  unique,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const memberRoleEnum = pgEnum("member_role", ["owner", "admin", "member"]);
export const dayOfWeekEnum = pgEnum("day_of_week", [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
]);
export const bookingStatusEnum = pgEnum("booking_status", [
  "pending",
  "confirmed",
  "cancelled",
  "completed",
]);

export const users = pgTable("users", {
  id: uuid("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  fullName: varchar("full_name", { length: 255 }).notNull(),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const organizations = pgTable("organizations", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  description: text("description"),
  logoUrl: text("logo_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const workspaces = pgTable(
  "workspaces",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 100 }).notNull(),
    description: text("description"),
    timezone: varchar("timezone", { length: 100 }).default("UTC").notNull(),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    uniqueOrgSlug: unique().on(table.organizationId, table.slug),
    orgIdIdx: index("workspace_org_id_idx").on(table.organizationId),
    slugIdx: index("workspace_slug_idx").on(table.slug),
  })
);

export const organizationMembers = pgTable(
  "organization_members",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    role: memberRoleEnum("role").default("member").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    uniqueOrgUser: unique().on(table.organizationId, table.userId),
    orgIdIdx: index("org_member_org_id_idx").on(table.organizationId),
    userIdIdx: index("org_member_user_id_idx").on(table.userId),
  })
);

export const workspaceMembers = pgTable(
  "workspace_members",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    workspaceId: uuid("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    role: memberRoleEnum("role").default("member").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    uniqueWorkspaceUser: unique().on(table.workspaceId, table.userId),
    workspaceIdIdx: index("workspace_member_workspace_id_idx").on(table.workspaceId),
    userIdIdx: index("workspace_member_user_id_idx").on(table.userId),
  })
);

export const bookingTypes = pgTable(
  "booking_types",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    workspaceId: uuid("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 100 }).notNull(),
    description: text("description"),
    duration: integer("duration").notNull(),
    color: varchar("color", { length: 7 }).default("#3b82f6"),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    uniqueWorkspaceSlug: unique().on(table.workspaceId, table.slug),
    workspaceIdIdx: index("booking_type_workspace_id_idx").on(table.workspaceId),
  })
);

export const availabilitySchedules = pgTable(
  "availability_schedules",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    workspaceId: uuid("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 255 }).notNull(),
    timezone: varchar("timezone", { length: 100 }).default("UTC").notNull(),
    isDefault: boolean("is_default").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    workspaceIdIdx: index("availability_schedule_workspace_id_idx").on(table.workspaceId),
    userIdIdx: index("availability_schedule_user_id_idx").on(table.userId),
  })
);

export const availabilitySlots = pgTable(
  "availability_slots",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    scheduleId: uuid("schedule_id")
      .notNull()
      .references(() => availabilitySchedules.id, { onDelete: "cascade" }),
    dayOfWeek: dayOfWeekEnum("day_of_week").notNull(),
    startTime: varchar("start_time", { length: 5 }).notNull(),
    endTime: varchar("end_time", { length: 5 }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    scheduleIdIdx: index("availability_slot_schedule_id_idx").on(table.scheduleId),
  })
);

export const bookings = pgTable(
  "bookings",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    workspaceId: uuid("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    bookingTypeId: uuid("booking_type_id")
      .notNull()
      .references(() => bookingTypes.id, { onDelete: "restrict" }),
    hostUserId: uuid("host_user_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    guestName: varchar("guest_name", { length: 255 }).notNull(),
    guestEmail: varchar("guest_email", { length: 255 }).notNull(),
    guestNotes: text("guest_notes"),
    startTime: timestamp("start_time").notNull(),
    endTime: timestamp("end_time").notNull(),
    status: bookingStatusEnum("status").default("pending").notNull(),
    cancelledAt: timestamp("cancelled_at"),
    cancellationReason: text("cancellation_reason"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    workspaceIdIdx: index("booking_workspace_id_idx").on(table.workspaceId),
    hostUserIdIdx: index("booking_host_user_id_idx").on(table.hostUserId),
    startTimeIdx: index("booking_start_time_idx").on(table.startTime),
    guestEmailIdx: index("booking_guest_email_idx").on(table.guestEmail),
  })
);

export const usersRelations = relations(users, ({ many }) => ({
  organizationMemberships: many(organizationMembers),
  workspaceMemberships: many(workspaceMembers),
  availabilitySchedules: many(availabilitySchedules),
  hostedBookings: many(bookings),
}));

export const organizationsRelations = relations(organizations, ({ many }) => ({
  workspaces: many(workspaces),
  members: many(organizationMembers),
}));

export const organizationMembersRelations = relations(organizationMembers, ({ one }) => ({
  organization: one(organizations, {
    fields: [organizationMembers.organizationId],
    references: [organizations.id],
  }),
  user: one(users, {
    fields: [organizationMembers.userId],
    references: [users.id],
  }),
}));

export const workspacesRelations = relations(workspaces, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [workspaces.organizationId],
    references: [organizations.id],
  }),
  members: many(workspaceMembers),
  bookingTypes: many(bookingTypes),
  availabilitySchedules: many(availabilitySchedules),
  bookings: many(bookings),
}));

export const workspaceMembersRelations = relations(workspaceMembers, ({ one }) => ({
  workspace: one(workspaces, {
    fields: [workspaceMembers.workspaceId],
    references: [workspaces.id],
  }),
  user: one(users, {
    fields: [workspaceMembers.userId],
    references: [users.id],
  }),
}));

export const bookingTypesRelations = relations(bookingTypes, ({ one, many }) => ({
  workspace: one(workspaces, {
    fields: [bookingTypes.workspaceId],
    references: [workspaces.id],
  }),
  bookings: many(bookings),
}));

export const availabilitySchedulesRelations = relations(availabilitySchedules, ({ one, many }) => ({
  workspace: one(workspaces, {
    fields: [availabilitySchedules.workspaceId],
    references: [workspaces.id],
  }),
  user: one(users, {
    fields: [availabilitySchedules.userId],
    references: [users.id],
  }),
  slots: many(availabilitySlots),
}));

export const availabilitySlotsRelations = relations(availabilitySlots, ({ one }) => ({
  schedule: one(availabilitySchedules, {
    fields: [availabilitySlots.scheduleId],
    references: [availabilitySchedules.id],
  }),
}));

export const bookingsRelations = relations(bookings, ({ one }) => ({
  workspace: one(workspaces, {
    fields: [bookings.workspaceId],
    references: [workspaces.id],
  }),
  bookingType: one(bookingTypes, {
    fields: [bookings.bookingTypeId],
    references: [bookingTypes.id],
  }),
  host: one(users, {
    fields: [bookings.hostUserId],
    references: [users.id],
  }),
}));
