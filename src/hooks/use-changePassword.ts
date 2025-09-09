import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
    generateOtp,
    changePassword,
    type GenerateOtpPayload,
    type ChangePasswordPayload,
} from "@/service/changePassword-service";

export const useGenerateOtp = () => {
    return useMutation({
        mutationFn: async (payload: GenerateOtpPayload) => {
            const response = await generateOtp(payload);
            if ("success" in response && !response.success) {
                throw new Error(response.error);
            }
            return response;
        },
        onSuccess: () => {
            toast.success("OTP sent to your email!");
        },
        onError: (error) => {
            toast.error(error.message || "Failed to generate OTP.");
        },
    });
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

export { ChangePasswordPayload, GenerateOtpPayload };