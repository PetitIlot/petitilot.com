-- Migration: Add application_motivation column to creators table
-- This column stores the motivation text from creator applications

ALTER TABLE creators
ADD COLUMN IF NOT EXISTS application_motivation TEXT;

-- Make slug nullable (required for the new flow where candidature doesn't include slug)
ALTER TABLE creators
ALTER COLUMN slug DROP NOT NULL;

-- Make cgu_accepted_at nullable (CGU is now accepted at inscription, not candidature)
ALTER TABLE creators
ALTER COLUMN cgu_accepted_at DROP NOT NULL;

COMMENT ON COLUMN creators.application_motivation IS 'Motivation text submitted during creator application';
