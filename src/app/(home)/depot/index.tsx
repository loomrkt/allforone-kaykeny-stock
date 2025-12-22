"use client";

import { getDepots } from "@/api/depot";
import LoadingData from "@/components/common/loadingData";
import { DataTable } from "@/components/data-table";
import { Pagination } from "@/components/ui/pagination";
import type Depot from "@/interfaces/depot";
import type { ApiParameters } from "@/interfaces/global";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Columns } from "./columns";
import { DepotCardDetails } from "./depotDetailsModal";
import { GridList } from "./gridList";

function ListDepotPage() {
  const [params, setParams] = useState<ApiParameters>({
    page: 1,
    limit: 8,
    isSupplier: false,
  });
  const [selectedDepot, setSelectedDepot] = useState<Depot | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [totalPage, setTotalPage] = useState<number>(0);

  const { data: depotData, isLoading } = useQuery({
    queryKey: ["depots", { ...params, isSupplier: false }],
    queryFn: () => getDepots({ ...params, isSupplier: false }),
  });

  const handleDepotClick = useCallback((depot: Depot) => {
    setSelectedDepot(depot);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedDepot(null);
    setIsModalOpen(false);
  }, []);

  const columns = useMemo(() => Columns(handleDepotClick), [handleDepotClick]);

  useEffect(() => {
    if (depotData?.meta?.total && params.limit) {
      setTotalPage(Math.ceil(depotData.meta.total / params.limit));
    }
  }, [depotData?.meta, params.limit]);

  return (
    <div className="w-full h-auto space-y-4 p-2 pl-1 z-10">
      {isLoading ? (
        <LoadingData />
      ) : (
        <>
          <div className="hidden sm:block">
            <DataTable
              columns={columns}
              data={depotData?.data || []}
              totalPages={totalPage}
              currentPage={params.page ?? 1}
              onPageChange={(page) => {
                setParams({ ...params, page });
              }}
            />
          </div>

          <div className="block sm:hidden">
            <GridList
              data={depotData?.data || []}
              onDepotClick={handleDepotClick}
            />
            <Pagination
              totalPages={totalPage}
              currentPage={params.page ?? 1}
              onPageChange={(page) => {
                setParams({ ...params, page });
              }}
            />
          </div>
        </>
      )}

      <DepotCardDetails
        depot={selectedDepot}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}

export default ListDepotPage;
