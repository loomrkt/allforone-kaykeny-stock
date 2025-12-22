"use client";

import { Stock } from "@/interfaces/stock";
import { cn } from "@/lib/utils";
import type { ColumnDef } from "@tanstack/react-table";

export const Columns = (
  onStockClick: (stock: Stock) => void
): ColumnDef<Stock, unknown>[] => {
  const renderClickableCell = (value: string | number | null | undefined) => (
    <span className="text-gray-600 cursor-pointer">{value ?? "-"}</span>
  );

  return [
    {
      accessorKey: "productName",
      header: "Produit",
      cell: ({ row }) => renderClickableCell(row.original.productName),
    },
    {
      accessorKey: "quantity",
      header: "Quantité",
      cell: ({ row }) => (
        <span
          className={cn(
            "text-gray-600 cursor-pointer",
            row?.original?.quantity === 0 && "text-[12px] text-destructive/50"
          )}
        >
          {row?.original?.quantity === 0
            ? "stock épuisé"
            : row?.original?.quantity ?? "-"}
        </span>
      ),
    },
    {
      accessorKey: "depotName",
      header: "Dépôt",
      enableSorting: false,
      cell: ({ row }) => renderClickableCell(row.original.depotName),
    },
    {
      accessorKey: "sizeName",
      header: "Taille",
      enableSorting: false,
      cell: ({ row }) => renderClickableCell(row.original.sizeName),
    },
    {
      accessorKey: "colorName",
      header: "Couleur",
      enableSorting: false,
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2">
            <div
              className="w-5 h-5 rounded-sm border border-primary/50"
              style={{ backgroundColor: row.original?.colorCode ?? "#000" }}
            />
            <span
              className={`text-primary cursor-pointer`}
              onClick={() => onStockClick(row.original)}
            >
              {row.original.colorName}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "price",
      header: "Prix",
      cell: ({ row }) => (
        <p className="text-gray-600 cursor-pointer hover:underline space-x-2">
          <span
            className={
              row.original.promotionalPrice ? "text-sm line-through" : ""
            }
          >
            {row.original.price}
          </span>
          {row.original.promotionalPrice ? (
            <span className="font-medium">{row.original.promotionalPrice}</span>
          ) : null}
        </p>
      ),
    },
    {
      accessorKey: "transferPrice",
      header: "Prix de transfert",
      cell: ({ row }) => renderClickableCell(row.original.transferPrice),
    },
  ];
};
