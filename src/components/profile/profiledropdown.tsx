// src/components/tariff/profile-dropdown.tsx
"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";
// Fix: Import the Module type from the centralized types file.
import { type Module } from "@/types/user-info";

interface ProfileDropdownProps {
  closeDropdown: () => void;
  openEditProfileModal: () => void;
}

export default function ProfileDropdown({ closeDropdown, openEditProfileModal }: ProfileDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        closeDropdown();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [closeDropdown]);

  // Safely get user data with fallbacks
  const fullName = `${user?.firstname ?? ""} ${user?.lastname ?? ""}`.trim() || "User Name";
  const userEmail = user?.email ?? "user@example.com";
  
  // Access the modules array from the single groups object
  const userRoles = user?.groups?.modules?.map((module: Module) => module.name).join(", ") ?? "User";

  // Use the first letter of the first and last name for the avatar
  const avatarInitials = (user?.firstname?.charAt(0) ?? "") + (user?.lastname?.charAt(0) ?? "");
  
  // Use the businessContact from the user's business object
  const phoneNumber = user?.phoneNumber ?? "N/A";

  return (
    <div ref={dropdownRef} className="w-full p-6 bg-white rounded-lg shadow-lg">
      <div className="flex items-center gap-4 w-full">
        <div className="h-12 w-12 rounded-full bg-[#225BFF] flex items-center justify-center text-white">
          {avatarInitials.toUpperCase() || "UN"}
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
          onClick={() => {
            openEditProfileModal();
            closeDropdown();
          }}
          className="cursor-pointer bg-[#161CCA] text-white"
        >
          Edit Profile
        </Button>
      </div>
    </div>
  );
}