"use client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Branding } from "../../components/branding/branding";
import { AuthhForm } from "../../components/authform/authform";
import { useAuth } from "../../context/auth-context";

export default function Login() {
  const { login } = useAuth();

  const handleSubmit = async (email: string, password: string) => {
    await login(email, password);
  };

  return (
    <div className="min-h-screen">
      <div className="flex min-h-screen w-full items-center justify-between gap-8 overflow-hidden rounded-lg p-20">
        {/* Left Section: Branding */}
        <div className="min-h-screen w-1/2 text-black">
          <Branding
            labelTitle="Welcome back!"
            label="Log in to access your centralized dashboard, where you can manage data, billing,
          vending, and HES services—all in one streamlined platform."
          />
        </div>

        {/* Right Section: Sign-In Form */}
        <div className="w-1/2">
          <div className="w-2/3 rounded-lg p-8 shadow-lg">
            <AuthhForm formType="signin" onSubmit={handleSubmit} />
          </div>
        </div>
      </div>
    </div>
  );
}
