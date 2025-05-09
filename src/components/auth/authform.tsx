"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeftIcon, EyeIcon, EyeOffIcon } from "lucide-react";

type FormType = "signin" | "resetpassword";

interface AuthFormProps {
  formType: FormType;
  onSubmit: (email: string, password: string) => void;
  initialEmail?: string;
  initialPassword?: string;
}

export function AuthForm({
  formType,
  onSubmit,
  initialEmail = "",
  initialPassword = "",
}: AuthFormProps) {
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
    } catch (_error) {
      // Error handling is done in the parent component
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-6">
      <h2 className="mb-8 text-3xl font-semibold text-gray-800">Sign In</h2>

      <div className="space-y-1.5">
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email
        </label>
        <input
          type="email"
          id="email"
          placeholder="ecmi@gridflex.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-md border border-gray-300 px-4 py-3 text-gray-800 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
          required
        />
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700"
        >
          Password
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-4 py-3 pr-10 text-gray-800 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
            required
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeIcon className="h-5 w-5" />
            ) : (
              <EyeOffIcon className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      <div className="flex justify-end">
        <Link
          href="/login/forgotpassword"
          className="text-sm text-gray-600 hover:text-blue-700 hover:underline"
        >
          Forgot Password?
        </Link>
      </div>

      <button
        type="submit"
        disabled={!isFormValid || isSubmitting}
        className={`w-full rounded-md py-3 font-medium text-white transition-colors ${
          !isFormValid || isSubmitting
            ? "cursor-not-allowed bg-blue-600/50"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {isSubmitting ? "Signing in..." : "Sign In"}
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
