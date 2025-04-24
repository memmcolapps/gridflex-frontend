"use client"

import { Branding } from "../../../components/branding/branding";
import { AuthhForm } from "../../../components/authform/authform";

export default function ForgotPassword() {
    return (
        <div className="min-h-screen bg-white-100 flex items-center justify-center p-4">
            <div className="hidden md:flex w-full max-w-5xl rounded-lg overflow-hidden h-120 gap-36">
                {/* Left Section: Branding */}
                <div className="w-1/2 text-black p-2 flex flex-col justify-between h-75">
                    <Branding labelTitle="Forgot your password"
                        label="No worries - enter your email to reset your password and get back to managaing your dashboard in no time" />
                </div>

                {/* Right Section: Sign-In Form */}

                <div className="w-screen p-4 flex flex-col justify-center bg-white-700 h-60 md:mt-24 mr-2 rounded-lg shadow-[0px_0px_10px_0px_rgba(0,0,0,0.25)]">
                    <AuthhForm formType="resetpassword"
                        onSubmit={(e) => {
                            e.preventDefault();
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

