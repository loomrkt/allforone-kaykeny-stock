import { Color } from "@/interfaces/color";
import { Meta } from "@/interfaces/global";
import {
  genericCreate,
  genericDelete,
  genericGetList,
  genericGetOne,
  genericUpdate,
} from "../common";

const url = "/Color";

export type ColorDTO = Omit<Color, "id">;

export const getColors = async ({
  search,
  limit,
  page,
}: {
  search?: string;
  limit?: number;
  page?: number;
}): Promise<{ colors: Color[]; meta?: Meta } | undefined> => {
  const result = await genericGetList<Color>(url, {
    search,
    limit,
    page,
  });
  if (!result) return;
  return { colors: result.data, meta: result.meta };
};

export const getAllColors = async () => genericGetList<Color>(url);

export const getColor = (id: string) => genericGetOne<Color>(url, id);

export const createColor = (data: ColorDTO) =>
  genericCreate<ColorDTO, Color>(url, data);

export const updateColor = (id: string, data: ColorDTO) =>
  genericUpdate<ColorDTO, Color>(url, id, data);

export const deleteColor = (id: string | number) => genericDelete(url, id);
