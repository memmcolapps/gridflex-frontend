"use client";

import { Bell, ChevronDown, LogOut, User } from "lucide-react";
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

export function Navbar() {
  const { logout, isLoading } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  const closeDropdown = () => setIsProfileOpen(false);

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-gray-200 md:-ml-8 bg-white ">
      <div className="flex h-full w-full items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left side - empty for now but can be used for breadcrumbs or other elements */}
        <div className="flex flex-col items-start md:flex-none p-14"> {/* Changed flex to flex-col */}
         <span className="text-2xl font-bold">IBEDC</span> 
          <div className="relative flex-1 md:w-80 md:flex-none">Hello Margaret</div>
        </div>

        {/* Right side with user controls */}
        <div className="flex items-center gap-2 sm:gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="relative rounded-full hover:bg-gray-100"
          >
            <Bell className="text-gray-600" size={18} />
            <span className="absolute top-1.5 right-1.5 flex h-2 w-2 rounded-full bg-red-500" />
            <span className="sr-only">Notifications</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-2 rounded-full hover:bg-gray-100 p-6 cursor-pointer"
                disabled={isProfileOpen}
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src="" alt="User" />
                  <AvatarFallback className="rounded-full bg-blue-600 text-white">
                    MA
                  </AvatarFallback>
                </Avatar>
                <ChevronDown className="text-gray-500" size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-fit bg-white text-gray-700"
            >
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer hover:bg-gray-100"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
              >
                <User size={12} />
                Profile
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer hover:bg-gray-100 text-red-600 w-fit"
                onClick={logout}
                disabled={isLoading}
              >
                <LogOut size={12} className="text-red-600" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Profile dropdown */}
      {isProfileOpen && (
        <div className="absolute right-4 top-16 z-40 w-140 rounded-lg border border-gray-200 bg-white shadow-lg sm:right-6">
          <ProfileDropdown
            closeDropdown={closeDropdown}
            openEditProfileModal={() => setIsEditProfileOpen(true)}
          />
        </div>
      )}

      {/* Edit profile modal */}
      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
      />
    </header>
  );
}