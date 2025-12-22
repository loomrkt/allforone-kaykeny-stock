"use client";

import DeleteUserButton from "@/features/user/deleteUserButton";
import EditUserButton from "@/features/user/editUserButton";
import Guard from "@/guard";
import Depot from "@/interfaces/depot";
import { Role } from "@/interfaces/role&permission";
import { PERMISSIONS } from "@/interfaces/role&permission/constant";
import { User } from "@/interfaces/user/user";
import { formatDepotOption, formatRoleOption } from "@/utils";
import type { ColumnDef } from "@tanstack/react-table";

export const Columns = (
  onUserClick: (user: User) => void,
  depots: Depot[],
  roles: Role[]
): ColumnDef<User, unknown>[] => {
  const depotOption = formatDepotOption(depots || []);
  const roleOption = formatRoleOption(roles || []);
  return [
    {
      accessorKey: "firstName",
      header: "Prénom",
      cell: ({ row }) => (
        <span
          className="cursor-pointer font-medium text-blue-700 hover:text-blue-900 hover:underline"
          onClick={() => onUserClick(row.original)}
        >
          {row.original.firstName}
        </span>
      ),
    },
    {
      accessorKey: "lastName",
      header: "Nom",
      cell: ({ row }) => (
        <span
          className="cursor-pointer text-blue-700 hover:text-blue-900 hover:underline"
          onClick={() => onUserClick(row.original)}
        >
          {row.original.lastName}
        </span>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => (
        <span
          className="text-accent cursor-pointer"
          onClick={() => onUserClick(row.original)}
        >
          {row.original.email}
        </span>
      ),
    },

    {
      accessorFn: (row) => row.depotId || "-",
      header: "Depot",
      cell: ({ row }) => {
        const depotName =
          depotOption.find((depot) => depot.value === row.original.depotId)
            ?.label ||
          row.original.depotId ||
          "-";

        return (
          <span
            className="cursor-pointer text-black hover:text-purple-800 hover:underline transition-all duration-200 ease-in-out"
            onClick={() => onUserClick(row.original)}
          >
            {depotName}
          </span>
        );
      },
    },
    {
      accessorFn: (row) => row.roleId || "-",
      header: "Role",
      cell: ({ row }) => {
        const roleName =
          roleOption.find((role) => role.value === row.original.roleId)
            ?.label ||
          row.original.roleId ||
          "-";

        return (
          <span
            className="cursor-pointer text-black hover:text-purple-800 hover:underline transition-all duration-200 ease-in-out"
            onClick={() => onUserClick(row.original)}
          >
            {roleName}
          </span>
        );
      },
    },

    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Guard permission={PERMISSIONS.USER.UPDATE}>
            <EditUserButton data={row.original} />
          </Guard>
          <Guard permission={PERMISSIONS.USER.DELETE}>
            <DeleteUserButton user={row.original} />
          </Guard>
        </div>
      ),
    },
  ];
};
