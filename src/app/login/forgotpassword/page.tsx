"use client";

import { useState } from "react";

import Link from "next/link";

import { ArrowLeftIcon, CheckCircleIcon } from "lucide-react";

import { toast } from "sonner";

import { Branding } from "../../../components/auth/branding";

import { AuthForm } from "../../../components/auth/authform";

import { sendResetOtp, resetPassword } from "../../../service/auth-service";

export default function ForgotPassword() {

  const [step, setStep] = useState<'email' | 'otp' | 'reset' | 'success'>('email');

  const [email, setEmail] = useState('');

  const [otp, setOtp] = useState('');

  const [newPassword, setNewPassword] = useState('');

  const [confirmPassword, setConfirmPassword] = useState('');

  const handleEmailSubmit = async (email: string, _password: string) => {

    try {

      await sendResetOtp(email);

      setEmail(email);

      setStep('otp');

    } catch {

      // error handled in service

    }

  };

  const handleOtpSubmit = async (e: React.FormEvent) => {

    e.preventDefault();

    setStep('reset');

  };

  const handleResetSubmit = async (e: React.FormEvent) => {

    e.preventDefault();

    if (newPassword !== confirmPassword) {

      toast.error("Passwords do not match");

      return;

    }

    try {

      await resetPassword(email, otp, newPassword, confirmPassword);

      setStep('success');

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

            {step === 'email' ? (

              <AuthForm

                formType="resetpassword"

                onSubmit={handleEmailSubmit}

              />

            ) : step === 'otp' ? (

              <form onSubmit={handleOtpSubmit} className="w-full space-y-6">

                <h2 className="mb-8 text-3xl font-semibold text-gray-800">Enter OTP</h2>

                <div className="space-y-1.5">

                  <label className="block text-sm font-medium text-gray-700">OTP Code</label>

                  <div className="flex space-x-2 justify-center">

                    {Array.from({length: 4}, (_, i) => (

                      <input

                        key={i}

                        type="text"

                        maxLength={1}

                        className="w-12 h-12 text-center border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500"

                        value={otp[i] ?? ''}

                        onChange={(e) => {

                          const newOtp = otp.split('');

                          newOtp[i] = e.target.value.replace(/[^0-9]/g, ''); // only numbers

                          setOtp(newOtp.join(''));

                          // auto focus next

                          if (e.target.value && i < 3) {

                            const nextInput = e.target.nextElementSibling as HTMLInputElement;

                            if (nextInput) nextInput.focus();

                          }

                        }}

                      />

                    ))}

                  </div>

                </div>

                <button

                  type="submit"

                  className="flex w-full items-center justify-center gap-2 rounded-md py-3 font-medium text-white bg-blue-600 hover:bg-blue-700"

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

            ) : step === 'reset' ? (

              <form onSubmit={handleResetSubmit} className="w-full space-y-6">

                <h2 className="mb-8 text-3xl font-semibold text-gray-800">Reset Password</h2>

                <div className="space-y-1.5">

                  <label className="block text-sm font-medium text-gray-700">New Password</label>

                  <input

                    type="password"

                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500"

                    value={newPassword}

                    onChange={(e) => setNewPassword(e.target.value)}

                    required

                  />

                </div>

                <div className="space-y-1.5">

                  <label className="block text-sm font-medium text-gray-700">Confirm Password</label>

                  <input

                    type="password"

                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500"

                    value={confirmPassword}

                    onChange={(e) => setConfirmPassword(e.target.value)}

                    required

                  />

                </div>

                <button

                  type="submit"

                  className="flex w-full items-center justify-center gap-2 rounded-md py-3 font-medium text-white bg-blue-600 hover:bg-blue-700"

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

                <h2 className="mb-4 text-3xl font-semibold text-gray-800">Successful</h2>

                <p className="text-gray-600 w-fit">Your New password has been updated <br></br>successfully. You can now log in with your new password securely.</p>

                <Link

                  href="/login"

                  className="inline-flex items-center w-full justify-center gap-2 rounded-md py-3 px-6 font-medium text-white bg-[#161CCA]"

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
