"use client";

import { useState } from "react";
import { useAuth } from "@/context/auth-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, ChevronDown, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ProfileDropdown from "./profile/profiledropdown";
import EditProfileModal from "./profile/editprofilemodal";
import ChangePasswordModal from "./profile/changepasswordmodal";

export function Navbar() {
  const { isLoading } = useAuth();
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);

  const handleOpenEditProfileModal = () => {
    setIsEditProfileModalOpen(true);
  };
  
  const handleOpenChangePasswordModal = () => {
    setIsEditProfileModalOpen(false);
    setIsChangePasswordModalOpen(true);
  };

  return (
    <header className="sticky top-0 z-30 border-b border-gray-200 py-6 h-18 bg-white">
      <div className="flex h-full w-full items-center justify-between px-4 sm:px-6 lg:px-8">
        <UserInfo />
        <div className="flex items-center gap-2 sm:gap-4">
          <NotificationButton />
          <UserDropdown
            isLoading={isLoading}
            openEditProfileModal={handleOpenEditProfileModal}
            openChangePasswordModal={handleOpenChangePasswordModal}
          />
        </div>
      </div>
      {isEditProfileModalOpen && (
        <EditProfileModal
          isOpen={isEditProfileModalOpen}
          onClose={() => setIsEditProfileModalOpen(false)}
          onOpenChangePassword={handleOpenChangePasswordModal}
        />
      )}
      {isChangePasswordModalOpen && (
        <ChangePasswordModal
          isOpen={isChangePasswordModalOpen}
          onClose={() => setIsChangePasswordModalOpen(false)}
        />
      )}
    </header>
  );
}

export const UserAvatar = () => {
  const { user } = useAuth();
  const initials = `${user?.firstname?.charAt(0) ?? ""}${user?.lastname?.charAt(0) ?? ""}`.toUpperCase();
  return (
    <Avatar className="h-7 w-7 sm:h-8 sm:w-8">
      <AvatarImage src="" alt="User" />
      <AvatarFallback className="rounded-full bg-blue-600 text-xs text-white sm:text-sm">
        {initials}
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
    <div className="flex flex-col items-start justify-center px-1 py-3 sm:py-4 md:flex-none lg:py-5">
      <span className="text-lg leading-tight font-bold sm:text-xl lg:text-2xl">
        {user?.business?.businessName?.toUpperCase() ?? "BUSINESS NAME"}
      </span>
      <div className="relative flex-1 md:w-80 md:flex-none">
        <span className="text-sm text-gray-600 sm:text-base">
          Hello {user?.firstname?.toUpperCase() ?? "USER"}
        </span>
      </div>
    </div>
  );
};

interface UserDropdownProps {
  isLoading: boolean;
  openEditProfileModal: () => void;
  openChangePasswordModal: () => void;
}

export const UserDropdown = ({ isLoading, openEditProfileModal, openChangePasswordModal }: UserDropdownProps) => {
  const { logout } = useAuth();
  const [isProfileViewActive, setIsProfileViewActive] = useState(false);

  return (
    <DropdownMenu onOpenChange={(open) => {
      if (!open) {
        setIsProfileViewActive(false);
      }
    }}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex cursor-pointer items-center gap-2 rounded-full px-4 py-5 hover:bg-gray-100 focus:outline-none focus:ring-gray-100/10"
        >
          <UserAvatar />
          <ChevronDown className="text-gray-500" size={16} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        side="bottom"
        className="w-fit bg-white mt-4 text-gray-700 p-0"
        collisionPadding={10}
        avoidCollisions
      >
        {isProfileViewActive ? (
          <ProfileDropdown
            closeDropdown={() => setIsProfileViewActive(false)}
            openEditProfileModal={() => {
              setIsProfileViewActive(false);
              openEditProfileModal();
            }}
            openChangePasswordModal={() => {
              setIsProfileViewActive(false);
              openChangePasswordModal();
            }}
          />
        ) : (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer hover:bg-gray-100"
              onSelect={(e) => {
                e.preventDefault();
                setIsProfileViewActive(true);
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
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};