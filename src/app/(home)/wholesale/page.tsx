"use client";

import { getList } from "@/api/wholesale";
import { LoadingList } from "@/components/common/loadingTable";
import { DataTable } from "@/components/data-table";
import Guard from "@/guard";
import type { ApiParameters } from "@/interfaces/global";
import { PERMISSIONS } from "@/interfaces/role&permission/constant";
import WholeSale from "@/interfaces/wholesale";
import { useProductStore } from "@/stores/product/productStore";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";
import MoonLoader from "react-spinners/MoonLoader";
import { AddWholesaleButton } from "./addWholesaleButton";
import { Columns } from "./columns";
import WholesaleCard from "./wholesaleCard";
import WholesaleDetailModal from "./wholesaleDetail";

function ListWholesalePage() {
  const [params, setParams] = useState<ApiParameters>({ page: 1, limit: 8 });
  const [selectedWholesale, setSelectedWholesale] = useState<WholeSale | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [totalPage, setTotalPage] = useState<number>(Math.ceil(0));

  const { data: wholeSale, isLoading } = useQuery({
    queryKey: ["get-wholesale"],
    queryFn: () => getList({}),
    refetchOnWindowFocus: false,
    refetchInterval: false,
  });
  const products = useProductStore(({ products }) => products);

  const handleRowClick = useCallback((data: WholeSale) => {
    setSelectedWholesale(data);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedWholesale(null);
    setIsModalOpen(false);
  }, []);

  // scroll logique pour mobile
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

      // Scroll down
      if (
        isScrollingDown &&
        params?.page &&
        scrollTop + clientHeight >= scrollHeight - 50 &&
        params.page < totalPage
      ) {
        setParams({ ...params, page: params.page + 1 });
      }

      // Scroll top
      if (isScrollingUp && params?.page && scrollTop <= 50 && params.page > 1) {
        setParams({ ...params, page: params.page - 1 });
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [params.page, totalPage, setParams, params]);

  useEffect(() => {
    if (wholeSale?.meta?.total && params.limit)
      setTotalPage(Math.ceil(wholeSale.meta.total / params.limit));
  }, [wholeSale?.meta, params.limit]);

  return (
    <>
      <div className="w-full h-auto space-y-4 px-4 sm:px-16 z-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold hidden sm:block">
            Listes des prix de gros
          </h2>
          <div className="flex justify-end items-center">
            <Guard permission={PERMISSIONS.USER.CREATE}>
              <AddWholesaleButton />
            </Guard>
          </div>
        </div>

        <div className="max-sm:hidden">
          {isLoading ? (
            <LoadingList />
          ) : (
            <div className="sm:block hidden">
              <DataTable
                columns={Columns(products ?? [])}
                data={wholeSale?.data || []}
                totalPages={totalPage}
                currentPage={params.page}
                onPageChange={(page) => {
                  setParams({ ...params, page });
                }}
                onRowClick={handleRowClick}
              />
            </div>
          )}
          <WholesaleDetailModal
            open={isModalOpen}
            onClose={handleCloseModal}
            data={selectedWholesale}
          />
        </div>
      </div>

      <div
        ref={scrollRef}
        className="hidden max-sm:block h-[calc(100vh-16rem)] overflow-y-auto"
      >
        {isLoading ? (
          <div className="w-full py-2 flex items-center justify-center">
            <MoonLoader size={24} />
          </div>
        ) : null}

        {wholeSale?.data ? (
          <div className="space-y-2">
            {wholeSale.data.map((wholesale, index) => (
              <WholesaleCard key={index} data={wholesale} />
            ))}
          </div>
        ) : null}
      </div>
    </>
  );
}

export default ListWholesalePage;
