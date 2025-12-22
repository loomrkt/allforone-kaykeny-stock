import Collection from "@/interfaces/collection";
import {
  genericCreate,
  genericDelete,
  genericGetList,
  genericGetOne,
  genericUpdate,
} from "../common";

const url = "/Collection";

// ✅ Type utilisé pour la création
export type CollectionDTO = Omit<Collection, "id"> & {
  image?: File;
};

// ✅ Type utilisé pour la mise à jour (même structure que pour la création)
export type UpdateCollectionDTO = Omit<Collection, "id"> & {
  image?: File;
};

export const getCollections = (params?: {
  search?: string;
  limit?: number;
  page?: number;
}) => {
  return genericGetList<Collection>(url, params);
};

export const getCollection = (id: string) => genericGetOne<Collection>(url, id);

export const createCollection = (data: CollectionDTO) => {
  const formData = new FormData();

  formData.append("name", data.name);
  formData.append("code", data.code);
  if (data.description) formData.append("description", data.description);
  if (data.image) formData.append("image", data.image);
  if (data.imageName) formData.append("imageName", data.imageName);
  if (data.imageUrl) formData.append("imageUrl", data.imageUrl);

  return genericCreate<FormData, Collection>(url, formData);
};

export const updateCollection = (id: string, data: UpdateCollectionDTO) => {
  const formData = new FormData();

  formData.append("name", data.name);
  formData.append("code", data.code);
  if (data.description) formData.append("description", data.description);
  if (data.imageName) formData.append("imageName", data.imageName);
  if (data.imageUrl) formData.append("imageUrl", data.imageUrl);
  if (data.image) formData.append("image", data.image); // ✅ image correct ici

  return genericUpdate<FormData, Collection>(url, id, formData);
};

export const deleteCollection = (id: string | number) => genericDelete(url, id);
