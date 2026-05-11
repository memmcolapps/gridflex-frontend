"use client";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import {
  Activity,
  Building2,
  ChevronDown,
  ClipboardList,
  Cylinder,
  Users,
  Zap,
  Info,
  MessageSquareMore,
  type LucideIcon,
  CircleAlert,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useMemo } from "react";
import { useAuth } from "@/context/auth-context";

interface NavItemProps {
  title: string;
  href: string;
  icon: LucideIcon;
  permission: NavPermission;
  alwaysVisible?: boolean;
  isActive?: boolean;
  hasSubmenu?: boolean;
  submenuItems?: SubMenuItemProps[];
}

interface SubMenuItemProps {
  title: string;
  href: string;
  permission: NavPermission;
  hasSubmenu?: boolean;
  submenuItems?: SubMenuItemProps[];
}

interface NavPermission {
  module: string;
  subModules?: string[];
}

const navItems: NavItemProps[] = [
  {
    title: "Data Management",
    href: "/data-management",
    icon: Cylinder,
    permission: { module: "Data Management" },
    hasSubmenu: true,
    submenuItems: [
      {
        title: "Dashboard",
        href: "/data-management/dashboard",
        permission: { module: "Data Management" },
      },
      {
        title: "Organization",
        href: "/data-management/organization",
        permission: { module: "Data Management", subModules: ["Organization"] },
      },
      {
        title: "Meter Management",
        href: "/data-management/meter-management",
        permission: {
          module: "Data Management",
          subModules: ["Meter Management"],
        },
        hasSubmenu: true,
        submenuItems: [
          {
            title: "Meter Manufacturers",
            href: "/data-management/meter-management/meter-manufacturer",
            permission: {
              module: "Data Management",
              subModules: ["Meter Management"],
            },
          },
          {
            title: "Meter Inventory",
            href: "/data-management/meter-management/meter-inventory",
            permission: {
              module: "Data Management",
              subModules: ["Meter Management"],
            },
          },
          {
            title: "Meters",
            href: "/data-management/meter-management/meters",
            permission: {
              module: "Data Management",
              subModules: ["Meter Management"],
            },
          },
          {
            title: "Assigned Meter",
            href: "/data-management/meter-management/assign-meter",
            permission: {
              module: "Data Management",
              subModules: ["Meter Management"],
            },
          },
        ],
      },
      {
        title: "Customer Management",
        href: "/data-management/customer-management",
        permission: {
          module: "Data Management",
          subModules: ["Customer Management"],
        },
      },
      {
        title: "Band Management",
        href: "/data-management/band-management",
        permission: {
          module: "Data Management",
          subModules: ["Band Management"],
        },
      },
      {
        title: "Tariff Rate",
        href: "/data-management/tarrif-rate",
        permission: { module: "Data Management", subModules: ["Tariff"] },
      },
      {
        title: "Debt Management",
        href: "/data-management/debt-management",
        permission: {
          module: "Data Management",
          subModules: ["Debt Management"],
        },
        hasSubmenu: true,
        submenuItems: [
          {
            title: "Debt Setting",
            href: "/data-management/debt-management/debt-settings",
            permission: {
              module: "Data Management",
              subModules: ["Debt Management"],
            },
          },
          {
            title: "Debit Adjustment",
            href: "/data-management/debt-management/debit-adjustment",
            permission: {
              module: "Data Management",
              subModules: ["Debt Management"],
            },
          },
          {
            title: "Credit Adjustment",
            href: "/data-management/debt-management/credit-adjustment",
            permission: {
              module: "Data Management",
              subModules: ["Debt Management"],
            },
          },
        ],
      },
      {
        title: "Review and Approval",
        href: "/data-management/reviewandapproval",
        permission: {
          module: "Data Management",
          subModules: ["Review and Approval"],
        },
      },
    ],
  },
  // {
  //   title: "Billing",
  //   href: "/billing",
  //   icon: CreditCard,
  //   hasSubmenu: true,
  //   submenuItems: [
  //     { title: "Dashboard", href: "/billing/dashboard" },
  //     {
  //       title: "MD Prebilling",
  //       href: "#",
  //       hasSubmenu: true,
  //       submenuItems: [
  //         {
  //           title: "Meter Reading Sheet",
  //           href: "/billing/md-prebilling/reading-sheet",
  //         },
  //         {
  //           title: "Meter Consumption",
  //           href: "/billing/md-prebilling/meter-consumption",
  //         },
  //         {
  //           title: "Energy-Import",
  //           href: "/billing/md-prebilling/energy-import",
  //         },
  //       ],
  //     },
  //     {
  //       title: "Non-MD Prebilling",
  //       href: "#",
  //       hasSubmenu: true,
  //       submenuItems: [
  //         {
  //           title: "Meter Reading Sheet",
  //           href: "/billing/non-md-prebilling/reading-sheet",
  //         },
  //         {
  //           title: "Meter Consumption",
  //           href: "/billing/non-md-prebilling/meter-consumption",
  //         },
  //         {
  //           title: "Energy-Import",
  //           href: "/billing/non-md-prebilling/energy-import",
  //         },
  //       ],
  //     },
  //     { title: "Billing", href: "/billing/billing" },
  //     { title: "Payments", href: "/billing/payments" },
  //   ],
  // },
  {
    title: "Vending",
    href: "/vending",
    icon: Zap,
    permission: { module: "Vending" },
    hasSubmenu: true,
    submenuItems: [
      {
        title: "Dashboard",
        href: "/vending/vending-dashboard",
        permission: { module: "Vending" },
      },
      {
        title: "Vending",
        href: "/vending/vending",
        permission: { module: "Vending", subModules: ["Vending"] },
      },
    ],
  },
  {
    title: "HES",
    href: "/hes",
    icon: Building2,
    permission: { module: "HES" },
    hasSubmenu: true,
    submenuItems: [
      {
        title: "Dashboard",
        href: "/hes/dashboard",
        permission: { module: "HES" },
      },
      {
        title: "Communication Report",
        href: "/hes/hes-communication-report",
        permission: { module: "HES", subModules: ["HES"] },
      },
      {
        title: "Realtime Data",
        href: "/hes/hes-realtime-data",
        permission: { module: "HES", subModules: ["HES"] },
      },
      {
        title: "Profile and Events",
        href: "/hes/profile-and-events",
        permission: { module: "HES", subModules: ["HES"] },
      },
      {
        title: "Meter Remote Configuration",
        href: "/hes/controlsandconfigs/meter-remote-config",
        permission: { module: "HES", subModules: ["HES"] },
      },

      // {
      //   title: "Controls and Confirguration",
      //   href: "/hes/controlsandconfigs",
      //   hasSubmenu: true,
      //   submenuItems: [
      //     {
      //       title: "Data Collection Scheduler",
      //       href: "/hes/controlsandconfigs/data-collection-scheduler",
      //     },
      //     {
      //       title: "Meter Remote Configuration",
      //       href: "/hes/controlsandconfigs/meter-remote-config",
      //     },
      //   ],
      // },
    ],
  },
  {
    title: "User Management",
    href: "/user-management",
    icon: Users,
    permission: { module: "User Management" },
    hasSubmenu: true,
    submenuItems: [
      {
        title: "Group Permission",
        href: "/user-management/group-permission",
        permission: {
          module: "User Management",
          subModules: ["User Management"],
        },
      },
      {
        title: "Users",
        href: "/user-management",
        permission: {
          module: "User Management",
          subModules: ["User Management"],
        },
      },
    ],
  },
  {
    title: "Audit Log",
    href: "/audit-log",
    icon: Activity,
    permission: { module: "Audit Log" },
    alwaysVisible: true,
    hasSubmenu: false,
  },
  {
    title: "Report Summary",
    href: "/customized-report",
    icon: ClipboardList,
    permission: { module: "Report Summary" },
    hasSubmenu: false,
  },
  {
    title: "Incident Report",
    href: "/incident-report",
    icon: CircleAlert,
    permission: { module: "Incident Report" },
    alwaysVisible: true,
    hasSubmenu: false,
  },

  {
    title: "Change Log",
    href: "/change-log",
    icon: MessageSquareMore,
    permission: { module: "Change Log" },
    hasSubmenu: false,
  },
  {
    title: "About Us",
    href: "/about-us",
    icon: Info,
    permission: { module: "About Us" },
    hasSubmenu: false,
  },
];

