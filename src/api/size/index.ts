import { Size } from "@/interfaces/size";
import { axiosWithCredential } from "@/lib/axios";
import { genericDelete, genericGetList, genericGetOne } from "../common";

const url = "/Size";

export type SizeDTO = Omit<Size, "id" | "createdAt">;

export const getSizes = async ({
  search,
  limit,
  page,
}: {
  search?: string;
  limit?: number;
  page?: number;
}) => {
  return genericGetList<Size>(url, {
    search,
    limit,
    page,
  });
};

export const getSize = (id: string) => genericGetOne<Size>(url, id);

export const createSize = async (data: SizeDTO) => {
  const formData = new FormData();
  formData.append("name", data.name);
  formData.append("code", data.code);
  formData.append("category", data.category);
  formData.append("description", data.description);

  const response = await axiosWithCredential.post(url, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const updateSize = async (id: string, data: SizeDTO) => {
  const formData = new FormData();
  formData.append("name", data.name);
  formData.append("code", data.code);
  formData.append("category", data.category);
  formData.append("description", data.description);

  const response = await axiosWithCredential.put(`${url}/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const deleteSize = (id: string | number) => genericDelete(url, id);
