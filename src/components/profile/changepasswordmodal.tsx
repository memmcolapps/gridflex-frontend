import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChangePasswordModal({ isOpen, onClose }: ChangePasswordModalProps) {
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otpError, setOtpError] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="relative">
            <label htmlFor="oldPassword" className="text-sm font-medium">
              Old Password <span className="text-red-500">*</span>
            </label>
            <Input
              id="oldPassword"
              type={showOldPassword ? "text" : "password"}
              defaultValue="12345678"
            />
            <button
              type="button"
              className="absolute right-2 top-8"
              onClick={() => setShowOldPassword(!showOldPassword)}
            >
              {showOldPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <div className="relative">
            <label htmlFor="newPassword" className="text-sm font-medium">
              New Password <span className="text-red-500">*</span>
            </label>
            <Input
              id="newPassword"
              type={showNewPassword ? "text" : "password"}
              defaultValue="00000000"
            />
            <button
              type="button"
              className="absolute right-2 top-8"
              onClick={() => setShowNewPassword(!showNewPassword)}
            >
              {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <div className="relative">
            <label htmlFor="confirmPassword" className="text-sm font-medium">
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              defaultValue="00000000"
            />
            <button
              type="button"
              className="absolute right-2 top-8"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <div>
            <label htmlFor="otp" className="text-sm font-medium">
              OTP <span className="text-red-500">*</span>
            </label>
            <Input
              id="otp"
              className={otpError ? "border-red-500" : ""}
              defaultValue={otpError ? "213545" : ""}
            />
            {otpError && (
              <p className="text-sm text-red-500 mt-1">
                Wrong OTP
              </p>
            )}
            <button
              type="button"
              className="text-sm text-blue-600 mt-1"
              onClick={() => setOtpError(!otpError)}
            >
              {otpError ? "Resend?" : "Didn't get an OTP? Resend"}
            </button>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onClose}>Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}