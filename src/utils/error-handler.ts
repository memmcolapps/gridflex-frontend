/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import axios, { type AxiosError } from "axios";

export interface ApiErrorResponse {
  responsecode: string;
  responsedesc: string;
}

export interface ApiError {
  message: string;
  status: number;
  error: string;
  code?: string;
}

export const handleApiError = (error: unknown): ApiError => {
  let errorMessage: string;
  let statusCode = 500;
  let errorCode: string | undefined;

  // Type assertion for axios error check
  if (axios.isAxiosError(error)) {
    // Now TS knows error is an AxiosError type
    const axiosError = error as AxiosError<ApiErrorResponse>;

    if (axiosError.response) {
      // Server responded with an error status
      const { data, status } = axiosError.response;

      statusCode = status;
      errorMessage =
        data?.responsedesc ?? `Request failed with status ${status}`;
      errorCode = data?.responsecode;

      // Map common HTTP status codes to appropriate messages
      switch (status) {
        case 400:
          errorMessage = data?.responsedesc ?? "Invalid request parameters";
          break;
        case 401:
          errorMessage = "Authentication required";
          break;
        case 403:
          errorMessage = "You do not have permission to perform this action";
          break;
        case 404:
          errorMessage = "The requested resource was not found";
          break;
        case 422:
          errorMessage = data?.responsedesc ?? "Invalid input data";
          break;
        case 503:
          errorMessage = "Service temporarily unavailable";
          break;
        default:
          if (status >= 500) {
            errorMessage = "An internal server error occurred";
          }
      }
    } else if (axiosError.request) {
      // Request was made but no response received
      errorMessage = "No response received from server";
      statusCode = 503; // Service Unavailable
      errorCode = "NETWORK_ERROR";
    } else {
      // Error occurred during request setup
      errorMessage = `Request setup failed: ${axiosError.message}`;
      statusCode = 400;
      errorCode = "REQUEST_SETUP_ERROR";
    }
  } else if (error instanceof Error) {
    // Handle standard Error objects
    errorMessage = error.message;
    errorCode = "UNKNOWN_ERROR";
  } else {
    // Handle unknown error types
    errorMessage = "An unexpected error occurred";
    errorCode = "UNKNOWN_ERROR";
  }

  // Log the error for debugging with additional context
  console.error("API Error:", {
    timestamp: new Date().toISOString(),
    message: errorMessage,
    status: statusCode,
    code: errorCode,
    originalError: error,
    stack: error instanceof Error ? error.stack : undefined,
  });

  return {
    message: errorMessage,
    status: statusCode,
    error: errorCode ?? "ERROR",
    code: errorCode,
  };
};

// Helper function for auth-specific errors
export const handleAuthError = (error: unknown): ApiError => {
  const apiError = handleApiError(error);

  // Add auth-specific error handling
  if (apiError.status === 401) {
    // Clear auth token on unauthorized
    localStorage.removeItem("auth_token");
  }

  return apiError;
};
