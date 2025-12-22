import { Role } from "@/interfaces/role&permission";
import {
  genericCreate,
  genericDelete,
  genericGetList,
  genericGetOne,
  genericUpdate,
} from "../common";

const url = "/Role";

export type RoleDTO = Omit<Role, "id">;

export const getRoles = async ({
  search,
  limit,
  page,
}: {
  search?: string;
  limit?: number;
  page?: number;
}) => {
  return genericGetList<Role>(url, { search, limit, page });
};

export const getRole = (id: string) => genericGetOne<Role>(url, id);

export const createRole = (data: RoleDTO) =>
  genericCreate<RoleDTO, Role>(url, data);

export const updateRole = (id: string, data: RoleDTO) =>
  genericUpdate<RoleDTO, Role>(url, id, data);

export const deleteRole = (id: string | number) => genericDelete(url, id);
