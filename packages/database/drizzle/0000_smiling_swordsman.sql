-- Drop existing tables if they exist (for clean migrations)
DROP TABLE IF EXISTS "users" CASCADE;

-- Create users table
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"full_name" varchar NOT NULL
);