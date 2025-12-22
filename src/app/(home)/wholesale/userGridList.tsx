"use client";

import { Pagination } from "@/components/ui/pagination";
import DeleteUserButton from "@/features/user/deleteUserButton";
import EditUserButton from "@/features/user/editUserButton";
import type { ApiParameters } from "@/interfaces/global";
import type { User } from "@/interfaces/user/user";

interface UserGridProps {
  userData: User[];
  roleData: { id: string; name: string }[];
  depotData: { id: string; name: string }[];
  handleRowClick: (user: User) => void;
  params: ApiParameters;
  totalPage: number;
  setParams: (params: ApiParameters) => void;
}

export function UserGrid({
  userData,
  roleData,
  depotData,
  handleRowClick,
  params,
  totalPage,
  setParams,
}: UserGridProps) {
  return (
    <div className="sm:hidden block space-y-4 px-4">
      {userData.map((user: User) => (
        <div
          key={user.id}
          role="button"
          tabIndex={0}
          className="bg-white shadow-lg rounded-xl p-4 border border-gray-100 cursor-pointer hover:shadow-xl hover:bg-gray-50 transition-shadow duration-200"
          onClick={() => handleRowClick(user)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              handleRowClick(user);
            }
          }}
        >
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-semibold">
              {user.firstName?.charAt(0) || "U"}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-base font-semibold text-gray-800">
                    {user.firstName} {user.lastName}
                  </h3>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">
                    Role:{" "}
                    {roleData.find((role) => role.id === user.roleId)?.name ||
                      "N/A"}
                  </p>
                  <p className="text-xs text-gray-500">
                    Depot:{" "}
                    {depotData.find((depot) => depot.id === user.depotId)
                      ?.name || "N/A"}
                  </p>
                </div>
              </div>
              <div className="mt-2 flex items-center">
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    user.isDeleted
                      ? "bg-red-100 text-red-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {user.isDeleted ? "Inactive" : "Active"}
                </span>
              </div>
            </div>
          </div>
          <div className="flex justify-end mt-4 space-x-2">
            <EditUserButton data={user} />

            <DeleteUserButton user={user} />
          </div>
        </div>
      ))}
      <div className="mt-6 flex justify-center">
        <Pagination
          currentPage={params.page ?? 1}
          totalPages={totalPage}
          onPageChange={(page) => setParams({ ...params, page })}
          className="flex items-center gap-2"
        />
      </div>
    </div>
  );
}
