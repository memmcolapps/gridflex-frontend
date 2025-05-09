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
  submenuItems?: { title: string; href: string }[];
}

export function SidebarNav() {
  const pathname = usePathname();

  // Track expanded state of each menu item
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>(
    () => {
      // Initialize with Data Management expanded if Band Management is active
      const initialState: Record<string, boolean> = {};
      if (pathname === "/dashboard") {
        initialState["Data Management"] = true;
      }
      return initialState;
    },
  );

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
        { title: "Meter Management", href: "/meter-management" },
        { title: "Customer Management", href: "/data-management/customer-management" },
        { title: "Tariff", href: "/data-management/tarrif" },
        { title: "Band Management", href: "/data-management/band-management" },
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
        { title: "Users", href: "/user-management"},
        { title: "Group Permission", href: "/user-management/group-permission"}
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
    <Sidebar className="border-r border-gray-200 w-[264px] ">
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
        <SidebarMenu className="px-6 py-5 ">
          {navItems.map((item) => {
            return (
              <Collapsible
              // defaultOpen
                className="group/collapsible"
                key={item.title}
              >
                <SidebarMenuItem className="">
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      className={cn(
                        "flex items-center justify-between py-6",
                        expandedItems[item.title] && "bg-gray-100",
                      )}
                      onClick={() => toggleExpanded(item.title)}
                    >
                      <div className="flex items-center gap-8 text-xl">
                        <item.icon size={12} />
                        <span>{item.title}</span>
                      </div>
                      {item.hasSubmenu && (
                        <ChevronDown
                          className={cn(
                            "h-4 w-4 transition-transform duration-200",
                            expandedItems[item.title] ? "rotate-0" : "-rotate-90",
                          )}
                          size={12}
                        />
                      )}
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    {item.hasSubmenu && (
                      <SidebarMenuSub className="mt-1">
                        {item.submenuItems?.map((subItem) => (
                          <SidebarMenuItem
                            className={cn(
                              "flex items-center p-2.5 text-xl",
                              pathname === subItem.href &&
                                "rounded-md bg-[#161CCA] text-white",
                            )}
                            key={subItem.title}
                          >
                            <Link
                              href={subItem.href}
                              className="flex w-full items-center gap-10"
                            >
                              <span>{subItem.title}</span>
                            </Link>
                          </SidebarMenuItem>
                        ))}
                      </SidebarMenuSub>
                    )}
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
