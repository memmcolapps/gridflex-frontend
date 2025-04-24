"use client";
import { Branding } from "/components/branding";
import { AuthhForm } from "/components/authform";

export default function Login() {
  return (
    <div className="min-h-screen bg-white-100 flex items-center justify-center p-4">
      <div className="hidden md:flex w-full max-w-5xl rounded-lg overflow-hidden h-120 gap-36">
        {/* Left Section: Branding */}
        <div className="w-1/2 text-black p-2 flex flex-col justify-between h-75">
          <Branding labelTitle="Welcome back!"
            label=" Log in to access your centralized dashboard, where you can manage data, billing,
              vending, and HES services—all in one streamlined platform." />
        </div>

        {/* Right Section: Sign-In Form */}
        <div className="w-screen p-2 flex flex-col justify-center bg-white-700 h-85 shadow-[0px_0px_10px_0px_rgba(0,0,0,0.25)] mt-14 mr-2 rounded-lg">
          <AuthhForm formType="signin"
            onSubmit={(e) => {
              e.preventDefault();
            }} />
        </div>
      </div>
    </div>
  );
};


