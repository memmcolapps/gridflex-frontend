"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import {
  Building2,
  ChevronDown,
  ClipboardList,
  Cylinder,
  type LucideIcon,
  CreditCard,
  Plug,
  Users,
  Zap,
  Activity,
} from "lucide-react";
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
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

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

  // Automatically expand parent items when child is active
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
        { title: "Organization", href: "/organization" },
        {
          title: "Meter Management",
          href: "/data-management/meter-management",
          hasSubmenu: true,
          submenuItems: [
            { title: "Meters", href: "/data-management/meter-management" },
            { title: "Meter Manufacturers", href: "/data-management/meter-management/meter-manufacturer" },
            { title: "Allocate Meters", href: "/data-management/meter-management/allocate-meter" }
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
            { title: "Debt Setting", href: "/data-management/debt-management/debt-setting" },
            { title: "Mode of Payment", href: "/data-management/debt-management/mode-of-payment" },
            { title: "Debit Adjustment", href: "/data-management/debt-management/debit-adjustments"},
            { title: "Credit Adjustment", href: "/data-management/debt-management/credit-adjustments"}
          ]
        },
      ],
    },
    {
      title: "Feeder Management",
      href: "/feeder-management",
      icon: Plug,
      hasSubmenu: true,
      submenuItems: [],
    },
    {
      title: "Billing",
      href: "/billing",
      icon: CreditCard,
      hasSubmenu: true,
      submenuItems: [],
    },
    {
      title: "Vending",
      href: "/vending",
      icon: Zap,
      hasSubmenu: true,
      submenuItems: [],
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
  ];

  return (
    <Sidebar className="border-r border-gray-200 w-[264px]">
      <SidebarHeader className="flex items-center justify-center py-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex items-center justify-center">
            <Image
              src="/images/logo2.svg"
              alt="GridFlex Logo"
              width={42}
              height={54}
            />
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu className="px-6 py-5">
          {navItems.map((item) => {
            const isActive = isItemActive(item.href, item.submenuItems);
            const isExpanded = expandedItems[item.title] ?? isActive;

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
                        "flex items-center justify-between py-6 w-full",
                        isActive && "bg-gray-100"
                      )}
                    >
                      <div className="flex items-center gap-8 text-xl">
                        <item.icon size={12} />
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
                            <div key={subItem.title} className="pl-6">
                              {subItem.hasSubmenu ? (
                                <Collapsible
                                  open={isSubExpanded}
                                  onOpenChange={() => toggleExpanded(subItem.title)}
                                >
                                  <SidebarMenuItem>
                                    <CollapsibleTrigger asChild>
                                      <SidebarMenuButton
                                        className={cn(
                                          "flex items-center justify-between w-full p-2.5 text-xl",
                                          isSubActive && "text-[#161CCA] font-medium"
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
                                      <SidebarMenuSub className="mt-1 pl-4 space-y-1">
                                        {subItem.submenuItems?.map((nestedItem) => (
                                          <SidebarMenuItem
                                            key={nestedItem.title}
                                            className={cn(
                                              "p-2.5 text-xl",
                                              pathname === nestedItem.href &&
                                              "rounded-md bg-[#161CCA] text-white"
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
                                    "p-2.5 text-xl",
                                    pathname === subItem.href &&
                                    "rounded-md bg-[#161CCA] text-white"
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
      </SidebarContent>
    </Sidebar>
  );
}
