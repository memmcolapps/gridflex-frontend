import axios from "axios";
import { toast } from "sonner";
import { type UserInfo } from "../types/user-info";
import { handleAuthError } from "@/utils/error-handler";
import { env } from "@/env";

interface LoginResponse {
  responsecode: string;
  responsedesc: string;
  responsedata: LoginResponseData;
}

interface LoginResponseData {
  access_token: string;
  user_info: UserInfo;
}

const API_URL = env.NEXT_PUBLIC_BASE_URL;
const CUSTOM_HEADER = env.NEXT_PUBLIC_CUSTOM_HEADER;

export async function loginApi(
  email: string,
  password: string,
): Promise<LoginResponseData> {
  try {
    const formData = new FormData();
    formData.append("username", email);
    formData.append("password", password);

    const response = await axios.post<LoginResponse>(
      `${API_URL}/auth/service/admin/login`,
      formData,
      {
        headers: {
          custom: CUSTOM_HEADER,
        },
      },
    );

    // Check if the response indicates success
    if (response.data.responsecode === "000") {
      toast.success("Login successful!");
      return response.data.responsedata;
    } else {
      // If response code is not "00", treat it as an error
      throw new Error(response.data.responsedesc || "Login failed");
    }
  } catch (error: unknown) {
    const apiError = handleAuthError(error);
    // Show error notification to user
    toast.error(apiError.message);
    throw new Error(apiError.message);
  }
}
