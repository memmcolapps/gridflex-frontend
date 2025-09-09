"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";

export default function HomePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [isTimeout, setIsTimeout] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsTimeout(true);
      router.push("/login");
    }, 5000);

    if (!isLoading) {
      if (user) {
        router.push("/data-management/dashboard");
      } else {
        router.push("/login");
      }
    }

    return () => clearTimeout(timeoutId);
  }, [isLoading, router, user]);

  if (isTimeout) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <p className="text-red-500">Loading timeout. Redirecting to login...</p>
        <button
          onClick={() => router.push("/login")}
          className="rounded bg-purple-500 px-4 py-2 text-white hover:bg-purple-600"
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="h-12 w-12 animate-spin rounded-full border-t-2 border-b-2 border-purple-500"></div>
    </div>
  );
}
