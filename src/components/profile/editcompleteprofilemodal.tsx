// components/modals/EditCompleteProfileModal.tsx
'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';

interface EditCompleteProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (formData: FormData) => void;
  initialFormData: FormData;
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  newPassword: string;
  confirmPassword: string;
  otp: string;
}

export function EditCompleteProfileModal({ open, onOpenChange, onSubmit, initialFormData }: EditCompleteProfileModalProps) {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    newPassword: '',
    confirmPassword: '',
    otp: '',
  });
  const [otpSent, setOtpSent] = useState(false);
  const [otpTimer, setOtpTimer] = useState(60);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
    let error = '';
    if (id === 'firstName') {
      if (!value) error = 'First name is required';
    } else if (id === 'lastName') {
      if (!value) error = 'Last name is required';
    } else if (id === 'email') {
      if (!value) error = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(value)) error = 'Invalid email address';
    } else if (id === 'phoneNumber') {
      if (!value) error = 'Phone number is required';
      else if (!/^\d+$/.test(value) || value.length < 10) error = 'Invalid phone number';
    } else if (id === 'newPassword') {
      if (!value) error = 'Password is required';
      else if (value.length < 6) error = 'Password must be at least 6 characters';
      if (formData.confirmPassword && value !== formData.confirmPassword) {
        setErrors((prev) => ({ ...prev, confirmPassword: "Password doesn't match" }));
      } else {
        setErrors((prev) => ({ ...prev, confirmPassword: '' }));
      }
    } else if (id === 'confirmPassword') {
      if (!value) error = 'Confirm password is required';
      else if (formData.newPassword && value !== formData.newPassword) error = "Password doesn't match";
    } else if (id === 'otp') {
      if (!value) error = 'OTP is required';
      else if (!/^\d+$/.test(value) || value.length !== 6) error = 'OTP must be 6 digits';
    }
    return error;
  };

  // Handle input changes with real-time validation
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    const error = validateField(id, value);
    setErrors((prev) => ({ ...prev, [id]: error }));
    if (id === 'otp') setOtpError(null);
  };

  // Handle blur event for validation
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    const error = validateField(id, value);
    setErrors((prev) => ({ ...prev, [id]: error }));
  };

  // Validate form fields on submission
  const validateForm = () => {
    const newErrors = {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      newPassword: '',
      confirmPassword: '',
      otp: '',
    };
    let isValid = true;

    if (!formData.firstName) {
      newErrors.firstName = 'First name is required';
      isValid = false;
    }
    if (!formData.lastName) {
      newErrors.lastName = 'Last name is required';
      isValid = false;
    }
    if (!formData.email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
      isValid = false;
    }
    if (!formData.phoneNumber) {
      newErrors.phoneNumber = 'Phone number is required';
      isValid = false;
    } else if (!/^\d+$/.test(formData.phoneNumber) || formData.phoneNumber.length < 10) {
      newErrors.phoneNumber = 'Invalid phone number';
      isValid = false;
    }
    if (!formData.newPassword) {
      newErrors.newPassword = 'Password is required';
      isValid = false;
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
      isValid = false;
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirm password is required';
      isValid = false;
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Password doesn't match";
      isValid = false;
    }
    if (!formData.otp) {
      newErrors.otp = 'OTP is required';
      isValid = false;
    } else if (!/^\d+$/.test(formData.otp) || formData.otp.length !== 6) {
      newErrors.otp = 'OTP must be 6 digits';
      isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };

  // Check if all fields are filled and valid
  const isFormValid = () => {
    return (
      formData.firstName &&
      formData.lastName &&
      formData.email &&
      /\S+@\S+\.\S+/.test(formData.email) &&
      formData.phoneNumber &&
      /^\d+$/.test(formData.phoneNumber) &&
      formData.phoneNumber.length >= 10 &&
      formData.newPassword &&
      formData.newPassword.length >= 6 &&
      formData.confirmPassword &&
      formData.newPassword === formData.confirmPassword &&
      formData.otp &&
      /^\d+$/.test(formData.otp) &&
      formData.otp.length === 6
    );
  };

  // Simulate OTP request
  const handleGetOtp = () => {
    if (!formData.phoneNumber || errors.phoneNumber) return;
    setOtpSent(true);
    setOtpTimer(60);
    setOtpError(null);
    setFormData((prev) => ({ ...prev, otp: '213445' }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (formData.otp !== '213445') {
      setOtpError('Wrong OTP');
      return;
    }
    onSubmit(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] h-fit bg-white">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">
                First Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`border-gray-200 ${errors.firstName ? 'border-red-500' : ''}`}
              />
              {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">
                Last Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`border-gray-200 ${errors.lastName ? 'border-red-500' : ''}`}
              />
              {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`border-gray-200 ${errors.email ? 'border-red-500' : ''}`}
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">
                Phone Number <span className="text-red-500">*</span>
              </Label>
              <Input
                id="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`border-gray-200 ${errors.phoneNumber ? 'border-red-500' : ''}`}
              />
              {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber}</p>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="newPassword">
                New Password <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={`border-gray-200 pr-10 ${errors.newPassword ? 'border-red-500' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500"
                >
                  {showPassword ? <EyeOff size={14} className="cursor-pointer" /> : <Eye size={14} className="cursor-pointer" />}
                </button>
              </div>
              {errors.newPassword && <p className="text-red-500 text-sm">{errors.newPassword}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">
                Confirm Password <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={`border-gray-200 pr-10 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500"
                >
                  {showConfirmPassword ? <EyeOff size={14} className="cursor-pointer" /> : <Eye size={14} className="cursor-pointer" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
            </div>
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
                className={`border-gray-200 ${errors.otp || otpError ? 'border-red-500' : ''}`}
              />
              {errors.otp && <p className="text-red-500 text-sm">{errors.otp}</p>}
              {otpError && <p className="text-red-500 text-sm">{otpError}</p>}
              {otpSent && otpTimer > 0 && (
                <p className="text-sm text-gray-500 flex justify-end">
                  Remaining time{' '}
                  <span className="text-[#161CCA]">
                    {Math.floor(otpTimer / 60)}:{otpTimer % 60 < 10 ? `0${otpTimer % 60}` : otpTimer % 60}s
                  </span>
                </p>
              )}
              {!otpSent ? (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleGetOtp}
                  disabled={!formData.phoneNumber || !/^\d+$/.test(formData.phoneNumber) || formData.phoneNumber.length < 10}
                  className="text-[#161CCA] p-0 h-auto cursor-pointer"
                >
                  Get OTP
                </Button>
              ) : (
                <p
                  className={`text-sm text-black cursor-pointer ${otpTimer > 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={otpTimer === 0 ? handleGetOtp : undefined}
                >
                  Didn’t get an OTP? <span className="text-[#161CCA]">Resend</span>
                </p>
              )}
            </div>
          </div>
          <div className="flex justify-end">
            <Button
              type="submit"
              className="w-fit"
              disabled={!isFormValid()}
              style={{
                backgroundColor: isFormValid() ? '#161CCA' : '#A2A4EA',
                color: 'white',
              }}
            >
              Save
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}