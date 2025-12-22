"use client";

import { MvtStock } from "@/interfaces/stock";
import type { ColumnDef } from "@tanstack/react-table";

export const Columns = (
  onStockClick: (stockMovement: MvtStock) => void
): ColumnDef<MvtStock, unknown>[] => {
  return [
    {
      accessorKey: "productId",
      header: "produit",
      cell: ({ row }) => (
        <span
          className="cursor-pointer font-semibold hover:underline"
          onClick={() => onStockClick(row.original)}
        >
          {row.original.productId}
        </span>
      ),
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => (
        <span
          className="text-gray-600 cursor-pointer"
          onClick={() => onStockClick(row.original)}
        >
          {row.original.type}
        </span>
      ),
    },
    {
      accessorKey: "mvtDate",
      header: "Date Mouvement",
      cell: ({ row }) => (
        <span
          className="text-gray-600 cursor-pointer"
          onClick={() => onStockClick(row.original)}
        >
          {row.original.mvtDate}
        </span>
      ),
    },
    {
      accessorKey: "quantity",
      header: "Quantité",
      cell: ({ row }) => (
        <span
          className="text-gray-600 cursor-pointer"
          onClick={() => onStockClick(row.original)}
        >
          {row.original.quantity}
        </span>
      ),
    },
    {
      accessorKey: "sourceId",
      header: "Source",
      cell: ({ row }) => (
        <span
          className="text-gray-600 cursor-pointer"
          onClick={() => onStockClick(row.original)}
        >
          {row.original.sourceId}
        </span>
      ),
    },
    {
      accessorKey: "destinationId",
      header: "Destination",
      cell: ({ row }) => (
        <span
          className="text-gray-600 cursor-pointer"
          onClick={() => onStockClick(row.original)}
        >
          {row.original.destinationId}
        </span>
      ),
    },

    {
      accessorKey: "price",
      header: "Prix",
      cell: ({ row }) => (
        <span
          className="text-gray-600 cursor-pointer"
          onClick={() => onStockClick(row.original)}
        >
          {row.original.price}
        </span>
      ),
    },
    {
      accessorKey: "purchasePrice",
      header: "Prix d'achat ",
      cell: ({ row }) => (
        <span
          className="text-gray-600 cursor-pointer"
          onClick={() => onStockClick(row.original)}
        >
          {row.original.purchasePrice}
        </span>
      ),
    },
    {
      accessorKey: "purchasePrice",
      header: "Prix d'achat",
      cell: ({ row }) => (
        <span
          className="text-gray-600 cursor-pointer"
          onClick={() => onStockClick(row.original)}
        >
          {row.original.purchasePrice}
        </span>
      ),
    },

    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => (
        <span
          className="text-gray-600 cursor-pointer"
          onClick={() => onStockClick(row.original)}
        >
          {row.original.email}
        </span>
      ),
    },

    // {
    //   accessorKey: "actions",
    //   header: "Actions",
    //   cell: ({ row }) => (
    //     <div className="flex gap-2">
    //       <EditStockButton data={row.original} />
    //       <DeleteStockButton stock={row.original} />
    //     </div>
    //   ),
    // },
  ];
};
