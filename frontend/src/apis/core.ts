import axios, { type Method } from "axios";
import Toast from "react-hot-toast";

// ------- BASE AXIOS INSTANCE -------
const api = axios.create({
  baseURL: "/api",
  // baseURL: "http://localhost:5001/api",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// ------- API Types -------
interface ApiResponse {
  status: boolean;
  message?: string;
  data?: any;
}
// ------- MAIN FUNCTION -------
/**
 * Handles API call and response and shows appropriate toast messages.
 * @param {Method} method
 * @param {string} url
 * @param {Object|null} body
 * @param {Object|null} config
 * @returns {Object|null} response data or null on error.
 */
export const processApiRequest = async (
  method: Method,
  url: string,
  body?: any,
  config?: any
): Promise<any> => {
  try {
    const response = await api.request<ApiResponse>({
      method,
      url,
      data: body,
      ...config,
    });

    const resData = response.data;

    // SUCCESS
    if (response?.status >= 200 && response?.status < 300 && resData?.status) {
      if (resData.message) Toast.success(String(resData.message));
      return resData ?? null;
    }

    // SERVER ERROR MESSAGE
    Toast.error(resData?.message ?? "Something went wrong");
    return null;
  } catch (error: any) {
    const status = error?.response?.status;
    const message = error?.response?.data?.message;

    switch (status) {
      case 400:
        Toast.error(message ?? "Bad request");
        break;

      case 401:
        Toast.error(message ?? "Login expired");
        break;

      case 403:
        Toast.error("Access denied");
        break;

      case 404:
        Toast.error("API not found");
        break;

      case 500:
        Toast.error("Server error");
        break;

      default:
        Toast.error("Something went wrong");
    }

    console.log(
      "ERROR: Handling API call || status:",
      status,
      "& message:",
      message
    );
    return null;
  }
};
