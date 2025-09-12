"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";
import { type Module } from "@/types/user-info"; 
import { useQuery } from "@tanstack/react-query";
import { fetchUser } from "@/service/profile-service";
import { useEffect } from "react";
import { useUser } from "@/hooks/use-user";

interface ProfileDropdownProps {
  closeDropdown: () => void;
  openEditProfileModal: () => void;
  openChangePasswordModal: () => void;
}

export default function ProfileDropdown({
  closeDropdown,
  openEditProfileModal,
  openChangePasswordModal,
}: ProfileDropdownProps) {
  const { user: authUser } = useAuth();
  const {
    data: user,
    isLoading,
    isError,
    error,
  } = useUser(authUser?.id);

  if (isLoading) {
    return (
      <div className="min-w-[400px] p-6 bg-white rounded-lg shadow-lg">
        <p>Loading profile details...</p>
      </div>
    );
  }

  if (isError) {
    console.error("Failed to fetch user profile:", error);
    return (
      <div className="min-w-[400px] p-6 bg-white rounded-lg shadow-lg">
        <p>Error: Failed to load profile. Please try again.</p>
      </div>
    );
  }

  // Fallback if no user data is available after loading
  if (!user) {
    return (
      <div className="min-w-[400px] p-6 bg-white rounded-lg shadow-lg">
        <p>No user data available.</p>
      </div>
    );
  }

  const fullName = `${user.firstname ?? ""} ${user.lastname ?? ""}`.trim() || "User Name";
  const userEmail = user.email ?? "user@example.com";
  const userRoles = authUser?.groups?.modules?.map((module: Module) => module.name).join(", ") ?? "User";
  const avatarInitials = (user.firstname?.charAt(0) ?? "") + (user.lastname?.charAt(0) ?? "");
  const phoneNumber = user.phoneNumber ?? "N/A";

  return (
    <div className="min-w-[400px] p-6 bg-white rounded-lg shadow-lg">
      <div className="flex items-center gap-4 w-full">
        <div className="h-12 w-12 rounded-full bg-[#225BFF] flex items-center justify-center text-white">
          {avatarInitials.toUpperCase() ?? "UN"}
        </div>
        <div>
          <p className="font-semibold">{fullName}</p>
          <p className="text-sm text-gray-500">{userEmail}</p>
          <p className="text-sm text-black">{userRoles}</p>
        </div>
      </div>
      <hr className="text-gray-200 mt-6" />
      <div className="flex justify-between w-full p-4">
        <div className="font-semibold">Name</div>
        <p>{fullName}</p>
      </div>
      <div className="flex justify-between w-full p-4">
        <div className="font-semibold">Email</div>
        <p>{userEmail}</p>
      </div>
      <div className="flex justify-between w-full p-4">
        <div className="font-semibold">Phone Number</div>
        <p>{phoneNumber}</p>
      </div>
      <div className="flex justify-between w-full p-4">
        <div className="font-semibold">Password</div>
        <p>•••••••••</p>
      </div>
      <hr className="text-gray-200 mt-6" />
      <div className="mt-4 flex gap-2 justify-between">
        <Button
          variant="outline"
          onClick={closeDropdown}
          className="cursor-pointer text-[#161CCA]"
        >
          Cancel
        </Button>
        <Button
          onClick={openEditProfileModal}
          className="cursor-pointer bg-[#161CCA] text-white"
        >
          Edit Profile
        </Button>
      </div>
    </div>
  );
}