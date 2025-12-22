"use client";

import { getCategories } from "@/api/category";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Pagination } from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { AddCategoryButton } from "@/features/category/addCategoryButton";
import CreateUpdateCategoryForm from "@/features/category/addCategoryForm";
import DeleteCategoryButton from "@/features/category/deleteCategoryButton";
import EditCategoryButton from "@/features/category/editCategoryButton";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { Category } from "@/interfaces/category";
import type { ApiParameters } from "@/interfaces/global";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

interface ListCategoryPageProps {
  search?: string;
}

function ListCategoryPage({ search }: ListCategoryPageProps) {
  const [params, setLocalParams] = useState<ApiParameters>({
    page: 1,
    limit: 8,
    search: search || "",
  });
  const [totalPage, setTotalPage] = useState<number>(1);
  const [selectedCategory, setSelectedCategory] = useState<
    Category | undefined
  >(undefined);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const isMobile = useMediaQuery("(max-width: 1024px)");

  const {
    data: categoryData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["categories", params],
    queryFn: () => getCategories(params),
  });

  useEffect(() => {
    setLocalParams((prev) => ({ ...prev, page: 1, search: search || "" }));
  }, [search]);

  useEffect(() => {
    if (categoryData?.meta?.total && params.limit) {
      setTotalPage(Math.ceil(categoryData.meta.total / params.limit));
    }
  }, [categoryData?.meta, params]);

  const handleEditCategory = (category: Category) => {
    setSelectedCategory(category);
    setIsFormVisible(true);
  };

  const handleAddNewCategory = () => {
    setSelectedCategory(undefined);
    setIsFormVisible(true);
  };

  const handleFormCancel = () => {
    setIsFormVisible(false);
    setSelectedCategory(undefined);
  };

  const renderContent = () => {
    if (error) {
      return (
        <div>Erreur lors du chargement des catégories : {error.message}</div>
      );
    }

    if (isLoading || !categoryData?.data || categoryData.data.length === 0) {
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

    return categoryData.data.map((category) => (
      <Card key={category.id} className="hover:shadow-md transition-all">
        <CardHeader>
          <CardTitle>{category.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p>
            <strong>Déscription:</strong> {category.description}
          </p>
          <p>
            <strong>Code:</strong> {category.code}
          </p>
          <div className="flex justify-end gap-2 mt-2">
            <EditCategoryButton
              data={category}
              onClick={() => handleEditCategory(category)}
            />
            <DeleteCategoryButton category={category} />
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
              {selectedCategory
                ? "Modifier la catégorie"
                : "Ajouter une catégorie"}
            </p>
            <p className="text-chart-3 mb-4">informations sur la catégorie</p>

            <CreateUpdateCategoryForm
              category={selectedCategory}
              onCancel={handleFormCancel}
            />
          </div>
        )}

        <div className="w-full col-span-5 lg:col-span-4">
          <div className="flex justify-end items-center lg:mb-0 mb-4">
            {isMobile && <AddCategoryButton onClick={handleAddNewCategory} />}
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
              <CreateUpdateCategoryForm
                category={selectedCategory}
                onCancel={handleFormCancel}
              />
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}

export default ListCategoryPage;
