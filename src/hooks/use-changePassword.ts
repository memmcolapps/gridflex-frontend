// hooks/use-changePassword.ts

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useState, useRef, useEffect, useCallback } from "react";
import {
    generateOtp,
    changePassword,
    type GenerateOtpPayload,
    type ChangePasswordPayload,
} from "@/service/changePassword-service";

// Define the custom timer hook inside this file
const useCountdown = (initialTime: number) => {
    const [timeLeft, setTimeLeft] = useState(initialTime);
    const [isRunning, setIsRunning] = useState(false);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const startCountdown = useCallback(() => {
        if (intervalRef.current !== null) return;
        setIsRunning(true);
        setTimeLeft(initialTime);
        intervalRef.current = setInterval(() => {
            setTimeLeft((prevTime) => {
                if (prevTime <= 1) {
                    clearInterval(intervalRef.current!);
                    setIsRunning(false);
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);
    }, [initialTime]);

    const stopCountdown = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        setIsRunning(false);
    }, []);

    const resetCountdown = useCallback(() => {
        stopCountdown();
        setTimeLeft(initialTime);
    }, [initialTime, stopCountdown]);

    useEffect(() => {
        return () => {
            stopCountdown();
        };
    }, [stopCountdown]);

    return { timeLeft, isRunning, startCountdown, stopCountdown, resetCountdown };
};

export const useGenerateOtp = () => {
    const countdown = useCountdown(60);

    const mutation = useMutation({
        mutationFn: async (payload: GenerateOtpPayload) => {
            const response = await generateOtp(payload);
            if ("success" in response && !response.success) {
                throw new Error(response.error);
            }
            return response;
        },
        onSuccess: () => {
            countdown.startCountdown();
            toast.success("OTP sent to your email!");
        },
        onError: (error) => {
            countdown.stopCountdown();
            toast.error(error.message || "Failed to generate OTP.");
        },
    });

    return {
        ...mutation,
        timeLeft: countdown.timeLeft,
        isRunning: countdown.isRunning,
    };
};

export const useChangePassword = () => {
    return useMutation({
        mutationFn: async (payload: ChangePasswordPayload) => {
            const response = await changePassword(payload);
            if ("success" in response && !response.success) {
                throw new Error(response.error);
            }
            return response;
        },
        onSuccess: () => {
            toast.success("Password changed successfully!");
        },
        onError: (error) => {
            toast.error(error.message || "Failed to change password.");
        },
    });
};

export { ChangePasswordPayload, GenerateOtpPayload, useCountdown };