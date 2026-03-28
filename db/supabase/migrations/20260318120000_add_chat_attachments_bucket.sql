-- Create storage bucket for chat attachments
-- This migration is idempotent: it only creates the bucket and policies if they do not already exist.

  Create bucket via direct insert to avoid relying on the (potentially version-varying) helper function.
    INSERT INTO storage.buckets (id, name)
    VALUES ('chat-attachments', 'chat-attachments')
    ON CONFLICT (id) DO NOTHING;