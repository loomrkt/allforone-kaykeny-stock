"use client";

import { getCollections } from "@/api/collection";
import { DataTable } from "@/components/common/dataTable";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { AddCollectionButton } from "@/features/collection/addCollectionButton";
import CreateUpdateCollectionForm from "@/features/collection/addCollectionForm";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import Collection from "@/interfaces/collection";
import { ApiParameters } from "@/interfaces/global";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";
import CollectionDetail from "./collectionDetails";
import { Columns } from "./columns";

export default function ListCollection() {
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

  const handleCollectionClick = useCallback((collection: Collection) => {
    setSelectedCollection(collection);
    setIsDetailDialogOpen(true);
  }, []);

  const [params, setParams] = useState<ApiParameters>({ page: 1, limit: 8 });
  const [selectedCollection, setSelectedCollection] =
    useState<Collection | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);

  const isMobile = useMediaQuery("(max-width: 1024px)");

  const { data: collectionData, isLoading } = useQuery({
    queryKey: ["collections", params],
    queryFn: () => getCollections(params),
  });

  const handleAddNewCollection = () => {
    setSelectedCollection(null);
    setIsFormVisible(true);
  };

  const handleFormCancel = () => {
    setIsFormVisible(false);
    setSelectedCollection(null);
  };

  const columns = useMemo(
    () => Columns(handleCollectionClick),
    [handleCollectionClick]
  );

  const renderTableContent = () => {
    if (
      isLoading ||
      !collectionData?.meta ||
      collectionData.meta.length === 0
    ) {
      const skeletonRows: Collection[] = Array.from({ length: 8 }).map(
        (_, index) => ({
          id: `skeleton-${index}`,
          name: "",
          code: "",
          description: "",
          imageUrl: "",
          imageName: "",
        })
      );
      return skeletonRows;
    }

    return collectionData.data;
  };

  return (
    <div className="grid grid-cols-5 gap-6 p-4">
      {!isMobile && (
        <div className="w-full col-span-1 border border-gray-200 bg-white p-4 rounded-md h-fit shadow-sm space-y-4">
          <p className="font-bold text-2xl">
            {selectedCollection
              ? "Modifier le model"
              : "Ajouter un nouveau model"}
          </p>

          <CreateUpdateCollectionForm
            collection={selectedCollection || undefined}
            onCancel={handleFormCancel}
          />
        </div>
      )}

      <div className="w-full col-span-5 lg:col-span-4">
        <div className="flex justify-end items-center lg:mb-0 mb-4">
          {isMobile && <AddCollectionButton onClick={handleAddNewCollection} />}
        </div>

        <DataTable
          columns={columns}
          data={renderTableContent()}
          currentPage={params.page || 1}
          totalPages={Math.ceil(
            (collectionData?.meta?.page || 0) / (params.limit || 8)
          )}
          onPageChange={(page: number) => {
            setParams((prev) => ({ ...prev, page }));
          }}
          isLoading={isLoading}
        />
      </div>

      {isMobile && (
        <Dialog open={isFormVisible} onOpenChange={setIsFormVisible}>
          <DialogContent className="max-w-md w-full">
            <DialogTitle>Ajouter / Modifier une collection</DialogTitle>
            <CreateUpdateCollectionForm
              collection={selectedCollection || undefined}
              onCancel={() => setSelectedCollection(null)}
            />
          </DialogContent>
        </Dialog>
      )}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-md w-full">
          <DialogTitle>Détails de la collection</DialogTitle>
          {selectedCollection && (
            <CollectionDetail collection={selectedCollection} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
