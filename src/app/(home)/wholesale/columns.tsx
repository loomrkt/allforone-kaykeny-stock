"use client";

import { Badge } from "@/components/ui/badge";
import { Product } from "@/interfaces/product";
import WholeSale from "@/interfaces/wholesale";
import { getEntityName } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { UpdateWholesaleButton } from "./updateWholesaleButton";

export const Columns = (products: Product[]): ColumnDef<WholeSale>[] => {
  return [
    {
      accessorKey: "productIds",
      header: "Produits",
      cell: ({ row }) => {
        const productIds = row.original.productIds;

        return (
          <div className="flex flex-wrap gap-1">
            {productIds.map((id) => (
              <Badge key={id} variant="secondary">
                {products ? getEntityName(products, id) : ""}
              </Badge>
            ))}
          </div>
        );
      },
    },
    {
      accessorKey: "rules",
      header: "Règles",
      cell: ({ row }) => {
        const rules = row.original.rules;

        return (
          <ul className="space-y-1">
            {rules.map((rule, index) => (
              <li key={index} className="text-sm">
                <span className="font-medium text-muted-foreground">
                  {rule.minQuantity} - {rule.maxQuantity}
                </span>{" "}
                →{" "}
                <span className="font-semibold text-green-600">
                  {rule.value} Ar
                </span>
              </li>
            ))}
          </ul>
        );
      },
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => <UpdateWholesaleButton data={row.original} />,
    },
  ];
};
