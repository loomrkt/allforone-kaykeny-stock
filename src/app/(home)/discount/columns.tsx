import DeleteDiscountButton from "@/features/discount/deleteDiscountButton";
import EditDiscountButton from "@/features/discount/editDiscountButton";
import type { Discount } from "@/interfaces/discount";
import type { Product } from "@/interfaces/product";
import { getEntityName } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";

export const Columns = (
  productsData: Product[]
): ColumnDef<Discount, unknown>[] => {
  return [
    {
      accessorKey: "title",
      header: "Titre",
      cell: ({ row }) => (
        <span className="cursor-pointer font-semibold text-green-700 hover:text-green-900 hover:underline">
          {row.original.title}
        </span>
      ),
    },
    {
      accessorKey: "value",
      header: "Valeur",
      cell: ({ row }) => (
        <span>
          {row.original.value}
          {row.original.isPercentage ? " %" : " Ar"}
        </span>
      ),
    },
    {
      accessorKey: "productId",
      header: "Produit concerné",
      cell: ({ row }) => (
        <div className="flex flex-col gap-1">
          {row.original.productId &&
            row.original.productId.map((id: string) => (
              <span key={id}>
                {productsData ? getEntityName(productsData, id) : <></>}
              </span>
            ))}
        </div>
      ),
    },
    {
      accessorKey: "startDate",
      header: "Début",
      cell: ({ row }) => (
        <span>{new Date(row.original.startDate).toLocaleDateString()}</span>
      ),
    },
    {
      accessorKey: "endDate",
      header: "Fin",
      cell: ({ row }) => (
        <span>{new Date(row.original.endDate).toLocaleDateString()}</span>
      ),
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <EditDiscountButton data={row.original} />
          <DeleteDiscountButton discount={row.original} />
        </div>
      ),
    },
  ];
};
