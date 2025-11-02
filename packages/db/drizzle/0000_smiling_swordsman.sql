CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"full_name" varchar NOT NULL
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE POLICY "users can view their own data row"
  ON users
  FOR SELECT
  USING (auth.uid() = id);

CREATE OR REPLACE POLICY "users can modify their own data row"
  ON users
  FOR UPDATE
  USING (auth.uid() = id);
  WITH CHECK (auth.uid() = id)

CREATE OR REPLACE POLICY "users can insert their own data row"
  ON users
  FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE OR REPLACE POLICY "users can delete their own data"
  ON users
  FOR DELETE
  USING (auth.uid() = id);