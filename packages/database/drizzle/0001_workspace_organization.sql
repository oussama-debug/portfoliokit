-- Drop existing types if they exist
DROP TYPE IF EXISTS "member_role" CASCADE;
DROP TYPE IF EXISTS "day_of_week" CASCADE;
DROP TYPE IF EXISTS "booking_status" CASCADE;

-- Create enums
CREATE TYPE "member_role" AS ENUM ('owner', 'admin', 'member');
CREATE TYPE "day_of_week" AS ENUM ('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday');
CREATE TYPE "booking_status" AS ENUM ('pending', 'confirmed', 'cancelled', 'completed');

-- Update users table (add columns if they don't exist)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='email') THEN
    ALTER TABLE "users" ADD COLUMN "email" VARCHAR(255) NOT NULL UNIQUE;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='avatar_url') THEN
    ALTER TABLE "users" ADD COLUMN "avatar_url" TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='created_at') THEN
    ALTER TABLE "users" ADD COLUMN "created_at" TIMESTAMP DEFAULT NOW() NOT NULL;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='updated_at') THEN
    ALTER TABLE "users" ADD COLUMN "updated_at" TIMESTAMP DEFAULT NOW() NOT NULL;
  END IF;
END $$;

-- Drop existing tables if they exist
DROP TABLE IF EXISTS "bookings" CASCADE;
DROP TABLE IF EXISTS "availability_slots" CASCADE;
DROP TABLE IF EXISTS "availability_schedules" CASCADE;
DROP TABLE IF EXISTS "booking_types" CASCADE;
DROP TABLE IF EXISTS "workspace_members" CASCADE;
DROP TABLE IF EXISTS "organization_members" CASCADE;
DROP TABLE IF EXISTS "workspaces" CASCADE;
DROP TABLE IF EXISTS "organizations" CASCADE;

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

-- Create bookings table
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

-- Note: RLS policies removed for standard PostgreSQL compatibility
-- If using Supabase, add RLS policies separately
