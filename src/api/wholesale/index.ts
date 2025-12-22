import { ApiResponse } from "@/interfaces/global";
import WholeSale from "@/interfaces/wholesale";
import { axiosWithCredential, catchAxios } from "@/lib/axios";
import { AxiosResponse } from "axios";
import { genericGetList } from "../common";

const url = "/wholesale";
export const getList = async ({
  search,
  limit,
  page,
}: {
  search?: string;
  limit?: number;
  page?: number;
}) =>
  genericGetList<WholeSale>(url, {
    search,
    limit,
    page,
  });

export const createUpdateWholesale = async (data: WholeSale) => {
  try {
    const response: AxiosResponse<ApiResponse<WholeSale>> =
      await axiosWithCredential.put(url, data);

    if (!response.data.success)
      throw new Error(response.data.message || "An unknown error occurred");

    return response.data.data;
  } catch (error) {
    catchAxios(error);
  }
};
