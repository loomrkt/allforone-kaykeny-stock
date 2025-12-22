import { Permission, Role } from "@/interfaces/role&permission";
import {
  DefaultSearchParams,
  genericCreate,
  genericGetList,
  genericGetOne,
} from "../common";

export const roleUrl = "role";
export const permissionUrl = "permission";

export type roleDTO = Omit<Role, "id">;
export const getRoles = async (params: DefaultSearchParams) =>
  genericGetList<Role>(roleUrl, { ...params });

export const getRole = async (id: string) => genericGetOne<Role>(roleUrl, id);

export const createRole = async (newRole: roleDTO) =>
  genericCreate<roleDTO, Role>(roleUrl, newRole);

// permissions
export const getPermissions = async (params: DefaultSearchParams) =>
  genericGetList<Permission>(permissionUrl, { ...params });

// role-permission
export type addPermissionRoleDTO = { roleId: string; permissionIds: string[] };
export const addPermissionRole = async ({
  roleId,
  permissionIds,
}: addPermissionRoleDTO) =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  genericCreate<string[], any>(`role/${roleId}/permissions`, permissionIds);
