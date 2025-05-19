"use client";

import type React from "react";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { SidebarNav } from "@/components/sidebar-nav";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Navbar } from "@/components/navbar";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log("User:", user);
    console.log("Is Loading:", isLoading);

    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <SidebarProvider>
      <div className="flex w-full overflow-hidden">
        <SidebarNav />
        <div className="flex flex-1 flex-col">
          <Navbar />
          <main className="flex-1 overflow-auto p-8">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
