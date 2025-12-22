"use client";

import { getColors } from "@/api/color";
import { getStocks } from "@/api/stock";
import { LoadingList } from "@/components/common/loadingTable";
import { DataTable } from "@/components/data-table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Pagination } from "@/components/ui/pagination";
import StockFilters, { StockFilter } from "@/features/stock/stockFilter";
import type { ApiParameters } from "@/interfaces/global";
import { Stock } from "@/interfaces/stock";
import { useQuery } from "@tanstack/react-query";
import { SortingState } from "@tanstack/react-table";
import { Filter } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Columns } from "./columns";
import { StockCardDetails } from "./stockDetailsModal";
import { StockGrid } from "./stockGridLIst";

type StockParams = ApiParameters & {
  orderByQuantity?: boolean;
  OrderByProductName?: boolean;
};

interface ListStockProps {
  params: StockParams;
  setParams: (params: StockParams) => void;
}

function ListStock({ params, setParams }: ListStockProps) {
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [totalPage, setTotalPage] = useState<number>(0);
  const [filter, setFilter] = useState<StockFilter>({});
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [sorting, setSorting] = useState<SortingState>([]);

  useEffect(() => {
    if (params.page !== 1) {
      setParams({
        ...params,
        page: 1,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter.depotId, params.search]);

  useEffect(() => {
    const newParams = { ...params, page: 1 };
    if (sorting?.length) {
      const { id, desc } = sorting[0];
      switch (id) {
        case "quantity":
          newParams.orderByQuantity = !desc;
          delete newParams.orderByPrice;
          delete newParams.OrderByProductName;
          break;
        case "productName":
          newParams.OrderByProductName = !desc;
          delete newParams.orderByQuantity;
          delete newParams.orderByPrice;
          break;
        case "price":
          newParams.orderByPrice = !desc;
          delete newParams.orderByQuantity;
          delete newParams.OrderByProductName;
          break;
        default:
          delete newParams.orderByPrice;
          delete newParams.orderByQuantity;
          delete newParams.OrderByProductName;
          break;
      }
    }

    setParams(newParams);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sorting]);

  const { data: stocksData, isLoading: isLoadingStocks } = useQuery({
    queryKey: ["stocks", params, filter],
    queryFn: () =>
      getStocks({
        ...params,
        search: params.search,
        ...filter,
      }),
  });

  const { data: colorData } = useQuery({
    queryKey: ["colors", params],
    queryFn: () => getColors({ ...params }),
  });

  const handleStockClick = useCallback((stock: Stock) => {
    setSelectedStock(stock);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedStock(null);
    setIsModalOpen(false);
  }, []);

  const columns = useMemo(() => Columns(handleStockClick), [handleStockClick]);

  useEffect(() => {
    if (stocksData?.meta?.total && params.limit) {
      setTotalPage(Math.ceil(stocksData.meta.total / params.limit));
    }
  }, [stocksData?.meta, params.limit]);

  const totalQuantity = useMemo(() => {
    return (
      stocksData?.data?.reduce(
        (acc, stock) => acc + (stock.quantity || 0),
        0
      ) ?? 0
    );
  }, [stocksData]);

  return (
    <div
      className="w-full space-y-4 p-2 pl-1 z-10 overflow-y-auto max-h-[80vh] sm:max-h-none"
      style={{ scrollbarWidth: "none" }}
    >
      <div className="flex gap-6">
        <div className="w-full max-w-xs hidden sm:block">
          <StockFilters {...{ setFilter, filter }} />
        </div>

        <div className="flex-1 relative">
          {isLoadingStocks ? (
            <LoadingList />
          ) : (
            <>
              <div className="hidden sm:block space-y-4">
                <DataTable
                  columns={columns}
                  data={stocksData?.data || []}
                  totalPages={totalPage}
                  currentPage={params.page ?? 1}
                  onPageChange={(page) => setParams({ ...params, page })}
                  className="h-[calc(100vh-12rem)]"
                  onRowClick={handleStockClick}
                  totalQuantity={totalQuantity}
                  sorting={sorting}
                  onSortingChange={setSorting}
                />
              </div>

              <div className="sm:hidden relative h-[calc(100vh-5rem)] flex flex-col">
                <div className="sticky -top-2 z-20 bg-white p-2 border-b shadow-sm">
                  <div className="flex items-center gap-2">
                    <Dialog
                      open={isFilterModalOpen}
                      onOpenChange={setIsFilterModalOpen}
                    >
                      <DialogTrigger asChild>
                        <button className="flex items-center gap-2 px-3 py-2 border rounded text-sm font-medium">
                          <Filter className="w-4 h-4" />
                          Filtres
                        </button>
                      </DialogTrigger>
                      <DialogContent className="bg-white border rounded-lg">
                        <DialogHeader>
                          <DialogTitle>Filtres</DialogTitle>
                        </DialogHeader>
                        <StockFilters {...{ setFilter, filter }} />
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                  <StockGrid
                    data={stocksData?.data || []}
                    loading={isLoadingStocks}
                    onClick={handleStockClick}
                    search={params.search || ""}
                  />
                </div>

                <div className="sticky bottom-2 bg-white p-2 border-t flex justify-between items-center text-sm">
                  <div className="text-gray-600">
                    Total quantité de produit :{" "}
                    <span className="font-medium">{totalQuantity}</span>
                  </div>
                  <Pagination
                    currentPage={params.page ?? 1}
                    totalPages={totalPage}
                    onPageChange={(page) => {
                      setParams({ ...params, page });
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <StockCardDetails
        stock={selectedStock}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        colors={colorData?.colors || []}
      />
    </div>
  );
}

export default ListStock;
