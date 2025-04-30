"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import {
  ActivitySquare,
  Building2,
  ChevronDown,
  ClipboardList,
  FileText,
  LayoutGrid,
  type LucideIcon,
  Plug,
  Settings,
  Users,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
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
      icon: LayoutGrid,
      hasSubmenu: true,
      submenuItems: [
        { title: "Dashboard", href: "/data-management/dashboard" },
        { title: "Organization", href: "/organization" },
        { title: "Meter Management", href: "/meter-management" },
        { title: "Customer Management", href: "/customer-management" },
        { title: "Tariff", href: "/tariff" },
        { title: "Band Management", href: "/band-management" },
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
      icon: FileText,
      hasSubmenu: true,
      submenuItems: [],
    },
    {
      title: "Vending",
      href: "/vending",
      icon: Settings,
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
      submenuItems: [],
    },
    {
      title: "Audit Log",
      href: "/audit-log",
      icon: ActivitySquare,
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
    <Sidebar className="border-none">
      <SidebarHeader className="flex items-center justify-center py-10">
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
        <SidebarMenu>
          {navItems.map((item) => {
            return (
              <Collapsible
                defaultOpen
                className="group/collapsible"
                key={item.title}
              >
                <SidebarMenuItem className="my-2 px-1.5">
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      className={cn(
                        "flex items-center justify-between",
                        expandedItems[item.title] && "bg-gray-100",
                      )}
                      onClick={() => toggleExpanded(item.title)}
                    >
                      <div className="flex items-center gap-8 text-xl">
                        <item.icon className="h-5 w-5" />
                        <span>{item.title}</span>
                      </div>
                      {item.hasSubmenu && (
                        <ChevronDown
                          className={cn(
                            "h-4 w-4 transition-transform duration-200",
                            expandedItems[item.title] && "rotate-180",
                          )}
                        />
                      )}
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    {item.hasSubmenu && (
                      <SidebarMenuSub>
                        {item.submenuItems?.map((subItem) => (
                          <SidebarMenuItem
                            className="my-2 flex items-center px-1.5 text-xl"
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
