-- Create enums
CREATE TYPE "member_role" AS ENUM ('owner', 'admin', 'member');
CREATE TYPE "day_of_week" AS ENUM ('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday');
CREATE TYPE "booking_status" AS ENUM ('pending', 'confirmed', 'cancelled', 'completed');

-- Update users table
ALTER TABLE "users" ADD COLUMN "email" VARCHAR(255) NOT NULL UNIQUE;
ALTER TABLE "users" ADD COLUMN "avatar_url" TEXT;
ALTER TABLE "users" ADD COLUMN "created_at" TIMESTAMP DEFAULT NOW() NOT NULL;
ALTER TABLE "users" ADD COLUMN "updated_at" TIMESTAMP DEFAULT NOW() NOT NULL;
ALTER TABLE "users" RENAME COLUMN "full_name" TO "full_name";

-- Create organizations table
CREATE TABLE "organizations" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" VARCHAR(255) NOT NULL,
  "slug" VARCHAR(100) NOT NULL UNIQUE,
  "description" TEXT,
  "logo_url" TEXT,
  "created_at" TIMESTAMP DEFAULT NOW() NOT NULL,
  "updated_at" TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Create workspaces table
CREATE TABLE "workspaces" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "organization_id" UUID NOT NULL REFERENCES "organizations"("id") ON DELETE CASCADE,
  "name" VARCHAR(255) NOT NULL,
  "slug" VARCHAR(100) NOT NULL,
  "description" TEXT,
  "timezone" VARCHAR(100) DEFAULT 'UTC' NOT NULL,
  "is_active" BOOLEAN DEFAULT TRUE NOT NULL,
  "created_at" TIMESTAMP DEFAULT NOW() NOT NULL,
  "updated_at" TIMESTAMP DEFAULT NOW() NOT NULL,
  UNIQUE("organization_id", "slug")
);

CREATE INDEX "workspace_org_id_idx" ON "workspaces"("organization_id");
CREATE INDEX "workspace_slug_idx" ON "workspaces"("slug");

-- Create organization_members table
CREATE TABLE "organization_members" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "organization_id" UUID NOT NULL REFERENCES "organizations"("id") ON DELETE CASCADE,
  "user_id" UUID NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "role" "member_role" DEFAULT 'member' NOT NULL,
  "created_at" TIMESTAMP DEFAULT NOW() NOT NULL,
  UNIQUE("organization_id", "user_id")
);

CREATE INDEX "org_member_org_id_idx" ON "organization_members"("organization_id");
CREATE INDEX "org_member_user_id_idx" ON "organization_members"("user_id");

-- Create workspace_members table
CREATE TABLE "workspace_members" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "workspace_id" UUID NOT NULL REFERENCES "workspaces"("id") ON DELETE CASCADE,
  "user_id" UUID NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "role" "member_role" DEFAULT 'member' NOT NULL,
  "created_at" TIMESTAMP DEFAULT NOW() NOT NULL,
  UNIQUE("workspace_id", "user_id")
);

CREATE INDEX "workspace_member_workspace_id_idx" ON "workspace_members"("workspace_id");
CREATE INDEX "workspace_member_user_id_idx" ON "workspace_members"("user_id");

-- Create booking_types table
CREATE TABLE "booking_types" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "workspace_id" UUID NOT NULL REFERENCES "workspaces"("id") ON DELETE CASCADE,
  "name" VARCHAR(255) NOT NULL,
  "slug" VARCHAR(100) NOT NULL,
  "description" TEXT,
  "duration" INTEGER NOT NULL,
  "color" VARCHAR(7) DEFAULT '#3b82f6',
  "is_active" BOOLEAN DEFAULT TRUE NOT NULL,
  "created_at" TIMESTAMP DEFAULT NOW() NOT NULL,
  "updated_at" TIMESTAMP DEFAULT NOW() NOT NULL,
  UNIQUE("workspace_id", "slug")
);

CREATE INDEX "booking_type_workspace_id_idx" ON "booking_types"("workspace_id");

