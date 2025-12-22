"use client";

import { getDepots } from "@/api/depot";
import { getRoles } from "@/api/role";
import { getUsers } from "@/api/user";
import { LoadingList } from "@/components/common/loadingTable";
import SearchInput from "@/components/common/searchInput";
import { DataTable } from "@/components/data-table";
import { AddUserButton } from "@/features/user/addUserButton";
import Guard from "@/guard";
import type { ApiParameters } from "@/interfaces/global";
import { PERMISSIONS } from "@/interfaces/role&permission/constant";
import { User } from "@/interfaces/user/user";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@uidotdev/usehooks";
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";
import { Columns } from "./columns";
import { UserCardDetails } from "./userCardDetails";
import { UserGrid } from "./userGridList";

function ListUserPage() {
  const [params, setParams] = useState<ApiParameters>({ page: 1, limit: 8 });
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchParams, setSearchParams] = useState<string>("");
  const [totalPage, setTotalPage] = useState<number>(Math.ceil(0));
  const search = useDebounce(searchParams, 1000);

  const { data: depotData } = useQuery({
    queryKey: ["depots"],
    queryFn: () => getDepots({}),
  });

  const { data: userData, isLoading } = useQuery({
    queryKey: ["users", params, search],
    queryFn: () => getUsers({ ...params, search }),
  });

  const { data: roleData } = useQuery({
    queryKey: ["roles"],
    queryFn: () => getRoles({}),
  });

  const handleRowClick = useCallback((user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedUser(null);
    setIsModalOpen(false);
  }, []);

  const columns = useMemo(
    () => Columns(handleRowClick, depotData?.data || [], roleData?.data || []),
    [depotData, handleRowClick, roleData]
  );

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchParams(e.target.value);
    setParams({ ...params, page: 1 });
  };

  useEffect(() => {
    if (userData?.meta?.total && params.limit)
      setTotalPage(Math.ceil(userData.meta.total / params.limit));
  }, [userData?.meta, params.limit]);

  return (
    <div className="w-full h-auto space-y-4 px-4 sm:px-16 z-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <div className="w-full sm:w-1/3">
          <SearchInput
            placeholder="Rechercher un utilisateur..."
            value={searchParams}
            onChange={handleSearch}
            onClear={() => {
              setSearchParams("");
              setParams({ ...params, page: 1 });
            }}
          />
        </div>

        <h2 className="text-lg font-semibold text-center sm:text-left hidden sm:block flex-1">
          Listes des utilisateurs
        </h2>

        <div className="flex justify-end">
          <Guard permission={PERMISSIONS.USER.CREATE}>
            <AddUserButton />
          </Guard>
        </div>
      </div>

      {isLoading ? (
        <LoadingList />
      ) : (
        <>
          <div className="sm:block hidden">
            <DataTable
              columns={columns}
              data={userData?.data || []}
              totalPages={totalPage}
              currentPage={params.page}
              onPageChange={(page) => {
                setParams({ ...params, page });
              }}
              onRowClick={handleRowClick}
            />
          </div>

          <UserGrid
            userData={userData?.data || []}
            roleData={roleData?.data || []}
            depotData={depotData?.data || []}
            handleRowClick={handleRowClick}
            params={params}
            totalPage={totalPage}
            setParams={setParams}
          />
        </>
      )}
      <UserCardDetails
        user={selectedUser}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}

export default ListUserPage;
