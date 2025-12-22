import { Meta } from "@/interfaces/global";
import { Supplier } from "@/interfaces/supplier";
import {
  genericCreate,
  genericDelete,
  genericGetList,
  genericGetOne,
  genericUpdate,
} from "../common";

const url = "/suppliers";

export type SupplierDTO = Omit<Supplier, "id">;

export const getSuppliers = async ({
  search,
  limit = 10,
  page = 1,
}: {
  search?: string;
  limit?: number;
  page?: number;
}): Promise<{ suppliers: Supplier[]; meta?: Meta } | undefined> => {
  const result = await genericGetList<Supplier>(url, {
    search,
    limit,
    page,
  });
  if (!result) return;
  return { suppliers: result.data, meta: result.meta };
};

export const getSupplier = (id: string) => genericGetOne<Supplier>(url, id);

export const createSupplier = (data: SupplierDTO) =>
  genericCreate<SupplierDTO, Supplier>(url, data);

export const updateSupplier = (id: string, data: SupplierDTO) =>
  genericUpdate<SupplierDTO, Supplier>(url, id, data);

export const deleteSupplier = (id: string | number) => genericDelete(url, id);