-- Create availability_schedules table
CREATE TABLE "availability_schedules" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "workspace_id" UUID NOT NULL REFERENCES "workspaces"("id") ON DELETE CASCADE,
  "user_id" UUID NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "name" VARCHAR(255) NOT NULL,
  "timezone" VARCHAR(100) DEFAULT 'UTC' NOT NULL,
  "is_default" BOOLEAN DEFAULT FALSE NOT NULL,
  "created_at" TIMESTAMP DEFAULT NOW() NOT NULL,
  "updated_at" TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE INDEX "availability_schedule_workspace_id_idx" ON "availability_schedules"("workspace_id");
CREATE INDEX "availability_schedule_user_id_idx" ON "availability_schedules"("user_id");

-- Create availability_slots table
CREATE TABLE "availability_slots" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "schedule_id" UUID NOT NULL REFERENCES "availability_schedules"("id") ON DELETE CASCADE,
  "day_of_week" "day_of_week" NOT NULL,
  "start_time" VARCHAR(5) NOT NULL,
  "end_time" VARCHAR(5) NOT NULL,
  "created_at" TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE INDEX "availability_slot_schedule_id_idx" ON "availability_slots"("schedule_id");

-- Update bookings table
DROP TABLE IF EXISTS "bookings";

CREATE TABLE "bookings" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "workspace_id" UUID NOT NULL REFERENCES "workspaces"("id") ON DELETE CASCADE,
  "booking_type_id" UUID NOT NULL REFERENCES "booking_types"("id") ON DELETE RESTRICT,
  "host_user_id" UUID NOT NULL REFERENCES "users"("id") ON DELETE RESTRICT,
  "guest_name" VARCHAR(255) NOT NULL,
  "guest_email" VARCHAR(255) NOT NULL,
  "guest_notes" TEXT,
  "start_time" TIMESTAMP NOT NULL,
  "end_time" TIMESTAMP NOT NULL,
  "status" "booking_status" DEFAULT 'pending' NOT NULL,
  "cancelled_at" TIMESTAMP,
  "cancellation_reason" TEXT,
  "created_at" TIMESTAMP DEFAULT NOW() NOT NULL,
  "updated_at" TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE INDEX "booking_workspace_id_idx" ON "bookings"("workspace_id");
CREATE INDEX "booking_host_user_id_idx" ON "bookings"("host_user_id");
CREATE INDEX "booking_start_time_idx" ON "bookings"("start_time");
CREATE INDEX "booking_guest_email_idx" ON "bookings"("guest_email");

-- Enable RLS on all tables
ALTER TABLE "organizations" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "workspaces" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "organization_members" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "workspace_members" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "booking_types" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "availability_schedules" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "availability_slots" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "bookings" ENABLE ROW LEVEL SECURITY;

-- RLS Policies for organizations
CREATE POLICY "users can view organizations they are members of"
  ON "organizations" FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM "organization_members"
      WHERE "organization_members"."organization_id" = "organizations"."id"
      AND "organization_members"."user_id" = auth.uid()
    )
  );

CREATE POLICY "organization owners can update their organization"
  ON "organizations" FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM "organization_members"
      WHERE "organization_members"."organization_id" = "organizations"."id"
      AND "organization_members"."user_id" = auth.uid()
      AND "organization_members"."role" = 'owner'
    )
  );

-- RLS Policies for workspaces
CREATE POLICY "users can view workspaces they have access to"
  ON "workspaces" FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM "workspace_members"
      WHERE "workspace_members"."workspace_id" = "workspaces"."id"
      AND "workspace_members"."user_id" = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM "organization_members"
      WHERE "organization_members"."organization_id" = "workspaces"."organization_id"
      AND "organization_members"."user_id" = auth.uid()
    )
  );

-- RLS Policies for bookings (public read for guest booking, authenticated for management)
CREATE POLICY "anyone can view bookings by workspace slug"
  ON "bookings" FOR SELECT
  USING (TRUE);

CREATE POLICY "workspace members can manage bookings"
  ON "bookings" FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM "workspace_members"
      WHERE "workspace_members"."workspace_id" = "bookings"."workspace_id"
      AND "workspace_members"."user_id" = auth.uid()
    )
  );
