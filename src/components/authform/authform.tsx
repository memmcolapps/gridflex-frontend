import { useState } from 'react';
import Link from 'next/link';
import { EyeIcon, EyeSlashIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

type FormType = 'signin' | 'resetpassword';

interface ReusableFormProps {
    formType: FormType;
    onSubmit: (e: React.FormEvent) => void;
    initialEmail?: string;
    initialPassword?: string;
}

export function AuthhForm({ formType, onSubmit, initialEmail = '', initialPassword = '' }: ReusableFormProps) {
    const [email, setEmail] = useState(initialEmail);
    const [password, setPassword] = useState(initialPassword);
    const [showPassword, setShowPassword] = useState(false);

    const isSignInForm = formType === 'signin';
    const isFormValid = isSignInForm
        ? email.trim() !== '' && password.trim() !== ''
        : email.trim() !== '';

    const togglePasswordVisibility = () => setShowPassword(!showPassword);

    return (
        <form
            onSubmit={onSubmit}
            className="space-y-4 p-4 rounded-lg flex flex-col align-center"
        >
            <h2 className="text-xl font-normal text-gray-800 mb-6 text-center">
                {isSignInForm ? 'Sign In' : 'Reset Password'}
            </h2>

            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                </label>
                <input
                    type="email"
                    id="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                />
            </div>

            {isSignInForm && (
                <>
                    <div className="relative">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
                            required
                        />
                        <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="absolute inset-y-0 right-0 flex items-center pr-3"
                            aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                            {showPassword ? (
                                <EyeIcon className="h-5 w-5 text-gray-500 mt-6" />

                            ) : (
                                <EyeSlashIcon className="h-5 w-5 text-gray-500 mt-6" />
                            )}
                        </button>
                    </div>

                    <div className="flex justify-end">
                        <Link href="/login/forgotpassword" className="text-sm text-black-600 hover:underline">
                            Forgot Password?
                        </Link>
                    </div>
                </>
            )}

            <button
                type="submit"
                disabled={!isFormValid}
                className={`w-full py-2 rounded-md text-white transition-colors ${!isFormValid
                        ? "bg-[#161CCA]/50 cursor-not-allowed"
                        : "bg-[#161CCA] hover:bg-[#161CCA]/90"
                    }`}
            >
                {isSignInForm ? 'Sign In' : 'Reset Password'}
            </button>

            {!isSignInForm && (
                <div className="flex justify-center">
                    <Link
                        href="/login"
                        className="flex items-center space-x-1 px-2 py-1.5 text-gray-700 bg-transparent rounded focus:outline-none"
                    >
                        <ArrowLeftIcon className="h-4 w-5 text-[#161CCA]" aria-hidden="true" />
                        <span>Back to Login</span>
                    </Link>
                </div>
            )}
        </form>
    );
};
