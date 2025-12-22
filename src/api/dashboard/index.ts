import { ApiResponse } from "@/interfaces/global";
import { axiosWithCredential, catchAxios } from "@/lib/axios";
import { AxiosResponse } from "axios";
import { genericGetList } from "../common";

export const url = "/dashboard";

export const getStatInfo = async ({
  depotId,
}: {
  depotId?: string;
}): Promise<
  | {
      totalProducts: number;
      totalStock: number;
      stockValue: number;
      outOfStockCount: number;
    }
  | undefined
> => {
  try {
    const response: AxiosResponse<
      ApiResponse<{
        totalProducts: number;
        totalStock: number;
        stockValue: number;
        outOfStockCount: number;
      }>
    > = await axiosWithCredential.get(url, {
      params: { depotId },
    });

    if (!response.data.success)
      throw new Error(response.data.message || "An error occurred");

    return response.data.data;
  } catch (error) {
    catchAxios(error);
  }
};

export type MovementDashboardHistory = {
  date: string;
  inbound: number;
  outbound: number;
};

export type MovementDashboardHistoryFilter = {
  startDate?: Date;
  endDate?: Date;
  depotId?: string;
  categoryId?: string;
  collectionId?: string;
  productId?: string;
};
export const getDashboardHistory = async (
  filter: MovementDashboardHistoryFilter
) => {
  return genericGetList<MovementDashboardHistory>(`${url}/stat`, {
    ...filter,
  });
};
