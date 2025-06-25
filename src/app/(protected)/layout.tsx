"use client";

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
      <div className="flex w-full min-h-screen">
        {/* Mobile message - only shows on small screens */}
        <div className="md:hidden fixed inset-0 bg-background z-50 flex items-center justify-center p-4">
          <div className="text-center max-w-md">
            <h2 className="text-3xl font-black mb-4">Screen Too Small</h2>
            <p className="mb-4 text-2xl font-semibold">
              This application is designed for larger screens. Please use a tablet or desktop computer for the best experience.
            </p>
            <p>Current screen size: {typeof window !== 'undefined' && `${window.innerWidth}px`}</p>
          </div>
        </div>

        {/* Desktop layout */}
        <div className="hidden md:flex w-full">
          {/* Sidebar with fixed width */}
          <div className="w-[21rem] flex-shrink-0">
            <SidebarNav />
          </div>
          {/* Main content area */}
          <div className="flex-1 flex flex-col">
            <Navbar />
            <main className="flex-1 py-4 px-8">
              {children}
            </main>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}