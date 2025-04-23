"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
// import { useAuth } from "@/context/auth-context";

export default function HomePage() {
  // const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // if (!isLoading) {
    //   if (user) {
    //     router.push("/dashboard");
    //   } else {
    //     router.push("/login");
    //   }
    // }
    router.push("/login");
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="h-12 w-12 animate-spin rounded-full border-t-2 border-b-2 border-purple-500"></div>
    </div>
  );
}
