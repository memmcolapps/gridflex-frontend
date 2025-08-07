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
import { useState } from "react";

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

export function SidebarNav() {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  const isItemActive = (href: string, subItems?: SubMenuItemProps[]) => {
    if (pathname === href) return true;
    if (subItems) {
      return subItems.some(
        (subItem) => pathname === subItem.href ||
          subItem.submenuItems?.some(
            (nestedItem) => pathname === nestedItem.href
          )
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
            { title: "Meter Manufacturers", href: "/data-management/meter-management/meter-manufacturer" },
            { title: "Meter Inventory", href: "/data-management/meter-management/meter-inventory" },
            { title: "Meters", href: "/data-management/meter-management/meters" },
            { title: "Assigned Meter", href: "/data-management/meter-management/assign-meter" }
          ]
        },
        { title: "Customer Management", href: "/data-management/customer-management" },
        { title: "Tariff", href: "/data-management/tarrif" },
        { title: "Band Management", href: "/data-management/band-management" },
        {
          title: "Debt Management",
          href: "/data-management/debt-management",
          hasSubmenu: true,
          submenuItems: [
            { title: "Debt Setting", href: "/data-management/debt-management/debt-settings" },
            { title: "Debit Adjustment", href: "/data-management/debt-management/debit-adjustment" },
            { title: "Credit Adjustment", href: "/data-management/debt-management/credit-adjustment" }
          ]
        },
        { title: "Review & Approval", href: "/data-management/reviewandapproval" },
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
            { title: "Meter Reading Sheet", href: "/billing/md-prebilling/reading-sheet" },
            { title: "Meter Consumption", href: "/billing/md-prebilling/meter-consumption" },
            { title: "Energy-Import", href: "/billing/md-prebilling/energy-import" },
          ]
        },
        {
          title: "Non-MD Prebilling",
          href: "#",
          hasSubmenu: true,
          submenuItems: [
            { title: "Meter Reading Sheet", href: "/billing/non-md-prebilling/reading-sheet" },
            { title: "Meter Consumption", href: "/billing/non-md-prebilling/meter-consumption" },
            { title: "Energy-Import", href: "/billing/non-md-prebilling/energy-import" },
          ]
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
        { title: "Vending", href: "/vending/vending" }
      ],
    },
    {
      title: "HES",
      href: "/hes",
      icon: Building2,
      hasSubmenu: true,
      submenuItems: [],
    },
    {
      title: "User Management",
      href: "/user-management",
      icon: Users,
      hasSubmenu: true,
      submenuItems: [
        { title: "Users", href: "/user-management" },
        { title: "Group Permission", href: "/user-management/group-permission" }
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

  return (
    <Sidebar className="fixed left-0 top-0 h-screen z-40 border-r border-gray-200 w-fit hidden md:block overflow-y-auto">
      <SidebarHeader className="flex items-center justify-center py-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex items-center justify-center">
            <Image
              src="/images/logo2.svg"
              alt="GridFlex Logo"
              width={42}
              height={54}
              className="w-10 h-auto"
            />
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent className="flex flex-col h-full">
        <SidebarMenu className="px-6 py-5">
          {navItems
            .filter((item) => !["Change Log", "About Us"].includes(item.title)) // [!code highlight]
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
                      className="flex items-center gap-8 text-xl"
                    >
                      <item.icon size={12} className="h-4 w-4 sm:h-5 sm:w-5" />
                      <span>{item.title}</span>
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
                          "flex items-center justify-between py-6 w-full text-base sm:text-lg",
                          isActive && "bg-gray-100"
                        )}
                      >
                        <div className="flex items-center gap-8 text-xl">
                          <item.icon size={14} className="w-4 h-4 sm:w-5 sm:h-5" />
                          <span>{item.title}</span>
                        </div>
                        {item.hasSubmenu && (
                          <ChevronDown
                            className={cn(
                              "h-4 w-4 transition-transform duration-200",
                              isExpanded ? "rotate-0" : "-rotate-90"
                            )}
                            size={12}
                          />
                        )}
                      </SidebarMenuButton>
                    </CollapsibleTrigger>

                    {item.hasSubmenu && (
                      <CollapsibleContent>
                        <SidebarMenuSub className="mt-1 space-y-1 whitespace-nowrap">
                          {item.submenuItems?.map((subItem) => {
                            const isSubActive = isItemActive(subItem.href, subItem.submenuItems);
                            const isSubExpanded = expandedItems[subItem.title] ?? isSubActive;

                            return (
                              <div key={subItem.title} className="pl-4 sm:pl-6">
                                {subItem.hasSubmenu ? (
                                  <Collapsible
                                    open={isSubExpanded}
                                    onOpenChange={() => toggleExpanded(subItem.title)}
                                  >
                                    <SidebarMenuItem>
                                      <CollapsibleTrigger asChild>
                                        <SidebarMenuButton
                                          className={cn(
                                            "flex items-center justify-between w-full px-2.5 py-6 text-xl sm:text-lg",
                                            isSubActive && "bg-gray-100 font-medium"
                                          )}
                                        >
                                          <span>{subItem.title}</span>
                                          <ChevronDown
                                            className={cn(
                                              "h-4 w-4 transition-transform duration-200",
                                              isSubExpanded ? "rotate-0" : "-rotate-90"
                                            )}
                                            size={12}
                                          />
                                        </SidebarMenuButton>
                                      </CollapsibleTrigger>
                                      <CollapsibleContent>
                                        <SidebarMenuSub className="mt-1 px-1">
                                          {subItem.submenuItems?.map((nestedItem) => (
                                            <SidebarMenuItem
                                              key={nestedItem.title}
                                              className={cn(
                                                "p-2.5 text-xl sm:text-lg",
                                                pathname === nestedItem.href
                                                  ? "rounded-md bg-[#161CCA] text-white"
                                                  : "hover:bg-gray-100 rounded-md"
                                              )}
                                            >
                                              <Link
                                                href={nestedItem.href}
                                                className="flex w-full items-center"
                                              >
                                                <span>{nestedItem.title}</span>
                                              </Link>
                                            </SidebarMenuItem>
                                          ))}
                                        </SidebarMenuSub>
                                      </CollapsibleContent>
                                    </SidebarMenuItem>
                                  </Collapsible>
                                ) : (
                                  <SidebarMenuItem
                                    className={cn(
                                      "p-2.5 text-xl sm:text-lg",
                                      pathname === subItem.href
                                        ? "rounded-md bg-[#161CCA] text-white"
                                        : "hover:bg-gray-100 rounded-md"
                                    )}
                                  >
                                    <Link
                                      href={subItem.href}
                                      className="flex w-full items-center"
                                    >
                                      <span>{subItem.title}</span>
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
            {navItems
              .filter((item) => ["Change Log", "About Us"].includes(item.title))
              .map((item) => (
                <SidebarMenuItem
                  key={item.title}
                  className={cn(
                    "p-2.5 text-xl",
                    pathname === item.href
                      ? "rounded-md bg-[#161CCA] text-white"
                      : "rounded-md hover:bg-gray-100"
                  )}
                >
                  <Link href={item.href} className="flex items-center gap-8 text-xl">
                    <item.icon size={12} className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuItem>
              ))}
          </SidebarMenu>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}