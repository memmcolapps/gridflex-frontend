"use client";

import { useState } from "react";
import { useAuth } from "@/context/auth-context";
import ProfileDropdown from "./profile/profiledropdown";
import EditProfileModal from "./profile/editprofilemodal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChevronDown, LogOut, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
  const { isLoading } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  const closeDropdown = () => setIsProfileOpen(false);

  return (
    <header className="sticky top-0 z-30 border-b border-gray-200 bg-white ">
      <div className="flex h-full w-full items-center justify-between px-4 sm:px-6 lg:px-8">
        <UserInfo />

        <div className="flex items-center gap-2 sm:gap-4">
          <NotificationButton />

          <UserDropdown
            onProfileClick={() => setIsProfileOpen(!isProfileOpen)}
            isLoading={isLoading}
          />
        </div>
      </div>

      {/* Profile dropdown */}
      {isProfileOpen && (
        <div className="absolute top-16 right-4 z-40 w-140 rounded-lg border border-gray-200 bg-white shadow-lg sm:right-6">
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

export const UserAvatar = () => {
  const { user } = useAuth();

  return (
    <Avatar className="h-8 w-8">
      <AvatarImage src="" alt="User" />
      <AvatarFallback className="rounded-full bg-blue-600 text-white">
        {`${user?.firstname?.charAt(0) ?? ""}${user?.lastname?.charAt(0) ?? ""}`}
      </AvatarFallback>
    </Avatar>
  );
};

export const NotificationButton = () => (
  <Button
    variant="ghost"
    size="icon"
    className="relative rounded-full hover:bg-gray-100"
    aria-label="Notifications"
  >
    <Bell className="text-gray-600" size={18} />
    <span className="absolute top-1.5 right-1.5 flex h-2 w-2 rounded-full bg-red-500" />
  </Button>
);

export const UserInfo = () => {
  const { user } = useAuth();

  return (
    <div className="flex flex-col items-start p-14 md:flex-none">
      <span className="text-2xl font-bold">
        {user?.business?.businessName?.toUpperCase() ?? "BUSINESS NAME"}
      </span>
      <div className="relative flex-1 md:w-80 md:flex-none">
        Hello {user?.firstname?.toUpperCase() ?? "USER"}
      </div>
    </div>
  );
};

export const UserDropdown = ({
  onProfileClick,
  isLoading,
}: {
  onProfileClick: () => void;
  isLoading: boolean;
}) => {
  const { logout } = useAuth();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex cursor-pointer items-center gap-2 rounded-full p-6 hover:bg-gray-100"
        >
          <UserAvatar />
          <ChevronDown className="text-gray-500" size={16} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-fit bg-white text-gray-700"
        collisionPadding={10}
        avoidCollisions
      >
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer hover:bg-gray-100"
          onSelect={(e) => {
            e.preventDefault();
            onProfileClick();
          }}
        >
          <User size={12} className="mr-2" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="w-fit cursor-pointer text-red-600 hover:bg-gray-100"
          onSelect={(e) => {
            e.preventDefault();
            logout();
          }}
          disabled={isLoading}
        >
          <LogOut size={12} className="mr-2 text-red-600" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
