import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChangePasswordModal({ isOpen, onClose }: ChangePasswordModalProps) {
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpTimer, setOtpTimer] = useState(60);
  const [otpError, setOtpError] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
    otp: "",
    phoneNumber: "", // Required for OTP validation
  });

  // Error state
  const [errors, setErrors] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
    otp: "",
    phoneNumber: "",
  });

  // OTP timer countdown
  useEffect(() => {
    if (otpSent && otpTimer > 0) {
      const timer = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [otpSent, otpTimer]);

  // Validate individual field
  const validateField = (id: string, value: string) => {
    let error = "";
    if (id === "oldPassword") {
      if (!value) error = "Old password is required";
    } else if (id === "newPassword") {
      if (!value) error = "New password is required";
      else if (value.length < 6) error = "Password must be at least 6 characters";
      // Also validate confirmPassword if newPassword changes
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
      else if (!/^\d+$/.test(value) || value.length !== 6) error = "OTP must be 6 digits";
    } else if (id === "phoneNumber") {
      if (!value) error = "Phone number is required";
      else if (!/^\d+$/.test(value) || value.length < 10) error = "Invalid phone number";
    }
    return error;
  };

  // Handle input changes with real-time validation
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));

    // Real-time validation
    const error = validateField(id, value);
    setErrors((prev) => ({ ...prev, [id]: error }));
    if (id === "otp") setOtpError(null);
  };

  // Handle blur event for validation
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    const error = validateField(id, value);
    setErrors((prev) => ({ ...prev, [id]: error }));
  };

  // Simulate OTP request
  const handleGetOtp = () => {
    if (!formData.phoneNumber || errors.phoneNumber) return;
    setOtpSent(true);
    setOtpTimer(60);
    setOtpError(null);
    setFormData((prev) => ({ ...prev, otp: "213445" })); // Simulate OTP
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
                className="absolute inset-y-0 right-0 flex items-center pr-3"
                onClick={() => setShowOldPassword(!showOldPassword)}
              >
                {showOldPassword ? <Eye size={14} className="text-gray-500" /> : <EyeOff size={14} className="text-gray-500" />}
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
            <Label htmlFor="phoneNumber" className="text-sm font-medium">
              Phone Number <span className="text-red-500">*</span>
            </Label>
            <Input
              id="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              onBlur={handleBlur}
              className={`border-[rgba(228,231,236,1)] ${errors.phoneNumber ? "border-red-500" : ""}`}
              placeholder="Enter Phone Number"
            />
            {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber}</p>}
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
                className={`border-[rgba(228,231,236,1)] ${errors.otp || otpError ? "border-red-500" : ""}`}
                placeholder="Enter OTP"
              />
              {errors.otp && <p className="text-red-500 text-sm">{errors.otp}</p>}
              {otpError && <p className="text-red-500 text-sm">{otpError}</p>}
              {otpSent && otpTimer > 0 && (
                <p className="text-sm text-gray-500 flex justify-end">
                  Remaining time <span className="text-[#161CCA]">
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
                  disabled={
                    !formData.phoneNumber ||
                    !/^\d+$/.test(formData.phoneNumber) ||
                    formData.phoneNumber.length < 10
                  }
                  className="text-[#161CCA] p-0 h-auto cursor-pointer"
                >
                  Get OTP
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
          <Button onClick={onClose} className="bg-[#161CCA] text-white">Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}