"use client";

import { getSizes } from "@/api/size";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pagination } from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { AddSizeButton } from "@/features/size/addSizeButton";
import CreateUpdateSizeForm from "@/features/size/addSizeForm";
import DeleteSizeButton from "@/features/size/deleteSizeButton";
import EditSizeButton from "@/features/size/editSizeButton";
import Guard from "@/guard";
import type { ApiParameters } from "@/interfaces/global";
import { PERMISSIONS } from "@/interfaces/role&permission/constant";
import { Size } from "@/interfaces/size";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

interface ListSizePageProps {
  search?: string;
}

function ListSizePage({ search }: ListSizePageProps) {
  const [params, setLocalParams] = useState<ApiParameters>({
    page: 1,
    limit: 8,
    search: search || "",
  });
  const [selectedSize, setSelectedSize] = useState<Size | undefined>(undefined);
  const [isMobileFormVisible, setIsMobileFormVisible] = useState(false);
  const [totalPage, setTotalPage] = useState<number>(1);

  const {
    data: sizeData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["sizes", params],
    queryFn: () => getSizes(params),
  });

  useEffect(() => {
    setLocalParams((prev) => ({ ...prev, page: 1, search: search || "" }));
  }, [search]);

  useEffect(() => {
    if (sizeData?.meta?.total && params.limit) {
      setTotalPage(Math.ceil(sizeData.meta.total / params.limit));
    }
  }, [sizeData?.meta, params]);

  const handleEditSizeMobile = (size: Size) => {
    setSelectedSize(size);
    setIsMobileFormVisible(true);
  };

  const handleAddNewSizeMobile = () => {
    setSelectedSize(undefined);
    setIsMobileFormVisible(true);
  };

  const handleCancelMobileForm = () => {
    setIsMobileFormVisible(false);
    setSelectedSize(undefined);
  };

  const renderContent = () => {
    if (error) {
      return <div>Erreur lors du chargement des tailles : {error.message}</div>;
    }

    if (isLoading || !sizeData?.data || sizeData.data.length === 0) {
      return Array.from({ length: 8 }).map((_, index) => (
        <Card key={index} className="hover:shadow-md transition-all">
          <CardHeader>
            <Skeleton className="h-6 w-3/4" />
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
            <div className="flex justify-end gap-2 mt-2">
              <Skeleton className="h-8 w-8 rounded-md" />
              <Skeleton className="h-8 w-8 rounded-md" />
            </div>
          </CardContent>
        </Card>
      ));
    }

    return sizeData.data.map((size) => (
      <Card key={size.id} className="hover:shadow-md transition-all">
        <CardHeader>
          <CardTitle>{size.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p>
            <strong>Code:</strong> {size.code}
          </p>
          <p>
            <strong>Catégorie: </strong>
            {size.category}
          </p>
          <p>
            <strong>Déscription:</strong> {size.description}
          </p>
          <div className="flex justify-end gap-2 mt-2">
            <Guard permission={PERMISSIONS.SIZE.UPDATE}>
              <EditSizeButton
                data={size}
                onClick={() => handleEditSizeMobile(size)}
              />
            </Guard>
            <Guard permission={PERMISSIONS.SIZE.DELETE}>
              <DeleteSizeButton size={size} />
            </Guard>
          </div>
        </CardContent>
      </Card>
    ));
  };

  return (
    <div
      className="w-full max-sm:h-[85vh] max-sm:overflow-y-auto h-auto p-4"
      style={{ scrollbarWidth: "none" }}
    >
      <div className="flex gap-6">
        <Guard permission={PERMISSIONS.SIZE.CREATE}>
          <div className="max-sm:hidden w-fit min-w-72 border border-gray-200 bg-white p-4 rounded-md h-fit shadow-sm space-y-4">
            <p className="font-bold text-2xl">
              {selectedSize
                ? "Modifier la taille"
                : "Ajouter une nouvelle taille"}
            </p>
            <CreateUpdateSizeForm
              size={selectedSize}
              onCancel={() => setSelectedSize(undefined)}
            />
          </div>
        </Guard>

        <div className="w-full">
          <Guard permission={PERMISSIONS.SIZE.CREATE}>
            <div className="flex justify-end items-center lg:mb-0 mb-4 sm:hidden">
              <AddSizeButton onClick={handleAddNewSizeMobile} />
            </div>
          </Guard>

          <div className="grid grid-cols-1 md:grid-cols-3 sm:overflow-y-auto lg:grid-cols-4 gap-4 pb-20">
            {renderContent()}
          </div>

          <div className="hidden sm:flex justify-end mt-6">
            <Pagination
              currentPage={params.page ?? 1}
              totalPages={totalPage}
              onPageChange={(page) => {
                setLocalParams({ ...params, page });
              }}
            />
          </div>
        </div>
      </div>

      <div className="sm:hidden fixed bottom-0 left-0 w-full bg-white p-2 border-t z-10">
        <Pagination
          currentPage={params.page ?? 1}
          totalPages={totalPage}
          onPageChange={(page) => {
            setLocalParams({ ...params, page });
          }}
        />
      </div>

      {isMobileFormVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 sm:hidden">
          <div className="bg-white rounded-md max-w-md w-full p-6 relative">
            <button
              aria-label="Fermer"
              onClick={handleCancelMobileForm}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
            >
              ✕
            </button>
            <p className="text-xl font-semibold mb-4">
              {selectedSize ? "Modifier la taille" : "Nouvelle taille"}
            </p>
            <CreateUpdateSizeForm
              size={selectedSize}
              onCancel={handleCancelMobileForm}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default ListSizePage;
