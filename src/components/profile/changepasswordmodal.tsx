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
import { useGenerateOtp, useChangePassword, useCountdown } from "@/hooks/use-changePassword";

interface ChangePasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ChangePasswordModal({ isOpen, onClose }: ChangePasswordModalProps) {
    const { user } = useAuth();
    const { mutate: generateOtpMutate, isPending: isOtpPending } = useGenerateOtp();
    const { mutate: changePasswordMutate, isPending: isPasswordChangePending } = useChangePassword();

    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formData, setFormData] = useState({
        newPassword: "",
        confirmPassword: "",
        otp: "",
    });

    const { timeLeft, startCountdown, isRunning, resetCountdown } = useCountdown(60);

    const [errors, setErrors] = useState({
        newPassword: "",
        confirmPassword: "",
        otp: "",
    });

    const validateField = (id: string, value: string) => {
        let error = "";
        if (id === "newPassword") {
            if (!value) error = "New password is required";
            else if (value.length < 6) error = "Password must be at least 6 characters";
        } else if (id === "confirmPassword") {
            if (!value) error = "Confirm password is required";
            else if (formData.newPassword && value !== formData.newPassword) error = "Passwords don’t match";
        } else if (id === "otp") {
            if (!value) error = "OTP is required";
            else if (!/^\d+$/.test(value) || value.length !== 6) error = "OTP must be 6 digits";
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

    const handleGetOtp = () => {
        if (!user?.email) {
            toast.error("User email not found. Please log in again.");
            return;
        }

        const payload = { username: user.email };
        generateOtpMutate(payload, {
            onSuccess: () => {
                startCountdown();
                toast.info(`OTP sent to ${user.email}`);
            },
        });
    };

    const handleSave = () => {
        if (!user?.email) {
            toast.error("User email not found. Please log in again.");
            return;
        }
        const { newPassword, confirmPassword, otp } = formData;
        const newPasswordError = validateField("newPassword", newPassword);
        const confirmPasswordError = validateField("confirmPassword", confirmPassword);
        const otpError = validateField("otp", otp);

        setErrors({
            newPassword: newPasswordError,
            confirmPassword: confirmPasswordError,
            otp: otpError,
        });

        if (newPasswordError || confirmPasswordError || otpError) {
            return;
        }

        const payload = {
            usernam: user.email,
            otp: otp,
            password: newPassword,
        };

        changePasswordMutate(payload, {
            onSuccess: () => {
                onClose();
                resetCountdown();
            },
            onError: () => {
                resetCountdown();
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
                                {showNewPassword ? <Eye size={14}  /> : <EyeOff size={14}  />}
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
                                {showConfirmPassword ? <Eye size={14}  /> : <EyeOff size={14} />}
                            </button>
                        </div>
                        {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="otp">
                            OTP <span className="text-red-500">*</span>
                        </Label>
                        <div className="space-y-1">
                            <Input
                                id="otp"
                                value={formData.otp}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                className={`border-[rgba(228,231,236,1)] ${errors.otp ? "border-red-500" : ""}`}
                                placeholder="Enter OTP"
                                disabled={!isRunning && timeLeft > 0}
                            />
                            {errors.otp && <p className="text-red-500 text-sm">{errors.otp}</p>}
                            {isRunning && (
                                <p className="text-sm text-gray-500 flex justify-end">
                                    Remaining time &nbsp;&nbsp; <span className="text-[#161CCA]">
                                        {Math.floor(timeLeft / 60)}:
                                        {timeLeft % 60 < 10 ? `0${timeLeft % 60}` : timeLeft % 60}s
                                    </span>
                                </p>
                            )}
                            {timeLeft <= 0 ? (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={handleGetOtp}
                                    disabled={isOtpPending}
                                    className="text-[#161CCA] p-0 h-auto cursor-pointer"
                                >
                                    {isOtpPending ? "Resending..." : "Resend OTP"}
                                </Button>
                            ) : (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={handleGetOtp}
                                    disabled={isOtpPending || isRunning}
                                    className="text-[#161CCA] p-0 h-auto cursor-pointer"
                                >
                                    {isOtpPending ? "Sending OTP..." : "Get OTP"}
                                </Button>
                            )}
                        </div>
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
                            !isRunning ||
                            !formData.newPassword ||
                            !formData.confirmPassword ||
                            !formData.otp ||
                            !!errors.newPassword ||
                            !!errors.confirmPassword ||
                            !!errors.otp
                        }
                    >
                        {isPasswordChangePending ? "Saving..." : "Save"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}