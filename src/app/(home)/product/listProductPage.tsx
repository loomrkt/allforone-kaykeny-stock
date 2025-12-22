"use client";

import { getProducts } from "@/api/product";
import { LoadingList } from "@/components/common/loadingTable";
import { DataTable } from "@/components/data-table";
import ProductFilters, {
  productFilter,
} from "@/features/product/productFilter";
import type { ApiParameters } from "@/interfaces/global";
import { Product } from "@/interfaces/product";
import { useCategoryStore } from "@/stores/category/categoryStore";
import { useCollectionStore } from "@/stores/collection/collectionStore";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Columns } from "./columns";
import { ProductCardDetails } from "./productDetailsModal";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Pagination } from "@/components/ui/pagination";
import DeleteProductButton from "@/features/product/deleteProductButton";
import EditProductButton from "@/features/product/editProductButton";
import { Filter } from "lucide-react";

function ProductGrid({
  products,
  onProductClick,
}: {
  products: Product[];
  onProductClick: (product: Product) => void;
}) {
  return (
    <div className="flex flex-wrap overflow-y-auto  gap-4">
      {products.map((product) => {
        const coverImage =
          product.images.find((img) => img.url) || product.images[0];
        return (
          <div
            key={product.id}
            className="cursor-pointer rounded-lg border p-2 shadow hover:shadow-lg w-full"
            onClick={() => onProductClick(product)}
          >
            {coverImage ? (
              <div className="relative w-full h-40 rounded overflow-hidden">
                <Image
                  src={
                    `${process.env.NEXT_PUBLIC_IMAGE_URL}/${product.images[0].url}` ||
                    "/assets/image/kk.webp"
                  }
                  width={1000}
                  height={1000}
                  alt={product.name || "Product Image"}
                  className="object-cover w-full h-full"
                  loading="lazy"
                />
              </div>
            ) : (
              <div className="w-full h-40 bg-gray-200 flex items-center justify-center text-gray-500 rounded">
                aucune image disponible
              </div>
            )}
            <h3 className="mt-2 font-semibold text-sm truncate">
              {product.name}
            </h3>
            <p className="text-xs text-gray-600">{product.reference}</p>
            <p className="mt-1 font-bold text-base">
              {product.price.toFixed(2)} €
            </p>

            <div className="flex items-center gap-2 justify-end mt-2">
              <EditProductButton data={product} />
              <DeleteProductButton product={product} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

interface ListProductProps {
  params: ApiParameters;
  setParams: (params: ApiParameters) => void;
  search: string;
}

function ListProduct({ params, setParams, search }: ListProductProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [totalPage, setTotalPage] = useState<number>(0);
  const [filter, setFilter] = useState<productFilter>({});
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const categories = useCategoryStore(({ categories }) => categories);
  const collections = useCollectionStore(({ collections }) => collections);

  const { data: productData, isLoading } = useQuery({
    queryKey: ["get-products", params, search, filter],
    queryFn: () => getProducts({ ...params, search, ...filter }),
  });

  const handleProductClick = useCallback((product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedProduct(null);
    setIsModalOpen(false);
  }, []);

  const columns = useMemo(
    () => Columns(handleProductClick, categories || [], collections || []),
    [categories, collections, handleProductClick]
  );

  useEffect(() => {
    if (productData?.meta?.total && params.limit) {
      setTotalPage(Math.ceil(productData.meta.total / params.limit));
    }
  }, [productData?.meta, params.limit]);

  return (
    <div className="w-full space-y-4 p-2 pl-1 z-10">
      <div className="flex flex-row gap-4 max-sm:flex-col">
        <div className="hidden sm:block w-64">
          <ProductFilters {...{ filter, setFilter }} />
        </div>

        <div className="sm:hidden mb-2">
          <Dialog open={isFilterModalOpen} onOpenChange={setIsFilterModalOpen}>
            <DialogTrigger asChild>
              <button className="flex items-center gap-2 px-3 py-2 border rounded text-sm font-medium">
                <Filter size={18} />
                Filtres
              </button>
            </DialogTrigger>
            <DialogContent className="bg-transparent border-none justify-center">
              <DialogHeader>
                <DialogTitle>Filtres</DialogTitle>
              </DialogHeader>
              <ProductFilters {...{ filter, setFilter }} />
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex-1">
          {isLoading ? (
            <LoadingList />
          ) : (
            <>
              <div className="hidden sm:block">
                <DataTable
                  columns={columns}
                  data={productData?.data || []}
                  totalPages={totalPage}
                  currentPage={params.page ?? 1}
                  onPageChange={(page) => {
                    setParams({ ...params, page });
                  }}
                  onRowClick={handleProductClick}
                  className="h-[calc(100vh-12rem)]"
                />
              </div>

              <div className="block sm:hidden max-w-[70vh] relative">
                <div className="overflow-y-auto max-h-[70vh] pr-1">
                  <ProductGrid
                    products={productData?.data || []}
                    onProductClick={handleProductClick}
                  />
                </div>

                <div className="fixed bottom-0 left-0 w-full  border-t p-2 z-20">
                  <Pagination
                    currentPage={params.page ?? 1}
                    totalPages={totalPage}
                    onPageChange={(page) => {
                      setParams({ ...params, page });
                    }}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <ProductCardDetails
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        categories={categories || []}
        collections={collections || []}
      />
    </div>
  );
}

export default ListProduct;
