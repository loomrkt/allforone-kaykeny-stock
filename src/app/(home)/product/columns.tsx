"use client";

import DeleteProductButton from "@/features/product/deleteProductButton";
import EditProductButton from "@/features/product/editProductButton";
import Guard from "@/guard";
import { Category } from "@/interfaces/category";
import Collection from "@/interfaces/collection";
import { Product } from "@/interfaces/product";
import { PERMISSIONS } from "@/interfaces/role&permission/constant";
import { formatCategoryOption, formatCollectionOption } from "@/utils";
import type { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";

export const Columns = (
  onProductClick: (product: Product) => void,
  categorys: Category[],
  collections: Collection[]
): ColumnDef<Product, unknown>[] => {
  const categoryOption = formatCategoryOption(categorys || []);
  const collectionOption = formatCollectionOption(collections || []);

  return [
    {
      accessorKey: "image",
      header: "",
      enableSorting: false,
      cell: ({ row }) => (
        <div onClick={() => onProductClick(row.original)}>
          {row?.original?.images.length ? (
            <div className="relative group">
              <Image
                src={
                  row.original?.images[0]?.url
                    ? `${process.env.NEXT_PUBLIC_IMAGE_URL}/${row.original.images[0].url}`
                    : "/assets/image/kk.webp"
                }
                alt={row.original.images[0]?.name || "Product Image"}
                width={1000}
                height={1000}
                className="object-contain w-fit max-sm:w-16 h-16 rounded-md border border-gray-300 shadow-sm "
              />
            </div>
          ) : (
            <span className="cursor-pointer text-gray-40 hover:underline transition-all duration-200 ease-in-out">
              -
            </span>
          )}
        </div>
      ),
    },
    {
      accessorKey: "name",
      header: "Nom",
      cell: ({ row }) => (
        <span
          className="cursor-pointer font-semibold hover:underline"
          onClick={() => onProductClick(row.original)}
        >
          {row.original.name}
        </span>
      ),
    },
    {
      accessorKey: "réference",
      header: "Réference",
      cell: ({ row }) => (
        <span
          className="text-gray-600 cursor-pointer"
          onClick={() => onProductClick(row.original)}
        >
          {row.original.reference}
        </span>
      ),
    },
    {
      accessorKey: "genre",
      header: "Genre",
      cell: ({ row }) => (
        <span
          className="text-gray-600 cursor-pointer"
          onClick={() => onProductClick(row.original)}
        >
          {row.original.gender}
        </span>
      ),
    },

    {
      accessorKey: "prix",
      header: "Prix",
      cell: ({ row }) => (
        <span
          className="text-gray-600 cursor-pointer"
          onClick={() => onProductClick(row.original)}
        >
          {row.original.price}
        </span>
      ),
    },
    {
      accessorKey: "transferPrice",
      header: "Prix de transfert",
      cell: ({ row }) => (
        <span
          className="text-gray-600 cursor-pointer"
          onClick={() => onProductClick(row.original)}
        >
          {row.original.transferPrice}
        </span>
      ),
    },
    {
      accessorKey: "collection",
      header: "Modèle",
      cell: ({ row }) => {
        const collectionName =
          collectionOption.find(
            (collection) => collection.value === row.original.collectionId
          )?.label ||
          row.original.collectionId ||
          "-";

        return (
          <span
            className="cursor-pointer text-gray-600"
            onClick={() => onProductClick(row.original)}
          >
            {collectionName}
          </span>
        );
      },
    },
    {
      accessorKey: "category",
      header: "Catégorie",
      cell: ({ row }) => {
        const categoryName =
          categoryOption.find(
            (category) => category.value === row.original.categoryId
          )?.label ||
          row.original.categoryId ||
          "-";

        return (
          <span
            className="cursor-pointer text-gray-600"
            onClick={() => onProductClick(row.original)}
          >
            {categoryName}
          </span>
        );
      },
    },

    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Guard permission={PERMISSIONS.PRODUCT.UPDATE}>
            <EditProductButton data={row.original} />
          </Guard>
          <Guard permission={PERMISSIONS.PRODUCT.DELETE}>
            <DeleteProductButton product={row.original} />
          </Guard>
        </div>
      ),
    },
  ];
};
