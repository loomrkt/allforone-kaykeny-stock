"use client";

import { getDiscounts } from "@/api/discount";
import { getProducts } from "@/api/product";
import { LoadingList } from "@/components/common/loadingTable";
import SearchInput from "@/components/common/searchInput";
import { DataTable } from "@/components/data-table";
import { Pagination } from "@/components/ui/pagination";
import { AddDiscountButton } from "@/features/discount/addDiscountButton";
import { Discount } from "@/interfaces/discount";
import type { ApiParameters } from "@/interfaces/global";
import { useQuery } from "@tanstack/react-query";
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";
import { Columns } from "./columns";
import { DiscountCard } from "./discountCardList";
import { DiscountCardDetails } from "./discounttDetailsModal";

function ListDiscountPage() {
  const [params, setParams] = useState<ApiParameters>({ page: 1, limit: 20 });
  const [selectedDiscount, setSelectedDiscount] = useState<Discount | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchParams, setSearchParams] = useState<string>("");
  const [totalPage, setTotalPage] = useState<number>(0);

  const { data: discountData, isLoading } = useQuery({
    queryKey: ["get-discounts", params, searchParams],
    queryFn: () => getDiscounts({ ...params, search: searchParams }),
    refetchOnWindowFocus: false,
    refetchInterval: false,
  });

  const { data: productsData } = useQuery({
    queryKey: ["get-all-product"],
    queryFn: () => getProducts({ getBaseInfo: true }),
  });

  const handleDiscountClick = useCallback((discount: Discount) => {
    setSelectedDiscount(discount);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = () => {
    setSelectedDiscount(null);
    setIsModalOpen(false);
  };

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchParams(value);
    setParams((prev) => ({ ...prev, page: 1 }));
  };

  const columns = useMemo(
    () => Columns(productsData?.data || []),
    [productsData?.data]
  );

  useEffect(() => {
    if (discountData?.meta?.total && params.limit) {
      setTotalPage(Math.ceil(discountData.meta.total / params.limit));
    }
  }, [discountData?.meta, params.limit]);

  return (
    <div className="w-full h-auto px-6 z-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
        <h2 className="text-lg font-semibold text-center sm:text-left">
          Listes des promotions
        </h2>
        <div className="flex justify-between items-center gap-2 sm:gap-4 sm:flex-col-reverse w-full sm:w-auto">
          <SearchInput
            className="flex-1"
            placeholder="Rechercher une promotion..."
            value={searchParams}
            onChange={handleSearch}
            onClear={() => {
              setSearchParams("");
              setParams((prev) => ({ ...prev, page: 1 }));
            }}
          />
          <AddDiscountButton />
        </div>
      </div>

      {isLoading ? (
        <LoadingList />
      ) : (
        <>
          {discountData?.discounts && productsData?.data && (
            <div className="sm:hidden">
              <div
                className="flex flex-col gap-4 h-[calc(100vh-25rem)] overflow-y-auto"
                style={{
                  scrollbarWidth: "none",
                }}
              >
                {discountData.discounts.map((discount) => (
                  <DiscountCard
                    key={discount.id}
                    discount={discount}
                    onClick={handleDiscountClick}
                    productsData={productsData.data}
                  />
                ))}
              </div>

              <div className="mt-4 flex justify-center">
                <Pagination
                  currentPage={params.page ?? 1}
                  totalPages={totalPage}
                  onPageChange={(page) =>
                    setParams((prev) => ({ ...prev, page }))
                  }
                />
              </div>
            </div>
          )}

          <div className="hidden sm:block">
            <DataTable
              columns={columns}
              data={discountData?.discounts || []}
              totalPages={totalPage}
              currentPage={params.page}
              onPageChange={(page) => setParams((prev) => ({ ...prev, page }))}
              className="h-[calc(100vh-10rem)]"
              onRowClick={handleDiscountClick}
            />
          </div>
        </>
      )}

      <DiscountCardDetails
        discount={selectedDiscount}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}

export default ListDiscountPage;
