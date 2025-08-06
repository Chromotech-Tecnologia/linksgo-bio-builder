-- Fix the infinite recursion issue in organization_members RLS policy
-- Remove the problematic policy that causes infinite recursion
DROP POLICY IF EXISTS "Organization owners and admins can manage members" ON public.organization_members;

-- Create a security definer function to check organization permissions
CREATE OR REPLACE FUNCTION public.can_manage_organization_members(org_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public, auth
AS $$
  SELECT EXISTS (
    SELECT 1 FROM organizations o
    WHERE o.id = org_id 
    AND (
      o.owner_id = auth.uid() 
      OR EXISTS (
        SELECT 1 FROM organization_members om 
        WHERE om.organization_id = org_id 
        AND om.user_id = auth.uid() 
        AND om.role IN ('owner', 'admin')
      )
    )
  );
$$;

-- Create new policy using the security definer function
CREATE POLICY "Organization owners and admins can manage members" 
ON public.organization_members
FOR ALL
USING (public.can_manage_organization_members(organization_id))
WITH CHECK (public.can_manage_organization_members(organization_id));