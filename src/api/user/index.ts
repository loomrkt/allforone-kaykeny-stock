import { ApiResponse, AuthResponse } from "@/interfaces/global";
import { User } from "@/interfaces/user/user";
import axios, { axiosWithCredential, catchAxios } from "@/lib/axios";

import { AxiosResponse } from "axios";
import {
  genericCreate,
  genericDelete,
  genericGetList,
  genericGetOne,
  genericUpdate,
} from "../common";
import api from "../index";

const baseUrl = "/User";

export type UserDTO = Omit<User, "id" | "token">;
export interface UpdatePasswordDTO {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

const handleResponse = <T>(response: ApiResponse<T>): T | null => {
  if (!response.success || !response.data) {
    throw new Error(response.message || "An unknown error occurred");
  }
  return response.data;
};

export async function login({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<AuthResponse | undefined> {
  try {
    const response: AxiosResponse<ApiResponse<AuthResponse>> = await axios.post(
      `authentication/login`,
      { email, password }
    );

    if (!response.data.data) throw new Error(response.data.message);
    return response.data.data;
  } catch (error) {
    catchAxios(error);
  }
}

// export async function login({
//   email,
//   password,
// }: {
//   email: string;
//   password: string;
// }): Promise<AuthResponse | null> {
//   try {
//     const response = await axios.post<ApiResponse<AuthResponse>>(
//       "authentication/login",
//       {
//         email,
//         password,
//       }
//     );
//     return handleResponse(response.data);
//   } catch (error) {
//     catchAxios(error);
//     return null;
//   }
// }

export const auth = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<User | null> => {
  try {
    const response = await axiosWithCredential.post<ApiResponse<User>>(
      `${api.user.auth}`,
      { email, password }
    );
    return handleResponse(response.data);
  } catch (error) {
    catchAxios(error);
    return null;
  }
};

export async function refreshToken(
  refreshToken: string
): Promise<AuthResponse | undefined> {
  try {
    const response = await axios.post<ApiResponse<AuthResponse>>(
      "authentication/Refresh",
      {
        refreshToken,
      }
    );
    if (!response.data.data) throw new Error(response.data.message);
    return response.data.data;
  } catch (error) {
    catchAxios(error);
  }
}

export const getOne = (id: string | number) =>
  genericGetOne<User>(baseUrl, String(id)) ?? null;

export const getByEmail = async (email: string): Promise<User | null> => {
  try {
    const response = await axios.get<ApiResponse<User>>(api.user.email, {
      params: { email },
    });
    return handleResponse(response.data);
  } catch (error) {
    catchAxios(error);
    return null;
  }
};

export const getList = async ({
  search,
  limit,
  page,
}: {
  search?: string;
  limit?: number;
  page?: number;
}) =>
  genericGetList<User>("user", {
    search,
    limit,
    page,
  });

export const getUsers = async ({
  search,
  limit,
  page,
}: {
  search?: string;
  limit?: number;
  page?: number;
}) => {
  return genericGetList<User>(baseUrl, {
    search,
    limit,
    page,
  });
};
export const createUser = (newUser: UserDTO) =>
  genericCreate<UserDTO, User>(baseUrl, newUser);

export type UpdateUserDTO = Omit<UserDTO, "password" | "email">;
export const updateUser = (id: string, newUser: UpdateUserDTO) =>
  genericUpdate<UpdateUserDTO, User>(baseUrl, id, newUser);

export const updateUserPassword = async (
  data: UpdatePasswordDTO
): Promise<boolean> => {
  try {
    const response = await axiosWithCredential.put<ApiResponse<null>>(
      "/User/ModifyPassword",
      data
    );
    handleResponse(response.data);
    return true;
  } catch (error) {
    catchAxios(error);
    return false;
  }
};

export const deleteUser = (id: string | number) => genericDelete(baseUrl, id);
