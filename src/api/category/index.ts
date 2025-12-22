import { Category } from "@/interfaces/category";
import {
  genericCreate,
  genericDelete,
  genericGetList,
  genericGetOne,
  genericUpdate,
} from "../common";

const url = "/Category";

export type CategoryDTO = Omit<Category, "id">;

export const getCategories = async ({
  search,
  limit,
  page,
}: {
  search?: string;
  limit?: number;
  page?: number;
}) => {
  return genericGetList<Category>(url, {
    search,
    limit,
    page,
  });
};

export const getCategory = (id: string) => genericGetOne<Category>(url, id);

export const createCategory = (data: CategoryDTO) =>
  genericCreate<CategoryDTO, Category>(url, data);

export const updateCategory = (id: string, data: CategoryDTO) =>
  genericUpdate<CategoryDTO, Category>(url, id, data);

export const deleteCategory = (id: string | number) => genericDelete(url, id);
