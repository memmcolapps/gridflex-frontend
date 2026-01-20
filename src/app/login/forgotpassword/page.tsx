"use client";

import { useState } from "react";

import Link from "next/link";

import {
  ArrowLeftIcon,
  EyeIcon,
  EyeOffIcon,
} from "lucide-react";

import { toast } from "sonner";

import { Branding } from "../../../components/auth/branding";

import { AuthForm } from "../../../components/auth/authform";

import { sendResetOtp, resetPassword } from "../../../service/auth-service";

export default function ForgotPassword() {
  const [step, setStep] = useState<"email" | "otp" | "reset" | "success">(
    "email",
  );

  const [email, setEmail] = useState("");

  const [otp, setOtp] = useState("");

  const [showConfirmPassword, setShowConfirmPassword] = useState(false); 

  const [showNewPassword, setShowNewPassword] = useState(false);

  const [newPassword, setNewPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const handleEmailSubmit = async (email: string, _password: string) => {
    try {
      await sendResetOtp(email);

      setEmail(email);

      setStep("otp");
    } catch {
      // error handled in service
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setStep("reset");
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");

      return;
    }

    try {
      await resetPassword(email, otp, newPassword, confirmPassword);

      setStep("success");
    } catch {
      // error handled
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="flex min-h-screen w-full items-center">
        {/* Left Section: Branding */}

        <div className="flex w-1/2 items-center justify-center px-20 py-10">
          <Branding
            labelTitle="Forgot your password"
            label="No worries - enter your email to reset your password and get back to managaing your dashboard in no time"
          />
        </div>

        {/* Right Section: Sign-In Form */}

        <div className="flex w-1/3 items-center justify-center border-l border-gray-100">
          <div className="w-[460px] px-10">
            {step === "email" ? (
              <AuthForm formType="resetpassword" onSubmit={handleEmailSubmit} />
            ) : step === "otp" ? (
              <form onSubmit={handleOtpSubmit} className="w-full space-y-6">
                <h2 className="mb-8 text-3xl font-semibold text-gray-800">
                  Enter OTP
                </h2>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">
                    OTP Code
                  </label>

                  <div className="flex justify-center space-x-2">
                    {Array.from({ length: 4 }, (_, i) => (
                      <input
                        key={i}
                        type="text"
                        maxLength={1}
                        className="h-12 w-12 rounded-md border border-gray-300 text-center focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        value={otp[i] ?? ""}
                        onChange={(e) => {
                          const newOtp = otp.split("");

                          newOtp[i] = e.target.value.replace(/[^0-9]/g, ""); // only numbers

                          setOtp(newOtp.join(""));

                          // auto focus next

                          if (e.target.value && i < 3) {
                            const nextInput = e.target
                              .nextElementSibling as HTMLInputElement;

                            if (nextInput) nextInput.focus();
                          }
                        }}
                      />
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-md bg-blue-600 py-3 font-medium text-white hover:bg-blue-700"
                >
                  Next
                </button>

                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={() => sendResetOtp(email)}
                    className="text-sm text-gray-600 hover:text-blue-700"
                  >
                    Did not get a mail? Click here resend
                  </button>
                </div>
              </form>
            ) : step === "reset" ? (
              <form onSubmit={handleResetSubmit} className="w-full space-y-6">
                <h2 className="mb-8 text-3xl font-semibold text-gray-800">
                  Reset Password
                </h2>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">
                    New Password
                  </label>

                  <div className="relative">
                    <input
                      placeholder="••••••••"
                      type={showNewPassword ? "text" : "password"}
                      className="w-full rounded-md border border-gray-300 px-4 py-3 pr-10 text-gray-800 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />

                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute inset-y-0 right-0 flex w-10 cursor-pointer items-center justify-center pr-3 text-gray-400 hover:text-gray-600"
                      aria-label={
                        showNewPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showNewPassword ? (
                        <EyeIcon size={10} />
                      ) : (
                        <EyeOffIcon size={10} />
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">
                    Confirm Password
                  </label>

                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />

                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 flex w-10 cursor-pointer items-center justify-center pr-3 text-gray-400 hover:text-gray-600"
                      aria-label={
                        showConfirmPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeIcon size={10} />
                      ) : (
                        <EyeOffIcon size={10} />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-md bg-blue-600 py-3 font-medium text-white hover:bg-blue-700"
                >
                  Reset Password
                </button>

                <div className="flex justify-center">
                  <Link
                    href="/login"
                    className="flex items-center space-x-1 rounded bg-transparent px-2 py-1.5 text-gray-700 focus:outline-none"
                  >
                    <ArrowLeftIcon
                      className="h-4 w-5 text-[#161CCA]"
                      aria-hidden="true"
                    />

                    <span>Back to Login</span>
                  </Link>
                </div>
              </form>
            ) : (
              <div className="w-full space-y-6 text-center">
                {/* <CheckCircleIcon className="mx-auto h-16 w-16 text-green-500" /> */}

                <h2 className="mb-4 text-3xl font-semibold text-gray-800">
                  Successful
                </h2>

                <p className="w-fit text-gray-600">
                  Your New password has been updated <br></br>successfully. You
                  can now log in with your new password securely.
                </p>

                <Link
                  href="/login"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-[#161CCA] px-6 py-3 font-medium text-white"
                >
                  Done
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
