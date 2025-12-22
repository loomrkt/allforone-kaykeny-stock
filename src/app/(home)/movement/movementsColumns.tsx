import AutoHideAfter1Hour from "@/components/common/guardWithHour";
import { DeleteMovementButton } from "@/features/movement/deleteMovementButton";
import Guard from "@/guard";
import { Color } from "@/interfaces/color";
import Depot from "@/interfaces/depot";
import Movement from "@/interfaces/movement";
import { PERMISSIONS } from "@/interfaces/role&permission/constant";
import { Size } from "@/interfaces/size";
import { getEntityName, truncateText } from "@/lib/utils";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

export const MvtColumns = (
  depots: Depot[],
  colors: Color[],
  sizes: Size[],
  onStockMovementClick: (stockMovement: Movement) => void,
  onDelete?: () => void
): ColumnDef<Movement, unknown>[] => {
  const type = (
    type: "INBOUND" | "OUTBOUND",
    isSale?: boolean,
    isReturn?: boolean
  ) => {
    if (type === "INBOUND" && !isReturn) return "Entrée";
    if (type === "INBOUND" && isReturn) return "Retour";
    if (type === "OUTBOUND" && isSale) return "Vente";
    if (type === "OUTBOUND" && !isSale) return "Transfert";
  };

  return [
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => (
        <span
          className={`font-semibold px-2 py-1 rounded cursor-pointer ${
            row.original.type === "INBOUND"
              ? "text-green-700 bg-green-100"
              : "text-red-700 bg-red-100"
          }`}
          onClick={() => onStockMovementClick(row.original)}
        >
          {type(
            row.original.type,
            !!(row.original.isSale || !row.original.destinationId),
            row.original.isReturn
          )}
        </span>
      ),
    },
    {
      accessorKey: "reference",
      header: "Référence",
      cell: ({ row }) => (
        <span
          className="cursor-pointer text-primary hover:underline"
          onClick={() => onStockMovementClick(row.original)}
        >
          {row.original.reference || "—"}
        </span>
      ),
    },
    {
      accessorKey: "stockName",
      header: "Produit",
      cell: ({ row }) => (
        <span
          className="cursor-pointer text-gray-800"
          onClick={() => onStockMovementClick(row.original)}
        >
          {row.original.productName
            ? truncateText(row.original.productName, 20)
            : "—"}
        </span>
      ),
    },
    {
      accessorKey: "quantity",
      header: "Quantité",
      cell: ({ row }) => (
        <span
          className="text-gray-800 font-semibold cursor-pointer"
          onClick={() => onStockMovementClick(row.original)}
        >
          {row.original.quantity ?? "—"}
        </span>
      ),
    },
    {
      accessorKey: "colorId",
      header: "Couleur",
      cell: ({ row }) => (
        <span
          className="cursor-pointer"
          onClick={() => onStockMovementClick(row.original)}
        >
          {getEntityName(colors, row.original.colorId)}
        </span>
      ),
    },
    {
      accessorKey: "sizeId",
      header: "Taille",
      cell: ({ row }) => (
        <span
          className="cursor-pointer"
          onClick={() => onStockMovementClick(row.original)}
        >
          {getEntityName(sizes, row.original.sizeId)}
        </span>
      ),
    },
    {
      accessorKey: "sourceId",
      header: "Source",
      cell: ({ row }) => (
        <span
          className="text-gray-600 cursor-pointer"
          onClick={() => onStockMovementClick(row.original)}
        >
          {row.original.sourceName ||
            (row.original.sourceId
              ? getEntityName(depots, row.original.sourceId)
              : "—")}
        </span>
      ),
    },
    {
      accessorKey: "destinationId",
      header: "Destination",
      cell: ({ row }) => (
        <span
          className="text-gray-600 cursor-pointer"
          onClick={() => onStockMovementClick(row.original)}
        >
          {row.original.destinationName ||
            (row.original.destinationId
              ? getEntityName(depots, row.original.destinationId)
              : "—")}
        </span>
      ),
    },
    {
      accessorKey: "purchasePrice",
      header: "Prix",
      cell: ({ row }) => (
        <span
          className="text-gray-700 font-medium cursor-pointer"
          onClick={() => onStockMovementClick(row.original)}
        >
          {row.original.purchasePrice != null
            ? `${row.original.purchasePrice.toFixed(2)} Ar`
            : "—"}
        </span>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Date",
      cell: ({ row }) => (
        <span
          className="text-gray-700 cursor-pointer"
          onClick={() => onStockMovementClick(row.original)}
        >
          {row.original.createdAt
            ? format(new Date(row.original.createdAt), "dd/MM/yyyy HH:mm")
            : "—"}
        </span>
      ),
    },
    {
      accessorKey: "email",
      header: "Utilisateur",
      cell: ({ row }) => (
        <span
          className="text-gray-500 cursor-pointer"
          onClick={() => onStockMovementClick(row.original)}
        >
          {row.original.email || "—"}
        </span>
      ),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <AutoHideAfter1Hour
          key={row.original.id}
          date={row?.original?.createdAt ?? new Date()}
        >
          <Guard permission={PERMISSIONS.MOVEMENT.MOVEMENT_CANCEL}>
            <DeleteMovementButton
              movementId={row.original.id}
              reference={row.original.reference}
              onDeleted={onDelete}
            />
          </Guard>
        </AutoHideAfter1Hour>
      ),
    },
  ];
};
