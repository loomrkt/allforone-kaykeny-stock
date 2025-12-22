"use client";

import DeleteCollectionButton from "@/features/collection/deleteCollectionButton";
import EditCollectionButton from "@/features/collection/editCollectionButton";
import type Collection from "@/interfaces/collection";
import type { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";

export const Columns = (
  onCollectionClick: (collection: Collection) => void
): ColumnDef<Collection, unknown>[] => {
  return [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <span
          className="cursor-pointer font-semibold text-blue-700 hover:text-blue-900 hover:underline"
          onClick={() => onCollectionClick(row.original)}
        >
          {row.original.name}
        </span>
      ),
    },

    {
      accessorKey: "code",
      header: "Code",
      cell: ({ row }) => (
        <span
          className="font-mono text-gray-700 cursor-pointer"
          onClick={() => onCollectionClick(row.original)}
        >
          {row.original.code}
        </span>
      ),
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => (
        <span
          className="font-mono text-gray-700 cursor-pointer"
          onClick={() => onCollectionClick(row.original)}
        >
          {row.original.description || "aucune description"}
        </span>
      ),
    },
    {
      accessorKey: "image",
      header: "",
      enableSorting: false,
      cell: ({ row }) => (
        <div onClick={() => onCollectionClick(row.original)}>
          <div className="relative group">
            <Image
              src={
                row.original?.imageUrl
                  ? `${process.env.NEXT_PUBLIC_IMAGE_URL}/${row.original.imageUrl}`
                  : "/assets/image/kk.webp"
              }
              alt={row.original?.imageName || "Product Image"}
              width={1000}
              height={1000}
              className="object-contain w-fit max-sm:w-16 h-16 rounded-md border border-gray-300 shadow-sm "
            />
          </div>
        </div>
      ),
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <EditCollectionButton data={row.original} />
          <DeleteCollectionButton collection={row.original} />
        </div>
      ),
    },
  ];
};
