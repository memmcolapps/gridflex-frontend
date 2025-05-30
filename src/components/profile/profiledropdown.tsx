"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import ChangePasswordModal from "./changepasswordmodal";

interface ProfileDropdownProps {
    closeDropdown: () => void;
    openEditProfileModal: () => void; // Ensure this prop is used
}

export default function ProfileDropdown({ closeDropdown, openEditProfileModal }: ProfileDropdownProps) {
    const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

    return (
        <>
            <div className="flex items-center gap-4 w-full">
                <div className="h-12 w-12 rounded-full bg-[#225BFF] flex items-center justify-center text-white">
                    AO
                </div>
                <div className="">
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
            {/* <div className="mt-4 flex gap-2">
                <Button onClick={() => setIsChangePasswordOpen(true)} variant="link" className="p-0">
                    Change Password
                </Button>
            </div> */}
            <div className="mt-4 flex gap-2 justify-between">

                <Button variant="outline" onClick={closeDropdown} className="cursor-pointer text-[#161CCA]">
                    Cancel
                </Button>
                <Button
                    onClick={() => {
                        openEditProfileModal(); // Open the Edit Profile modal via the prop
                        closeDropdown(); // Close the ProfileDropdown
                    }}
                    className="cursor-pointer bg-[#161CCA] text-white"
                >
                    Edit Profile
                </Button>
            </div>

            {/* Modals */}
            {/* <ChangePasswordModal
                isOpen={isChangePasswordOpen}
                onClose={() => setIsChangePasswordOpen(false)}
            /> */}
        </>
    );
}