import { useState } from "react";
import { useAuth } from "@/context/auth-context";
import ProfileDropdown from "./profile/profiledropdown";
import EditProfileModal from "./profile/editprofilemodal";
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

export function Navbar() {
  const { isLoading } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Add state for DropdownMenu

  const closeDropdown = () => setIsProfileOpen(false);

  return (
    <header className="sticky top-0 z-30 border-b border-gray-200 py-6 h-18 bg-white">
      <div className="flex h-full w-full items-center justify-between px-4 sm:px-6 lg:px-8">
        <UserInfo />

        <div className="flex items-center gap-2 sm:gap-4">
          <NotificationButton />
          <UserDropdown
            onProfileClick={() => {
              setIsProfileOpen(!isProfileOpen);
              setIsDropdownOpen(false); // Close the dropdown when profile is clicked
            }}
            isLoading={isLoading}
            isOpen={isDropdownOpen}
            setIsOpen={setIsDropdownOpen}
          />
        </div>
      </div>

      {isProfileOpen && (
        <div className="absolute top-16 right-4 z-40 w-140 rounded-lg border border-gray-200 bg-white shadow-lg sm:top-18 sm:right-6 lg:top-20">
          <ProfileDropdown
            closeDropdown={closeDropdown}
            openEditProfileModal={() => setIsEditProfileOpen(true)}
          />
        </div>
      )}

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
    <Avatar className="h-7 w-7 sm:h-8 sm:w-8">
      <AvatarImage src="" alt="User" />
      <AvatarFallback className="rounded-full bg-blue-600 text-xs text-white sm:text-sm">
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

export const UserDropdown = ({
  onProfileClick,
  isLoading,
  isOpen,
  setIsOpen,
}: {
  onProfileClick: () => void;
  isLoading: boolean;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}) => {
  const { logout } = useAuth();

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex cursor-pointer items-center gap-2 rounded-full p-2 hover:bg-gray-100 sm:p-3 lg:p-4"
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