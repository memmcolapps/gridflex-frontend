import { useState } from "react";
import Link from "next/link";
import {
  EyeIcon,
  EyeSlashIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";

type FormType = "signin" | "resetpassword";

interface ReusableFormProps {
  formType: FormType;
  onSubmit: (email: string, password: string) => void;
  initialEmail?: string;
  initialPassword?: string;
}

export function AuthhForm({
  formType,
  onSubmit,
  initialEmail = "",
  initialPassword = "",
}: ReusableFormProps) {
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState(initialPassword);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isSignInForm = formType === "signin";
  const isFormValid = isSignInForm
    ? email.trim() !== "" && password.trim() !== ""
    : email.trim() !== "";

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || isSubmitting) return;

    setIsSubmitting(true);
    try {
      onSubmit(email, password);
    } catch (error) {
      // Error handling is done in the parent component
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="align-center flex flex-col space-y-4 rounded-lg p-4"
    >
      <h2 className="mb-6 text-center text-xl font-normal text-gray-800">
        {isSignInForm ? "Sign In" : "Reset Password"}
      </h2>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email
        </label>
        <input
          type="email"
          id="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          required
        />
      </div>

      {isSignInForm && (
        <>
          <div className="relative">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 pr-10 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-0 flex items-center pr-3"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeIcon className="mt-6 h-5 w-5 text-gray-500" />
              ) : (
                <EyeSlashIcon className="mt-6 h-5 w-5 text-gray-500" />
              )}
            </button>
          </div>

          <div className="flex justify-end">
            <Link
              href="/login/forgotpassword"
              className="text-black-600 text-sm hover:underline"
            >
              Forgot Password?
            </Link>
          </div>
        </>
      )}

      <button
        type="submit"
        disabled={!isFormValid || isSubmitting}
        className={`w-full rounded-md py-2 text-white transition-colors ${
          !isFormValid || isSubmitting
            ? "cursor-not-allowed bg-[#161CCA]/50"
            : "bg-[#161CCA] hover:bg-[#161CCA]/90"
        }`}
      >
        {isSubmitting
          ? "Signing in..."
          : isSignInForm
            ? "Sign In"
            : "Reset Password"}
      </button>

      {!isSignInForm && (
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
      )}
    </form>
  );
}
