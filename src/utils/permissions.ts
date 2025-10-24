import { type UserInfo } from "@/types/user-info";

export function checkUserPermission(
  user: UserInfo | null,
  permission: "view" | "edit" | "approve" | "disable",
): boolean {
  if (!user?.groups?.permissions) return false;

  return !!user.groups.permissions[permission];
}

/**
 * Get the first accessible module path for a user based on their permissions
 * Returns the path to the first module they have access to, or a fallback path
 */
export function getFirstAccessiblePath(user: UserInfo | null): string {
  if (!user) {
    return "/login";
  }

  // SuperAdmin can go to any dashboard
  if (user.groups?.groupTitle?.toLowerCase() === "super admin") {
    return "/data-management/dashboard";
  }

  // Check module access in order and return the first accessible one
  const modules = user.groups?.modules || [];

  // Define the module to path mapping with fallback dashboard for each
  const modulePaths: Record<string, string> = {
    "Data Management": "/data-management/dashboard",
    Billing: "/billing/dashboard",
    Vending: "/vending/vending-dashboard",
    HES: "/hes/dashboard",
    "User Management": "/user-management",
    "Audit Log": "/audit-log",
    "Report Summary": "/customized-report",
    "Incident Report": "/incident-report",
  };

  // Normalize module name for comparison
  const normalizeModuleName = (name: string): string => {
    return name.toLowerCase().replace(/\s+/g, "");
  };

  // Find first accessible module
  for (const [moduleName, modulePath] of Object.entries(modulePaths)) {
    const hasModuleAccess = modules.some((module) => {
      const normalizedApiModuleName = normalizeModuleName(module.name);
      const normalizedModuleName_local = normalizeModuleName(moduleName);
      return (
        normalizedApiModuleName === normalizedModuleName_local && module.access
      );
    });

    if (hasModuleAccess) {
      return modulePath;
    }
  }

  // Check for Audit Log (special case, often always accessible)
  const hasAuditLogAccess = modules.some((module) => {
    return normalizeModuleName(module.name) === "auditlog";
  });

  if (hasAuditLogAccess) {
    return "/audit-log";
  }

  // Fallback to a generic dashboard or page
  return "/data-management";
}
