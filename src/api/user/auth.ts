import { ApiResponse, AuthResponse } from "@/interfaces/global";
import { User } from "@/interfaces/user/user";
import axios, { catchAxios } from "@/lib/axios";
import { AxiosResponse } from "axios";

export type userDTO = Omit<User, "id" | "token">;
const url = "Authentication";

export async function login({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<AuthResponse | undefined> {
  try {
    const response: AxiosResponse<ApiResponse<AuthResponse>> = await axios.post(
      `${url}/login`,
      { email, password }
    );

    if (!response.data.data) throw new Error(response.data.message);
    return response.data.data;
  } catch (error) {
    catchAxios(error);
  }
}

export async function refreshToken(refresh: string) {
  try {
    const response: AxiosResponse<
      ApiResponse<{
        mail: string;
        userRole: number;
        token: string;
        refreshToken: string;
      }>
    > = await axios.post(`${url}/refresh`, refresh);

    if (!response.data.data) throw new Error(response.data.message);
    return response.data.data;
  } catch (error) {
    catchAxios(error);
  }
}

export async function forgotPassword(email: string) {
  try {
    const response: AxiosResponse = await axios.post(`${url}/forgot-password`, {
      email,
    });

    if (response.status !== 200) {
      throw new Error(response.data ?? "an error occurred");
    }

    return response;
  } catch (error) {
    catchAxios(error);
  }
}

export async function verifyOtp({
  email,
  code,
}: {
  email: string;
  code: string;
}) {
  try {
    const response: AxiosResponse = await axios.post(
      `/${url}/validation-code`,
      {
        email,
        code: parseInt(code),
      }
    );

    if (response.status !== 200) {
      throw new Error(response.data ?? "an error occurred");
    }

    return response;
  } catch (error) {
    catchAxios(error);
  }
}

export async function resetPassword({
  email,
  code,
  password,
  confirmPassword,
}: {
  email: string;
  code: string;
  password: string;
  confirmPassword: string;
}) {
  try {
    const response = await axios.post(`/${url}/reset-password`, {
      email,
      code,
      confirmPassword,
      password,
    });

    if (response.status !== 200) {
      throw new Error(response.data ?? "an error occurred");
    }

    return response;
  } catch (error) {
    catchAxios(error);
  }
}
