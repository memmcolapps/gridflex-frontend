import { useAuth } from "@/context/auth-context";
import { checkUserPermission } from "@/utils/permissions";

/**
 * Hook to check user permissions for edit, view, approve, and disable actions
 */
export function usePermissions() {
  const { user } = useAuth();

  const canEdit = checkUserPermission(user, "edit");
  const canView = checkUserPermission(user, "view");
  const canApprove = checkUserPermission(user, "approve");
  const canDisable = checkUserPermission(user, "disable");

  return {
    canEdit,
    canView,
    canApprove,
    canDisable,
  };
}
