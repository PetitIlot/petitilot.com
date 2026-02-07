-- ============================================
-- MIGRATION 008: Fix Supabase Security Linter Issues
-- ============================================
-- Fixes:
-- 1. SECURITY DEFINER view: ressources_with_creator
-- 2. RLS disabled: unlocks, saved_searches, notifications
-- ============================================

-- ============================================
-- 1. FIX VIEW: ressources_with_creator
-- ============================================
-- Recreate view with SECURITY INVOKER (uses caller's permissions, not definer's)
-- This ensures RLS policies are properly enforced

DROP VIEW IF EXISTS ressources_with_creator;

CREATE VIEW ressources_with_creator
WITH (security_invoker = true)
AS
SELECT
  r.*,
  c.display_name as creator_name,
  c.slug as creator_slug,
  c.avatar_url as creator_avatar
FROM ressources r
LEFT JOIN creators c ON r.creator_id = c.id
WHERE r.status = 'published';

COMMENT ON VIEW ressources_with_creator IS 'Published resources with creator info. Uses SECURITY INVOKER to respect RLS.';

-- ============================================
-- 2. FIX RLS: unlocks table
-- ============================================
ALTER TABLE public.unlocks ENABLE ROW LEVEL SECURITY;

-- Ensure policies exist
DROP POLICY IF EXISTS "unlocks_select_own" ON public.unlocks;
DROP POLICY IF EXISTS "unlocks_insert_own" ON public.unlocks;
DROP POLICY IF EXISTS "unlocks_admin_all" ON public.unlocks;

-- Users can view their own unlocks
CREATE POLICY "unlocks_select_own" ON public.unlocks
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own unlocks (via purchase flow)
CREATE POLICY "unlocks_insert_own" ON public.unlocks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Admins have full access
CREATE POLICY "unlocks_admin_all" ON public.unlocks
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

-- ============================================
-- 3. FIX RLS: saved_searches table
-- ============================================
ALTER TABLE public.saved_searches ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "saved_searches_select_own" ON public.saved_searches;
DROP POLICY IF EXISTS "saved_searches_insert_own" ON public.saved_searches;
DROP POLICY IF EXISTS "saved_searches_update_own" ON public.saved_searches;
DROP POLICY IF EXISTS "saved_searches_delete_own" ON public.saved_searches;

-- Users can only see their own saved searches
CREATE POLICY "saved_searches_select_own" ON public.saved_searches
  FOR SELECT USING (auth.uid() = user_id);

-- Users can create their own saved searches
CREATE POLICY "saved_searches_insert_own" ON public.saved_searches
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own saved searches
CREATE POLICY "saved_searches_update_own" ON public.saved_searches
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own saved searches
CREATE POLICY "saved_searches_delete_own" ON public.saved_searches
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- 4. FIX RLS: notifications table
-- ============================================
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "notifications_select_own" ON public.notifications;
DROP POLICY IF EXISTS "notifications_update_own" ON public.notifications;
DROP POLICY IF EXISTS "notifications_delete_own" ON public.notifications;
DROP POLICY IF EXISTS "notifications_insert_system" ON public.notifications;

-- Users can only see their own notifications
CREATE POLICY "notifications_select_own" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

-- Users can update their own notifications (mark as read)
CREATE POLICY "notifications_update_own" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own notifications
CREATE POLICY "notifications_delete_own" ON public.notifications
  FOR DELETE USING (auth.uid() = user_id);

-- System/service role can insert notifications (for cron jobs, webhooks)
-- Note: Service role bypasses RLS, so this policy is for authenticated inserts if needed
CREATE POLICY "notifications_insert_system" ON public.notifications
  FOR INSERT WITH CHECK (
    -- Allow service role (handled automatically) or admin users
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
    -- Or allow users to insert their own notifications (for edge cases)
    OR auth.uid() = user_id
  );

-- ============================================
-- END MIGRATION 008
-- ============================================
