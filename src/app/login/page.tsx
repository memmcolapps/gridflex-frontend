"use client";
import { Branding } from "../../components/branding/branding";
import { AuthForm } from "../../components/authform/authform";
import { useAuth } from "../../context/auth-context";

export default function Login() {
  const { login } = useAuth();

  const handleSubmit = async (email: string, password: string) => {
    await login(email, password);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="flex min-h-screen w-full items-center">
        {/* Left Section: Branding */}
        <div className="flex w-1/2 items-center justify-center px-20 py-10">
          <Branding
            labelTitle="Welcome back!"
            label="Log in to access your centralized dashboard, where you can manage data, billing, vending and HES services—all in one streamlined platform."
          />
        </div>

        {/* Right Section: Sign-In Form */}
        <div className="flex w-1/3 items-center justify-center border-l border-gray-100">
          <div className="w-[460px] px-10">
            <AuthForm formType="signin" onSubmit={handleSubmit} />
          </div>
        </div>
      </div>
    </div>
  );
}
