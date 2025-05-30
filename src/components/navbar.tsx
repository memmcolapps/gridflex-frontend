"use client";

import { Bell, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/context/auth-context";
import { useState } from "react";
import ProfileDropdown from "./profile/profiledropdown";
import EditProfileModal from "./profile/editprofilemodal";
// Import EditProfileModal

export function Navbar() {
  const { logout, isLoading } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false); // Add state for EditProfileModal

  // Function to close the dropdown
  const closeDropdown = () => setIsProfileOpen(false);

  return (
    <header className="sticky top-0 z-30 h-18 border-b border-gray-200 text-black">
      <div className="mx-auto flex items-center h-full w-full justify-between px-8 pl-[280px]">
        <div className="flex items-center gap-2 md:gap-4">
          <div className="relative flex-1 md:w-80 md:flex-none"></div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="relative rounded-full bg-[#F6F6F6]">
            <Bell className="text-[#5D5D5D]" size={15} />
            <span className="absolute top-1.5 right-1.5 flex h-2 w-2 rounded-full" />
            <span className="sr-only">Notifications</span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-2 rounded-full"
              >
                <Avatar className="">
                  <AvatarImage
                    src="/placeholder.svg?height=32&width=32"
                    alt="User"
                  />
                  <AvatarFallback className="rounded-full bg-[#225BFF] text-white">MA</AvatarFallback>
                </Avatar>
                <ChevronDown className="text-muted-foreground" size={15} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="text-[#333333] bg-white p-4">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer hover:bg-gray-100 focus:bg-gray-100"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
              >
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer hover:bg-gray-100 focus:bg-gray-100">
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer hover:bg-gray-100 focus:bg-gray-100"
                onClick={logout}
                disabled={isLoading}
              >
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {/* Render ProfileDropdown below the navbar */}
      {isProfileOpen && (
        <div className="absolute top-18 right-8 w-150 bg-white shadow-lg rounded-lg p-4 z-20">
          <ProfileDropdown
            closeDropdown={closeDropdown}
            openEditProfileModal={() => setIsEditProfileOpen(true)} // Pass the function to open the modal
          />
        </div>
      )}
      {/* Render EditProfileModal */}
      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
      />
    </header>
  );
}