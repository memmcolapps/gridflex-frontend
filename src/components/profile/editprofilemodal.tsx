// @/components/EditProfileModal.tsx
"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import ChangePasswordModal from "./changepasswordmodal";
import { useAuth } from "@/context/auth-context";
import { useUpdateProfile } from "@/hooks/use-profile";
import { toast } from "sonner";
import { type UpdateProfilePayload } from "@/service/profile-service";

interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function EditProfileModal({ isOpen, onClose }: EditProfileModalProps) {
    const { user } = useAuth();
    const { mutate, isPending } = useUpdateProfile();
    const [showPassword, setShowPassword] = useState(false);
    const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
    const [formData, setFormData] = useState<UpdateProfilePayload>({
        id: user?.id ?? "",
        firstname: user?.firstname ?? "",
        lastname: user?.lastname ?? "",
        email: user?.email ?? "",
        phoneNumber: user?.phoneNumber ?? "N/A",
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!user?.id) {
            toast.error("User ID not found. Please log in again.");
            return;
        }
        const payload: UpdateProfilePayload = {
            ...formData,
        };
        mutate(payload, {
            onSuccess: () => {
                onClose();
            },
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px] bg-white h-fit">
                <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="firstname" className="text-sm font-medium">
                                    First Name <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    id="firstname"
                                    value={formData.firstname}
                                    onChange={handleInputChange}
                                    className="border-[rgba(228,231,236,1)]"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="lastname" className="text-sm font-medium">
                                    Last Name <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    id="lastname"
                                    value={formData.lastname}
                                    onChange={handleInputChange}
                                    className="border-[rgba(228,231,236,1)]"
                                    required
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="email" className="text-sm font-medium">
                                    Email <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    id="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="border-[rgba(228,231,236,1)]"
                                    type="email"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="phoneNumber" className="text-sm font-medium">
                                    Phone Number <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    id="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={handleInputChange}
                                    className="border-[rgba(228,231,236,1)]"
                                    type="tel"
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="password" className="text-sm font-medium">
                                Password
                            </label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value="••••••••"
                                    className="pr-10 border-[rgba(228,231,236,1)]"
                                    disabled
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
                            <div className="mt-2">
                                <a
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setIsChangePasswordOpen(true);
                                        onClose();
                                    }}
                                    className="text-sm text-[#161CCA] cursor-pointer"
                                >
                                    Change Password
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-between w-full">
                        <Button
                            variant="outline"
                            onClick={onClose}
                            className="text-[#161CCA] bg-white"
                            disabled={isPending}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" className="bg-[#161CCA] text-white" disabled={isPending}>
                            {isPending ? "Saving..." : "Save"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
            {isChangePasswordOpen && (
                <ChangePasswordModal
                    isOpen={isChangePasswordOpen}
                    onClose={() => setIsChangePasswordOpen(false)}
                />
            )}
        </Dialog>
    );
}