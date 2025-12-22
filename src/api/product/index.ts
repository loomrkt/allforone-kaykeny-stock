import { Media } from "@/interfaces/common";
import { Product } from "@/interfaces/product";
import {
  genericCreate,
  genericDelete,
  genericGetList,
  genericGetOne,
  genericUpdate,
} from "../common";

const url = "/Product";

export type ProductDTO = Omit<
  Product,
  "id" | "name" | "reference" | "images"
> & {
  images?: File[];
};

export type UpdateProductDTO = Omit<Product, "id" | "name" | "reference"> & {
  images?: Media[];
  newImages?: File[];
};

export const getProducts = async (params: {
  search?: string;
  limit?: number;
  page?: number;
  orderByPrice?: boolean;
  minPrice?: number;
  maxPrice?: number;
  categoryId?: string;
  collectionId?: string;
  genderFilter?: string;
  ageGroupFilter?: string;
  getBaseInfo?: boolean;
}) => {
  return genericGetList<Product>(url, { ...params });
};

export const getProduct = (id: string) => genericGetOne<Product>(url, id);

export const createProduct = (data: ProductDTO) => {
  const formData = new FormData();

  if (data.coupe) formData.append("coupe", data.coupe);
  formData.append("gender", data.gender);
  formData.append("price", data.price.toString());
  formData.append("transferPrice", data.transferPrice.toString());
  formData.append("categoryId", data.categoryId);
  formData.append("collectionId", data.collectionId || "");

  if (data.images)
    data.images.forEach((file) => {
      formData.append("images", file);
    });

  return genericCreate<FormData, Product>(url, formData);
};

export const updateProduct = (id: string, data: UpdateProductDTO) => {
  const formData = new FormData();

  if (data.coupe) formData.append("coupe", data.coupe);
  formData.append("gender", data.gender);
  formData.append("price", data.price.toString());
  formData.append("transferPrice", data.transferPrice.toString());
  formData.append("categoryId", data.categoryId);
  formData.append("collectionId", data.collectionId || "");

  if (data.newImages)
    data.newImages.forEach((file) => {
      formData.append("newImages", file);
    });

  return genericUpdate<FormData, Product>(url, id, formData);
};

export const deleteProduct = (id: string | number) => genericDelete(url, id);
