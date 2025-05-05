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

export function Navbar() {
  return (
    <header className="sticky top-0 z-30 flex h-28 w-full items-center justify-between border-b px-20 text-black">
      <div className="flex items-center gap-2 md:gap-4">
        <div className="relative flex-1 md:w-80 md:flex-none"></div>
      </div>
      <div className="flex items-center gap-2 ">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="" size={15} />
          <span className="absolute top-1.5 right-1.5 flex h-2 w-2 rounded-full bg-blue-600" />
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
                <AvatarFallback>MA</AvatarFallback>
              </Avatar>
              <ChevronDown className="text-muted-foreground" size={15} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="text-black">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
