"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
// import { useAuth } from "@/context/auth-context";

export default function HomePage() {
  // const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="">
        <h1 className="text-2xl font-bold">Welcome to Gridflex</h1>
        <p className="mt-4 text-gray-600">
          This is a placeholder for the dashboard page.
        </p>
        <p className="mt-4 text-gray-600">
          You can add your dashboard content here. editted by musa..
        </p>
      </div>
    </div>
  );
}