export function SidebarNav() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>(
    {},
  );

  const normalizePermissionName = (name: string): string => {
    return name.toLowerCase().replace(/[\s_-]+/g, "");
  };

  const isItemActive = (href: string, subItems?: SubMenuItemProps[]) => {
    if (pathname === href) return true;
    if (subItems) {
      return subItems.some(
        (subItem) =>
          pathname === subItem.href ||
          subItem.submenuItems?.some(
            (nestedItem) => pathname === nestedItem.href,
          ),
      );
    }
    return false;
  };

  const toggleExpanded = (title: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const filteredNavItems = useMemo(() => {
    if (!user) return [];

    const restrictedRoles = ["business hub", "service center"];
    const isRestrictedRole = restrictedRoles.includes(
      user?.nodeInfo?.type?.toLowerCase() || "",
    );

    const canAccess = (permission: NavPermission): boolean => {
      if (!user?.groups?.modules) return false;

      const normalizedModuleName = normalizePermissionName(permission.module);
      const allowedSubModules = permission.subModules?.map((subModule) =>
        normalizePermissionName(subModule),
      );

      return user.groups.modules.some((module) => {
        if (
          normalizePermissionName(module.name) !== normalizedModuleName ||
          !module.access
        ) {
          return false;
        }

        if (!allowedSubModules?.length) return true;

        return module.subModules.some(
          (subModule) =>
            allowedSubModules.includes(
              normalizePermissionName(subModule.name),
            ) && subModule.access,
        );
      });
    };

    const filterMeterInventory = (items: NavItemProps[]): NavItemProps[] => {
      return items.map((item) => {
        if (item.title === "Data Management" && item.submenuItems) {
          return {
            ...item,
            submenuItems: item.submenuItems.map((subItem) => {
              if (
                subItem.title === "Meter Management" &&
                subItem.submenuItems &&
                isRestrictedRole
              ) {
                return {
                  ...subItem,
                  submenuItems: subItem.submenuItems.filter(
                    (nested) => nested.title !== "Meter Inventory",
                  ),
                };
              }
              return subItem;
            }),
          };
        }
        return item;
      });
    };

    const filteredItems = navItems
      .filter((item) => item.alwaysVisible ?? canAccess(item.permission))
      .map((item) => {
        if (item.submenuItems) {
          return {
            ...item,
            submenuItems: item.submenuItems
              .filter((subItem) => canAccess(subItem.permission))
              .map((subItem) => {
                if (subItem.submenuItems) {
                  return {
                    ...subItem,
                    submenuItems: subItem.submenuItems.filter((nested) =>
                      canAccess(nested.permission),
                    ),
                  };
                }
                return subItem;
              }),
          };
        }

        return item;
      });

    return isRestrictedRole
      ? filterMeterInventory(filteredItems)
      : filteredItems;
  }, [user]);

  return (
    <Sidebar className="fixed top-0 left-0 z-40 hidden h-screen w-80 overflow-y-auto border-r border-gray-200 md:block">
      <SidebarHeader className="flex items-center justify-center py-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex items-center justify-center">
            <Image
              src="/images/logo2.svg"
              alt="GridFlex Logo"
              width={42}
              height={54}
              className="h-auto w-10"
            />
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent className="flex h-full flex-col">
        <SidebarMenu className="px-4 py-5">
          {filteredNavItems
            .filter((item) => !["Change Log", "About Us"].includes(item.title))
            .map((item) => {
              const isActive = isItemActive(item.href, item.submenuItems);
              const isExpanded = expandedItems[item.title] ?? isActive;
              if (!item.hasSubmenu) {
                return (
                  <SidebarMenuItem
                    key={item.title}
                    className={cn(
                      "px-2.5 py-5 text-xl",
                      isActive
                        ? "rounded-md bg-[#161CCA] text-white"
                        : "rounded-md hover:bg-gray-100",
                    )}
                  >
                    <Link
                      href={item.href}
                      className="flex items-center gap-3 text-lg leading-tight"
                    >
                      <item.icon
                        size={12}
                        className="h-4 w-4 flex-shrink-0 sm:h-5 sm:w-5"
                      />
                      <span className="break-words">{item.title}</span>
                    </Link>
                  </SidebarMenuItem>
                );
              }
              return (
                <Collapsible
                  key={item.title}
                  open={isExpanded}
                  onOpenChange={() => toggleExpanded(item.title)}
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        className={cn(
                          "flex min-h-fit w-full items-center justify-between py-6 text-base leading-tight sm:text-lg",
                          isActive && "bg-gray-100",
                        )}
                      >
                        <div className="flex items-center gap-3 text-lg leading-tight">
                          <item.icon
                            size={14}
                            className="h-4 w-4 flex-shrink-0 sm:h-5 sm:w-5"
                          />
                          <span className="break-words">{item.title}</span>
                        </div>
                        {item.hasSubmenu && (
                          <ChevronDown
                            className={cn(
                              "h-4 w-4 transition-transform duration-200",
                              isExpanded ? "rotate-0" : "-rotate-90",
                            )}
                            size={12}
                          />
                        )}
                      </SidebarMenuButton>
                    </CollapsibleTrigger>

                    {item.hasSubmenu && (
                      <CollapsibleContent>
                        <SidebarMenuSub className="mt-1 space-y-1">
                          {item.submenuItems?.map((subItem) => {
                            const isSubActive = isItemActive(
                              subItem.href,
                              subItem.submenuItems,
                            );
                            const isSubExpanded =
                              expandedItems[subItem.title] ?? isSubActive;

                            return (
                              <div key={subItem.title} className="pl-4 sm:pl-6">
                                {subItem.hasSubmenu ? (
                                  <Collapsible
                                    open={isSubExpanded}
                                    onOpenChange={() =>
                                      toggleExpanded(subItem.title)
                                    }
                                  >
                                    <SidebarMenuItem>
                                      <CollapsibleTrigger asChild>
                                        <SidebarMenuButton
                                          className={cn(
                                            "flex min-h-fit w-full items-center justify-between px-2.5 py-6 text-lg leading-tight sm:text-base",
                                            isSubActive &&
                                              "bg-gray-100 font-medium",
                                          )}
                                        >
                                          <span className="break-words">
                                            {subItem.title}
                                          </span>
                                          <ChevronDown
                                            className={cn(
                                              "h-4 w-4 transition-transform duration-200",
                                              isSubExpanded
                                                ? "rotate-0"
                                                : "-rotate-90",
                                            )}
                                            size={12}
                                          />
                                        </SidebarMenuButton>
                                      </CollapsibleTrigger>
                                      <CollapsibleContent>
                                        <SidebarMenuSub className="mt-1 px-1">
                                          {subItem.submenuItems?.map(
                                            (nestedItem) => (
                                              <SidebarMenuItem
                                                key={nestedItem.title}
                                                className={cn(
                                                  "p-2.5 text-lg leading-tight sm:text-base",
                                                  pathname === nestedItem.href
                                                    ? "rounded-md bg-[#161CCA] text-white"
                                                    : "rounded-md hover:bg-gray-100",
                                                )}
                                              >
                                                <Link
                                                  href={nestedItem.href}
                                                  className="flex w-full items-center"
                                                >
                                                  <span className="break-words">
                                                    {nestedItem.title}
                                                  </span>
                                                </Link>
                                              </SidebarMenuItem>
                                            ),
                                          )}
                                        </SidebarMenuSub>
                                      </CollapsibleContent>
                                    </SidebarMenuItem>
                                  </Collapsible>
                                ) : (
                                  <SidebarMenuItem
                                    className={cn(
                                      "p-2.5 text-lg leading-tight sm:text-base",
                                      pathname === subItem.href
                                        ? "rounded-md bg-[#161CCA] text-white"
                                        : "rounded-md hover:bg-gray-100",
                                    )}
                                  >
                                    <Link
                                      href={subItem.href}
                                      className="flex w-full items-center"
                                    >
                                      <span className="break-words">
                                        {subItem.title}
                                      </span>
                                    </Link>
                                  </SidebarMenuItem>
                                )}
                              </div>
                            );
                          })}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    )}
                  </SidebarMenuItem>
                </Collapsible>
              );
            })}
        </SidebarMenu>

        <div className="mt-auto px-6 py-5">
          <SidebarMenu>
            {filteredNavItems
              .filter((item) => ["Change Log", "About Us"].includes(item.title))
              .map((item) => (
                <SidebarMenuItem
                  key={item.title}
                  className={cn(
                    "p-2.5 text-lg leading-tight",
                    pathname === item.href
                      ? "rounded-md bg-[#161CCA] text-white"
                      : "rounded-md hover:bg-gray-100",
                  )}
                >
                  <Link
                    href={item.href}
                    className="flex items-center gap-3 text-lg leading-tight"
                  >
                    <item.icon
                      size={12}
                      className="h-4 w-4 flex-shrink-0 sm:h-5 sm:w-5"
                    />
                    <span className="break-words">{item.title}</span>
                  </Link>
                </SidebarMenuItem>
              ))}
          </SidebarMenu>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
