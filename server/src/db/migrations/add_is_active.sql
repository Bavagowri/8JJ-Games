-- server/src/db/migrations/add_is_active.sql


-- Add is_active column to users table if it doesn't exist
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE 
AFTER is_verified;