"use client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Branding } from "../../components/branding/branding";
import { AuthhForm } from "../../components/authform/authform";
import { useAuth } from "../../context/auth-context";

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (email: string, password: string) => {
    try {
      await login(email, password);
      toast.success("Login successful");
      router.push("/data-management/dashboard");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Login failed");
    }
  };

  return (
    <div className="bg-white-100 flex min-h-screen items-center justify-center p-4">
      <div className="hidden h-120 w-full max-w-5xl gap-36 overflow-hidden rounded-lg md:flex">
        {/* Left Section: Branding */}
        <div className="flex h-75 w-1/2 flex-col justify-between p-2 text-black">
          <Branding
            labelTitle="Welcome back!"
            label="Log in to access your centralized dashboard, where you can manage data, billing,
              vending, and HES services—all in one streamlined platform."
          />
        </div>

        {/* Right Section: Sign-In Form */}
        <div className="bg-white-700 mt-14 mr-2 flex h-85 w-screen flex-col justify-center rounded-lg p-2 shadow-[0px_0px_10px_0px_rgba(0,0,0,0.25)]">
          <AuthhForm formType="signin" onSubmit={handleSubmit} />
        </div>
      </div>
    </div>
  );
}
