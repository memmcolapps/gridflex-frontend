"use client";

import { Branding } from "../../../components/branding/branding";
import { AuthForm } from "../../../components/authform/authform";

export default function ForgotPassword() {
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
          <AuthForm
            formType="resetpassword"
            onSubmit={(e) => {
              console.log(e);
            }}
          />
        </div>
      </div>
    </div>
  );
}
