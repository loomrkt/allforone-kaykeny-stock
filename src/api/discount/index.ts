import { Discount } from "@/interfaces/discount";
import { Meta } from "@/interfaces/global";
import {
  genericCreate,
  genericDelete,
  genericGetList,
  genericGetOne,
  genericUpdate,
} from "../common";

const url = "/Discount";

export type DiscountDTO = Omit<Discount, "id">;

export const getDiscounts = async ({
  search,
  limit,
  page,
}: {
  search?: string;
  limit?: number;
  page?: number;
}): Promise<{ discounts: Discount[]; meta?: Meta } | undefined> => {
  const result = await genericGetList<Discount>(url, {
    search,
    limit,
    page,
  });
  if (!result) return;
  return { discounts: result.data, meta: result.meta };
};

export const getDiscount = (id: string) => genericGetOne<Discount>(url, id);

export const createDiscount = (data: DiscountDTO) =>
  genericCreate<DiscountDTO, Discount>(url, data);

export const updateDiscount = (id: string, data: DiscountDTO) =>
  genericUpdate<DiscountDTO, Discount>(url, id, data);

export const deleteDiscount = (id: string | number) => genericDelete(url, id);
