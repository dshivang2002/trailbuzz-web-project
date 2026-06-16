-- Explicitly deny public/authenticated SELECT on sensitive tables.
-- Admin access happens via service_role (backend), which bypasses RLS.

CREATE POLICY "Deny public read of enquiries"
ON public.enquiries
FOR SELECT
TO anon, authenticated
USING (false);

CREATE POLICY "Deny public read of page visits"
ON public.page_visits
FOR SELECT
TO anon, authenticated
USING (false);