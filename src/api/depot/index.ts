import Depot from "@/interfaces/depot";
import {
  genericCreate,
  genericDelete,
  genericGetList,
  genericGetOne,
  genericUpdate,
} from "../common";

const url = "/Depot";

export type DepotDTO = Omit<Depot, "id" | "createdAt">;

export const getDepots = async ({
  search,
  limit,
  page,
  isSupplier,
}: {
  search?: string;
  limit?: number;
  page?: number;
  isSupplier?: boolean;
}) => {
  return genericGetList<Depot>(url, {
    search,
    limit,
    page,
    isSupplier,
  });
};

export const getDepot = (id: string) => genericGetOne<Depot>(url, id);

export const createDepot = (data: DepotDTO) =>
  genericCreate<DepotDTO, Depot>(url, data);

export const updateDepot = (id: string, data: DepotDTO) =>
  genericUpdate<DepotDTO, Depot>(url, id, data);

export const deleteDepot = (id: string | number) => genericDelete(url, id);
