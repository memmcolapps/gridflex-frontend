"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";

interface ProfileDropdownProps {
  closeDropdown: () => void;
  openEditProfileModal: () => void;
}

export default function ProfileDropdown({ closeDropdown, openEditProfileModal }: ProfileDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        closeDropdown();
      }
    };

    // Add event listener for clicks
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup event listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [closeDropdown]);

  return (
    <div ref={dropdownRef} className="w-full p-6 bg-white rounded-lg shadow-lg">
      <div className="flex items-center gap-4 w-full">
        <div className="h-12 w-12 rounded-full bg-[#225BFF] flex items-center justify-center text-white">
          AO
        </div>
        <div>
          <p className="font-semibold">Abdulmjib Oyewo</p>
          <p className="text-sm text-gray-500">oyewoabdulmjib2@gmail.com</p>
          <p className="text-sm text-black">Admin</p>
        </div>
      </div>
      <hr className="text-gray-200 mt-6" />
      <div className="flex justify-between w-full p-4">
        <div className="font-semibold">Name</div>
        <p>Abdulmjib Oyewo</p>
      </div>
      <div className="flex justify-between w-full p-4">
        <div className="font-semibold">Email</div>
        <p>oyewoabdulmjib2@gmail.com</p>
      </div>
      <div className="flex justify-between w-full p-4">
        <div className="font-semibold">Phone Number</div>
        <p>08109877266</p>
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