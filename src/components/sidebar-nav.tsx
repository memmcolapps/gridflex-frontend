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
  CreditCard,
  Cylinder,
  Users,
  Zap,
  Info,
  MessageSquareMore,
  type LucideIcon,
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
  isActive?: boolean;
  hasSubmenu?: boolean;
  submenuItems?: SubMenuItemProps[];
}

interface SubMenuItemProps {
  title: string;
  href: string;
  hasSubmenu?: boolean;
  submenuItems?: { title: string; href: string }[];
}

const navItems: NavItemProps[] = [
  {
    title: "Data Management",
    href: "/data-management",
    icon: Cylinder,
    hasSubmenu: true,
    submenuItems: [
      { title: "Dashboard", href: "/data-management/dashboard" },
      { title: "Organization", href: "/data-management/organization" },
      {
        title: "Meter Management",
        href: "/data-management/meter-management",
        hasSubmenu: true,
        submenuItems: [
          {
            title: "Meter Manufacturers",
            href: "/data-management/meter-management/meter-manufacturer",
          },
          {
            title: "Meter Inventory",
            href: "/data-management/meter-management/meter-inventory",
          },
          {
            title: "Meters",
            href: "/data-management/meter-management/meters",
          },
          {
            title: "Assigned Meter",
            href: "/data-management/meter-management/assign-meter",
          },
        ],
      },
      {
        title: "Customer Management",
        href: "/data-management/customer-management",
      },
      { title: "Band Management", href: "/data-management/band-management" },
      { title: "Tariff Rate", href: "/data-management/tarrif-rate" },
      {
        title: "Debt Management",
        href: "/data-management/debt-management",
        hasSubmenu: true,
        submenuItems: [
          {
            title: "Debt Setting",
            href: "/data-management/debt-management/debt-settings",
          },
          {
            title: "Debit Adjustment",
            href: "/data-management/debt-management/debit-adjustment",
          },
          {
            title: "Credit Adjustment",
            href: "/data-management/debt-management/credit-adjustment",
          },
        ],
      },
      {
        title: "Review & Approval",
        href: "/data-management/reviewandapproval",
      },
    ],
  },
  {
    title: "Billing",
    href: "/billing",
    icon: CreditCard,
    hasSubmenu: true,
    submenuItems: [
      { title: "Dashboard", href: "/billing/dashboard" },
      {
        title: "MD Prebilling",
        href: "#",
        hasSubmenu: true,
        submenuItems: [
          {
            title: "Meter Reading Sheet",
            href: "/billing/md-prebilling/reading-sheet",
          },
          {
            title: "Meter Consumption",
            href: "/billing/md-prebilling/meter-consumption",
          },
          {
            title: "Energy-Import",
            href: "/billing/md-prebilling/energy-import",
          },
        ],
      },
      {
        title: "Non-MD Prebilling",
        href: "#",
        hasSubmenu: true,
        submenuItems: [
          {
            title: "Meter Reading Sheet",
            href: "/billing/non-md-prebilling/reading-sheet",
          },
          {
            title: "Meter Consumption",
            href: "/billing/non-md-prebilling/meter-consumption",
          },
          {
            title: "Energy-Import",
            href: "/billing/non-md-prebilling/energy-import",
          },
        ],
      },
      { title: "Billing", href: "/billing/billing" },
      { title: "Payments", href: "/billing/payments" },
    ],
  },
  {
    title: "Vending",
    href: "/vending",
    icon: Zap,
    hasSubmenu: true,
    submenuItems: [
      { title: "Dashboard", href: "/vending/vending-dashboard" },
      { title: "Vending", href: "/vending/vending" },
    ],
  },
  {
    title: "HES",
    href: "/hes",
    icon: Building2,
    hasSubmenu: true,
    submenuItems: [
      { title: "Dashboard", href: "/hes/dashboard" },
      {
        title: "Communication Report",
        href: "/hes/hes-communication-report",
      },
      { title: "Realtime Data", href: "/hes/hes-realtime-data" },
      { title: "Profile and Events", href: "/hes/profile-and-events" },

      {
        title: "Controls and Confirguration",
        href: "/hes/controlsandconfigs",
        hasSubmenu: true,
        submenuItems: [
          {
            title: "Data Collection Scheduler",
            href: "/hes/controlsandconfigs/data-collection-scheduler",
          },
          {
            title: "Meter Remote Configuration",
            href: "/hes/controlsandconfigs/meter-remote-config",
          },
        ],
      },
    ],
  },
  {
    title: "User Management",
    href: "/user-management",
    icon: Users,
    hasSubmenu: true,
    submenuItems: [
      { title: "Users", href: "/user-management" },
      {
        title: "Group Permission",
        href: "/user-management/group-permission",
      },
    ],
  },
  {
    title: "Audit Log",
    href: "/audit-log",
    icon: Activity,
    hasSubmenu: false,
  },
  {
    title: "Customized Report",
    href: "/customized-report",
    icon: ClipboardList,
    hasSubmenu: false,
  },

  {
    title: "Change Log",
    href: "/change-log",
    icon: MessageSquareMore,
    hasSubmenu: false,
  },
  {
    title: "About Us",
    href: "/about-us",
    icon: Info,
    hasSubmenu: false,
  },
];

export function SidebarNav() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>(
    {},
  );

  const normalizeModuleName = (name: string): string => {
    return name.toLowerCase().replace(/\s+/g, "");
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

    // SuperAdmin can see everything
    if (user.groups?.groupTitle?.toLowerCase() === "super admin") {
      return navItems;
    }
    const hasModuleAccess = (moduleName: string): boolean => {
      if (!user?.groups?.modules) return false;

      const normalizedModuleName = normalizeModuleName(moduleName);

      if (normalizedModuleName === "auditlog") return true;

      return user.groups.modules.some((module) => {
        const normalizedApiModuleName = normalizeModuleName(module.name);
        return (
          normalizedApiModuleName === normalizedModuleName && module.access
        );
      });
    };

    return navItems.filter((item) => {
      if (item.title === "Audit Log") return true;

      return hasModuleAccess(item.title);
    });
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
                      "p-2.5 text-xl",
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
