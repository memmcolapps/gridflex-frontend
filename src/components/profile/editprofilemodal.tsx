import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import ChangePasswordModal from "./changepasswordmodal"; // Import ChangePasswordModal

interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function EditProfileModal({ isOpen, onClose }: EditProfileModalProps) {
    const [showPassword, setShowPassword] = useState(false);
    const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false); // State for ChangePasswordModal

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px] bg-white h-fit">
                <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="firstName" className="text-sm font-medium">
                                First Name <span className="text-red-500">*</span>
                            </label>
                            <Input id="firstName" defaultValue="Abdulmjib"
                                className="border-[rgba(228,231,236,1)]" />
                        </div>
                        <div>
                            <label htmlFor="lastName" className="text-sm font-medium">
                                Last Name <span className="text-red-500">*</span>
                            </label>
                            <Input id="lastName" defaultValue="Oyewo"
                                className="border-[rgba(228,231,236,1)]" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="email" className="text-sm font-medium">
                                Email <span className="text-red-500">*</span>
                            </label>
                            <Input id="email" defaultValue="oyewoabdulmjib2@gmail.com"
                                className="border-[rgba(228,231,236,1)]" />
                        </div>
                        <div>
                            <label htmlFor="phone" className="text-sm font-medium">
                                Phone Number <span className="text-red-500">*</span>
                            </label>
                            <Input id="phone" defaultValue="08107255252"
                                className="border-[rgba(228,231,236,1)]" />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="password" className="text-sm font-medium">
                            Password <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                defaultValue="12345678"
                                className="pr-10 border-[rgba(228,231,236,1)]"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 flex items-center pr-3"
                            >
                                {showPassword ? (
                                    <Eye className="text-gray-500" size={14} />
                                ) : (
                                    <EyeOff className="text-gray-500" size={14} />
                                )}
                            </button>
                        </div>
                        {/* Change Password Link */}
                        <div className="mt-2">
                            <a
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault(); // Prevent default link behavior
                                    setIsChangePasswordOpen(true); // Open ChangePasswordModal
                                    onClose(); // Close EditProfileModal
                                }}
                                className="text-sm text-[#161CCA] cursor-pointer"
                            >
                                Change Password
                            </a>
                        </div>
                    </div>
                </div>

                <div className="flex justify-between w-full">
                    <Button variant="outline" onClick={onClose} className="text-[#161CCA] bg-white">
                        Cancel
                    </Button>
                    <Button onClick={onClose} className="bg-[#161CCA] text-white">Save</Button>
                </div>
            </DialogContent>
            {/* Render ChangePasswordModal */}
            <ChangePasswordModal
                isOpen={isChangePasswordOpen}
                onClose={() => setIsChangePasswordOpen(false)}
            />
        </Dialog>
    );
}