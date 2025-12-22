"use client";

import EditDepotButton from "@/features/depot/editDepotButton";
import DeleteSupplierButton from "@/features/supplier/deleteDepotButton";
import type Depot from "@/interfaces/depot";
import type { ColumnDef } from "@tanstack/react-table";

export const Columns = (
  onDepotClick: (depot: Depot) => void
): ColumnDef<Depot, unknown>[] => {
  return [
    {
      accessorKey: "name",
      header: "Nom",
      cell: ({ row }) => (
        <span
          className="cursor-pointer font-semibold text-blue-700 hover:text-blue-900 hover:underline"
          onClick={() => onDepotClick(row.original)}
        >
          {row.original.name}
        </span>
      ),
    },
    {
      accessorKey: "adress",
      header: "Adresse",
      cell: ({ row }) => (
        <span
          className="text-accent cursor-pointer"
          onClick={() => onDepotClick(row.original)}
        >
          {row.original.adress}
        </span>
      ),
    },
    {
      accessorKey: "details",
      header: "Détails",
      cell: ({ row }) => (
        <span
          className="text-gray-600 cursor-pointer"
          onClick={() => onDepotClick(row.original)}
        >
          {row.original.details}
        </span>
      ),
    },
    {
      accessorKey: "contact",
      header: "Contact",
      cell: ({ row }) => (
        <span
          className="text-gray-600 cursor-pointer"
          onClick={() => onDepotClick(row.original)}
        >
          {row.original.contact}
        </span>
      ),
    },
    // {
    //   accessorKey: "isFournisseur",
    //   header: "Fournisseur",
    //   cell: ({ row }) => (
    //     <span className="text-sm">
    //       {row.original.isSupplier ? "Oui" : "Non"}
    //     </span>
    //   ),
    // },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <EditDepotButton data={row.original} />
          <DeleteSupplierButton depot={row.original} />
        </div>
      ),
    },
  ];
};
