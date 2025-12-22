/* eslint-disable @typescript-eslint/no-explicit-any */
import { refreshToken } from "@/api/user";
import Axios, { AxiosError, isAxiosError } from "axios";
import { configure } from "axios-hooks";
import { signOut } from "next-auth/react";

const axios = Axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_BASE_URL || "https://jsonplaceholder.typicode.com/",
});

export const source = Axios.CancelToken.source();
export const cancelRequest = () => source.cancel("Operation cancelled by user");

configure({ axios, defaultOptions: { manual: true } });

export const catchAxios = (error: unknown): never => {
  if (isAxiosError(error)) {
    console.error("axios error :>> ", error);
    throw new Error(error.message);
  } else {
    console.error("general error :>> ", error);
    throw new Error("An unexpected error occurred");
  }
};

export const axiosWithCredential = Axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_BASE_URL || "https://jsonplaceholder.typicode.com/",
  withCredentials: true,
});

axiosWithCredential.interceptors.request.use(
  (config) => {
    const stored = localStorage.getItem("auth-store");
    const parsed = stored ? JSON.parse(stored) : null;

    if (parsed?.state?.user?.token) {
      config.headers.Authorization = `Bearer ${parsed.state.user.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosWithCredential.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const stored = localStorage.getItem("auth-store");
    const parsed = stored ? JSON.parse(stored) : null;

    if (error?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        if (parsed?.state?.user?.refreshToken) {
          const response = await refreshToken(
            parsed?.state?.user?.refreshToken
          );
          if (!response?.refreshToken) {
            throw new Error(error?.message ?? "Erreur serveur");
          }

          localStorage.setItem(
            "auth-store",
            JSON.stringify({
              state: {
                user: response,
              },
            })
          );
          originalRequest.headers.Authorization = `Bearer ${response.token}`;
          return axiosWithCredential(originalRequest);
        }
      } catch (error) {
        localStorage.removeItem("auth-store");
        await signOut();
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

// todo : move to common services
export class AppError extends Error {
  status?: number;
  code?: string;
  details?: any;

  constructor(
    message: string,
    options?: { status?: number; code?: string; details?: any }
  ) {
    super(message);
    this.name = "AppError";
    this.status = options?.status;
    this.code = options?.code;
    this.details = options?.details;
  }
}

export function catchAndThrowAxios(error: unknown): never {
  console.log("error :>> ", error);
  if (Axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<any>;
    const status = axiosError.response?.status;
    const message =
      axiosError.response?.data?.message ||
      axiosError.message ||
      "Une erreur réseau est survenue";

    throw new AppError(message, {
      status,
      code: axiosError.code,
      details: axiosError.response?.data,
    });
  }

  // Unknown error (not Axios)
  if (error instanceof Error) {
    throw new AppError(error.message);
  }

  throw new AppError("Erreur inconnue");
}

export default axios;
