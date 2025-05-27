import { type UserInfo } from "@/types/user-info";

export function checkUserPermission(
  user: UserInfo | null,
  permission: "view" | "edit" | "approve" | "disable",
): boolean {
  if (!user?.groups?.permissions) return false;

  return !!user.groups.permissions[permission];
}
