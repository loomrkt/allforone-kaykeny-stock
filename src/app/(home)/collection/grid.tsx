"use client";

import { getCollections } from "@/api/collection";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pagination } from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { AddCollectionButton } from "@/features/collection/addCollectionButton";
import CreateUpdateCollectionForm from "@/features/collection/addCollectionForm";
import CollectionFormModal from "@/features/collection/collectionModalForm";
import DeleteCollectionButton from "@/features/collection/deleteCollectionButton";
import EditCollectionButton from "@/features/collection/editCollectionButton";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import Collection from "@/interfaces/collection";
import type { ApiParameters } from "@/interfaces/global";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useEffect, useState } from "react";

interface GridCollectionProps {
  search?: string;
  isFormVisible: boolean;
  setIsFormVisible: (visible: boolean) => void;
  setSelectedCollection: (collection: Collection | null) => void;
  selectedCollection: Collection | null;
}

export default function GridCollection({
  search,
  isFormVisible,
  setIsFormVisible,
  setSelectedCollection,
  selectedCollection,
}: GridCollectionProps) {
  const [params, setLocalParams] = useState<ApiParameters>({
    page: 1,
    limit: 8,
    search: search || "",
  });
  const [totalPage, setTotalPage] = useState<number>(1);
  const isMobile = useMediaQuery("(max-width: 1024px)");

  const {
    data: collectionData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["collections", params],
    queryFn: () => getCollections(params),
  });

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setLocalParams((prev: any) => ({ ...prev, page: 1, search: search || "" }));
  }, [search]);

  useEffect(() => {
    if (collectionData?.meta?.total && params.limit) {
      setTotalPage(Math.ceil(collectionData.meta.total / params.limit));
    }
  }, [collectionData?.meta, params]);

  const handleEditCollection = (collection: Collection) => {
    setSelectedCollection(collection);
    setIsFormVisible(true);
  };

  const handleAddNewCollection = () => {
    setSelectedCollection(null);
    setIsFormVisible(true);
  };

  const handleFormCancel = () => {
    setIsFormVisible(false);
    setSelectedCollection(null);
  };

  const renderContent = () => {
    if (error) {
      return (
        <div>Erreur lors du chargement des collections : {error.message}</div>
      );
    }

    if (
      isLoading ||
      !collectionData?.data ||
      collectionData.data.length === 0
    ) {
      return Array.from({ length: 8 }).map((_, index) => (
        <Card key={index} className="hover:shadow-md transition-all">
          <CardHeader>
            <Skeleton className="h-6 w-3/4" />
          </CardHeader>
          <CardContent className="space-y-2">
            <Skeleton className="h-32 w-full rounded-md" />
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

    return collectionData.data.map((collection) => (
      <Card key={collection.id} className="hover:shadow-md transition-all">
        <CardHeader>
          <CardTitle>{collection.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="relative w-full h-30 mb-2">
            <Image
              src={
                collection.imageName
                  ? `${process.env.NEXT_PUBLIC_IMAGE_URL}/${collection.imageUrl}`
                  : "/assets/image/kk.webp"
              }
              alt={collection.imageName || "collection images"}
              fill
              className="object-cover rounded-md"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority={false}
            />
          </div>

          <p>
            <strong>Description:</strong>{" "}
            {collection.description || "Aucune description"}
          </p>
          <p>
            <strong>Code:</strong> {collection.code}
          </p>
          <div className="flex justify-end gap-2 mt-2">
            <EditCollectionButton
              data={collection}
              onClick={() => handleEditCollection(collection)}
            />
            <DeleteCollectionButton collection={collection} />
          </div>
        </CardContent>
      </Card>
    ));
  };

  return (
    <div className="min-h-screen relative">
      <div className="grid grid-cols-5 gap-6 p-4 pb-24">
        {!isMobile && (
          <div className="w-full col-span-1 border border-gray-200 bg-white p-4 rounded-md h-fit shadow-sm space-y-3">
            <p className="font-bold text-2xl mb-0">
              {selectedCollection
                ? "Modifier la collection"
                : "Ajouter une nouvelle collection"}
            </p>
            <CreateUpdateCollectionForm
              collection={selectedCollection || undefined}
              onCancel={handleFormCancel}
            />
          </div>
        )}
        <div className="w-full col-span-5 lg:col-span-4 flex flex-col">
          <div className="flex justify-end items-center lg:mb-0 mb-4">
            {isMobile && (
              <AddCollectionButton onClick={handleAddNewCollection} />
            )}
          </div>

          <div
            className="overflow-y-auto max-h-[65vh] pr-1"
            style={{ scrollbarWidth: "none" }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 w-full bg-white border-t p-4 shadow-md z-10">
        <div className="container mx-auto flex justify-end">
          <Pagination
            currentPage={params.page ?? 1}
            totalPages={totalPage}
            onPageChange={(page) => {
              setLocalParams({ ...params, page });
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        </div>
      </div>

      {isMobile && (
        <CollectionFormModal
          open={isFormVisible}
          onClose={handleFormCancel}
          collection={selectedCollection}
        />
      )}
    </div>
  );
}
