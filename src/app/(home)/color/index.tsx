"use client";

import { getColors } from "@/api/color";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Pagination } from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { AddColorButton } from "@/features/color/addColorButton";
import CreateUpdateColorForm from "@/features/color/addColorForm";
import DeleteColorButton from "@/features/color/deleteColorButton";
import EditColorButton from "@/features/color/editColorButton";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import type { Color } from "@/interfaces/color";
import type { ApiParameters } from "@/interfaces/global";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

interface ListColorPageProps {
  search?: string;
}

function ListColorPage({ search }: ListColorPageProps) {
  const [params, setLocalParams] = useState<ApiParameters>({
    page: 1,
    limit: 8,
    search: search || "",
  });
  const [selectedColor, setSelectedColor] = useState<Color | undefined>(
    undefined
  );
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [totalPage, setTotalPage] = useState<number>(1);
  const isMobile = useMediaQuery("(max-width: 1024px)");

  const {
    data: colorData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["colors", params],
    queryFn: () => getColors(params),
  });

  useEffect(() => {
    setLocalParams((prev) => ({ ...prev, page: 1, search: search || "" }));
  }, [search]);

  useEffect(() => {
    if (colorData?.meta?.total && params.limit) {
      setTotalPage(Math.ceil(colorData.meta.total / params.limit));
    }
  }, [colorData?.meta, params]);

  const handleEditColor = (color: Color) => {
    setSelectedColor(color);
    setIsFormVisible(true);
  };

  const handleAddNewColor = () => {
    setSelectedColor(undefined);
    setIsFormVisible(true);
  };

  const handleFormCancel = () => {
    setIsFormVisible(false);
    setSelectedColor(undefined);
  };

  const renderContent = () => {
    if (error) {
      return (
        <div>Erreur lors du chargement des couleurs : {error.message}</div>
      );
    }

    if (isLoading || !colorData?.colors || colorData.colors.length === 0) {
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
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-6 w-6 rounded-full" />
              <Skeleton className="h-4 w-1/3" />
            </div>
            <div className="flex justify-end gap-2 mt-2">
              <Skeleton className="h-8 w-8 rounded-md" />
              <Skeleton className="h-8 w-8 rounded-md" />
            </div>
          </CardContent>
        </Card>
      ));
    }

    return colorData.colors.map((color) => (
      <Card key={color.id} className="hover:shadow-md transition-all">
        <CardHeader>
          <CardTitle>{color.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center gap-2">
            <strong>Code:</strong> {color.code}
          </div>
          <div className="flex items-center gap-2">
            <strong>Couleur:</strong>
            <div
              className="w-6 h-6 rounded-full"
              style={{ backgroundColor: color.hexaCode }}
            />
            <span>{color.hexaCode}</span>
          </div>
          <div className="flex justify-end gap-2 mt-2">
            <EditColorButton
              data={color}
              onClick={() => handleEditColor(color)}
            />
            <DeleteColorButton color={color} />
          </div>
        </CardContent>
      </Card>
    ));
  };

  return (
    <div
      className="w-full h-[78vh] p-4 overflow-y-auto"
      style={{ scrollbarWidth: "none" }}
    >
      <div className="grid grid-cols-5 gap-6">
        {!isMobile && (
          <div className="w-full col-span-1 border border-gray-200 bg-white p-4 rounded-md h-fit shadow-sm">
            <p className="font-bold text-2xl mb-0">
              {selectedColor ? "Modifier la couleur" : "Ajouter une couleur"}
            </p>
            <p className="text-chart-3 mb-4">Informations sur la couleur</p>
            <CreateUpdateColorForm
              color={selectedColor}
              onCancel={handleFormCancel}
            />
          </div>
        )}

        <div className="w-full col-span-5 lg:col-span-4">
          <div className="flex justify-end items-center lg:mb-0 mb-4">
            {isMobile && <AddColorButton onClick={handleAddNewColor} />}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {renderContent()}
          </div>

          <div className="hidden lg:flex justify-end mt-6">
            <Pagination
              currentPage={params.page ?? 1}
              totalPages={totalPage}
              onPageChange={(page) => {
                setLocalParams({ ...params, page });
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            />
          </div>
          <div className="lg:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 px-4 py-2 shadow-md z-10">
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
          <Dialog open={isFormVisible} onOpenChange={setIsFormVisible}>
            <DialogContent className="max-w-md w-full">
              <CreateUpdateColorForm
                color={selectedColor}
                onCancel={handleFormCancel}
              />
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}

export default ListColorPage;
