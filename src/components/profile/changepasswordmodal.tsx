"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { useGenerateOtp, useChangePassword } from "@/hooks/use-changePassword";
import { useAuth } from "@/context/auth-context";

interface ChangePasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ChangePasswordModal({ isOpen, onClose }: ChangePasswordModalProps) {
    const { user } = useAuth();
    const { mutate: generateOtpMutate, isPending: isOtpPending } = useGenerateOtp();
    const { mutate: changePasswordMutate, isPending: isPasswordChangePending, isSuccess: isPasswordChangeSuccess } = useChangePassword();
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [otpTimer, setOtpTimer] = useState(60);
    const [formData, setFormData] = useState({
        newPassword: "",
        confirmPassword: "",
        otp: "",
    });
    const [errors, setErrors] = useState({
        newPassword: "",
        confirmPassword: "",
        otp: "",
    });
    useEffect(() => {
        if (otpSent && otpTimer > 0) {
            const timer = setInterval(() => {
                setOtpTimer((prev) => prev - 1);
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [otpSent, otpTimer]);
    useEffect(() => {
        if (isPasswordChangeSuccess) {
            onClose();
        }
    }, [isPasswordChangeSuccess, onClose]);

    const validateField = (id: string, value: string) => {
        let error = "";
        if (id === "newPassword") {
            if (!value) error = "New password is required";
            else if (value.length < 6) error = "Password must be at least 6 characters";
            if (formData.confirmPassword && value !== formData.confirmPassword) {
                setErrors((prev) => ({ ...prev, confirmPassword: "Passwords don’t match" }));
            } else {
                setErrors((prev) => ({ ...prev, confirmPassword: "" }));
            }
        } else if (id === "confirmPassword") {
            if (!value) error = "Confirm password is required";
            else if (formData.newPassword && value !== formData.newPassword) error = "Passwords don’t match";
        } else if (id === "otp") {
            if (!value) error = "OTP is required";
            else if (!/^\d+$/.test(value) || value.length !== 4) error = "OTP must be 6 digits";
        }
        return error;
    };
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
        const error = validateField(id, value);
        setErrors((prev) => ({ ...prev, [id]: error }));
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

        // ------------------------------------------
        // CONSOLE LOG FOR VERIFICATION
        console.log("Email being passed to the backend for OTP:", user.email);
        // ------------------------------------------

        const payload = { username: user.email };
        generateOtpMutate(payload, {
            onSuccess: () => {
                setOtpSent(true);
                setOtpTimer(60);
                toast.info(`OTP sent to ${user.email}`);
            }
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

        if (newPasswordError || confirmPasswordError || otpError) {
            setErrors((prev) => ({
                ...prev,
                newPassword: newPasswordError,
                confirmPassword: confirmPasswordError,
                otp: otpError,
            }));
            return;
        }

        // ------------------------------------------
        // CONSOLE LOG FOR VERIFICATION
        console.log("Email being passed to the backend for password change:", user.email);
        // ------------------------------------------

        const payload = {
            usernam: user.email,
            otp: otp,
            password: newPassword,
        };
        changePasswordMutate(payload);
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
                                disabled={!otpSent}
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 flex items-center pr-3"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                            >
                                {showNewPassword ? <Eye size={14} className="text-gray-500" /> : <EyeOff size={14} className="text-gray-500" />}
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
                                disabled={!otpSent}
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 flex items-center pr-3"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? <Eye size={14} className="text-gray-500" /> : <EyeOff size={14} className="text-gray-500" />}
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
                            />
                            {errors.otp && <p className="text-red-500 text-sm">{errors.otp}</p>}
                            {otpSent && otpTimer > 0 && (
                                <p className="text-sm text-gray-500 flex justify-end">
                                    Remaining time &nbsp;&nbsp; <span className="text-[#161CCA]">
                                        {Math.floor(otpTimer / 60)}:
                                        {otpTimer % 60 < 10 ? `0${otpTimer % 60}` : otpTimer % 60}s
                                    </span>
                                </p>
                            )}
                            {!otpSent ? (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={handleGetOtp}
                                    disabled={!user?.email || isOtpPending}
                                    className="text-[#161CCA] p-0 h-auto cursor-pointer"
                                >
                                    {isOtpPending ? "Sending OTP..." : "Get OTP"}
                                </Button>
                            ) : (
                                <p
                                    className={`text-sm text-black cursor-pointer ${otpTimer > 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                                    onClick={otpTimer === 0 ? handleGetOtp : undefined}
                                >
                                    Didn’t get an OTP? <span className="text-[#161CCA]">Resend</span>
                                </p>
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
                        disabled={isPasswordChangePending || !otpSent}
                    >
                        {isPasswordChangePending ? "Saving..." : "Save"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}