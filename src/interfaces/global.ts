// import { Roles } from "./user/user";

export interface Meta {
  length: number;
  total?: number;
  page?: number;
  pageSize?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  code: number;
  message: string;
  meta?: Meta;
  count?: number;
}

export interface ApiParameters {
  search?: string;
  limit?: number;
  page?: number;
  minPrice?: number;
  maxPrice?: number;
  genderFilter?: string;
  ageGroupFilter?: string;
  categoryId?: string;
  collectionId?: string;
  coupes?: string[];
  orderByPrice?: boolean;

  [key: string]: string | number | boolean | string[] | undefined;
}

export interface ResponseType {
  success: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
  message: string;
}

export interface SelectedType {
  value: string;
  label: string;
}

export interface FilterType {
  id: string;
  name: string;
  child?: FilterType[];
  type?: string;
}

export interface AuthResponse {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  token: string;
  refreshToken: string;
}

export type snackbarState = "info" | "warning" | "error" | "success";
