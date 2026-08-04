// components/profile/changepasswordmodal.tsx

"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/auth-context";
import { useChangePassword } from "@/hooks/use-changePassword";

interface ChangePasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ChangePasswordModal({ isOpen, onClose }: ChangePasswordModalProps) {
    const { user } = useAuth();
    const { mutate: changePasswordMutate, isPending: isPasswordChangePending } = useChangePassword();

    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formData, setFormData] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [errors, setErrors] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const validateField = (id: string, value: string) => {
        let error = "";
        if (id === "oldPassword") {
            if (!value) error = "Old password is required";
            else if (value.length < 6) error = "Password must be at least 6 characters";
        } else if (id === "newPassword") {
            if (!value) error = "New password is required";
            else if (value.length < 6) error = "Password must be at least 6 characters";
        } else if (id === "confirmPassword") {
            if (!value) error = "Confirm password is required";
            else if (formData.newPassword && value !== formData.newPassword) error = "Passwords don’t match";
        }
        return error;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData((prev) => {
            const updatedFormData = { ...prev, [id]: value };
            const error = validateField(id, value);
            setErrors((prevErrors) => ({ ...prevErrors, [id]: error }));
            if (id === "newPassword") {
                if (updatedFormData.confirmPassword && value !== updatedFormData.confirmPassword) {
                    setErrors((prevErrors) => ({ ...prevErrors, confirmPassword: "Passwords don’t match" }));
                } else {
                    setErrors((prevErrors) => ({ ...prevErrors, confirmPassword: "" }));
                }
            }
            return updatedFormData;
        });
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        const error = validateField(id, value);
        setErrors((prev) => ({ ...prev, [id]: error }));
    };

    const handleSave = () => {
        if (!user?.email) {
            toast.error("User email not found. Please log in again.");
            return;
        }
        const { oldPassword, newPassword, confirmPassword } = formData;
        const oldPasswordError = validateField("oldPassword", oldPassword);
        const newPasswordError = validateField("newPassword", newPassword);
        let confirmPasswordError = validateField("confirmPassword", confirmPassword);
        if (newPassword !== confirmPassword) {
            confirmPasswordError = "Passwords don’t match";
        }

        setErrors({
            oldPassword: oldPasswordError,
            newPassword: newPasswordError,
            confirmPassword: confirmPasswordError,
        });

        if (oldPasswordError || newPasswordError || confirmPasswordError) {
            return;
        }

        const payload = {
            confirmPassword: confirmPassword,
            oldPassword: oldPassword,
            newPassword: newPassword,
        };

        changePasswordMutate(payload, {
            onSuccess: () => {
                onClose();
            },
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px] bg-white h-fit">
                <DialogHeader>
                    <DialogTitle>Change Password</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="oldPassword" className="text-sm font-medium">
                            Old Password <span className="text-red-500">*</span>
                        </Label>
                        <div className="relative">
                            <Input
                                id="oldPassword"
                                type={showOldPassword ? "text" : "password"}
                                placeholder="Enter Old Password"
                                value={formData.oldPassword}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                className={`border-[rgba(228,231,236,1)] ${errors.oldPassword ? "border-red-500" : ""}`}
                            />
                            <button
                                type="button"
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded text-gray-500 hover:text-gray-700"
                                onClick={() => setShowOldPassword(!showOldPassword)}
                            >
                                {showOldPassword ? <Eye size={14} /> : <EyeOff size={14} />}
                            </button>
                        </div>
                        {errors.oldPassword && <p className="text-red-500 text-sm">{errors.oldPassword}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="newPassword" className="text-sm font-medium">
                            New Password <span className="text-red-500">*</span>
                        </Label>
                        <div className="relative">
                            <Input
                                id="newPassword"
                                type={showNewPassword ? "text" : "password"}
                                placeholder="Enter New Password"
                                value={formData.newPassword}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                className={`border-[rgba(228,231,236,1)] ${errors.newPassword ? "border-red-500" : ""}`}
                            />
                            <button
                                type="button"
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded text-gray-500 hover:text-gray-700"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                            >
                                {showNewPassword ? <Eye size={14} /> : <EyeOff size={14} />}
                            </button>
                        </div>
                        {errors.newPassword && <p className="text-red-500 text-sm">{errors.newPassword}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword" className="text-sm font-medium">
                            Confirm Password <span className="text-red-500">*</span>
                        </Label>
                        <div className="relative">
                            <Input
                                id="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Confirm Password"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                className={`border-[rgba(228,231,236,1)] ${errors.confirmPassword ? "border-red-500" : ""}`}
                            />
                            <button
                                type="button"
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded text-gray-500 hover:text-gray-700"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? <Eye size={14} /> : <EyeOff size={14} />}
                            </button>
                        </div>
                        {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
                    </div>
                </div>
                <div className="flex justify-between w-full">
                    <Button variant="outline" onClick={onClose} className="text-[#161CCA] bg-white">
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSave}
                        className="bg-[#161CCA] text-white"
                        disabled={
                            isPasswordChangePending ||
                            !formData.oldPassword ||
                            !formData.newPassword ||
                            !formData.confirmPassword ||
                            !!errors.oldPassword ||
                            !!errors.newPassword ||
                            !!errors.confirmPassword
                        }
                    >
                        {isPasswordChangePending ? "Saving..." : "Save"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
