"use client";

import { getDepots } from "@/api/depot";
import { getMovementStocks } from "@/api/movement";
import { LoadingList } from "@/components/common/loadingTable";
import { DataTable } from "@/components/data-table";
import Filter, { filterType } from "@/features/movement/filter";
import { MovementCard } from "@/features/movement/movementCard";
import type { ApiParameters } from "@/interfaces/global";
import Movement from "@/interfaces/movement";
import { useColorStore } from "@/stores/color/colorStore";
import { useDepotStore } from "@/stores/depot/depotStore";
import { useSizeStore } from "@/stores/size/sizeStore";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import MoonLoader from "react-spinners/MoonLoader";
import { MvtColumns } from "./movementsColumns";
import { StockMovementDetailsDialog } from "./stockMovementDetailsModal";

interface ListStockMovementsProps {
  params: ApiParameters;
  setParams: (params: ApiParameters) => void;
  search: string;
}

function ListStockMovement({
  params,
  setParams,
  search,
}: ListStockMovementsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [totalPage, setTotalPage] = useState<number>(0);
  const [selectedMvtStock, setSelectedMvtStock] = useState<Movement | null>(
    null
  );

  const [filter, setFilter] = useState<filterType>({});

  const {
    data: stockMovementsData,
    isLoading: isLoadingStockMovements,
    refetch,
  } = useQuery({
    queryKey: ["get-movements", params, search, filter],
    queryFn: () =>
      getMovementStocks({
        ...params,
        ...filter,
        search,
      }),
  });

  const scrollRef = useRef<HTMLDivElement>(null);
  const lastScrollTop = useRef<number>(0);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      const scrollHeight = container.scrollHeight;
      const clientHeight = container.clientHeight;

      const isScrollingDown = scrollTop > lastScrollTop.current;
      const isScrollingUp = scrollTop < lastScrollTop.current;
      lastScrollTop.current = scrollTop;

      if (
        isScrollingDown &&
        params?.page &&
        scrollTop + clientHeight >= scrollHeight - 50 &&
        params.page < totalPage
      ) {
        setParams({ ...params, page: params.page + 1 });
      }

      if (isScrollingUp && params?.page && scrollTop <= 50 && params.page > 1) {
        setParams({ ...params, page: params.page - 1 });
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [params.page, totalPage, setParams, params]);

  const handleMvtStockClick = useCallback((movement: Movement) => {
    setSelectedMvtStock(movement);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedMvtStock(null);
    setIsModalOpen(false);
  }, []);

  const setDepots = useDepotStore(({ setDepots }) => setDepots);
  const colors = useColorStore(({ colors }) => colors);
  const sizes = useSizeStore(({ sizes }) => sizes);

  const { data: depots } = useQuery({
    queryKey: ["get-all-depot"],
    queryFn: () => getDepots({}),
  });

  useEffect(() => {
    if (depots?.data) setDepots(depots.data);
  }, [depots?.data, setDepots]);

  const columns = useMemo(
    () =>
      MvtColumns(
        depots?.data ?? [],
        colors ?? [],
        sizes ?? [],
        handleMvtStockClick,
        refetch
      ),
    [handleMvtStockClick, depots?.data, colors, sizes, refetch]
  );

  useEffect(() => {
    if (stockMovementsData?.meta?.total && params.limit) {
      setTotalPage(Math.ceil(stockMovementsData.meta.total / params.limit));
    }
  }, [stockMovementsData?.meta, params.limit]);

  return (
    <div className="w-full space-y-4 p-2 pl-1 z-10">
      <Filter handleFilter={setFilter} />

      <div className="flex justify-center items-center max-sm:hidden">
        {isLoadingStockMovements ? (
          <LoadingList />
        ) : (
          <DataTable
            columns={columns}
            data={(stockMovementsData?.data as Movement[]) || []}
            totalPages={totalPage}
            currentPage={params.page}
            onPageChange={(page) => {
              setParams({ ...params, page });
            }}
            className="h-[calc(100vh-22rem)] max-sm:h-auto"
            onRowClick={handleMvtStockClick}
          />
        )}
      </div>

      <div
        ref={scrollRef}
        className="hidden max-sm:block h-[calc(100vh-20rem)] overflow-y-auto"
      >
        {isLoadingStockMovements ? (
          <div className="w-full py-2 flex items-center justify-center">
            <MoonLoader size={24} />
          </div>
        ) : null}

        {stockMovementsData?.data ? (
          <div className="space-y-2">
            {stockMovementsData.data.map((movement, index) => (
              <div key={index} className="cursor-pointer">
                <MovementCard movement={movement} />
              </div>
            ))}
          </div>
        ) : null}
      </div>

      <StockMovementDetailsDialog
        stockMovement={selectedMvtStock}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}

export default ListStockMovement;
